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

/**
 * Set from the session: the service tells us up front whether its voice is
 * loaded. Without this the first question is spent finding out — a request
 * that fails, a fallback that starts late, and a candidate listening to
 * silence while the microphone opens underneath them.
 */
export function setServiceVoice(available: boolean): void {
  serviceDown = !available;
}

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
  // Empty on the first call in Samsung Internet and most Android browsers:
  // the list arrives later, over voiceschanged. Speaking with no voice set
  // is still better than not speaking — the browser uses its default — so
  // this returns null and the utterance goes out without one.
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
  } else {
    // No voice list yet. Setting the language still gets the right default
    // on Android, and leaving .voice unset is what lets it speak at all.
    utterance.lang = 'en-IN';
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
 * The recorded clip for a question, if there is one.
 *
 * Some questions are spoken ahead of time on a machine that can afford to
 * run the model, and shipped with the portal under public/voice. The name
 * is a hash of the question text — see interview-api/scripts/record-
 * questions.mjs, which must hash it exactly the same way.
 *
 * This exists because the interview service runs on an instance too small
 * to make speech without stalling itself. When that stops being true the
 * recordings simply stop being found, and nothing here needs changing.
 */
async function recordedUrl(text: string): Promise<string | null> {
  const subtle = window.crypto?.subtle;
  if (!subtle) return null;
  try {
    const bytes = new TextEncoder().encode(text.trim());
    const digest = await subtle.digest('SHA-1', bytes);
    const key = Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 20);
    return `/voice/${key}.wav`;
  } catch {
    // Non-secure origin, most likely. The service and the browser are both
    // still there.
    return null;
  }
}

/**
 * Say one question. Returns a function that stops it part-way, for when the
 * candidate starts answering before it has finished.
 *
 * Three places the voice can come from, in order: a clip recorded ahead of
 * time, the interview service, and the browser's own. `onDone` is what opens
 * the microphone, so it has to fire exactly once whatever happens —
 * including on a device with no voices installed, where speechSynthesis
 * accepts an utterance and then never says another word.
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

  /**
   * Play one URL, and hand on to `next` if it will not play.
   *
   * The timeout matters as much as the error: an audio element that is
   * still downloading reports nothing at all, and the candidate hears
   * silence until the guard above opens the microphone over the top of it.
   */
  const playFrom = (url: string, next: () => void, waitMs: number): void => {
    if (settled || !player) { next(); return; }
    const audio = player;
    const giveUp = window.setTimeout(() => {
      if (settled) return;
      audio.onplaying = null;
      audio.onended = null;
      audio.onerror = null;
      try { audio.pause(); } catch { /* nothing playing */ }
      next();
    }, waitMs);
    const stopWaiting = () => window.clearTimeout(giveUp);

    audio.onplaying = stopWaiting;
    audio.onended = () => { stopWaiting(); finish(); };
    audio.onerror = () => {
      stopWaiting();
      audio.onended = null;
      audio.onerror = null;
      next();
    };
    audio.src = url;
    audio.play().catch(() => { stopWaiting(); next(); });
  };

  const fromBrowser = () => speakInBrowser(text, finish);

  const fromService = () => {
    if (!source || serviceDown) { fromBrowser(); return; }
    playFrom(speechUrl(source.token, source.questionId), () => {
      // Stop trying for the rest of the interview, so every question is not
      // held up by the same wait.
      serviceDown = true;
      fromBrowser();
    }, 2500);
  };

  // A recording is a local file, so it either starts quickly or is not
  // there; the service is over the network and gets longer.
  recordedUrl(text).then(url => {
    if (settled) return;
    if (url) playFrom(url, fromService, 1200);
    else fromService();
  });

  return () => { finish(); stopSpeaking(); };
}
