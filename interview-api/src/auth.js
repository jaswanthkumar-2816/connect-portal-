import crypto from 'node:crypto';
import { config } from './config.js';

// ============================================================
// Who is asking
// ============================================================
// The recruiter-facing routes used to be guarded by a shared key that the
// portal sent from the browser. That key shipped inside the JavaScript
// bundle, which every candidate downloads to take their interview — so the
// guard was protecting nothing from anyone who opened dev tools, and the
// routes behind it mint interviews and return other people's assessments.
//
// So the recruiter is identified by the token they already signed in with,
// checked against the gateway that issued it. The shared key survives for
// server-to-server callers only, where it never reaches a browser.

const TTL_MS = 60_000;
const cache = new Map();

const fingerprint = token => crypto.createHash('sha256').update(token).digest('hex');

function remember(key, user) {
  cache.set(key, { user, at: Date.now() });
  // Small and self-clearing: this is a minute of breathing room for the
  // gateway, not a session store.
  if (cache.size > 500) {
    for (const [k, v] of cache) if (Date.now() - v.at > TTL_MS) cache.delete(k);
  }
}

/**
 * Check a portal token with the gateway that issued it.
 *
 * Cached for a minute. A recruiter who is disabled mid-minute keeps working
 * until it expires, which is the price of not putting a network round trip
 * in front of every report that gets opened.
 */
export async function verifyRecruiter(token) {
  if (!token) return null;
  const key = fingerprint(token);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.user;

  try {
    const res = await fetch(`${config.gatewayUrl}/api/connect/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success || !data?.user) return null;

    const user = {
      id: String(data.user.id || ''),
      companyId: String(data.user.companyId || ''),
      email: String(data.user.email || ''),
      role: String(data.user.role || 'recruiter'),
    };
    remember(key, user);
    return user;
  } catch {
    // The gateway is unreachable. Refusing is the only safe answer: the
    // alternative is letting anything through whenever it is down.
    return null;
  }
}
