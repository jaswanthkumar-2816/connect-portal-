import { create } from 'zustand';
import {
  executeOrbitPrompt,
  orbitAudio,
  type OrbitActionCard,
  type OrbitResponse,
} from '../services/orbitService';
import { useAuthStore } from './authStore';
import { useInboxFilterStore } from './inboxFilterStore';

export interface OrbitMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolUsed?: string;
  actionCard?: OrbitActionCard;
  suggestedPrompts?: string[];
  isTyping?: boolean;
}

interface OrbitState {
  isOpen: boolean;
  isCommandPaletteOpen: boolean;
  messages: OrbitMessage[];
  isThinking: boolean;
  activeTool: string | null;
  soundEnabled: boolean;
  isListening: boolean;
  unreadCount: number;

  // Actions
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleSound: () => void;
  setIsListening: (val: boolean) => void;
  clearHistory: () => void;
  exportHistory: () => void;
  sendMessage: (text: string, navigate?: (path: string) => void) => Promise<void>;
  executeActionCard: (
    payload: { type: string; path?: string; data?: any },
    navigate?: (path: string) => void
  ) => Promise<void>;
}

// Clean up any old chat history in localStorage so it never reloads old chats
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hc_orbit_chat_history');
  }
} catch {}

export function getFreshGreetingMessage(): OrbitMessage[] {
  const user = useAuthStore.getState().user;
  const companyName = (user as any)?.companyName || (user?.name ? `${user.name}'s Company` : 'TechNova');

  return [
    {
      id: `msg-init-${Date.now()}`,
      role: 'assistant',
      content: `👋 **Hello! I'm Orbit**, your recruitment intelligence copilot for **${companyName}**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];
}

export const useOrbitStore = create<OrbitState>((set, get) => ({
  isOpen: false,
  isCommandPaletteOpen: false,
  messages: getFreshGreetingMessage(),
  isThinking: false,
  activeTool: null,
  soundEnabled: true,
  isListening: false,
  unreadCount: 0,

  toggleOpen: () => {
    const next = !get().isOpen;
    if (next) {
      if (get().soundEnabled) orbitAudio.playChime('open');
      // Always provide a clean, fresh session on open
      set({ isOpen: true, messages: getFreshGreetingMessage(), unreadCount: 0 });
    } else {
      set({ isOpen: false });
    }
  },

  setOpen: (open: boolean) => {
    if (open) {
      if (get().soundEnabled) orbitAudio.playChime('open');
      // Always provide a clean, fresh session on open
      set({ isOpen: true, messages: getFreshGreetingMessage(), unreadCount: 0 });
    } else {
      set({ isOpen: false });
    }
  },

  openCommandPalette: () => {
    if (get().soundEnabled) orbitAudio.playChime('pop');
    set({ isCommandPaletteOpen: true });
  },

  closeCommandPalette: () => {
    set({ isCommandPaletteOpen: false });
  },

  toggleSound: () => {
    const next = !get().soundEnabled;
    if (next) orbitAudio.playChime('action');
    set({ soundEnabled: next });
  },

  setIsListening: (val: boolean) => set({ isListening: val }),

  clearHistory: () => {
    set({ messages: getFreshGreetingMessage() });
    if (get().soundEnabled) orbitAudio.playChime('action');
  },

  exportHistory: () => {
    try {
      const msgs = get().messages;
      const text = msgs
        .map(
          m =>
            `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n${
              m.actionCard ? `[Action Card: ${m.actionCard.title}]\n` : ''
            }`
        )
        .join('\n----------------------------------------\n\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orbit_ai_chat_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  },

  sendMessage: async (text: string, navigate?: (path: string) => void) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: OrbitMessage = {
      id: `msg-u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentMsgs = [...get().messages, userMsg];
    set({
      messages: currentMsgs,
      isThinking: true,
      activeTool: 'Orbit logic engine analyzing...',
    });

    try {
      const activePath = typeof window !== 'undefined' ? window.location.pathname : '/industry';
      const res: OrbitResponse = await executeOrbitPrompt(
        trimmed,
        activePath,
        toolName => {
          set({ activeTool: toolName });
        }
      );

      const botMsg: OrbitMessage = {
        id: `msg-a-${Date.now()}`,
        role: 'assistant',
        content: res.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUsed: res.toolUsed,
        actionCard: res.actionCard,
        suggestedPrompts: res.suggestedPrompts,
      };

      const finalMsgs = [...currentMsgs, botMsg];
      set({
        messages: finalMsgs,
        isThinking: false,
        activeTool: null,
        unreadCount: get().isOpen ? 0 : get().unreadCount + 1,
      });

      if (res.soundCue && get().soundEnabled) {
        orbitAudio.playChime(res.soundCue);
      }

      if (res.navigatePath && navigate) {
        navigate(res.navigatePath);
        // When Orbit applies an Inbox filter, close the chat so the page is visible
        if (res.navigatePath.includes('/applications') && useInboxFilterStore.getState().criteria) {
          set({ isOpen: false, isCommandPaletteOpen: false });
        }
      }
    } catch (err: any) {
      const errorMsg: OrbitMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ I encountered an unexpected error while processing that action. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set({
        messages: [...currentMsgs, errorMsg],
        isThinking: false,
        activeTool: null,
      });
      if (get().soundEnabled) orbitAudio.playChime('error');
    }
  },

  executeActionCard: async (payload, navigate) => {
    if (payload.type === 'APPLY_INBOX_FILTER') {
      const prompt = payload.data?.prompt || payload.data?.criteria?.sourcePrompt;
      if (prompt) useInboxFilterStore.getState().applyFromPrompt(String(prompt));
      else if (payload.data?.criteria) useInboxFilterStore.getState().setCriteria(payload.data.criteria);
      if (payload.path && navigate) navigate(payload.path);
      set({ isOpen: false, isCommandPaletteOpen: false });
      if (get().soundEnabled) orbitAudio.playChime('action');
    } else if (payload.type === 'CLEAR_INBOX_FILTER') {
      useInboxFilterStore.getState().clear();
      if (payload.path && navigate) navigate(payload.path);
      if (get().soundEnabled) orbitAudio.playChime('action');
    } else if (payload.type === 'NAVIGATE' && payload.path && navigate) {
      navigate(payload.path);
      if (get().soundEnabled) orbitAudio.playChime('action');
    } else if (payload.type === 'COMMAND' && payload.data) {
      await get().sendMessage(String(payload.data), navigate);
    } else if (payload.type === 'SEND_OFFER' && payload.data) {
      await get().sendMessage(`Send selection notice to candidate ${payload.data.candidateId}`, navigate);
    } else if (payload.type === 'CREATE_JOB_FROM_SKILLS') {
      await get().sendMessage('Create a new job opportunity with these extracted skills', navigate);
    }
  },
}));
