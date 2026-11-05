import { askGroq, groqConfigured } from './groq.js';

// ============================================================
// Reading the answers
// ============================================================
// What comes out of here lands in front of someone deciding whether to give
// a person a job. A bare number cannot be argued with, checked, or overruled
// — so nothing here is allowed to be a bare number. Every score carries the
// reason it was given and the thing in the answers that led to it, the fit
// for the role is argued rather than asserted, and every positive and every
// concern names what the candidate actually said.
//
// That is partly for the recruiter, who can then disagree with the reasoning
// instead of deferring to a score. It is mostly for the candidate, because a
// score nobody can explain is a score nobody can appeal.
//
// The model sees a transcript, and a transcript is a lossy and often wrong
// record of what somebody said. The prompt is told so, at length: a model
// that believes the transcript is the person fails the quiet, the accented
// and the softly-spoken first.

const SYSTEM = `You assess a short spoken job interview for HIERO Connect, a hiring portal used mostly by small and mid-sized Indian businesses. A recruiter reads your assessment before deciding whether to meet the candidate.

You are reading an automatic transcript of someone speaking, alone, into a phone. It is imperfect. Treat it accordingly:

- Judge what they said, not how the recogniser spelled it. Ignore grammar slips, filler words, repetition, missing punctuation and garbled names — those are artefacts of speech and of the transcriber, not of the candidate.
- Never mark anyone down for accent, dialect, Indian English usage, or for mixing in another language.
- Never infer or comment on age, gender, caste, religion, region, marital status, family, health or disability, and never let anything of the sort touch a score.
- Score only on evidence that is in the answers. Where an answer is missing or too short to tell, score low but say in the reason that this is thin evidence, not a bad answer.
- Never invent detail that is not in the transcript.
- A short interview supports only a tentative conclusion. Say so rather than rounding it into confidence.

EVERY JUDGEMENT MUST BE EXPLAINED. A score with no reason is a failed response.

Score each area 0-100, where 50 is an ordinary acceptable answer for this role, not a failure:
- communication: were they clear and easy to follow
- problemSolving: did they describe working something out, not just what happened
- roleKnowledge: do they show they know what this job involves day to day
- relevance: does their experience bear on this role
- confidence: did they answer directly and stand behind what they said — not volume, not polish

For each area give:
  "score": the number
  "why": one or two sentences saying what in their answers produced that number, and what would have made it higher. Name the question or quote a few of their own words. Write it so the candidate could read it.

"overall" is your judgement of the interview as a whole, 0-100 — it need not be the average — and "overallWhy" explains in two or three sentences how you got there, including which areas pulled it up and which pulled it down.

"strengths": up to three. Each is {"point": short phrase, "evidence": what they said that shows it}.
"concerns": up to three. Each is {"point": short phrase, "evidence": what in the answers led you to it}. A concern is something the recruiter should probe, not an insult. If the only concern is thin evidence, say that.

"fit": {"verdict": one short sentence on whether this person fits THIS role, "reasoning": three or four sentences arguing it — what the role needs, what they showed, where the gap is, and what the interview could not tell you}. The reasoning must be about this specific role and the skills asked for, not about the candidate in general.

"recommendation" must be exactly one of:
"Worth meeting", "Worth meeting, with reservations", "Probably not a fit", "Not enough to go on"

"summary": two or three sentences to the recruiter, including what the interview does not tell them.

Reply with JSON only:
{"overall":0,"overallWhy":"","scores":{"communication":{"score":0,"why":""},"problemSolving":{"score":0,"why":""},"roleKnowledge":{"score":0,"why":""},"relevance":{"score":0,"why":""},"confidence":{"score":0,"why":""}},"strengths":[{"point":"","evidence":""}],"concerns":[{"point":"","evidence":""}],"fit":{"verdict":"","reasoning":""},"recommendation":"","summary":""}`;

const RECOMMENDATIONS = [
  'Worth meeting',
  'Worth meeting, with reservations',
  'Probably not a fit',
  'Not enough to go on',
];

const AREAS = ['communication', 'problemSolving', 'roleKnowledge', 'relevance', 'confidence'];

function clampScore(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, n));
}

const text = value => String(value ?? '').trim();

/** A score line is only useful with its reasoning, so both travel together. */
function readScoreLine(raw) {
  // Tolerates a model that answers with a bare number where an object was
  // asked for — the score is still worth keeping, it just arrives unexplained.
  if (typeof raw === 'number') return { score: clampScore(raw), why: '' };
  return { score: clampScore(raw?.score), why: text(raw?.why) };
}

function readPoints(value, max = 3) {
  return (Array.isArray(value) ? value : [])
    .map(item =>
      typeof item === 'string'
        ? { point: text(item), evidence: '' }
        : { point: text(item?.point), evidence: text(item?.evidence) }
    )
    .filter(item => item.point)
    .slice(0, max);
}

function emptyScores() {
  return Object.fromEntries(AREAS.map(area => [area, { score: null, why: '' }]));
}

/** The honest report for an interview with nothing in it to read. */
function nothingToJudge(answered, asked) {
  const why =
    answered === 0
      ? 'They opened the interview but did not answer any question, so there is nothing to score.'
      : `Only ${answered} of ${asked} questions got an answer, and those were a few words each — not enough to score anything from.`;
  return {
    overall: null,
    overallWhy: why,
    scores: emptyScores(),
    strengths: [],
    concerns: [
      {
        point: 'Nothing to assess',
        evidence: why,
      },
    ],
    fit: {
      verdict: 'This interview cannot tell you whether they fit the role.',
      reasoning:
        'There are no answers of any length to read, so nothing here bears on the role one way or the other. Treat this as an interview that did not happen rather than one that went badly — a dead microphone, a bad connection or a misunderstanding all look like this. If you were interested in their application, it is worth sending the link again or calling them.',
    },
    recommendation: 'Not enough to go on',
    summary: why,
    source: 'none',
  };
}

export async function assessInterview({ role, companyName, skills, answers }) {
  const asked = answers.length;
  const words = a => text(a.transcript).split(/\s+/).filter(Boolean).length;
  const real = answers.filter(a => words(a) >= 8);

  // Below this there is no interview to read. Sending it to a model anyway
  // produces confident-sounding reasoning built on nothing, which is the one
  // outcome worth going out of the way to avoid.
  if (real.length === 0) {
    return nothingToJudge(answers.filter(a => text(a.transcript)).length, asked);
  }

  if (!groqConfigured()) {
    const base = nothingToJudge(real.length, asked);
    return {
      ...base,
      overallWhy:
        'No assessment was produced: this server has no Groq key configured, so nothing read the answers.',
      summary:
        'The answers were recorded and are stored, but nothing has read them — the interview service has no Groq key. The transcript is intact, so this can be assessed once a key is set.',
      concerns: [],
      source: 'unconfigured',
    };
  }

  const skillNames = (Array.isArray(skills) ? skills : [])
    .map(s => (typeof s === 'string' ? s : s?.name))
    .filter(Boolean)
    .slice(0, 12)
    .join(', ');

  const script = answers
    .map((a, i) => {
      const said = text(a.transcript);
      return `Q${i + 1} (${a.about || 'general'}): ${a.question}\nA${i + 1}: ${
        said ? `${said}\n[spoke for ${Math.round(a.seconds || 0)} seconds]` : '[skipped — no answer given]'
      }`;
    })
    .join('\n\n');

  const user = `Role applied for: ${role || 'not stated'}
Employer: ${companyName || 'not stated'}
${skillNames ? `Skills the employer asked for: ${skillNames}` : 'The employer did not list specific skills, so judge fit against what the role title normally involves.'}
Questions answered with something substantial: ${real.length} of ${asked}

Transcript:
${script}`;

  const data = await askGroq({ system: SYSTEM, user, temperature: 0.2, maxTokens: 2400 });

  const scores = {};
  for (const area of AREAS) scores[area] = readScoreLine(data?.scores?.[area]);

  return {
    overall: clampScore(data?.overall),
    overallWhy: text(data?.overallWhy),
    scores,
    strengths: readPoints(data?.strengths),
    concerns: readPoints(data?.concerns ?? data?.areasToImprove),
    fit: {
      verdict: text(data?.fit?.verdict),
      reasoning: text(data?.fit?.reasoning),
    },
    recommendation: RECOMMENDATIONS.includes(data?.recommendation)
      ? data.recommendation
      : 'Not enough to go on',
    summary: text(data?.summary),
    source: 'groq',
  };
}
