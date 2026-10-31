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
