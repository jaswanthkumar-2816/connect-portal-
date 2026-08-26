import { create } from 'zustand';
import type { User } from '../types';
import { demoUser } from '../data/demo';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, _password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: { companyName?: string; email: string; password: string; [key: string]: any }) => Promise<boolean>;
}

function formatNameFromEmail(email: string): string {
  if (!email) return 'Recruiter';
  const prefix = email.split('@')[0];
  const parts = prefix.split(/[._-]/);
  return parts
    .filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function formatCompanyFromEmail(email: string): string {
  if (!email) return 'TechNova Inc.';
  const domain = email.split('@')[1] || '';
  const comp = domain.split('.')[0];
  if (!comp || comp === 'gmail' || comp === 'yahoo' || comp === 'outlook' || comp === 'hotmail' || comp === 'company') {
    return 'TechNova Inc.';
  }
  return comp.charAt(0).toUpperCase() + comp.slice(1).toLowerCase() + ' Corp';
}

const savedAuth = localStorage.getItem('hc_auth') === 'true';
const savedUserStr = localStorage.getItem('hc_user');
const savedUser: User | null = savedUserStr ? JSON.parse(savedUserStr) : savedAuth ? demoUser : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser,
  isAuthenticated: !!savedUser || savedAuth,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 600));
    if (email) {
      const isDemo = email.toLowerCase().includes('technova') || email === demoUser.email;
      const userName = isDemo ? demoUser.name : formatNameFromEmail(email);
      const companyName = isDemo ? 'TechNova' : formatCompanyFromEmail(email);
      const companyId = isDemo ? 'c1' : `c-${email.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

      const userObj: User = {
        id: isDemo ? demoUser.id : `u-${Date.now()}`,
        name: userName,
        email: email,
        role: 'industry',
        companyId: companyId,
        designation: isDemo ? demoUser.designation : 'Recruiting Lead',
        phone: isDemo ? demoUser.phone : '+91 98765 43210',
      };
      (userObj as any).companyName = companyName;

      set({ user: userObj, isAuthenticated: true, isLoading: false });
      localStorage.setItem('hc_auth', 'true');
      localStorage.setItem('hc_user', JSON.stringify(userObj));
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('hc_auth');
    localStorage.removeItem('hc_user');
  },

  register: async (data) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 800));

    const userName = data.recruiterName || formatNameFromEmail(data.email) || 'Recruiter';
    const companyName = data.companyName || formatCompanyFromEmail(data.email) || 'New Enterprise';
    const newCompanyId = `c-${Date.now()}`;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userName,
      email: data.email,
      role: 'industry',
      companyId: newCompanyId,
      designation: data.designation || 'HR Manager',
      phone: data.phone || '+91 98765 43210',
    };
    (newUser as any).companyName = companyName;

    // Save custom registered company into localStorage for company profile resolution
    const customCompany = {
      id: newCompanyId,
      name: companyName,
      email: data.email,
      industry: data.industry || 'Information Technology',
      size: data.size || '11-50',
      location: data.location || 'Bangalore, India',
      website: data.website || `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      description: `${companyName} is committed to hiring top verified talent and accelerating campus recruitment.`,
      recruiter: {
        name: userName,
        designation: data.designation || 'HR Manager',
        phone: data.phone || '+91 98765 43210',
        email: data.email,
      },
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      const storedStr = localStorage.getItem('hc_custom_companies') || '[]';
      const customList = JSON.parse(storedStr);
      customList.push(customCompany);
      localStorage.setItem('hc_custom_companies', JSON.stringify(customList));
    } catch {
      // ignore JSON parse errors
    }

    set({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });

    localStorage.setItem('hc_auth', 'true');
    localStorage.setItem('hc_user', JSON.stringify(newUser));
    return true;
  },
}));
