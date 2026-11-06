// ============================================================
// The people you have already hired
// ============================================================
// Everything here is scoped on the gateway by the recruiter's own token, so
// nothing in this file passes a company id — a company id sent from a browser
// is a claim, not a fact.

import { GATEWAY_URL } from '../lib/endpoints';
import { getAuthToken } from '../store/authStore';

export interface Employee {
  id: string;
  companyId: string;
  applicationId: string | null;
  name: string;
  email: string;
  phone: string;
  role: string;
  resumeUrl: string;
  joinedOn: string;
  salary: string;
  branch: string;
  status: 'active' | 'left';
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'holiday';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
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

/** A gateway older than this feature answers 404 with an HTML error page.
 *  Saying so beats "could not load", which sends someone looking for a
 *  problem in their own data. */
function notDeployed(status: number) {
  return status === 404 || status === 405;
}

export async function getEmployees(): Promise<{ ok: boolean; employees: Employee[]; error?: string }> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/connect/workforce/employees`, { headers: headers() });
    if (notDeployed(res.status)) {
      return { ok: false, employees: [], error: 'This server does not have the team list yet. Deploy the gateway.' };
    }
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return { ok: false, employees: [], error: data?.error || 'Could not load your team.' };
    }
    return { ok: true, employees: data.employees || [] };
  } catch {
    return { ok: false, employees: [], error: 'Cannot reach the HIERO gateway.' };
  }
}

export async function addEmployee(body: {
  applicationId?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  joinedOn?: string;
  salary?: string;
  branch?: string;
}): Promise<{ ok: boolean; employee?: Employee; error?: string }> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/connect/workforce/employees`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (notDeployed(res.status)) {
      return { ok: false, error: 'This server does not have the team list yet. Deploy the gateway.' };
    }
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) return { ok: false, error: data?.error || 'Could not add this person.' };
    return { ok: true, employee: data.employee };
  } catch {
    return { ok: false, error: 'Cannot reach the HIERO gateway.' };
  }
}

export async function updateEmployee(
  id: string,
  body: Partial<Pick<Employee, 'name' | 'email' | 'phone' | 'role' | 'salary' | 'branch' | 'joinedOn' | 'status'>>
): Promise<{ ok: boolean; employee?: Employee; error?: string }> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/connect/workforce/employees/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) return { ok: false, error: data?.error || 'Could not save that.' };
    return { ok: true, employee: data.employee };
  } catch {
    return { ok: false, error: 'Cannot reach the HIERO gateway.' };
  }
}

export async function getAttendance(
  from: string,
  to: string
): Promise<{ ok: boolean; attendance: AttendanceRecord[]; error?: string }> {
  try {
    const query = `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    const res = await fetch(`${GATEWAY_URL}/api/connect/workforce/attendance${query}`, { headers: headers() });
    if (notDeployed(res.status)) {
      return { ok: false, attendance: [], error: 'This server does not have attendance yet. Deploy the gateway.' };
    }
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return { ok: false, attendance: [], error: data?.error || 'Could not load attendance.' };
    }
    return { ok: true, attendance: data.attendance || [] };
  } catch {
    return { ok: false, attendance: [], error: 'Cannot reach the HIERO gateway.' };
  }
}

export async function markAttendance(body: {
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}): Promise<{ ok: boolean; record?: AttendanceRecord; error?: string }> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/connect/workforce/attendance`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) return { ok: false, error: data?.error || 'Could not save that.' };
    return { ok: true, record: data.record };
  } catch {
    return { ok: false, error: 'Cannot reach the HIERO gateway.' };
  }
}
