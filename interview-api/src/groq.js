import { config } from './config.js';

// ============================================================
// Talking to Groq
// ============================================================
// Groq speaks the OpenAI chat format, so this is a thin fetch rather than an
// SDK — one dependency fewer to keep current, and the whole surface we use
// fits on this page.
//
// Every call here asks for JSON back and parses it. A model that returns
// prose where the code expects an object is a failure, and it is treated as
// one: callers fall back to something sensible rather than showing a
// candidate a half-rendered interview.

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const TIMEOUT_MS = 45000;

export class GroqUnavailable extends Error {}

export const groqConfigured = () => Boolean(config.groqKey);

async function once({ system, user, temperature, maxTokens }) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.groqKey}`,
    },
    body: JSON.stringify({
      model: config.groqModel,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const text = await res.text();

  if (!res.ok) {
    let detail = text.slice(0, 300);
    try {
      detail = JSON.parse(text)?.error?.message || detail;
    } catch { /* the body was not JSON; the raw text will do */ }
    const err = new GroqUnavailable(`Groq ${res.status}: ${detail}`);
    err.status = res.status;
    throw err;
  }

  let content;
  try {
    content = JSON.parse(text)?.choices?.[0]?.message?.content;
  } catch {
    throw new GroqUnavailable('Groq sent a response that was not JSON.');
  }
  if (!content) throw new GroqUnavailable('Groq sent an empty response.');

  try {
    return JSON.parse(content);
  } catch {
    throw new GroqUnavailable('Groq did not answer in the JSON shape that was asked for.');
  }
}

/**
 * One JSON-shaped completion, retried once.
 *
 * The retry is for rate limits and the model's occasional malformed object —
 * both clear up on a second attempt, and both would otherwise land on a
 * candidate who is sitting there waiting.
 */
export async function askGroq({ system, user, temperature = 0.4, maxTokens = 1600 }) {
  if (!groqConfigured()) {
    throw new GroqUnavailable('GROQ_API_KEY is not set.');
  }
  try {
    return await once({ system, user, temperature, maxTokens });
  } catch (err) {
    const worthRetrying = !err.status || err.status === 429 || err.status >= 500;
    if (!worthRetrying) throw err;
    await new Promise(r => setTimeout(r, 1200));
    return once({ system, user, temperature, maxTokens });
  }
}

// ============================================================
// Hearing the candidate
// ============================================================
// Whisper, on Groq. This replaced the browser's own SpeechRecognition,
// which is a Chrome feature pretending to be a web standard: Samsung
// Internet and Firefox do not have it, Safari's is its own thing, and on
// Android it competes with the page for the microphone and loses. It fails
// by transcribing nothing rather than by raising an error, so an interview
// would run to the end and file empty answers.
//
// The candidate's phone now records and uploads. One way for every browser,
// and a failure is a failed request we can say something about.

const TRANSCRIBE_MODEL = process.env.WHISPER_MODEL || 'whisper-large-v3-turbo';

/** Audio in, words out. Throws GroqUnavailable so callers can say so. */
export async function transcribe(audio, filename = 'answer.webm') {
  if (!config.groqKey) throw new GroqUnavailable('No Groq key, so answers cannot be transcribed.');
  if (!audio?.length) throw new GroqUnavailable('There was no audio to transcribe.');

  const form = new FormData();
  form.append('file', new Blob([audio]), filename);
  form.append('model', TRANSCRIBE_MODEL);
  form.append('response_format', 'json');
  // Names and salon words it would otherwise guess at. Not a transcript of
  // the question — that would bias it towards repeating the question back.
  form.append('language', 'en');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.groqKey}` },
    body: form,
    signal: AbortSignal.timeout(90000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new GroqUnavailable(`transcription ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = await res.json();
  return String(data?.text || '').trim();
}
