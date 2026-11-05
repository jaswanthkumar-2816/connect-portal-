// ============================================================
// Where the portal talks to HIERO
// ============================================================
// A build can pin the gateway with VITE_HIERO_GATEWAY_URL. When it doesn't,
// the origin the portal is served from decides: a dev server on localhost
// talks to a local gateway, anything else — connect.hiero.in, a Vercel
// preview, a tunnel — talks to the deployed one.
//
// The old default was localhost for every build, so a deployed portal that
// was missing the environment variable pointed at a machine nobody else can
// reach, and every call failed with nothing on screen to explain why.

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '']);

const DEPLOYED_GATEWAY = 'https://hiero.in';
const LOCAL_GATEWAY = 'http://localhost:2816';

function resolveGatewayUrl(): string {
  const configured = import.meta.env.VITE_HIERO_GATEWAY_URL;
  if (configured) return configured.replace(/\/+$/, '');
  const host = typeof window === 'undefined' ? '' : window.location.hostname;
  return LOCAL_HOSTS.has(host) ? LOCAL_GATEWAY : DEPLOYED_GATEWAY;
}

export const GATEWAY_URL = resolveGatewayUrl();

/** True when the portal is running against a developer's own machine. */
export const isLocalGateway = GATEWAY_URL === LOCAL_GATEWAY;

// ============================================================
// Where the AI interview runs
// ============================================================
// Its own service, not the gateway: writing questions and reading answers
// means waiting on Groq, and a rate limit there should not be able to take
// sign-in and the inbox with it. Default is a local dev server on 4010.
//
// See interview-api/ in this repository.

const LOCAL_INTERVIEW_API = 'http://localhost:4010';

function resolveInterviewApiUrl(): string {
  const configured = import.meta.env.VITE_INTERVIEW_API_URL;
  if (configured) return configured.replace(/\/+$/, '');
  return LOCAL_INTERVIEW_API;
}

export const INTERVIEW_API_URL = resolveInterviewApiUrl();
