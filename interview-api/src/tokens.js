import crypto from 'node:crypto';
import { config } from './config.js';

// ============================================================
// The invite token
// ============================================================
// This is the candidate's whole credential: no account, no password, one
// link. So it is signed, it carries its own expiry, and the server checks
// both before it will say a single word about the interview behind it.
//
// Signed rather than random because a signature survives a restart with no
// database lookup, and because a token that cannot be forged is one less
// thing the store has to be careful about.

const b64 = buf => Buffer.from(buf).toString('base64url');

function sign(payloadJson) {
  return crypto.createHmac('sha256', config.secret).update(payloadJson).digest('base64url');
}

export function issueToken({ jti, applicationId, ttlDays = config.inviteTtlDays }) {
  const payload = {
    jti,
    applicationId,
    exp: Date.now() + ttlDays * 24 * 60 * 60 * 1000,
  };
  const json = JSON.stringify(payload);
  return `${b64(json)}.${sign(json)}`;
}

/** @returns the payload, or null with a reason the caller can show. */
export function readToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return { ok: false, reason: 'not-found' };
  const [body, signature] = token.split('.');
  if (!body || !signature) return { ok: false, reason: 'not-found' };

  let json;
  try {
    json = Buffer.from(body, 'base64url').toString('utf8');
  } catch {
    return { ok: false, reason: 'not-found' };
  }

  const expected = sign(json);
  // Compared the slow way on purpose: a fast compare leaks, one byte at a
  // time, how close a guess was.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: 'not-found' };
  }

  let payload;
  try {
    payload = JSON.parse(json);
  } catch {
    return { ok: false, reason: 'not-found' };
  }

  if (!payload?.jti) return { ok: false, reason: 'not-found' };
  if (Number(payload.exp) < Date.now()) return { ok: false, reason: 'expired', payload };

  return { ok: true, payload };
}

export const newId = () => crypto.randomUUID();
