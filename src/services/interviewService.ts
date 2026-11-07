import { INTERVIEW_API_URL } from '../lib/endpoints';

// ============================================================
// The candidate's side of the interview
// ============================================================
// Everything here is called by someone who is not signed in. The token out of
// the link is the whole credential, so it goes in the URL path or the body of
// every call and no recruiter token is ever attached — a candidate must not
// inherit a recruiter's reach just because they opened the portal.
//
// It talks to the interview service in interview-api/, not to the HIERO
// gateway — see lib/endpoints. Its routes:
//
//   GET  /api/interview/session/:token
//        → { success, session: { state, candidateName, role, companyName,
//                                questions: [{ id, text, about? }], answered } }
//        state: 'ready' | 'in-progress' | 'completed' | 'expired' | 'used' | 'revoked'
//
//        A refused invite must come back as JSON naming the state —
//        { success: false, state: 'expired' } and so on. A bare 404 is read
//        as the service being absent rather than as a bad link, because that
//        is what an unrouted path actually means.
//
//   POST /api/interview/answer
//        { token, questionId, index, transcript, seconds, typed }
//        → { success, answered }
//
//   POST /api/interview/finish
//        { token }
//        → { success }
//
// The answer goes up as text, never as audio. The recruiter's report is built
// from scores and words; the recording is not ours to collect, and not
// collecting it is simpler than promising to delete it.

export type SessionState =
  | 'ready'
  | 'in-progress'
  | 'completed'
  | 'expired'
  | 'used'
  | 'revoked'
  | 'not-found'
  | 'unreachable';

export interface InterviewQuestion {
  id: string;
  text: string;
  /** The skill this question is getting at, shown to the candidate. */
  about?: string;
}

export interface InterviewSession {
  state: SessionState;
  candidateName: string;
  role: string;
  companyName: string;
  questions: InterviewQuestion[];
  /** How many were answered already, so a reload lands on the right one. */
  answered: number;
  /** True when this is the local rehearsal, not a real interview. */
  rehearsal: boolean;
  /**
   * Whether the service's own voice is loaded and will answer. It says so
   * up front rather than letting the first question find out: a request that
   * fails is a question the candidate hears nothing of.
   */
  voice: boolean;
}

const TIMEOUT_LOAD = 20000;
const TIMEOUT_SEND = 30000;

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    // The gateway is reached over an ngrok tunnel while testing, and without
    // this a plain browser request gets ngrok's warning page back instead of
    // the API response. Ignored on any other host.
    'ngrok-skip-browser-warning': 'true',
  };
}

async function call(path: string, ms: number, init?: RequestInit): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(`${INTERVIEW_API_URL}${path}`, {
      ...init,
      headers: headers(),
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const KNOWN_STATES: SessionState[] = [
  'ready', 'in-progress', 'completed', 'expired', 'used', 'revoked', 'not-found',
];

function readState(value: unknown): SessionState {
  const v = String(value || '').toLowerCase().replace(/_/g, '-');
  if ((KNOWN_STATES as string[]).includes(v)) return v as SessionState;
  // The gateway's own vocabulary for an invite, mapped onto ours.
  if (v === 'started') return 'in-progress';
  if (v === 'sent' || v === 'pending' || v === 'new') return 'ready';
  if (v === 'done' || v === 'finished' || v === 'scored') return 'completed';
  if (v === 'invalid' || v === 'unknown') return 'not-found';
  return 'not-found';
}

// ── The rehearsal ───────────────────────────────────────────
// So the interview can be walked through on a developer's machine with no
// gateway running, and so a demo does not depend on the network in the room.
// It is never silently a stand-in for the real thing: the page says it is a
// rehearsal, and nothing is sent anywhere.

const REHEARSAL_QUESTIONS: InterviewQuestion[] = [
  { id: 'r1', text: 'To start, tell me a little about yourself and the work you have done so far.', about: 'Communication' },
  { id: 'r2', text: 'Why this role, and why at this company?', about: 'Relevance' },
  { id: 'r3', text: 'Walk me through something you worked on that you are proud of. What was your part in it?', about: 'Knows the work' },
  { id: 'r4', text: 'Tell me about a time a customer or a colleague was unhappy with your work. What did you do?', about: 'Problem solving' },
  { id: 'r5', text: 'What part of this job do you think you would find hardest?', about: 'Confidence' },
  { id: 'r6', text: 'Last one — is there anything you would like us to know that we have not asked about?', about: 'Communication' },
];

function rehearsalAllowed(): boolean {
  return (
    import.meta.env.VITE_DEMO_INTERVIEW === 'true' ||
    INTERVIEW_API_URL.startsWith('http://localhost')
  );
}

function rehearsalSession(): InterviewSession {
  return {
    state: 'ready',
    candidateName: '',
    role: 'this role',
    companyName: 'the company',
    questions: REHEARSAL_QUESTIONS,
    answered: 0,
    rehearsal: true,
    // The rehearsal runs with no service behind it.
    voice: false,
  };
}

// ── Calls ───────────────────────────────────────────────────

export async function loadInterview(token: string): Promise<InterviewSession> {
  const empty = {
    candidateName: '',
    role: '',
    companyName: '',
    questions: [] as InterviewQuestion[],
    answered: 0,
    rehearsal: false,
    voice: false,
  };

  if (!token) return { ...empty, state: 'not-found' };

  const res = await call(
    `/api/interview/session/${encodeURIComponent(token)}`,
    TIMEOUT_LOAD
  );

  if (!res) {
    // No answer at all: the gateway is down, asleep, or not reachable from
    // wherever the candidate is standing. That is not an invalid link, and
    // telling them their link is broken would be a lie.
    return rehearsalAllowed() ? rehearsalSession() : { ...empty, state: 'unreachable' };
  }

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.success) {
    // A refusal only counts as a verdict on the link when the gateway names
    // one. Express answers an unbuilt route with a plain HTML 404, and
    // reading that as "your link is broken" sends a candidate off to ask the
    // company for a replacement for a link that was never the problem.
    const named = data?.state ?? data?.reason;
    if (named) return { ...empty, state: readState(named) };
    if (res.status === 410) return { ...empty, state: 'expired' };
    if (res.status === 401 || res.status === 403) return { ...empty, state: 'not-found' };
    return rehearsalAllowed() ? rehearsalSession() : { ...empty, state: 'unreachable' };
  }

  const session = data.session || data;
  const questions: InterviewQuestion[] = (Array.isArray(session.questions) ? session.questions : [])
    .map((q: Record<string, unknown>, i: number) => ({
      id: String(q?.id ?? q?.questionId ?? i + 1),
      text: String(q?.text ?? q?.question ?? '').trim(),
      about: q?.about ? String(q.about) : q?.skill ? String(q.skill) : undefined,
    }))
    .filter((q: InterviewQuestion) => q.text.length > 0);

  // A session the gateway calls usable but has no questions for cannot be
  // taken. Say so as a broken link rather than opening an empty interview.
  const state = readState(session.state || session.status || 'ready');
  if (questions.length === 0 && (state === 'ready' || state === 'in-progress')) {
    return { ...empty, state: 'not-found' };
  }

  const answered = Number(session.answered ?? session.questionsAnswered ?? 0);

  return {
    state,
    candidateName: String(session.candidateName || session.studentName || '').trim(),
    role: String(session.role || session.jobTitle || 'this role').trim(),
    companyName: String(session.companyName || session.company || 'the company').trim(),
    questions,
    answered: Number.isFinite(answered) ? Math.max(0, answered) : 0,
    rehearsal: false,
    voice: session.voice !== false,
  };
}

export async function submitAnswer(params: {
  token: string;
  questionId: string;
  index: number;
  transcript: string;
  seconds: number;
  typed: boolean;
  rehearsal: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  if (params.rehearsal) return { ok: true };

  const res = await call('/api/interview/answer', TIMEOUT_SEND, {
    method: 'POST',
    body: JSON.stringify({
      token: params.token,
      questionId: params.questionId,
      index: params.index,
      transcript: params.transcript,
      seconds: params.seconds,
      typed: params.typed,
    }),
  });

  if (!res) {
    return { ok: false, error: 'That did not reach us. Check your connection and send it again.' };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    return { ok: false, error: data?.error || 'That answer could not be saved. Try sending it again.' };
  }
  return { ok: true };
}

export async function finishInterview(params: {
  token: string;
  rehearsal: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  if (params.rehearsal) return { ok: true };

  const res = await call('/api/interview/finish', TIMEOUT_SEND, {
    method: 'POST',
    body: JSON.stringify({ token: params.token }),
  });

  if (!res) {
    return { ok: false, error: 'Your answers are saved, but we could not close the interview off. Try once more.' };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    return { ok: false, error: data?.error || 'We could not close the interview off. Try once more.' };
  }
  return { ok: true };
}
