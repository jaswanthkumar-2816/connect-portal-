import { useCallback, useEffect, useRef, useState } from 'react';
import { INTERVIEW_API_URL } from '../lib/endpoints';

// ============================================================
// Answering out loud
// ============================================================
// The candidate's phone records the answer and sends the audio to the
// interview service, which runs it through Whisper and sends back the words.
//
// It used to use the browser's own SpeechRecognition, and that is why
// interviews kept failing in ways nobody could see. It is a Chrome feature
// wearing a standard's name: Firefox has never had it, Samsung Internet does
// not, and Safari's is its own dialect. On Android it wants the microphone
// at the same time as the page's level meter, and after two or three
// questions it stops being given it — then transcribes nothing, raises no
// error, and lets the interview run to the end filing empty answers.
//
// Recording is one thing every browser can do. A failure is now a failed
// request, which is something we can put on the screen.
//
// Two parts, failing separately on purpose:
//
//   getUserMedia — the recording itself, plus the level meter that notices
//                  when they have stopped talking. Taken once at the first
//                  question and held: asking per question is what used to
//                  exhaust it partway through.
//   the service  — turns that recording into words. If it cannot be reached
//                  they can type instead, so nobody is shut out of a job by
//                  their choice of phone.
//
// The audio is not kept. It is sent, transcribed and dropped — the page says
// as much to the candidate, and the report is built only from the words.

export const MAX_ANSWER_SECONDS = 120;

/**
 * Quiet for this long after they have finished a thought and the answer is
 * taken as finished.
 *
 * Three seconds. It keeps the interview moving, which is what it is for, and
 * the risk it carries is real: three seconds is a short pause when you are
 * being interviewed by a machine and trying to remember a date, so it will
 * sometimes cut off someone who thinks before they speak. The hint below is
 * what makes that survivable — the countdown starts at one second, so a
 * candidate who is still thinking can see the answer about to end and keep
 * talking to hold it open.
 */
const GAP_MS = 3000;

/**
 * A quieter beat first, so the countdown is not a surprise. Moved earlier
 * along with the gap: on a three second gap a hint at 1.6s left barely over
 * a second of warning, which is not enough to react to.
 */
const SILENCE_HINT_MS = 1000;

/** Above this the analyser counts it as someone talking rather than a room. */
const VOICE_LEVEL = 0.055;

type Status = 'idle' | 'starting' | 'recording' | 'transcribing' | 'stopped';

/**
 * Containers worth asking for, best first.
 *
 * Opus in WebM is small, which matters when this is uploaded off a phone on
 * mobile data between questions. Safari records MP4 instead and will not be
 * talked out of it. Whisper accepts both.
 */
const CONTAINERS = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

function pickContainer(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  for (const type of CONTAINERS) {
    try {
      if (MediaRecorder.isTypeSupported(type)) return type;
    } catch { /* older implementations throw on odd input */ }
  }
  return '';
}

/**
 * Can this browser answer out loud at all?
 *
 * Every browser that can record can. The old check asked whether Chrome's
 * speech API was present, which sent Firefox and Samsung Internet users
 * straight to the typing box for no reason.
 */
export const speechSupported = (): boolean =>
  typeof MediaRecorder !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);

export interface VoiceAnswer {
  status: Status;
  /** What they said, once the service has written it down. */
  transcript: string;
  /** Kept for the UI. There is no live partial text when the words come
   *  back after the recording rather than during it. */
  interim: string;
  /** 0–1 microphone loudness, for the meter. */
  level: number;
  seconds: number;
  /** Set when they have spoken and then gone quiet for a moment. */
  silent: boolean;
  /** True once the recording stopped itself at the time limit. */
  cappedOut: boolean;
  /** True when the gap ended the answer rather than the candidate tapping. */
  autoStopped: boolean;
  error: string;
  meterLive: boolean;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
  edit: (text: string) => void;
}

export function useVoiceAnswer(token: string): VoiceAnswer {
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState('');
  const [level, setLevel] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [silent, setSilent] = useState(false);
  const [cappedOut, setCappedOut] = useState(false);
  const [autoStopped, setAutoStopped] = useState(false);
  const [error, setError] = useState('');
  const [meterLive, setMeterLive] = useState(false);

  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  // Built once and kept. A fresh analyser and source node per question piles
  // up nodes on one context for no benefit — the microphone behind them is
  // the same one throughout.
  const analyser = useRef<AnalyserNode | null>(null);
  const frame = useRef<number>(0);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);
  const lastVoiceAt = useRef(0);
  const spoke = useRef(false);
  /** Bumped per answer, so a transcript that arrives late is dropped rather
   *  than landing in the next question's box. */
  const turn = useRef(0);

  /**
   * Stop listening. The microphone itself is kept unless `releaseMic`.
   *
   * It used to be handed back after every answer and asked for again at the
   * next question. That is two things competing for one microphone, and
   * Android stops granting it after a few rounds — silently.
   */
  const teardown = useCallback((releaseMic = false) => {
    if (recorder.current) {
      recorder.current.ondataavailable = null;
      recorder.current.onstop = null;
      try {
        if (recorder.current.state !== 'inactive') recorder.current.stop();
      } catch { /* already stopped */ }
      recorder.current = null;
    }
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    if (ticker.current) {
      clearInterval(ticker.current);
      ticker.current = null;
    }
    if (releaseMic) {
      if (stream.current) {
        stream.current.getTracks().forEach(t => t.stop());
        stream.current = null;
      }
      if (audioCtx.current) {
        audioCtx.current.close().catch(() => {});
        audioCtx.current = null;
      }
      analyser.current = null;
      setMeterLive(false);
    }
    setLevel(0);
  }, []);

  // A candidate who closes the tab mid-answer should not leave the mic light
  // on, so the stream is released when this unmounts — and only then.
  useEffect(() => () => teardown(true), [teardown]);

  /** The microphone, taken once and reused for the rest of the interview. */
  const getMic = useCallback(async (): Promise<MediaStream | null> => {
    const live = stream.current?.getAudioTracks().some(t => t.readyState === 'live');
    if (live && stream.current) return stream.current;
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      stream.current = media;
      return media;
    } catch {
      setError('Your browser is blocking the microphone. Allow it and try again — or type your answer instead.');
      return null;
    }
  }, []);

  /** The level meter, which is also how we notice they have stopped talking. */
  const startMeter = useCallback(async (media: MediaStream) => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtx.current && audioCtx.current.state !== 'closed'
        ? audioCtx.current
        : new Ctx();
      audioCtx.current = ctx;
      // A context left alone between questions suspends itself on some
      // phones, and a suspended one reads silence however loudly they talk —
      // which would end every answer after three seconds.
      if (ctx.state === 'suspended') await ctx.resume().catch(() => {});

      if (!analyser.current) {
        const node = ctx.createAnalyser();
        node.fftSize = 512;
        ctx.createMediaStreamSource(media).connect(node);
        analyser.current = node;
      }
      const meter = analyser.current;
      const buffer = new Uint8Array(meter.frequencyBinCount);
      setMeterLive(true);

      const read = () => {
        meter.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
        const rms = Math.sqrt(sum / buffer.length) / 255;
        setLevel(rms);
        if (rms > VOICE_LEVEL) {
          lastVoiceAt.current = Date.now();
          spoke.current = true;
          setSilent(false);
        }
        frame.current = requestAnimationFrame(read);
      };
      frame.current = requestAnimationFrame(read);
    } catch {
      // No meter. The recording still happens; they lose the bars and the
      // automatic move to the next question, not the interview.
      setMeterLive(false);
    }
  }, []);

  /** Send the recording off and put the words in the box. */
  const sendForWords = useCallback(async (blob: Blob, mine: number) => {
    if (!blob.size) {
      if (turn.current === mine) setStatus('stopped');
      return;
    }
    setStatus('transcribing');
    try {
      const res = await fetch(`${INTERVIEW_API_URL}/api/interview/transcribe`, {
        method: 'POST',
        headers: {
          'Content-Type': blob.type || 'audio/webm',
          'x-interview-token': token,
          'ngrok-skip-browser-warning': 'true',
        },
        body: blob,
        signal: AbortSignal.timeout(90000),
      });
      const data = await res.json().catch(() => null);
      if (turn.current !== mine) return;          // they moved on; drop it
      if (!res.ok || !data?.success) {
        setError(data?.error || 'We could not make out the recording. Try again, or type your answer.');
      } else if (data.text) {
        setTranscript(prev => (prev ? `${prev} ${data.text}`.trim() : data.text));
      } else {
        setError('Nothing came through. Say it again, or type your answer.');
      }
    } catch {
      if (turn.current !== mine) return;
      setError('We could not reach the interview service. Type your answer and carry on.');
    } finally {
      if (turn.current === mine) setStatus('stopped');
    }
  }, [token]);

  const stopRef = useRef<() => void>(() => {});

  const stop = useCallback(() => {
    if (ticker.current) {
      clearInterval(ticker.current);
      ticker.current = null;
    }
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    setLevel(0);
    const rec = recorder.current;
    if (!rec || rec.state === 'inactive') {
      setStatus('stopped');
      return;
    }
    // onstop picks it up and sends it. The microphone stays open.
    try { rec.stop(); } catch { setStatus('stopped'); }
  }, []);

  useEffect(() => { stopRef.current = stop; }, [stop]);

  const start = useCallback(async () => {
    setError('');
    setSilent(false);
    setCappedOut(false);
    setAutoStopped(false);
    setStatus('starting');
    spoke.current = false;
    startedAt.current = Date.now();
    lastVoiceAt.current = Date.now();
    const mine = turn.current;

    const media = await getMic();
    if (!media) { setStatus('stopped'); return; }
    await startMeter(media);

    chunks.current = [];
    const mimeType = pickContainer();
    let rec: MediaRecorder;
    try {
      rec = new MediaRecorder(media, mimeType ? { mimeType } : undefined);
    } catch {
      setError('This browser will not record audio. Type your answer instead.');
      setStatus('stopped');
      return;
    }
    recorder.current = rec;

    rec.ondataavailable = e => { if (e.data?.size) chunks.current.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunks.current, { type: mimeType || 'audio/webm' });
      chunks.current = [];
      void sendForWords(blob, mine);
    };
    // A chunk a second, so a tab killed mid-answer still holds most of it
    // rather than one unfinished blob.
    try { rec.start(1000); } catch { rec.start(); }
    setStatus('recording');

    ticker.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      setSeconds(elapsed);
      if (elapsed >= MAX_ANSWER_SECONDS) {
        setCappedOut(true);
        stopRef.current();
        return;
      }
      if (!spoke.current) return;
      const quietFor = Date.now() - lastVoiceAt.current;
      if (quietFor > SILENCE_HINT_MS) setSilent(true);
      // The gap is the end of the answer. Someone who has finished talking
      // should not have to find a button to say so — that is the difference
      // between an interview and a form with a microphone on it.
      if (quietFor > GAP_MS) {
        setAutoStopped(true);
        stopRef.current();
      }
    }, 250);
  }, [getMic, startMeter, sendForWords]);

  const reset = useCallback(() => {
    turn.current += 1;        // anything still in flight belongs to the last question
    teardown();
    setStatus('idle');
    setTranscript('');
    setSeconds(0);
    setSilent(false);
    setCappedOut(false);
    setAutoStopped(false);
    setError('');
    spoke.current = false;
  }, [teardown]);

  const edit = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  return {
    status, transcript, interim: '', level, seconds, silent, cappedOut, autoStopped, error, meterLive,
    start, stop, reset, edit,
  };
}
