import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { config } from './config.js';

// ============================================================
// The interviewer's voice
// ============================================================
// Kokoro-82M, run here on our own machine. It is 82 million parameters and
// Apache-2.0, which means the voice costs nothing per question and no
// third party is sent a list of what we are asking candidates.
//
// It replaced the browser's own speechSynthesis, which is whatever voice the
// candidate's phone happens to ship with — on a cheap Android that is a flat
// robot reading a job interview to someone who is already nervous. The voice
// is the only thing in the room with them, so it is worth the 80MB.
//
// Rendered here rather than in the browser on purpose: in-browser inference
// would mean every candidate downloading the model over mobile data before
// the first question. A phone gets a WAV of a few seconds instead.

const CACHE_DIR = path.join(path.dirname(config.dataFile), 'audio');

/**
 * Write the samples as 16-bit PCM rather than the 32-bit floats the model
 * hands back.
 *
 * It halves the file for no audible difference, and the candidate is the one
 * paying for the difference — often on mobile data, standing somewhere, with
 * eight questions still to download.
 */
function toWav16(samples, sampleRate) {
  const bytes = Buffer.alloc(44 + samples.length * 2);

  bytes.write('RIFF', 0);
  bytes.writeUInt32LE(36 + samples.length * 2, 4);
  bytes.write('WAVE', 8);
  bytes.write('fmt ', 12);
  bytes.writeUInt32LE(16, 16);           // PCM header length
  bytes.writeUInt16LE(1, 20);            // 1 = uncompressed PCM
  bytes.writeUInt16LE(1, 22);            // mono
  bytes.writeUInt32LE(sampleRate, 24);
  bytes.writeUInt32LE(sampleRate * 2, 28); // bytes per second
  bytes.writeUInt16LE(2, 32);            // bytes per sample frame
  bytes.writeUInt16LE(16, 34);           // bits per sample
  bytes.write('data', 36);
  bytes.writeUInt32LE(samples.length * 2, 40);

  for (let i = 0; i < samples.length; i++) {
    // Clamped before scaling: a sample above 1 wraps around into a loud
    // crackle rather than simply clipping.
    const sample = Math.max(-1, Math.min(1, samples[i]));
    bytes.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }
  return bytes;
}

let loading = null;
let tts = null;
let unavailable = '';

/**
 * Loaded on first use, once, and shared.
 *
 * The first call pays for the model download; the rest are a few hundred
 * milliseconds. Nothing here blocks the server starting — an interview with
 * a silent question is still an interview, and the text is on screen.
 */
async function model() {
  if (tts) return tts;
  if (unavailable) throw new Error(unavailable);
  if (loading) return loading;

  loading = (async () => {
    const { KokoroTTS } = await import('kokoro-js');
    console.log(`[voice] loading ${config.voiceModel} (first run downloads it)…`);
    const loaded = await KokoroTTS.from_pretrained(config.voiceModel, {
      dtype: config.voiceDtype,
      device: 'cpu',
    });
    tts = loaded;
    console.log(`[voice] ready — ${config.voiceName} at ${config.voiceSpeed}x`);
    return loaded;
  })();

  try {
    return await loading;
  } catch (err) {
    // Remembered, so a machine with no network or no disk space does not
    // retry a 300MB download on every question.
    unavailable = `voice unavailable: ${err.message}`;
    loading = null;
    console.error(`[voice] ${unavailable}`);
    throw new Error(unavailable);
  }
}

/** Start the download in the background so the first candidate does not wait. */
export function warmVoice() {
  if (!config.voiceEnabled) return;
  model().catch(() => {});
}

export const voiceEnabled = () => config.voiceEnabled;

function cachePath(text) {
  const key = crypto
    .createHash('sha1')
    .update(`${config.voiceModel}|${config.voiceName}|${config.voiceSpeed}|${text}`)
    .digest('hex');
  return path.join(CACHE_DIR, `${key}.wav`);
}

/**
 * The question, spoken. Returns WAV bytes.
 *
 * Cached on disk by the text itself: every candidate for the same job is
 * asked the same questions, so the second one onwards is a file read.
 */
export async function speakText(text) {
  const clean = String(text || '').trim();
  if (!clean) throw new Error('nothing to say');
  if (!config.voiceEnabled) throw new Error('voice is turned off');

  const file = cachePath(clean);
  try {
    return await fs.promises.readFile(file);
  } catch {
    // Not rendered yet. Fall through and make it.
  }

  const engine = await model();
  const audio = await engine.generate(clean, {
    voice: config.voiceName,
    speed: config.voiceSpeed,
  });
  const wav = toWav16(audio.audio, audio.sampling_rate);

  try {
    await fs.promises.mkdir(CACHE_DIR, { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.promises.writeFile(tmp, wav);
    await fs.promises.rename(tmp, file);
  } catch (err) {
    // A cache that cannot be written is a slow service, not a broken one.
    console.error('[voice] could not cache:', err.message);
  }

  return wav;
}
