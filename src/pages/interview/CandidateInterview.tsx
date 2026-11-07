import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Loader2, CheckCircle2, Clock, Link2Off, WifiOff, ShieldOff,
  Volume2, VolumeX, RotateCw, ArrowRight, AlertCircle, Headphones,
} from 'lucide-react';
import Logo from '../../components/ui/Logo';
import AnswerRecorder from '../../components/interview/AnswerRecorder';
import Interviewer from '../../components/interview/Interviewer';
import { useVoiceAnswer, speechSupported } from '../../hooks/useVoiceAnswer';
import { speak, stopSpeaking, voiceAvailable, warmVoices, prefetchSpeech, setServiceVoice } from '../../lib/speak';
import {
  loadInterview, submitAnswer, finishInterview,
  type InterviewSession, type SessionState,
} from '../../services/interviewService';

// ============================================================
// The interview, as the candidate sees it
// ============================================================
// They scanned a QR code at a counter, or opened a link on the bus. No
// account, no app, no sign-in — the token in the link is who they are, and
// this page is the whole experience.
//
// So it is built for the worst case rather than the demo: one hand, a phone,
// a noisy room, a connection that drops. Every question is sent as it is
// answered, so a dropped connection costs one answer instead of the lot. The
// question stays on screen while it is read aloud. Nothing can be answered by
// accident, and nothing can be lost by tapping the wrong thing.

const MUTE_KEY = 'cp_interview_muted';

/**
 * How long the answer sits on screen before it is sent and the next question
 * is asked.
 *
 * The interview runs itself: the question is read, the microphone opens, the
 * gap after they stop talking ends the answer, and this is the window in
 * which they can say no. Long enough to read what was heard and press a
 * button, short enough that nobody thinks it has frozen.
 */
const AUTO_SEND_SECONDS = 6;

function Shell({
  finishedClip = false,
  children,
  speaking = false,
  withVideo = true,
}: {
  children: React.ReactNode;
  speaking?: boolean;
  withVideo?: boolean;
  /** Switches her to the closing clip — she thanks them and holds it. */
  finishedClip?: boolean;
}) {
  return (
    // data-theme is pinned: the portal's light mode would turn every surface
    // on this page white, over a video that is already mostly white. The
    // candidate never chose a theme here, and this screen only works dark.
    <div
      data-theme="dark"
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: '#000' }}
    >
      {/* The clip is 9:16. On a phone that is the whole screen; on a laptop
          it is a portrait frame in the middle rather than a face stretched
          across a monitor. */}
      <div
        className="relative overflow-hidden"
        style={{
          height: '100dvh',
          width: 'min(100vw, calc(100dvh * 9 / 16))',
          background: 'var(--color-bg)',
        }}
      >
        {withVideo && <Interviewer speaking={speaking} finished={finishedClip} />}

        <div className="relative h-full flex flex-col px-4 pt-5 pb-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <Logo size="sm" />
            {withVideo ? (
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg"
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                AI · not a live person
              </span>
            ) : (
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-muted)',
                }}
              >
                Interview
              </span>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/** A dead end, said plainly, with whatever the candidate can actually do about it. */
function Stopped({
  icon,
  title,
  body,
  onRetry,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center animate-scale-in">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
      >
        {icon}
      </div>
      <h1
        className="text-xl font-black mb-2"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)' }}
      >
        {title}
      </h1>
      <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--color-muted)' }}>
        {body}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 mt-5 text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
          style={{
            background: 'var(--color-accent-bg)',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
          }}
        >
          <RotateCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}

const BLOCKED: Record<string, { icon: React.ReactNode; title: string; body: string }> = {
  expired: {
    icon: <Clock size={24} style={{ color: 'var(--color-muted)' }} />,
    title: 'This link has expired',
    body: 'An interview link lasts a week. Reply to the email you received and the company can send you a fresh one.',
  },
  used: {
    icon: <CheckCircle2 size={24} style={{ color: 'var(--color-accent)' }} />,
    title: 'You have already taken this',
    body: 'Your answers are with the company and the link only works once. There is nothing more to do — they will be in touch.',
  },
  completed: {
    icon: <CheckCircle2 size={24} style={{ color: 'var(--color-accent)' }} />,
    title: 'This interview is finished',
    body: 'Your answers are already with the company. They will be in touch about what happens next.',
  },
  revoked: {
    icon: <ShieldOff size={24} style={{ color: 'var(--color-muted)' }} />,
    title: 'This link has been turned off',
    body: 'The company withdrew this interview. If you think that is a mistake, reply to the email they sent you.',
  },
  'not-found': {
    icon: <Link2Off size={24} style={{ color: 'var(--color-muted)' }} />,
    title: 'This link does not look right',
    body: 'It may have been cut short when it was copied. Open it straight from the email, or scan the QR code again.',
  },
};

export default function CandidateInterview() {
  const { token = '' } = useParams<{ token: string }>();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [state, setState] = useState<SessionState | 'loading'>('loading');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [muted, setMuted] = useState(() => localStorage.getItem(MUTE_KEY) === 'true');
  const [reading, setReading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  // Set when they ask the interview to wait. It lasts for this question
  // only — holding once should not turn the rest of the interview manual.
  const [held, setHeld] = useState(false);

  const voice = useVoiceAnswer();
  const speechOk = useMemo(() => speechSupported(), []);
  const canRead = useMemo(() => voiceAvailable(), []);
  const stopRead = useRef<() => void>(() => {});
  // The question being asked right now. A reply from speech synthesis that
  // arrives after the candidate has moved on must not open the microphone
  // on top of the next question.
  const askSeq = useRef(0);
  const statusRef = useRef(voice.status);
  statusRef.current = voice.status;

  const questions = session?.questions || [];
  const question = questions[index];
  const total = questions.length;
  const isLast = index === total - 1;

  const fetchSession = useCallback(() => {
    setState('loading');
    loadInterview(token).then(result => {
      setSession(result);
      // Answered everything but never closed it off — there is nothing left
      // to ask, so this reads as finished rather than as a blank question.
      if (result.answered >= result.questions.length && result.questions.length > 0) {
        setState('completed');
        return;
      }
      setIndex(Math.min(result.answered, Math.max(result.questions.length - 1, 0)));
      setState(result.state);
    });
  }, [token]);

  useEffect(fetchSession, [fetchSession]);

  // Two things the moment the session lands, both for the first question —
  // the one that used to arrive in silence.
  //
  // The service says whether its own voice is loaded, so a question is not
  // spent discovering that it is not. And the first question's audio is
  // fetched now, while the candidate is still reading the page and deciding
  // to tap, rather than after the tap with them waiting on it.
  useEffect(() => {
    if (!session || state !== 'ready') return;
    setServiceVoice(session.voice && !session.rehearsal);
    if (session.voice && !session.rehearsal && !muted) {
      prefetchSpeech(token, session.questions[0]?.id);
    }
  }, [session, state, token, muted]);

  // Mid-interview, a reload costs them the answer they are on. The browser
  // only shows its own wording here, but it is still the difference between
  // losing one answer and losing it by surprise.
  useEffect(() => {
    if (!started || finished) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [started, finished]);

  useEffect(() => () => stopSpeaking(), []);

  // Reading the question, then opening the microphone, is the whole loop.
  // Nobody should have to tap anything between being asked and answering —
  // the point of a spoken interview is that it behaves like one.
  const ask = useCallback((text: string, questionId?: string) => {
    askSeq.current += 1;
    const mine = askSeq.current;

    const openMic = () => {
      if (askSeq.current !== mine) return;
      // Anything but already listening. This used to insist on 'idle',
      // which is a state React has not necessarily re-rendered into by the
      // time a question finishes being read — reset() queues it, and a
      // question that is read quickly can finish first. The microphone then
      // never opened and the candidate sat looking at a question nothing
      // was listening to.
      if (statusRef.current === 'starting' || statusRef.current === 'recording') return;
      void voice.start();
    };

    if (muted || !canRead || !text) {
      // A beat, so the next question does not land mid-breath.
      window.setTimeout(openMic, 600);
      return;
    }
    setReading(true);
    stopRead.current = speak(
      text,
      () => {
        setReading(false);
        openMic();
      },
      questionId ? { token, questionId } : undefined
    );
  }, [muted, canRead, voice, token]);

  const begin = () => {
    warmVoices();
    setStarted(true);
    // Safari will not speak unless the first utterance comes out of a tap,
    // and this tap is the one. Reading the question here rather than from an
    // effect is what keeps the voice working on an iPhone.
    ask(questions[index]?.text || '', questions[index]?.id);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem(MUTE_KEY, String(next));
    if (next) {
      stopSpeaking();
      setReading(false);
    }
  };

  const replay = () => {
    if (!question) return;
    stopSpeaking();
    setReading(true);
    stopRead.current = speak(
      question.text,
      () => setReading(false),
      { token, questionId: question.id }
    );
  };

  // The next question's audio is fetched while they are answering this one,
  // so the interview does not pause to download a few seconds of speech
  // between every question.
  useEffect(() => {
    if (!started || finished || muted) return;
    prefetchSpeech(token, questions[index + 1]?.id);
  }, [started, finished, muted, token, questions, index]);

  // Whoever started the answer — the candidate tapping, or the interview
  // opening the mic for them — the question stops being read the moment
  // there is someone talking over it.
  useEffect(() => {
    if (voice.status === 'recording') {
      stopSpeaking();
      setReading(false);
    }
  }, [voice.status]);

  const sendRef = useRef<() => void>(() => {});

  // The gap ended the answer, so the interview carries itself to the next
  // question. The countdown is visible and cancellable: an interview that
  // moves on by itself has to be one you can stop, or the first mis-heard
  // answer is simply lost.
  useEffect(() => {
    if (voice.status !== 'stopped' || !voice.autoStopped || held || sending || finished) {
      setCountdown(null);
      return;
    }
    // Nothing was heard. Carrying on would file silence as their answer and
    // take the question with it — they get to try again instead, or type.
    if (!voice.transcript.trim()) {
      setCountdown(null);
      return;
    }
    setCountdown(AUTO_SEND_SECONDS);
    const timer = window.setInterval(() => {
      setCountdown(prev => (prev === null ? null : Math.max(0, prev - 1)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [voice.status, voice.autoStopped, voice.transcript, held, sending, finished]);

  useEffect(() => {
    if (countdown === 0) sendRef.current();
  }, [countdown]);

  const holdOn = () => {
    setHeld(true);
    setCountdown(null);
  };

  const sendAnswer = async () => {
    if (!session || !question || sending) return;
    setSendError('');
    stopSpeaking();
    setReading(false);
    setSending(true);

    const answer = await submitAnswer({
      token,
      questionId: question.id,
      index,
      transcript: voice.transcript.trim(),
      seconds: voice.seconds,
      typed: !speechOk,
      rehearsal: session.rehearsal,
    });

    if (!answer.ok) {
      setSending(false);
      setSendError(answer.error || 'That answer could not be sent.');
      return;
    }

    if (isLast) {
      const close = await finishInterview({ token, rehearsal: session.rehearsal });
      setSending(false);
      if (!close.ok) {
        setSendError(close.error || 'We could not close the interview off.');
        return;
      }
      voice.reset();
      setCountdown(null);
      setFinished(true);
      return;
    }

    setSending(false);
    setHeld(false);
    setCountdown(null);
    voice.reset();
    const next = index + 1;
    setIndex(next);
    ask(questions[next]?.text || '', questions[next]?.id);
  };

  sendRef.current = () => { void sendAnswer(); };

  // ── Terminal screens ──────────────────────────────────────

  if (state === 'loading') {
    return (
      <Shell withVideo={false}>
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 size={22} className="animate-spin" style={{ color: 'var(--color-muted-2)' }} />
          <p className="text-sm mt-3" style={{ color: 'var(--color-muted)' }}>Opening your interview…</p>
        </div>
      </Shell>
    );
  }

  if (state === 'unreachable') {
    return (
      <Shell withVideo={false}>
        <Stopped
          icon={<WifiOff size={24} style={{ color: 'var(--color-muted)' }} />}
          title="We cannot load your interview"
          body="Your link is fine — we just could not reach the server. Check your connection and try again in a moment."
          onRetry={fetchSession}
        />
      </Shell>
    );
  }

  if (BLOCKED[state] && !finished) {
    const copy = BLOCKED[state];
    return (
      <Shell withVideo={false}>
        <Stopped icon={copy.icon} title={copy.title} body={copy.body} />
      </Shell>
    );
  }

  if (finished) {
    return (
      <Shell finishedClip>
        <div className="flex-1 flex flex-col items-center justify-end text-center animate-scale-in pb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent-border)' }}
          >
            <CheckCircle2 size={28} style={{ color: 'var(--color-accent)' }} />
          </div>
          <h1
            className="text-2xl font-black mb-2"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)' }}
          >
            That is everything
          </h1>
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--color-muted)' }}>
            {session?.rehearsal
              ? 'That was a rehearsal, so nothing was sent anywhere.'
              : `Your answers have gone to ${session?.companyName || 'the company'}. They will be in touch about what happens next — you can close this page.`}
          </p>
          <p className="text-xs mt-5 max-w-xs" style={{ color: 'var(--color-muted-2)' }}>
            Thank you for taking the time.
          </p>
        </div>
      </Shell>
    );
  }

  // ── The interview ─────────────────────────────────────────

  if (!started) {
    const name = session?.candidateName?.split(/\s+/)[0] || '';
    const resuming = (session?.answered || 0) > 0;

    return (
      <Shell>
        <div className="flex-1 flex flex-col justify-end animate-slide-up">
          {/* One panel rather than text floating on the clip. Over a video
              this bright, legibility cannot be left to a gradient — and a
              candidate squinting at the rules of the interview is a
              candidate who skips them. */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'rgba(8,8,10,0.86)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <h1
              className="text-xl font-black leading-tight"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)' }}
            >
              {name ? `Hello ${name}` : 'Hello'} — about the {session?.role} job
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
              {session?.companyName} would like to ask you {total} question{total === 1 ? '' : 's'} before
              meeting you. About {Math.max(5, Math.round(total * 1.2))} minutes.
            </p>

            {session?.rehearsal && (
              <div
                className="flex items-start gap-2 rounded-xl p-2.5 mt-3"
                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}
              >
                <AlertCircle size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <p className="text-[11px] leading-relaxed" style={{ color: '#fbbf24' }}>
                  <b>Rehearsal.</b> The server could not be reached, so nothing you say is sent or scored.
                </p>
              </div>
            )}

            <div className="space-y-2 mt-3.5">
              {[
                'Each question is read to you, then the microphone opens on its own. Just talk.',
                'Stop talking and it moves on. Hold it back if you are not finished.',
                'You can take this once, so find somewhere reasonably quiet.',
              ].map(line => (
                <p key={line} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
                  <span
                    className="mt-[6px] w-1 h-1 rounded-full flex-shrink-0"
                    style={{ background: 'var(--color-accent)' }}
                  />
                  {line}
                </p>
              ))}
            </div>

            <p
              className="flex items-start gap-2 text-[11px] leading-relaxed mt-3 pt-3"
              style={{ color: 'var(--color-muted)', borderTop: '1px solid rgba(255,255,255,0.09)' }}
            >
              <Headphones size={13} className="mt-0.5 flex-shrink-0" />
              <span>
                Your phone will ask for the microphone. What you say is turned into text and scored
                against the role —{' '}
                <span style={{ color: 'var(--color-text-dim)' }}>
                  the company sees the scores and a short summary, never a recording.
                </span>
              </span>
            </p>

            {resuming && (
              <p className="text-xs mt-3 font-semibold" style={{ color: 'var(--color-accent)' }}>
                You answered {session?.answered} already — this picks up at question {index + 1}.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={begin}
            className="flex items-center justify-center gap-2 w-full mt-3 py-3.5 rounded-2xl text-sm font-black transition-all active:scale-[0.98]"
            style={{ background: 'var(--color-accent)', color: '#000' }}
          >
            {resuming ? 'Carry on' : 'Start the interview'} <ArrowRight size={16} />
          </button>
        </div>
      </Shell>
    );
  }

  const answered = voice.transcript.trim().length > 0;
  const canSend = voice.status === 'stopped' || (!speechOk && answered);

  return (
    <Shell speaking={reading}>
      <div className="flex-1 flex flex-col">
        {/* Where they are */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold" style={{ color: 'var(--color-muted)' }}>
              Question {index + 1} of {total}
            </span>
            {canRead && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={replay}
                  disabled={muted}
                  className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-40"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
                >
                  <RotateCw size={11} /> {reading ? 'Reading…' : 'Read again'}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? 'Read questions out loud' : 'Stop reading questions out loud'}
                  className="p-1.5 rounded-lg transition-all"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
                >
                  {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>
              </div>
            )}
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-3)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((index + (canSend ? 1 : 0)) / total) * 100}%`, background: 'var(--color-accent)' }}
            />
          </div>
        </div>

        {/* Nothing goes here. It is where she is, and an interview where you
            cannot see the person asking is just a form that talks. */}
        <div className="flex-1 min-h-[12vh]" />

        {/* The question */}
        <div
          className="rounded-2xl p-4 mb-4 flex-shrink-0 animate-card-in"
          style={{
            background: 'rgba(10,10,12,0.78)',
            border: `1px solid ${reading ? 'var(--color-accent-border)' : 'rgba(255,255,255,0.14)'}`,
            backdropFilter: 'blur(10px)',
            transition: 'border-color 240ms ease',
          }}
          key={question?.id}
        >
          {question?.about && (
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-accent)' }}
            >
              {question.about}
            </p>
          )}
          <p
            className="text-lg font-bold leading-snug"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)' }}
          >
            {question?.text}
          </p>
        </div>

        <AnswerRecorder voice={voice} speechOk={speechOk} />

        {sendError && (
          <div
            className="flex items-start gap-2 rounded-xl p-3 mt-4"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#f87171' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#f87171' }}>{sendError}</p>
          </div>
        )}

        {/* Sending is per answer, so a connection that drops costs this one
            question rather than the whole interview. */}
        {countdown !== null && countdown > 0 && (
          <div
            className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 mt-4 animate-fade-in"
            style={{ background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent-border)' }}
          >
            <p className="text-xs font-semibold" style={{ color: 'var(--color-accent)' }}>
              {isLast ? 'Finishing' : 'Next question'} in {countdown}…
            </p>
            <button
              type="button"
              onClick={holdOn}
              className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              Hold on
            </button>
          </div>
        )}

        {canSend && (
          <div className="mt-5 flex-shrink-0">
            <button
              type="button"
              onClick={sendAnswer}
              disabled={sending}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-black transition-all active:scale-[0.98] disabled:opacity-60"
              style={
                answered
                  ? { background: 'var(--color-accent)', color: '#000' }
                  : {
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-muted)',
                    }
              }
            >
              {sending ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  {answered
                    ? isLast ? 'Send and finish' : 'Send and continue'
                    : isLast ? 'Skip and finish' : 'Skip this question'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
            <p className="text-[11px] text-center mt-2.5" style={{ color: 'var(--color-muted-2)' }}>
              {!answered
                ? 'Nothing came through. You can record again, or skip — a skipped question scores nothing.'
                : held
                  ? 'Held. Send it when you are ready, or record the answer again.'
                  : 'Once it is sent you cannot change this answer.'}
            </p>
          </div>
        )}
      </div>
    </Shell>
  );
}
