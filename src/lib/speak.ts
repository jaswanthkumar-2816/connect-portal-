import { INTERVIEW_API_URL } from './endpoints';

// ============================================================
// Reading the question out loud
// ============================================================
// The interview is spoken, so the question is spoken too. A candidate who is
// more comfortable listening than reading should not be at a disadvantage,
// and hearing a question asked is what makes this feel like an interview
// rather than a form.
//
// The voice comes from the interview service, which runs Kokoro-82M itself —
// see interview-api/src/voice.js. The browser's own speechSynthesis is kept
// only as a fallback, because what it sounds like depends entirely on the
// phone: on a cheap Android it is a flat robot reading a job interview to
// someone who is already nervous.
//
// The question also stays on screen throughout. Voice alone would be cruel
// on a noisy shop floor, and nobody should have to replay a question to
// remember what they were asked.

const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

let player: HTMLAudioElement | null = null;
let browserVoice: SpeechSynthesisVoice | null = null;
/** Set once the service has failed us, so we stop waiting on it every time. */
let serviceDown = false;

export function voiceAvailable(): boolean {
  return typeof window !== 'undefined';
}

export function speechUrl(token: string, questionId: string): string {
  return `${INTERVIEW_API_URL}/api/interview/speak/${encodeURIComponent(token)}/${encodeURIComponent(questionId)}`;
}

// ── The browser's own voice, kept for when ours cannot be reached ──

const PREFERRED = ['en-IN', 'en-GB', 'en-AU', 'en-US'];

function pickBrowserVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  if (browserVoice) return browserVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  for (const tag of PREFERRED) {
    const match = voices.find(v => v.lang?.replace('_', '-') === tag);
    if (match) { browserVoice = match; return match; }
  }
  browserVoice = voices.find(v => v.lang?.toLowerCase().startsWith('en')) || voices[0];
  return browserVoice;
}

function speakInBrowser(text: string, done: () => void): void {
  if (!('speechSynthesis' in window)) {
    done();
    return;
  }
  try { window.speechSynthesis.cancel(); } catch { /* nothing was speaking */ }

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickBrowserVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  utterance.rate = 0.95;
  utterance.onend = done;
  utterance.onerror = done;
  try {
    window.speechSynthesis.speak(utterance);
  } catch {
    done();
  }
}

// ── Setting up ──

/**
 * Called from the tap that starts the interview.
 *
 * A phone will not play audio that no one asked for, and the only tap we are
 * ever going to get is this one. Playing a moment of silence through the
 * element here is what buys the right to speak every question after it.
 */
export function warmVoices(): void {
  if (!voiceAvailable()) return;
  if ('speechSynthesis' in window) {
    pickBrowserVoice();
    window.speechSynthesis.onvoiceschanged = () => { browserVoice = null; pickBrowserVoice(); };
  }
  if (!player) {
    player = new Audio();
    player.preload = 'auto';
  }
  player.src = SILENT_WAV;
  player.play().catch(() => {
    // Refused. The questions will fall back to the browser's voice, which
    // the same tap has already unlocked.
  });
}

/** Pull the next question's audio into the browser cache while they answer. */
export function prefetchSpeech(token: string, questionId?: string): void {
  if (!token || !questionId || serviceDown) return;
  fetch(speechUrl(token, questionId), { mode: 'cors', credentials: 'omit' }).catch(() => {});
}

export function stopSpeaking(): void {
  if (player) {
    try { player.pause(); } catch { /* nothing playing */ }
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch { /* nothing speaking */ }
  }
}

/**
 * Say one question. Returns a function that stops it part-way, for when the
 * candidate starts answering before it has finished.
 *
 * `onDone` is what opens the microphone, so it has to fire exactly once
 * whatever happens — including on a device with no voices installed, where
 * speechSynthesis accepts an utterance and then never says another word.
 */
export function speak(
  text: string,
  onDone?: () => void,
  source?: { token: string; questionId: string }
): () => void {
  if (!voiceAvailable() || !text.trim()) {
    onDone?.();
    return () => {};
  }

  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    window.clearTimeout(guard);
    onDone?.();
  };

  // Speech is the least reliable thing on this page: a missing voice, a
  // suspended audio queue, a tab that lost focus mid-sentence. The interview
  // opens the microphone when the question finishes, so a reading that never
  // finishes is an interview that never starts.
  const words = text.trim().split(/\s+/).length;
  const guard = window.setTimeout(finish, Math.min(Math.max(words * 600, 8000), 30000));

  stopSpeaking();

  if (source && !serviceDown && player) {
    const audio = player;
    audio.onended = finish;
    audio.onerror = () => {
      // Ours could not be fetched or decoded. Fall back rather than leaving
      // the candidate in silence — and stop trying for the rest of the
      // interview, so every question is not held up by the same timeout.
      serviceDown = true;
      audio.onended = null;
      audio.onerror = null;
      speakInBrowser(text, finish);
    };
    audio.src = speechUrl(source.token, source.questionId);
    audio.play().catch(() => {
      serviceDown = true;
      speakInBrowser(text, finish);
    });
    return () => { finish(); stopSpeaking(); };
  }

  speakInBrowser(text, finish);
  return () => { finish(); stopSpeaking(); };
}
