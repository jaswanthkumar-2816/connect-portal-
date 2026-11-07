import express from 'express';
import cors from 'cors';
import { config, checkConfig } from './config.js';
import { store, ready as storeReady } from './store.js';
import { issueToken, readToken, newId } from './tokens.js';
import { writeQuestions } from './questions.js';
import { assessInterview } from './report.js';
import { groqConfigured } from './groq.js';
import { speakText, warmVoice, voiceEnabled, voiceReady } from './voice.js';
import { verifyRecruiter } from './auth.js';

// ============================================================
// HIERO Interview API
// ============================================================
// The AI interview, on its own. Groq writes the questions from the job the
// recruiter posted, the candidate answers them in the portal, and Groq reads
// the answers back into a report the recruiter can act on.
//
// It is a separate service because it is the one part of Connect that is
// slow, that costs money per request, and that depends on somebody else's
// uptime. Kept inside the portal's gateway, a Groq outage or a rate limit
// would take sign-in and the inbox down with it. Out here, the worst it can
// do is fail to write a report.

const app = express();

app.use(express.json({ limit: '256kb' }));
app.use(
  cors({
    origin: config.allowedOrigins.includes('*') ? true : config.allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization', 'ngrok-skip-browser-warning'],
  })
);

// ── Guards ──────────────────────────────────────────────────

/**
 * Recruiter-side routes.
 *
 * The portal sends the recruiter's own sign-in token, which is checked with
 * the gateway that issued it. The shared key is still accepted, but only for
 * callers that are not a browser — scripts, cron, another service. It must
 * never be compiled into the portal bundle, because every candidate
 * downloads that bundle to take their interview.
 */
async function recruiterOnly(req, res, next) {
  const bearer = (req.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (bearer) {
    const user = await verifyRecruiter(bearer);
    if (user) {
      req.recruiter = user;
      return next();
    }
  }

  const key = req.get('x-api-key');
  if (config.apiKey && key && key === config.apiKey) {
    req.recruiter = null; // a trusted service, not a person
    return next();
  }

  return res.status(401).json({ success: false, error: 'Not authorised.' });
}

/**
 * One company must not be able to read another's assessments. The invite
 * records who created it; everything after checks against that.
 */
function ownsSession(req, session) {
  if (!req.recruiter) return true;          // trusted service-to-service call
  if (!session.companyId) return true;      // created before this was recorded
  return session.companyId === req.recruiter.companyId;
}

// A token cannot realistically be guessed — it is HMAC signed — but a
// machine trying anyway should not get unlimited attempts, and an API that
// answers a thousand requests a second from one address is being abused
// whatever it is being asked.
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 120;

function throttle(req, res, next) {
  const who = req.ip || 'unknown';
  const now = Date.now();
  const seen = hits.get(who);
  if (!seen || now - seen.start > WINDOW_MS) {
    hits.set(who, { start: now, count: 1 });
    return next();
  }
  seen.count += 1;
  if (seen.count > MAX_PER_WINDOW) {
    return res.status(429).json({ success: false, error: 'Too many requests. Wait a minute.' });
  }
  next();
}

// Left alone, the map above grows one entry per address forever.
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [who, seen] of hits) if (seen.start < cutoff) hits.delete(who);
}, WINDOW_MS).unref();

/** Resolve :token or body.token to a live session, or answer for us. */
function withSession(req, res) {
  const token = req.params.token || req.body?.token;
  const read = readToken(token);
  if (!read.ok) {
    res.status(read.reason === 'expired' ? 410 : 404).json({ success: false, state: read.reason });
    return null;
  }
  const session = store.get(read.payload.jti);
  if (!session) {
    res.status(404).json({ success: false, state: 'not-found' });
    return null;
  }
  if (session.state === 'revoked') {
    res.status(403).json({ success: false, state: 'revoked' });
    return null;
  }
  return session;
}

// ── Health ──────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'hiero-interview-api',
    groq: groqConfigured() ? config.groqModel : 'not configured',
    voice: voiceEnabled() ? config.voiceName : 'off',
    sessions: store.count(),
    // false means interviews in progress are on a disk that a restart
    // throws away. Worth seeing here rather than from a candidate.
    durable: store.durable(),
  });
});

// ── Recruiter: create an interview ──────────────────────────

app.post('/api/interview/invite', recruiterOnly, async (req, res) => {
  const {
    applicationId,
    candidateName = '',
    role = '',
    companyName = '',
    skills = [],
    description = '',
    questionCount,
  } = req.body || {};

  if (!applicationId) {
    return res.status(400).json({ success: false, error: 'applicationId is required.' });
  }

  const count = Math.min(Math.max(Number(questionCount) || config.questionCount, 3), 15);
  // Written now rather than when the candidate opens the link: they should
  // not be watching a spinner while a model thinks, and the recruiter is the
  // one who can wait a second.
  const { questions, source } = await writeQuestions({
    role,
    companyName,
    description,
    skills,
    count,
  });

  const jti = newId();
  const token = issueToken({ jti, applicationId });

  store.put({
    jti,
    applicationId: String(applicationId),
    companyId: req.recruiter?.companyId || '',
    createdBy: req.recruiter?.id || 'service',
    candidateName: String(candidateName || ''),
    role: String(role || ''),
    companyName: String(companyName || ''),
    skills: Array.isArray(skills) ? skills : [],
    description: String(description || ''),
    questions,
    questionSource: source,
    state: 'ready',
    answers: [],
    createdAt: new Date().toISOString(),
    openedAt: null,
    completedAt: null,
    report: null,
    reportError: null,
  });

  res.json({
    success: true,
    token,
    url: `${config.portalUrl}/interview/${token}`,
    questions: questions.length,
    questionSource: source,
  });
});

// ── Candidate: the interview ────────────────────────────────

app.get('/api/interview/session/:token', throttle, (req, res) => {
  const session = withSession(req, res);
  if (!session) return;

  if (session.state === 'completed') {
    return res.status(409).json({ success: false, state: 'used' });
  }

  if (!session.openedAt) store.update(session.jti, { openedAt: new Date().toISOString() });

  res.json({
    success: true,
    session: {
      state: session.answers.length > 0 ? 'in-progress' : 'ready',
      candidateName: session.candidateName,
      role: session.role || 'this role',
      companyName: session.companyName || 'the company',
      questions: session.questions,
      answered: session.answers.length,
      // Whether our own voice can be used for this interview. The portal
      // asks so it can go straight to the browser's voice instead of
      // waiting on an endpoint that is going to refuse.
      voice: voiceEnabled() && voiceReady(),
    },
  });
});

/**
 * The question, read aloud.
 *
 * Authenticated by the same token as the rest of the candidate's side, so a
 * stranger cannot use this as a free text-to-speech service, and cached hard
 * on the way out: the same question goes to every candidate for that job,
 * and a phone should not re-download it between replays.
 */
app.get('/api/interview/speak/:token/:questionId', throttle, async (req, res) => {
  const session = withSession(req, res);
  if (!session) return;

  const question = session.questions.find(q => q.id === req.params.questionId);
  if (!question) {
    return res.status(404).json({ success: false, error: 'No such question.' });
  }

  // Never wait on a cold model. See voiceReady() — waiting here is what
  // took the service down mid-interview.
  if (!voiceEnabled() || !voiceReady()) {
    warmVoice();
    return res.status(503).json({ success: false, error: 'voice not ready' });
  }

  try {
    const wav = await speakText(question.text);
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Length': String(wav.length),
      'Cache-Control': 'private, max-age=86400',
    });
    res.send(wav);
  } catch (err) {
    // The portal falls back to the browser's own voice on anything but a
    // 200, so this needs to be quick and honest rather than retried.
    res.status(503).json({ success: false, error: err.message });
  }
});

app.post('/api/interview/answer', throttle, (req, res) => {
  const session = withSession(req, res);
  if (!session) return;

  if (session.state === 'completed') {
    return res.status(409).json({ success: false, state: 'used', error: 'This interview is already finished.' });
  }

  const index = Number(req.body?.index);
  const question = session.questions[index];
  if (!question) {
    return res.status(400).json({ success: false, error: 'There is no question at that position.' });
  }

  const answer = {
    questionId: question.id,
    question: question.text,
    about: question.about || null,
    // Long enough for anyone talking for two minutes, short enough that a
    // script cannot use this as free storage.
    transcript: String(req.body?.transcript || '').slice(0, 8000),
    seconds: Math.max(0, Math.min(Number(req.body?.seconds) || 0, 600)),
    typed: Boolean(req.body?.typed),
    at: new Date().toISOString(),
  };

  // Sending the same answer twice — a retry after a dropped connection —
  // replaces it rather than recording the candidate as answering twice.
  const answers = [...session.answers];
  const existing = answers.findIndex(a => a.questionId === question.id);
  if (existing >= 0) answers[existing] = answer;
  else answers.push(answer);

  store.update(session.jti, { answers, state: 'in-progress' });
  res.json({ success: true, answered: answers.length });
});

app.post('/api/interview/finish', throttle, async (req, res) => {
  const session = withSession(req, res);
  if (!session) return;

  if (session.state === 'completed') {
    return res.json({ success: true, alreadyFinished: true });
  }

  const completedAt = new Date().toISOString();
  // Every question, answered or not: a skipped question is a fact about the
  // interview, and leaving it out would hide it from the assessment.
  const script = session.questions.map(q => {
    const given = session.answers.find(a => a.questionId === q.id);
    return {
      question: q.text,
      about: q.about,
      transcript: given?.transcript || '',
      seconds: given?.seconds || 0,
    };
  });

  let report = null;
  let reportError = null;
  try {
    report = await assessInterview({
      role: session.role,
      companyName: session.companyName,
      skills: session.skills,
      answers: script,
    });
  } catch (err) {
    // The candidate finished. Their part worked, and telling them it failed
    // because our model was busy would be both untrue and unfair — the
    // report is retried when the recruiter opens it.
    reportError = err.message;
  }

  store.update(session.jti, { state: 'completed', completedAt, report, reportError });
  // The one write worth waiting on. The candidate is already reading the
  // thank-you screen, and the report is not produced a second time.
  await store.settled(session.jti);
  res.json({ success: true });
});

// ── Recruiter: the report ───────────────────────────────────

function reportBody(session) {
  const answered = session.answers.filter(a => (a.transcript || '').trim()).length;
  const base = {
    sessionStatus: session.state,
    completedAt: session.completedAt,
    questionsAsked: session.questions.length,
    questionsAnswered: answered,
  };

  if (session.report) return { ...base, ...session.report };

  const pending = session.reportError
    ? 'The answers are saved, but the assessment could not be produced. Open this again in a few minutes.'
    : '';

  return {
    ...base,
    overall: null,
    overallWhy: pending,
    scores: {
      communication: { score: null, why: '' },
      problemSolving: { score: null, why: '' },
      roleKnowledge: { score: null, why: '' },
      relevance: { score: null, why: '' },
      confidence: { score: null, why: '' },
    },
    strengths: [],
    concerns: [],
    fit: { verdict: '', reasoning: '' },
    recommendation: '',
    summary: pending,
  };
}

app.get('/api/interview/report/:applicationId', recruiterOnly, async (req, res) => {
  const session = store.latestForApplication(String(req.params.applicationId));
  if (!session) return res.json({ success: true, state: 'none', report: null });
  if (!ownsSession(req, session)) {
    // Deliberately the same answer as "no interview": whether a rival
    // company has interviewed someone is itself worth not leaking.
    return res.json({ success: true, state: 'none', report: null });
  }

  // A report that failed to generate at the end of the interview is tried
  // again here, once, now that whatever was wrong has had time to pass.
  if (session.state === 'completed' && !session.report && session.reportError) {
    try {
      const report = await assessInterview({
        role: session.role,
        companyName: session.companyName,
        skills: session.skills,
        answers: session.questions.map(q => {
          const given = session.answers.find(a => a.questionId === q.id);
          return {
            question: q.text,
            about: q.about,
            transcript: given?.transcript || '',
            seconds: given?.seconds || 0,
          };
        }),
      });
      store.update(session.jti, { report, reportError: null });
      session.report = report;
    } catch (err) {
      console.error('[report] retry failed:', err.message);
    }
  }

  res.json({ success: true, state: session.state, report: reportBody(session) });
});

/** Pull a link back before it is used. */
app.post('/api/interview/revoke', recruiterOnly, (req, res) => {
  const session = store.latestForApplication(String(req.body?.applicationId || ''));
  if (!session || !ownsSession(req, session)) {
    return res.status(404).json({ success: false, error: 'No interview for that application.' });
  }
  store.update(session.jti, { state: 'revoked' });
  res.json({ success: true });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: `No route for ${req.method} ${req.path}` });
});

const missing = checkConfig();
if (missing.length) {
  console.error(`\n  Cannot start: ${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} not set.`);
  console.error('  Copy .env.example to .env and fill it in.\n');
  process.exit(1);
}

// Sessions already in progress come back from the database before the first
// request is taken — answering "no such interview" to a valid link while
// hydrating would be the same failure this guards against.
await storeReady;

app.listen(config.port, () => {
  console.log(`\n  HIERO Interview API on http://localhost:${config.port}`);
  console.log(`  Groq:   ${groqConfigured() ? config.groqModel : 'no key — standard questions, no scoring'}`);
  console.log(`  Voice:  ${voiceEnabled() ? `${config.voiceName} (${config.voiceModel})` : 'off — the browser reads the questions'}`);
  console.log(`  Portal: ${config.portalUrl}`);
  console.log(`  Stored: ${store.count()} session${store.count() === 1 ? '' : 's'} ` +
    `(${store.durable() ? 'MongoDB' : 'local file — lost on restart'})\n`);

  // Fetched now rather than when the first candidate is waiting on it.
  warmVoice();
});
