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

const saved = (localStorage.getItem('cp_theme') as Theme) || 'dark';
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
