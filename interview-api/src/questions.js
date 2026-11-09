import { askGroq, groqConfigured } from './groq.js';
import { config } from './config.js';

// ============================================================
// Writing the questions
// ============================================================
// The questions come from the job the recruiter actually posted, not from a
// bank. A salon asking for a stylist and a clinic asking for a receptionist
// should not get the same interview, and the recruiter should not have to
// write one.
//
// They are also written to be *said*. A question that reads well on a form —
// "Rate your proficiency in client management" — is unanswerable out loud,
// and the answer it drags out of someone scores worse than their ability
// deserves.
//
// And they are written easy on purpose. The person answering may be a fresh
// graduate with no job behind them, standing in a room on their own phone,
// nervous. A question that assumes years of experience — "tell me how you
// handled rotas for a six-chair salon" — leaves them with nothing to say,
// and then scores them on having said nothing. That is the interview
// failing, not the candidate. So the questions stay short and ordinary, and
// anything a candidate could not possibly know yet is simply not asked.

/** The areas the report scores on. Questions are tagged with one of these. */
export const AREAS = ['Communication', 'Relevance', 'Knows the work', 'Problem solving', 'Confidence'];

const SYSTEM = `You write short, easy spoken interview questions for HIERO Connect, a hiring portal used mostly by small and mid-sized Indian businesses — salons, clinics, shops, workshops, small offices — and by companies hiring from colleges.

The candidate answers out loud, alone, into a phone. Nobody is there to rephrase a question they did not understand. Many of them are fresh out of college with no job yet, and English may be their second or third language.

Write as if you were asking a nervous 21-year-old in person. Every question must be answerable by someone who has never held this job.

Rules for every question:
- Everyday spoken English. Short, common words. One idea per question.
- At most 16 words. Shorter is better.
- Answerable in 20 to 60 seconds by someone talking.
- Never yes/no. Never two questions joined by "and".
- No trade jargon, no manager vocabulary. Not "rota", "reconcile", "inventory",
  "stakeholder", "KPI", "escalate", "strategy", "workflow", "prioritise".
  Say "staff timings", "match the cash", "stock", "the boss", "plan", "first".
- Do not assume they have worked before. Instead of "tell me about a time you
  did X at work", ask "have you ever..." or "what would you do if..." or
  "what do you think matters most when...". College, home and part-time work
  all count as experience.
- Never ask for numbers, targets, percentages or tools they may not have used.
- No riddles, no puzzles, no "rate yourself out of ten".
- Do not ask anything about age, caste, religion, marital status, pregnancy, family, health or disability.
- Name the actual role in plain words where it helps. Do not invent facts about the company.

Shape of the set:
1. An opening question that lets them introduce themselves.
2. One or two about any experience they have, worded so having none is still answerable.
3. Two or three simple "what would you do if" questions from the everyday reality of this job.
4. One about why they want this job.
5. A closing question that gives them room to add anything.

Tag each question with the one area it is really getting at, from exactly:
"Communication", "Relevance", "Knows the work", "Problem solving", "Confidence".

Good examples, for the level of language expected:
- "To start, tell me about yourself."
- "Have you ever worked in a shop or a salon before? Tell me about it."
- "A customer is angry about waiting too long. What do you say to them?"
- "Two staff want the same day off. How would you sort it out?"
- "Why do you want this job?"

Reply with JSON only: {"questions":[{"text":"...","about":"..."}]}`;

/**
 * The model writes with typographic punctuation — curly apostrophes, and a
 * non-breaking hyphen in "part\u2011time". It looks right on a page and reads
 * wrong out loud: the voice stumbles over characters it has no sound for.
 * The question is spoken before it is read, so it is stored plain.
 */
function plainPunctuation(text) {
  return text
    .replace(/[\u2018\u2019\u201B]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2011\u2012\u2013]/g, '-')
    .replace(/\u2014/g, ' - ')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clean(list, count) {
  const seen = new Set();
  const out = [];
  for (const item of Array.isArray(list) ? list : []) {
    const text = plainPunctuation(String(item?.text ?? item?.question ?? ''));
    if (text.length < 10) continue;
    // The prompt asks for sixteen words. A question well past that has
    // stopped being a spoken question and turned into a paragraph with a
    // question mark, which is the thing candidates cannot answer. Dropping
    // it leaves the set short, and a short set falls back to the standard
    // one below — a plain interview rather than an unanswerable one.
    if (text.split(' ').length > 26) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const about = AREAS.includes(item?.about) ? item.about : undefined;
    out.push({ id: `q${out.length + 1}`, text, about });
    if (out.length >= count) break;
  }
  return out;
}

/**
 * The set used when there is no Groq key, or when Groq cannot be reached.
 *
 * A generic interview is a poor interview, but it is an interview. The
 * alternative is a candidate who scanned a code and got an error, which
 * costs the employer the applicant.
 */
export function standardQuestions(role, count = config.questionCount) {
  const job = role?.trim() || 'this role';
  const set = [
    { text: 'To start, tell me about yourself.', about: 'Communication' },
    { text: `Have you done any work before that is close to ${job}?`, about: 'Relevance' },
    { text: 'Tell me about something you have done that you are proud of.', about: 'Knows the work' },
    { text: 'What do you think this job needs most from the person doing it?', about: 'Knows the work' },
    { text: 'A customer is upset and waiting. What would you say to them?', about: 'Problem solving' },
    { text: 'You have more work than you can finish today. What do you do first?', about: 'Problem solving' },
    { text: 'Why do you want this job?', about: 'Relevance' },
    { text: 'Which part of this job do you think will be hard for you?', about: 'Confidence' },
    { text: 'What is something new you have learned lately?', about: 'Confidence' },
    { text: 'Last one — is there anything else you want us to know?', about: 'Communication' },
  ];
  return clean(set, count);
}

function describeSkills(skills) {
  const names = (Array.isArray(skills) ? skills : [])
    .map(s => (typeof s === 'string' ? s : s?.name))
    .map(s => String(s || '').trim())
    .filter(Boolean)
    .slice(0, 12);
  return names.length ? names.join(', ') : '';
}

export async function writeQuestions({ role, companyName, description, skills, count = config.questionCount }) {
  if (!groqConfigured()) {
    return { questions: standardQuestions(role, count), source: 'standard' };
  }

  const skillLine = describeSkills(skills);
  const jd = String(description || '').trim().slice(0, 2500);

  const user = `Write ${count} questions for this job.

Role: ${role || 'not stated'}
Employer: ${companyName || 'not stated'}
${skillLine ? `Skills the employer asked for: ${skillLine}` : 'The employer did not list skills.'}

${jd ? `The job post says:\n"""\n${jd}\n"""` : 'There is no written job description — work from the role title alone and keep the questions about the everyday reality of that job.'}`;

  try {
    const data = await askGroq({ system: SYSTEM, user, temperature: 0.6, maxTokens: 1400 });
    const questions = clean(data?.questions, count);
    // Too few usable questions back is a failed generation, not a short
    // interview. Half an interview scores worse than a standard one.
    if (questions.length < Math.min(4, count)) {
      return { questions: standardQuestions(role, count), source: 'standard' };
    }
    return { questions, source: 'groq' };
  } catch (err) {
    console.error('[questions] Groq could not write them:', err.message);
    return { questions: standardQuestions(role, count), source: 'standard' };
  }
}
