import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

function int(value, fallback) {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  port: int(process.env.PORT, 4010),

  groqKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',

  secret: process.env.INTERVIEW_SECRET || '',
  // Server-to-server only. Never put this in a VITE_ variable: those are
  // compiled into the browser bundle.
  apiKey: process.env.CONNECT_API_KEY || '',

  // The gateway that issues recruiter sign-in tokens. This service checks
  // tokens against it rather than trusting a shared secret from a browser.
  gatewayUrl: (process.env.HIERO_GATEWAY_URL || 'http://localhost:2816').replace(/\/+$/, ''),

  portalUrl: (process.env.PORTAL_URL || 'http://localhost:2004').replace(/\/+$/, ''),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:2004')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),

  inviteTtlDays: int(process.env.INVITE_TTL_DAYS, 7),
  questionCount: Math.min(Math.max(int(process.env.QUESTION_COUNT, 8), 3), 15),

  // Where interviews in progress are kept. Without it they go to the JSON
  // file below, which does not survive a restart on a host with an
  // ephemeral disk — see src/store.js. Same database as the gateway.
  mongoUri: process.env.MONGODB_URI || '',
  mongoDb: process.env.MONGODB_DB || '',

  dataFile: path.join(here, '..', 'data', 'sessions.json'),

  // ── The interviewer's voice ──
  //
  // Two ways to make it. 'groq' asks Groq over HTTPS; 'local' runs
  // Kokoro-82M in this process.
  //
  // Local is free per question and sounds good, and it is the wrong choice
  // on a small instance: the inference is synchronous, so a tenth of a CPU
  // spends about a minute inside one request. Nothing else is served in
  // that time — including the host's health check, which concludes the
  // service is dead and restarts it, in the middle of an interview.
  //
  // Groq does the work on their machine. The request here is a download.
  voiceEnabled: process.env.VOICE_ENABLED !== 'false',
  ttsProvider: (process.env.TTS_PROVIDER || (process.env.GROQ_API_KEY ? 'groq' : 'local')).toLowerCase(),
  ttsModel: process.env.TTS_MODEL || 'canopylabs/orpheus-v1-english',
  // Groq's Orpheus voices: autumn, diana, hannah, austin, daniel, troy.
  // It used to answer to 'tara' and now refuses it outright, so a name that
  // is merely out of date fails every question rather than degrading.
  ttsVoice: process.env.TTS_VOICE || 'hannah',
  voiceModel: process.env.VOICE_MODEL || 'onnx-community/Kokoro-82M-v1.0-ONNX',
  voiceName: process.env.VOICE_NAME || 'af_heart',
  voiceDtype: process.env.VOICE_DTYPE || 'q8',
  // A shade under conversational: an interview question read at full speed
  // has to be replayed, which is slower than reading it slowly once.
  voiceSpeed: Number(process.env.VOICE_SPEED) || 0.95,
};

/**
 * Refuse to start half-configured rather than failing one candidate at a
 * time, in the middle of their interview, with nothing in the logs that says
 * why. The Groq key is the exception: questions fall back to a standard set
 * without it, which is worth having on a laptop with no key to hand.
 */
export function checkConfig() {
  const missing = [];
  if (!config.secret || config.secret.startsWith('change-me')) missing.push('INTERVIEW_SECRET');
  if (!config.gatewayUrl) missing.push('HIERO_GATEWAY_URL');
  return missing;
}
