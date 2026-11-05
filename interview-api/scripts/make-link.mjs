#!/usr/bin/env node
import 'dotenv/config';

// ============================================================
// A test interview, from the command line
// ============================================================
// Trying the real thing normally means signing into the portal, finding an
// application and sending a mail. This mints one invite directly so the
// interview itself can be walked through — microphone, voice and all.
//
//   npm run link
//   npm run link -- --role "Senior Stylist" --name Priya
//
// It is a developer tool and it talks to the service as a trusted caller,
// so it needs CONNECT_API_KEY set. Nothing here is reachable from a browser.

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const api = (process.env.INTERVIEW_API_URL || `http://localhost:${process.env.PORT || 4010}`)
  .replace(/\/+$/, '');
const key = process.env.CONNECT_API_KEY;

if (!key) {
  console.error('\n  CONNECT_API_KEY is not set — this script signs in as a trusted service.\n');
  process.exit(1);
}

const body = {
  applicationId: flag('application', `test-${Date.now()}`),
  candidateName: flag('name', 'Priya Menon'),
  role: flag('role', 'Senior Stylist'),
  companyName: flag('company', 'Glow Salon'),
  skills: flag('skills', 'Hair colouring,Client handling,Billing').split(',').map(s => s.trim()),
  description: flag(
    'description',
    'Senior stylist for a two-chair salon: colouring, cuts, handling walk-ins and closing the till.'
  ),
  questionCount: Number(flag('questions', '')) || undefined,
};

const res = await fetch(`${api}/api/interview/invite`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': key },
  body: JSON.stringify(body),
}).catch(err => {
  console.error(`\n  Could not reach ${api} — is the service running?\n  ${err.message}\n`);
  process.exit(1);
});

const data = await res.json().catch(() => null);
if (!res.ok || !data?.success) {
  console.error(`\n  ${data?.error || `The service answered ${res.status}.`}\n`);
  process.exit(1);
}

console.log(`
  ${body.role} at ${body.companyName}, for ${body.candidateName}
  ${data.questions} questions, written by ${data.questionSource === 'groq' ? 'Groq' : 'the standard set (no Groq key)'}

  Open this in Chrome or Safari — the microphone needs a real browser:

  ${data.url}

  Application id: ${body.applicationId}
  Report:         GET ${api}/api/interview/report/${body.applicationId}
`);
