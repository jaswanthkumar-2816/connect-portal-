import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('cp_theme', t);
}

// Light by default. Connect is opened on a phone in a shop with the lights
// on, not in a dark room — and a recruiter who has never heard of a theme
// toggle should get the readable one without finding it.
const saved = (localStorage.getItem('cp_theme') as Theme) || 'light';
applyTheme(saved);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: saved,
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return { theme: next };
    }),
  setTheme: (t: Theme) => {
    applyTheme(t);
    set({ theme: t });
  },
}));
