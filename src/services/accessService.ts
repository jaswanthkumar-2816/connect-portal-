// ============================================================
// Access requests
// ============================================================
// Connect has no public signup: a recruiter reads other people's
// applications, so an account exists because a HIERO admin decided it
// should. These calls are the two halves of that — a company asking, and an
// admin answering.

import { GATEWAY_URL } from '../lib/endpoints';
import { getAuthToken } from '../store/authStore';

export interface AccessRequest {
  id: string;
  companyName: string;
  email: string;
  contactName?: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  note?: string;
  decidedAt?: string | null;
  decidedBy?: string;
  createdAt: string;
  lastRequestedAt?: string;
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  const token = getAuthToken();
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/** The public sign-up form. Deliberately answers the same way whether or not
 *  the address is already known, so it cannot be used to discover who uses
 *  Connect. */
export async function requestAccess(
  companyName: string,
  email: string
): Promise<{ ok: boolean; message?: string; error?: string; byEmail?: boolean }> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/connect/access/request`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ companyName, email }),
    });

    // A gateway without this route answers 404 with an HTML error page — it
    // is running a build from before the queue existed. The person filling
    // the form cannot do anything about that, so send them down the path
    // that still works instead of showing them a failure.
    if (res.status === 404 || res.status === 405) {
      return { ok: false, byEmail: true };
    }

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return { ok: false, error: data?.error || 'Could not send your request. Try again shortly.' };
    }
    return { ok: true, message: data.message };
  } catch {
    return { ok: false, error: 'Cannot reach HIERO. Check your connection and try again.' };
  }
}

export async function getAccessRequests(
  status?: 'pending' | 'approved' | 'rejected'
): Promise<{ ok: boolean; pending: number; requests: AccessRequest[]; error?: string }> {
  try {
    const query = status ? `?status=${status}` : '';
    const res = await fetch(`${GATEWAY_URL}/api/connect/access/requests${query}`, { headers: headers() });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return { ok: false, pending: 0, requests: [], error: data?.error || 'Could not load requests.' };
    }
    return { ok: true, pending: data.pending || 0, requests: data.requests || [] };
  } catch {
    return { ok: false, pending: 0, requests: [], error: 'Cannot reach the HIERO gateway.' };
  }
}

export async function approveAccessRequest(id: string): Promise<{
  ok: boolean;
  emailed?: boolean;
  temporaryPassword?: string;
  emailError?: string;
  error?: string;
}> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/connect/access/requests/${id}/approve`, {
      method: 'POST',
      headers: headers(),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return { ok: false, error: data?.error || 'Could not approve this request.' };
    }
    return {
      ok: true,
      emailed: data.emailed,
      temporaryPassword: data.temporaryPassword,
      emailError: data.emailError,
    };
  } catch {
    return { ok: false, error: 'Cannot reach the HIERO gateway.' };
  }
}

export async function rejectAccessRequest(
  id: string,
  note: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/connect/access/requests/${id}/reject`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ note }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return { ok: false, error: data?.error || 'Could not reject this request.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Cannot reach the HIERO gateway.' };
  }
}
