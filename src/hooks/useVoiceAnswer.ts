import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================
// Answering out loud
// ============================================================
// One answer at a time: hold the mic open, show the candidate that they are
// being heard, and hand back the words they said.
//
// Two separate things are going on, and they fail separately on purpose:
//
//   getUserMedia  — drives the level meter and the silence hint. If it is
//                   refused we lose the meter, not the interview.
//   SpeechRecognition — turns speech into text. Chrome and Safari have it,
//                   Firefox does not. Where it is missing the page offers a
//                   box to type in instead, because a candidate who cannot
//                   answer at all is a candidate who was rejected by their
//                   choice of browser.
//
// The audio itself is never kept. The portal only ever sends the words, which
// is what the recruiter's report is allowed to be built from.

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

type Status = 'idle' | 'starting' | 'recording' | 'stopped';

// The Web Speech API is not in TypeScript's DOM library, and it is still
// prefixed on Safari. These are the few members actually used here.
interface SpeechResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechResultList {
  length: number;
  [index: number]: SpeechResult;
}
interface SpeechEvent {
  resultIndex: number;
  results: SpeechResultList;
}
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechEvent) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

function recognitionCtor(): RecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export const speechSupported = (): boolean => recognitionCtor() !== null;

export interface VoiceAnswer {
  status: Status;
  /** What they have said so far, as words. */
  transcript: string;
  /** The phrase in progress, not yet committed by the recogniser. */
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

export function useVoiceAnswer(): VoiceAnswer {
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [level, setLevel] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [silent, setSilent] = useState(false);
  const [cappedOut, setCappedOut] = useState(false);
  const [autoStopped, setAutoStopped] = useState(false);
  const [error, setError] = useState('');
  const [meterLive, setMeterLive] = useState(false);

  const recognition = useRef<Recognition | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const frame = useRef<number>(0);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);
  const lastVoiceAt = useRef(0);
  const spoke = useRef(false);
  // The recogniser stops on its own after a pause — Chrome ends the session
  // rather than waiting. While the candidate is still recording we restart
  // it, so a thinking pause does not quietly end their answer.
  const wantRecognition = useRef(false);

  const teardown = useCallback(() => {
    wantRecognition.current = false;
    if (recognition.current) {
      recognition.current.onresult = null;
      recognition.current.onerror = null;
      recognition.current.onend = null;
      try { recognition.current.abort(); } catch { /* already gone */ }
      recognition.current = null;
    }
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    if (ticker.current) {
      clearInterval(ticker.current);
      ticker.current = null;
    }
    if (stream.current) {
      stream.current.getTracks().forEach(t => t.stop());
      stream.current = null;
    }
    if (audioCtx.current) {
      audioCtx.current.close().catch(() => {});
      audioCtx.current = null;
    }
    setMeterLive(false);
    setLevel(0);
  }, []);

  // A candidate who closes the tab mid-answer should not leave the mic light
  // on, so the stream is released when this unmounts.
  useEffect(() => teardown, [teardown]);

  const startMeter = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      audioCtx.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(media).connect(analyser);
      const buffer = new Uint8Array(analyser.frequencyBinCount);
      setMeterLive(true);

      const read = () => {
        analyser.getByteFrequencyData(buffer);
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
      return true;
    } catch {
      // Refused, or no microphone on the device. The interview can still be
      // answered — it just loses the meter and the silence hint.
      setMeterLive(false);
      return false;
    }
  }, []);

  const startRecognition = useCallback(() => {
    const Ctor = recognitionCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    // Indian English first: this is where the candidates are, and the
    // recogniser is markedly better on names and places with it set.
    rec.lang = 'en-IN';
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e: SpeechEvent) => {
      let committed = '';
      let pending = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) committed += result[0].transcript;
        else pending += result[0].transcript;
      }
      if (committed) {
        setTranscript(prev => `${prev} ${committed.trim()}`.trim());
        spoke.current = true;
        lastVoiceAt.current = Date.now();
        setSilent(false);
      }
      setInterim(pending.trim());
    };

    rec.onerror = (e: { error?: string }) => {
      // 'no-speech' and 'aborted' are ordinary — somebody paused, or we
      // stopped it ourselves. Only a refused mic is worth saying out loud.
      if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
        wantRecognition.current = false;
        setError('Your browser is blocking the microphone. Allow it, then try again — or type your answer instead.');
      }
    };

    rec.onend = () => {
      if (!wantRecognition.current) return;
      begin();
    };

    // Claimed before it is started, not after.
    //
    // This used to be the other way round, and it is why a candidate's
    // second answer came back blank. Starting a recogniser throws while the
    // previous one is still letting go of the microphone — which is exactly
    // the moment between one question and the next. The throw was caught and
    // ignored, so recognition.current was left null: the meter still moved,
    // the silence gap still ended the answer on time, and not one word was
    // ever transcribed. Everything looked right except the answer.
    //
    // So it is held onto first, and a failure to start is retried rather
    // than swallowed. The guard inside stops the retries the moment this
    // recogniser is replaced or torn down.
    recognition.current = rec;

    let attempt = 0;
    const begin = () => {
      if (!wantRecognition.current || recognition.current !== rec) return;
      try {
        rec.start();
      } catch {
        attempt += 1;
        if (attempt <= 10) {
          window.setTimeout(begin, 150);
        } else {
          setError('The microphone could not be started. Type your answer instead.');
        }
      }
    };
    begin();
  }, []);

  const stop = useCallback(() => {
    wantRecognition.current = false;
    if (recognition.current) {
      try { recognition.current.stop(); } catch { /* already stopping */ }
    }
    // Whatever was mid-phrase when they tapped stop is still something they
    // said, so it is kept rather than dropped.
    setTranscript(prev => {
      const tail = interim.trim();
      return tail ? `${prev} ${tail}`.trim() : prev;
    });
    setInterim('');
    teardown();
    setStatus('stopped');
  }, [interim, teardown]);

  // stop() is rebuilt whenever the interim text changes, so the cap reads it
  // through a ref — otherwise the timer below would hold a stale copy.
  const stopRef = useRef(stop);
  useEffect(() => { stopRef.current = stop; }, [stop]);

  const start = useCallback(async () => {
    setError('');
    setSilent(false);
    setCappedOut(false);
    setAutoStopped(false);
    setInterim('');
    setStatus('starting');
    spoke.current = false;
    startedAt.current = Date.now();
    lastVoiceAt.current = Date.now();

    await startMeter();
    wantRecognition.current = true;
    startRecognition();
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
  }, [startMeter, startRecognition]);

  const reset = useCallback(() => {
    teardown();
    setStatus('idle');
    setTranscript('');
    setInterim('');
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
    status, transcript, interim, level, seconds, silent, cappedOut, autoStopped, error, meterLive,
    start, stop, reset, edit,
  };
}
