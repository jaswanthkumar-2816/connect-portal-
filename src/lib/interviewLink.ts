// ============================================================
// The link the candidate opens
// ============================================================
// HIERO signs the invite and hands back a URL. The interview itself is run
// here, in the portal, so the link the candidate receives has to point at the
// portal's own origin while carrying HIERO's token unchanged — the token is
// the candidate's credential for that one interview.
//
// Set VITE_CONNECT_INTERVIEW=false to send candidates to HIERO's own page
// instead and leave the URL exactly as the gateway gave it.

/** Short enough to be a path segment like "interview", long enough to be a token. */
const MIN_TOKEN_LENGTH = 20;

const RUN_HERE = import.meta.env.VITE_CONNECT_INTERVIEW !== 'false';

function looksLikeToken(value?: string | null): boolean {
  return Boolean(value && value.length >= MIN_TOKEN_LENGTH && !value.includes('/'));
}

/**
 * Pull the invite token out of whatever shape the gateway's URL takes — a
 * query parameter, a trailing path segment, or a bare token on its own.
 */
export function interviewTokenFrom(raw?: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  let url: URL;
  try {
    // A bare token resolves as a relative path, which the segment check below
    // then picks up, so both forms go down the same road.
    url = new URL(trimmed, window.location.origin);
  } catch {
    return looksLikeToken(trimmed) ? trimmed : '';
  }
  for (const key of ['t', 'token', 'invite', 'jwt']) {
    const value = url.searchParams.get(key);
    if (looksLikeToken(value)) return value as string;
  }
  const segment = url.pathname.split('/').filter(Boolean).pop() || '';
  const decoded = (() => {
    try { return decodeURIComponent(segment); } catch { return segment; }
  })();
  return looksLikeToken(decoded) ? decoded : '';
}

/**
 * The URL to put in the email and the QR code.
 *
 * Falls back to the gateway's own URL when no token can be read out of it —
 * a link that goes somewhere is worth more than one built on a guess.
 */
export function candidateInterviewUrl(gatewayUrl?: string): string {
  if (!RUN_HERE) return gatewayUrl || '';
  const token = interviewTokenFrom(gatewayUrl);
  if (!token) return gatewayUrl || '';
  return `${window.location.origin}/interview/${encodeURIComponent(token)}`;
}
