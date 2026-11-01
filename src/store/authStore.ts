import { create } from 'zustand';
import type { User } from '../types';
import { GATEWAY_URL } from '../lib/endpoints';

const TOKEN_KEY = 'hc_token';
const USER_KEY = 'hc_user';

// Read outside the store so services can attach the token without importing
// the store and creating a cycle.
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function persist(token: string, user: User) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Sweep the old passwordless flag. Nothing reads it any more, but a key
    // called hc_auth=true sitting in storage invites someone to trust it again.
    localStorage.removeItem('hc_auth');
  } catch {
    // Private browsing or blocked storage: the session still works in memory.
  }
}

function clearStored() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Left over from the old passwordless sign-in. Remove it so a stale flag
    // can never look like a session.
    localStorage.removeItem('hc_auth');
  } catch {
    // Nothing to do.
  }
}

// The server owns identity. companyId comes from the signed token, never from
// anything the browser typed, which is what the old sign-in got wrong.
function toUser(payload: any): User {
  return {
    id: String(payload?.id || ''),
    name: String(payload?.name || ''),
    email: String(payload?.email || ''),
    role: 'industry',
    accountRole: payload?.role === 'admin' ? 'admin' : 'recruiter',
    companyId: String(payload?.companyId || ''),
    companyName: payload?.companyName ? String(payload.companyName) : undefined,
    designation: String(payload?.designation || 'HR'),
    phone: String(payload?.phone || ''),
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** True until the stored token has been checked against the server. */
  isRestoring: boolean;
  mustChangePassword: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  restore: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const storedToken = getAuthToken();
const storedUser = readStoredUser();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storedUser,
  token: storedToken,
  // Optimistic: the stored token is treated as good until restore() says
  // otherwise, so a reload does not flash the login page.
  isAuthenticated: Boolean(storedToken && storedUser),
  isLoading: false,
  isRestoring: Boolean(storedToken),
  mustChangePassword: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${GATEWAY_URL}/api/connect/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success || !data?.token) {
        set({
          isLoading: false,
          error: data?.error || 'Could not sign in. Try again.',
          isAuthenticated: false,
          user: null,
          token: null,
        });
        return false;
      }

      const user = toUser(data.user);
      persist(data.token, user);
      set({
        user,
        token: data.token,
        isAuthenticated: true,
        isRestoring: false,
        isLoading: false,
        mustChangePassword: Boolean(data.user?.mustChangePassword),
        error: null,
      });
      return true;
    } catch {
      set({ isLoading: false, error: 'Cannot reach the HIERO gateway. Is it running?' });
      return false;
    }
  },

  logout: () => {
    clearStored();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isRestoring: false,
      mustChangePassword: false,
      error: null,
    });
  },

  // Called once on app start. A token in localStorage proves nothing on its
  // own — an account can be disabled, or the token revoked or expired — so it
  // is checked against the server before the portal trusts it.
  restore: async () => {
    const token = get().token;
    if (!token) {
      set({ isRestoring: false, isAuthenticated: false });
      return;
    }
    try {
      const res = await fetch(`${GATEWAY_URL}/api/connect/auth/me`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        clearStored();
        set({ user: null, token: null, isAuthenticated: false, isRestoring: false });
        return;
      }

      const user = toUser(data.user);
      persist(token, user);
      set({
        user,
        isAuthenticated: true,
        isRestoring: false,
        mustChangePassword: Boolean(data.user?.mustChangePassword),
      });
    } catch {
      // The gateway is unreachable. Keep the session rather than throwing the
      // recruiter out over a dropped network; the next API call will fail
      // visibly anyway.
      set({ isRestoring: false });
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const token = get().token;
    if (!token) return false;
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${GATEWAY_URL}/api/connect/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        set({ isLoading: false, error: data?.error || 'Could not change the password.' });
        return false;
      }

      const user = toUser(data.user);
      persist(data.token, user);
      set({
        user,
        token: data.token,
        isLoading: false,
        mustChangePassword: false,
        error: null,
      });
      return true;
    } catch {
      set({ isLoading: false, error: 'Cannot reach the HIERO gateway.' });
      return false;
    }
  },
}));
