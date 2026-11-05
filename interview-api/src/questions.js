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

/** The areas the report scores on. Questions are tagged with one of these. */
export const AREAS = ['Communication', 'Relevance', 'Knows the work', 'Problem solving', 'Confidence'];

const SYSTEM = `You write short spoken interview questions for HIERO Connect, a hiring portal used mostly by small and mid-sized Indian businesses — salons, clinics, shops, workshops, small offices — and by companies hiring from colleges.

The candidate answers out loud, alone, into a phone. Nobody is there to rephrase a question they did not understand.

Rules for every question:
- Plain, spoken English. Short words. One idea per question.
- Answerable in 30 to 90 seconds by someone talking.
- Never yes/no. Never two questions joined by "and".
- Ask about what they have actually done, not hypothetical trivia.
- No riddles, no puzzles, no "rate yourself out of ten".
- Do not ask anything about age, caste, religion, marital status, pregnancy, family, health or disability.
- Name the actual role and real tasks from the job where it helps. Do not invent facts about the company.
- At most 28 words.

Shape of the set:
1. An opening question that lets them introduce themselves.
2. A couple about real experience of the work in the job.
3. One or two situational questions drawn from what this job involves day to day.
4. One about why this role and this employer.
5. A closing question that gives them room to add anything.

Tag each question with the one area it is really getting at, from exactly:
"Communication", "Relevance", "Knows the work", "Problem solving", "Confidence".

Reply with JSON only: {"questions":[{"text":"...","about":"..."}]}`;

function clean(list, count) {
  const seen = new Set();
  const out = [];
  for (const item of Array.isArray(list) ? list : []) {
    const text = String(item?.text ?? item?.question ?? '').trim().replace(/\s+/g, ' ');
    if (text.length < 10) continue;
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
    { text: 'To start, tell me a little about yourself and the work you have done so far.', about: 'Communication' },
    { text: `What experience do you have that is close to ${job}?`, about: 'Relevance' },
    { text: 'Walk me through something you worked on that you are proud of. What was your part in it?', about: 'Knows the work' },
    { text: 'Tell me about a time a customer or a colleague was unhappy with your work. What did you do about it?', about: 'Problem solving' },
    { text: 'Describe a normal working day in your last job, from arriving to leaving.', about: 'Knows the work' },
    { text: 'When you are given more work than you can finish in a day, how do you decide what to do first?', about: 'Problem solving' },
    { text: 'Why this role, and why here rather than somewhere else?', about: 'Relevance' },
    { text: 'What part of this job do you think you would find hardest?', about: 'Confidence' },
    { text: 'What have you learned recently that has made you better at your work?', about: 'Confidence' },
    { text: 'Last one — is there anything you would like us to know that we have not asked about?', about: 'Communication' },
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
