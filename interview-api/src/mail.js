import { config } from './config.js';

// ============================================================
// Sending the report to whoever asked for the interview
// ============================================================
// Over Resend's HTTPS API rather than SMTP, because this runs on Render and
// Render's free plan blocks ports 25, 465 and 587. Nodemailer talking to
// Gmail there hangs until it times out, having sent nothing — and it works
// perfectly on a laptop, which is why that went unnoticed for weeks.
//
// Same key and same from address as the gateway uses. Without them nothing
// is sent and the report still waits in the recruiter's inbox page; mail is
// the convenience, not the record.

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const MAIL_FROM = process.env.MAIL_FROM || 'HIERO Connect <noreply@hiero.in>';

export const mailConfigured = () => Boolean(RESEND_API_KEY);

async function send({ to, subject, html, replyTo }) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(`resend ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`);
  }
  return res.json();
}

const escape = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Green, amber, red — readable at a glance before any of the words are. */
function band(score) {
  const n = Number(score) || 0;
  if (n >= 70) return '#16a34a';
  if (n >= 45) return '#b45309';
  return '#dc2626';
}

const LABELS = {
  communication: 'Communication',
  problemSolving: 'Problem solving',
  roleKnowledge: 'Knows the work',
  relevance: 'Relevance',
  confidence: 'Confidence',
};

function scoreRows(scores = {}) {
  return Object.entries(LABELS)
    .filter(([key]) => scores[key])
    .map(([key, label]) => {
      const { score = 0, why = '' } = scores[key] || {};
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;vertical-align:top;width:150px">
            <div style="font:600 13px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:#111">${escape(label)}</div>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;vertical-align:top;width:52px">
            <div style="font:700 15px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:${band(score)}">${escape(score)}</div>
          </td>
          <td style="padding:10px 0 10px 8px;border-bottom:1px solid #eee;vertical-align:top">
            <div style="font:400 13px/1.55 -apple-system,Segoe UI,Roboto,sans-serif;color:#555">${escape(why)}</div>
          </td>
        </tr>`;
    })
    .join('');
}

function bullets(items = [], colour) {
  if (!items.length) return '';
  return items.map(i => `
    <li style="margin:0 0 8px;font:400 13px/1.55 -apple-system,Segoe UI,Roboto,sans-serif;color:#333">
      <b style="color:${colour}">${escape(i.point || i)}</b>
      ${i.evidence ? `<br><span style="color:#666">${escape(i.evidence)}</span>` : ''}
    </li>`).join('');
}

/**
 * The report, as an email.
 *
 * Everything the recruiter needs in the message itself. A salon owner
 * reading this on a phone between clients should not have to sign in to
 * find out whether it is worth meeting someone.
 */
export function reportEmail({ candidateName, role, companyName, report, answers = [] }) {
  const who = candidateName || 'The candidate';
  const overall = report?.overall ?? null;
  const verdict = report?.fit?.verdict || report?.recommendation || '';

  const transcript = answers.map((a, i) => `
    <div style="margin:0 0 14px">
      <div style="font:600 12px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:#888">Q${i + 1} · ${escape(a.about || '')}</div>
      <div style="font:600 13px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#111;margin:2px 0 4px">${escape(a.question)}</div>
      <div style="font:400 13px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#444">${escape(a.transcript) || '<i style="color:#999">no answer</i>'}</div>
    </div>`).join('');

  const html = `
<div style="background:#f6f7f9;padding:24px 12px">
 <div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden">
  <div style="padding:20px 22px;border-bottom:1px solid #eee">
    <div style="font:700 11px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#16a34a">HIERO Connect · interview finished</div>
    <div style="font:800 20px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#111;margin-top:7px">${escape(who)}</div>
    <div style="font:400 13px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#666;margin-top:3px">${escape(role || 'the role')}${companyName ? ` · ${escape(companyName)}` : ''}</div>
  </div>

  ${overall !== null ? `
  <div style="padding:18px 22px;border-bottom:1px solid #eee">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:middle">
        <div style="font:800 40px/1 -apple-system,Segoe UI,Roboto,sans-serif;color:${band(overall)}">${escape(overall)}<span style="font-size:16px;color:#999">/100</span></div>
      </td>
      <td style="vertical-align:middle;padding-left:16px">
        <div style="font:700 14px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:#111">${escape(verdict)}</div>
      </td>
    </tr></table>
    ${report?.overallWhy ? `<div style="font:400 13px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#555;margin-top:12px">${escape(report.overallWhy)}</div>` : ''}
  </div>` : `
  <div style="padding:18px 22px;border-bottom:1px solid #eee;font:400 13px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#b45309">
    The answers are saved, but the assessment could not be produced. Open the interview in the portal to try again.
  </div>`}

  ${report?.scores ? `
  <div style="padding:14px 22px 18px;border-bottom:1px solid #eee">
    <div style="font:700 11px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#888;margin-bottom:4px">How they did</div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${scoreRows(report.scores)}</table>
  </div>` : ''}

  ${report?.strengths?.length ? `
  <div style="padding:16px 22px;border-bottom:1px solid #eee">
    <div style="font:700 11px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#888;margin-bottom:9px">In their favour</div>
    <ul style="margin:0;padding-left:18px">${bullets(report.strengths, '#16a34a')}</ul>
  </div>` : ''}

  ${report?.concerns?.length ? `
  <div style="padding:16px 22px;border-bottom:1px solid #eee">
    <div style="font:700 11px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#888;margin-bottom:9px">Worth asking about</div>
    <ul style="margin:0;padding-left:18px">${bullets(report.concerns, '#b45309')}</ul>
  </div>` : ''}

  ${transcript ? `
  <div style="padding:16px 22px">
    <div style="font:700 11px/1 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#888;margin-bottom:11px">What they said</div>
    ${transcript}
  </div>` : ''}

  <div style="padding:14px 22px;background:#fafafa;border-top:1px solid #eee;font:400 11px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#999">
    Scored by HIERO from what the candidate said. No recording is kept — the words above are the whole record.
  </div>
 </div>
</div>`;

  const head = overall !== null ? `${overall}/100` : 'answers in';
  return {
    subject: `${who} — ${role || 'interview'} · ${head}`,
    html,
  };
}

export { send };
