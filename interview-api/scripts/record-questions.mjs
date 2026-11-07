#!/usr/bin/env node
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// ============================================================
// Record a set of questions, here, to be served as files
// ============================================================
// For when the service cannot make its own audio — a free instance whose
// CPU is too slow to run the model without stalling everything else.
//
// The questions are spoken on this machine and written into the portal's
// public/voice, named by a hash of the question text. The portal looks
// there before it asks the service for anything, so a recorded question
// plays instantly and a new one falls back as it did before.
//
//   node scripts/record-questions.mjs questions.json
//
// where questions.json is an array of strings, or { texts: [...] }.

process.env.TTS_PROVIDER = 'local';
const { speakText } = await import('../src/voice.js');

const input = process.argv[2];
if (!input) {
  console.error('\n  usage: node scripts/record-questions.mjs <questions.json>\n');
  process.exit(1);
}

const parsed = JSON.parse(fs.readFileSync(input, 'utf8'));
const texts = [...new Set((Array.isArray(parsed) ? parsed : parsed.texts || []).map(t => String(t).trim()).filter(Boolean))];

const out = path.resolve(process.argv[3] || path.join(import.meta.dirname, '..', '..', 'public', 'voice'));
fs.mkdirSync(out, { recursive: true });

/** Must match keyFor() in the portal's src/lib/speak.ts. */
const keyFor = text => crypto.createHash('sha1').update(text.trim()).digest('hex').slice(0, 20);

console.log(`\n  recording ${texts.length} question${texts.length === 1 ? '' : 's'} into ${out}\n`);

const index = {};
for (const [i, text] of texts.entries()) {
  const key = keyFor(text);
  const file = path.join(out, `${key}.wav`);
  if (fs.existsSync(file)) {
    index[key] = text;
    console.log(`  ${String(i + 1).padStart(2)}/${texts.length}  already there  ${text.slice(0, 58)}`);
    continue;
  }
  try {
    const wav = await speakText(text);
    fs.writeFileSync(file, wav);
    index[key] = text;
    console.log(`  ${String(i + 1).padStart(2)}/${texts.length}  ${String(Math.round(wav.length / 1024)).padStart(4)}KB  ${text.slice(0, 58)}`);
  } catch (err) {
    console.error(`  ${String(i + 1).padStart(2)}/${texts.length}  FAILED  ${err.message}`);
  }
}

// So it is possible to see what is recorded without listening to all of it.
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 2));
console.log(`\n  ${Object.keys(index).length} recorded\n`);
process.exit(0);
