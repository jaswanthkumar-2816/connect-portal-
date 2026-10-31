import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Send,
  Mic,
  MicOff,
  Minus,
  ArrowRight,
  Zap,
  Sparkles,
  BarChart3,
  Users,
  Briefcase,
  Star,
  FileCode2,
  Compass,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronRight,
  GraduationCap,
  Award,
  FileText,
  PlusCircle,
  Target,
  CheckCircle2,
  ListOrdered,
  LayoutGrid,
  ArrowRightCircle,
  Landmark,
  Building,
  PieChart,
  Flame,
  LayoutDashboard,
  Cpu,
  Terminal,
  Building2,
  Sliders,
  SunMoon,
  ChevronUp,
  SlidersHorizontal,
  GripHorizontal,
} from 'lucide-react';
import { useOrbitStore, type OrbitMessage } from '../../store/orbitStore';
import { useThemeStore } from '../../store/themeStore';
import OrbitLogo from './OrbitLogo';
import {
  getDynamicPortalContext,
  type DynamicPortalContext,
} from '../../services/dynamicFeatureService';

const ORBIT_POS_KEY = 'hc_orbit_widget_pos';

type OrbitPos = { right: number; bottom: number };

function loadOrbitPos(): OrbitPos {
  try {
    const raw = localStorage.getItem(ORBIT_POS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as OrbitPos;
      if (typeof parsed?.right === 'number' && typeof parsed?.bottom === 'number') {
        return parsed;
      }
    }
  } catch {}
  return { right: 24, bottom: 24 };
}

function saveOrbitPos(pos: OrbitPos) {
  try {
    localStorage.setItem(ORBIT_POS_KEY, JSON.stringify(pos));
  } catch {}
}

function clampOrbitPos(pos: OrbitPos, width: number, height: number): OrbitPos {
  const pad = 8;
  const maxRight = Math.max(pad, window.innerWidth - width - pad);
  const maxBottom = Math.max(pad, window.innerHeight - height - pad);
  return {
    right: Math.min(Math.max(pad, pos.right), maxRight),
    bottom: Math.min(Math.max(pad, pos.bottom), maxBottom),
  };
}
// ============================================================
// Enterprise Rich Formatted Content Renderer
// ============================================================
function FormattedContent({ text }: { text: string }) {
  if (!text) return null;

  const rawSections = text.split(/\n\n+/);

  return (
    <div className="space-y-3.5 text-sm leading-relaxed select-text text-white/95 font-normal">
      {rawSections.map((section, sIdx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // 1. Header ### Section
        if (trimmed.startsWith('### ')) {
          const title = trimmed.replace('### ', '').replace(/\*\*/g, '');
          return (
            <div key={sIdx} className="pt-2 pb-1 border-b border-white/[0.08]">
              <h4 className="font-bold text-sm text-white tracking-tight font-outfit flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-[#06c006] shadow-[0_0_8px_#06c006]" />
                <span>{title}</span>
              </h4>
            </div>
          );
        }

        // 2. Callout / Telemetry Container
        if (/^(🎯|💡|📌|💼|🚀|⭐|🎉|🏛️|📊|🧠)\s+/.test(trimmed)) {
          return (
            <div
              key={sIdx}
              className="p-3.5 rounded-2xl bg-[#06c006]/[0.08] border border-[#06c006]/35 shadow-sm space-y-1"
            >
              <div
                className="text-sm text-white font-medium leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
              />
            </div>
          );
        }

        // 3. Structured Key-Value / Bullet List Card
        if (trimmed.includes('\n• ') || trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const lines = trimmed.split(/\n/).filter(l => l.trim().length > 0);
          return (
            <div key={sIdx} className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.08] space-y-2 shadow-inner">
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^[•\-*]\s+/, '');
                return (
                  <div key={lIdx} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06c006] mt-2 flex-shrink-0 shadow-[0_0_6px_rgba(6,192,6,0.6)]" />
                    <div className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(cleanLine) }} />
                  </div>
                );
              })}
            </div>
          );
        }

        // 4. Numbered List Section
        if (/^\d+\.\s+/.test(trimmed)) {
          const lines = trimmed.split(/\n/).filter(l => l.trim().length > 0);
          return (
            <div key={sIdx} className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-1.5">
              {lines.map((line, lIdx) => (
                <div key={lIdx} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
              ))}
            </div>
          );
        }

        // 5. Standard Clean Paragraph
        return (
          <div
            key={sIdx}
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
          />
        );
      })}
    </div>
  );
}

function formatInline(str: string): string {
  return str
    // Shareable links: https://...
    .replace(
      /`?(https?:\/\/[^\s`]+)`?/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-[#06c006]/15 text-[#00ff66] font-mono text-xs font-bold border border-[#06c006]/40 inline-flex items-center gap-1 hover:bg-[#06c006]/25 hover:underline my-0.5">$1</a>'
    )
    // Bold **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white tracking-wide">$1</strong>')
    // Italic *text*
    .replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>')
    // Code chips `code`
    .replace(
      /`([^`]+)`/g,
      '<code class="px-2 py-0.5 rounded-lg bg-white/10 text-[#06c006] font-mono text-xs font-semibold border border-[#06c006]/30 inline-block my-0.5 mx-0.5">$1</code>'
    );
}

interface ControlMenuItem {
  id: string;
  title: string;
  prompt: string;
  icon: any;
  category: 'HIERO' | 'BRIDGE' | 'SYSTEM';
}

export default function OrbitWidget() {
  const {
    isOpen,
    setOpen,
    messages,
    sendMessage,
    executeActionCard,
    isThinking,
    activeTool,
    clearHistory,
    isListening,
    setIsListening,
    unreadCount,
  } = useOrbitStore();

  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [portalCtx, setPortalCtx] = useState<DynamicPortalContext | null>(null);
  const [pos, setPos] = useState<OrbitPos>(() =>
    typeof window !== 'undefined' ? loadOrbitPos() : { right: 24, bottom: 24 }
  );
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startRight: number;
    startBottom: number;
    width: number;
    height: number;
    moved: boolean;
    target: 'launcher' | 'window';
  } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const windowWidth = isExpanded
    ? Math.min(860, typeof window !== 'undefined' ? window.innerWidth - 24 : 860)
    : Math.min(580, typeof window !== 'undefined' ? window.innerWidth - 24 : 580);
  const windowHeight = isExpanded
    ? Math.min(800, typeof window !== 'undefined' ? window.innerHeight - 36 : 800)
    : Math.min(720, typeof window !== 'undefined' ? window.innerHeight - 40 : 720);

  const updatePos = useCallback((next: OrbitPos, width: number, height: number) => {
    const clamped = clampOrbitPos(next, width, height);
    setPos(clamped);
    saveOrbitPos(clamped);
  }, []);

  // Keep widget on-screen across resize / expand and page navigations
  useEffect(() => {
    const keepInView = () => {
      const w = isOpen ? windowWidth : 56;
      const h = isOpen ? windowHeight : 56;
      setPos(prev => {
        const clamped = clampOrbitPos(prev, w, h);
        if (clamped.right !== prev.right || clamped.bottom !== prev.bottom) {
          saveOrbitPos(clamped);
        }
        return clamped;
      });
    };
    keepInView();
    window.addEventListener('resize', keepInView);
    return () => window.removeEventListener('resize', keepInView);
  }, [isOpen, isExpanded, windowWidth, windowHeight]);

  const beginDrag = (
    e: React.PointerEvent,
    target: 'launcher' | 'window',
    width: number,
    height: number
  ) => {
    if (e.button !== 0) return;
    // Don't start drag from interactive controls inside the header
    const el = e.target as HTMLElement;
    if (el.closest('button, a, input, textarea, [data-no-drag]')) return;

    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startRight: pos.right,
      startBottom: pos.bottom,
      width,
      height,
      moved: false,
      target,
    };
    setIsDragging(true);
  };

  const onDragMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true;
    if (!drag.moved) return;
    updatePos(
      { right: drag.startRight - dx, bottom: drag.startBottom - dy },
      drag.width,
      drag.height
    );
  };

  const endDrag = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const moved = drag.moved;
    const target = drag.target;
    dragRef.current = null;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    // Launcher: treat as click only when not dragged
    if (target === 'launcher' && !moved) {
      setOpen(true);
    }
  };

  // Load dynamic telemetry on route change or open
  useEffect(() => {
    let mounted = true;
    const loadDynamicData = async () => {
      try {
        const ctx = await getDynamicPortalContext(location.pathname);
        if (mounted) setPortalCtx(ctx);
      } catch (err) {
        console.error('Failed loading dynamic portal context:', err);
      }
    };

    loadDynamicData();
    return () => {
      mounted = false;
    };
  }, [location.pathname, isOpen]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking, isOpen]);

  // Close menu on click outside or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setIsMenuOpen(prev => !prev);
      } else if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Web Speech API initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [setIsListening]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const txt = input.trim();
    if (!txt || isThinking) return;
    setInput('');
    setIsMenuOpen(false);
    await sendMessage(txt, navigate);
  };

  const handleExecutePrompt = async (promptText: string) => {
    if (isThinking) return;
    setIsMenuOpen(false);
    await sendMessage(promptText, navigate);
  };

  const topCand = portalCtx?.recentCandidateNames[0] || 'Top Candidate';
  const activeJob = portalCtx?.activeJobTitles[0] || 'AI Software Engineer';
  const topCollege = portalCtx?.topColleges[0] || 'NIT Warangal';
  const company = portalCtx?.activeCompany || 'TechNova';
  const topSkill = portalCtx?.topSkills[0] || 'Python';

  const CONTROL_OPTIONS: ControlMenuItem[] = [
    // 🏢 HIERO CONTROLS
    {
      id: 'hiero-create-job',
      category: 'HIERO',
      title: 'Create New Opportunity',
      prompt: 'Create new opportunity',
      icon: PlusCircle,
    },
    {
      id: 'hiero-match',
      category: 'HIERO',
      title: 'Match Verified Talent (>85%)',
      prompt: `Find candidates with ${topSkill} > 85%`,
      icon: Target,
    },
    {
      id: 'hiero-cgpa-high',
      category: 'HIERO',
      title: 'Inbox: CGPA ≥ 8.5',
      prompt: 'Show applies with CGPA >= 8.5',
      icon: GraduationCap,
    },
    {
      id: 'hiero-cgpa-filter',
      category: 'HIERO',
      title: 'Inbox: CGPA < 8.5',
      prompt: 'Filter inbox CGPA < 8.5',
      icon: GraduationCap,
    },
    {
      id: 'hiero-stats',
      category: 'HIERO',
      title: 'Recruitment & Pipeline Stats',
      prompt: "Summarize today's recruitment stats",
      icon: BarChart3,
    },
    {
      id: 'hiero-jd',
      category: 'HIERO',
      title: 'AI JD Skills Extractor',
      prompt: 'Extract skills from JD: AI Fullstack Engineer with React, Python, FastAPI, Docker, Cloud AWS',
      icon: FileCode2,
    },
    {
      id: 'hiero-jobs-nav',
      category: 'HIERO',
      title: 'View Active Opportunities',
      prompt: 'Go to jobs',
      icon: Briefcase,
    },

    // 🏛️ BRIDGE CAMPUS & TPO SYNC
    {
      id: 'bridge-colleges',
      category: 'BRIDGE',
      title: 'Partner Universities Network',
      prompt: 'Show connected partner universities and colleges',
      icon: Landmark,
    },
    {
      id: 'bridge-shortlist',
      category: 'BRIDGE',
      title: 'Candidate Shortlist Wizard',
      prompt: 'Shortlist candidate',
      icon: Star,
    },
    {
      id: 'bridge-offer',
      category: 'BRIDGE',
      title: 'Dispatch Selection Offer',
      prompt: 'Send selection notice to candidate',
      icon: CheckCircle2,
    },
    {
      id: 'bridge-pipeline',
      category: 'BRIDGE',
      title: 'Hiring Pipeline Funnel',
      prompt: 'Go to pipeline',
      icon: LayoutGrid,
    },
    {
      id: 'bridge-campus-drive',
      category: 'BRIDGE',
      title: 'Campus Drive Network',
      prompt: `Show campus candidates from ${topCollege}`,
      icon: GraduationCap,
    },

    // ⚙️ SYSTEM & ENVIRONMENT
    {
      id: 'sys-theme',
      category: 'SYSTEM',
      title: 'Toggle Dark / Light Theme',
      prompt: 'Toggle Dark / Light Theme',
      icon: SunMoon,
    },
    {
      id: 'sys-reset',
      category: 'SYSTEM',
      title: 'Reset Session Memory',
      prompt: 'Help',
      icon: RotateCcw,
    },
  ];

  return (
    <div className="orbit-root font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. Minimized Single Circular Floating Logo Button (Bottom Right) */}
      {/* ------------------------------------------------------------- */}
      {!isOpen && (
        <button
          type="button"
          onPointerDown={e => beginDrag(e, 'launcher', 56, 56)}
          onPointerMove={onDragMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`orbit-launcher-pill fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl group overflow-hidden p-0 touch-none ${
            isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab transition-transform duration-300 hover:scale-110 active:scale-95'
          }`}
          style={{
            right: pos.right,
            bottom: pos.bottom,
            left: 'auto',
            top: 'auto',
            background: '#050805',
            border: '1.5px solid rgba(6, 192, 6, 0.55)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.85), 0 0 22px rgba(6, 192, 6, 0.4)',
          }}
          title="Open Orbit AI — drag to move (Ctrl+O)"
          aria-label="Open Orbit AI Assistant"
        >
          <OrbitLogo size={56} className="transition-transform duration-200 group-hover:scale-105 pointer-events-none" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#00ff66] border-2 border-black shadow-[0_0_8px_#00ff66] animate-pulse pointer-events-none" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-[#06c006] text-black text-xs font-black flex items-center justify-center shadow-lg border border-black animate-bounce z-10 pointer-events-none">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. Expanded Clean Minimal Orbit AI Window */}
      {/* ------------------------------------------------------------- */}
      {isOpen && (
        <div
          className={`orbit-window fixed z-50 flex flex-col shadow-2xl rounded-3xl overflow-hidden ${
            isDragging ? '' : 'transition-[width,height] duration-300'
          } ${
            isExpanded
              ? 'w-[860px] max-w-[calc(100vw-24px)] h-[800px] max-h-[calc(100vh-36px)]'
              : 'w-[580px] max-w-[calc(100vw-24px)] h-[720px] max-h-[calc(100vh-40px)]'
          }`}
          style={{
            right: pos.right,
            bottom: pos.bottom,
            left: 'auto',
            top: 'auto',
            background: '#050505',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(6, 192, 6, 0.15)',
          }}
        >
          {/* Rotating Orbit planet background */}
          <div className="orbit-chat-bg" aria-hidden="true">
            <div className="orbit-chat-bg-spin">
              <img src="/brand/orbit-chat-bg.jpg" alt="" draggable={false} />
            </div>
            <div className="orbit-chat-bg-veil" />
          </div>

          {/* Subtle Top Accent Glow Line */}
          <div className="relative z-10 h-[2px] bg-gradient-to-r from-transparent via-[#06c006]/70 to-transparent pointer-events-none flex-shrink-0" />

          {/* ── HEADER (drag handle) ── */}
          <div
            className={`relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black/35 backdrop-blur-md flex-shrink-0 touch-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onPointerDown={e => beginDrag(e, 'window', windowWidth, windowHeight)}
            onPointerMove={onDragMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            title="Drag to move Orbit"
          >
            <div className="flex items-center gap-3 pointer-events-none">
              <div className="relative flex-shrink-0">
                <OrbitLogo size={40} rounded="xl" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00ff66] border border-black animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight font-outfit">Orbit</h3>
                  <GripHorizontal size={14} className="text-white/30" aria-hidden />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">Drag to move · Always around you</p>
              </div>
            </div>

            {/* Clean Action Controls */}
            <div className="flex items-center gap-2" data-no-drag>
              {/* Reset Chat */}
              <button
                type="button"
                onClick={clearHistory}
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] text-white/70 hover:text-white border border-white/[0.08] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw size={16} />
              </button>

              {/* Expand/Collapse Mode */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] text-white/70 hover:text-white border border-white/[0.08] hidden sm:flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                title={isExpanded ? 'Collapse size' : 'Expand size'}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Minimize Window */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] text-white/70 hover:text-white border border-white/[0.08] flex items-center justify-center transition-all active:scale-95 ml-0.5 cursor-pointer"
                title="Minimize (Ctrl+O)"
              >
                <Minus size={18} />
              </button>
            </div>
          </div>

          {/* ── CHAT MESSAGES BODY (Spacious, Minimal, Breathable) ── */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Role header label */}
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  {msg.role !== 'user' && <OrbitLogo size={16} />}
                  <span className="text-xs font-semibold text-white/50">
                    {msg.role === 'user' ? 'You' : 'Orbit'}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[94%] rounded-2xl p-5 transition-all ${
                    msg.role === 'user'
                      ? 'bg-[#06c006] text-black font-semibold rounded-tr-sm shadow-[0_4px_20px_rgba(6,192,6,0.25)]'
                      : 'bg-black/55 border border-white/[0.08] text-white/95 rounded-tl-sm shadow-md space-y-3.5 backdrop-blur-sm'
                  }`}
                  style={
                    msg.role === 'user'
                      ? undefined
                      : { backdropFilter: 'blur(20px)' }
                  }
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm leading-relaxed select-text font-bold">{msg.content}</p>
                  ) : (
                    <FormattedContent text={msg.content} />
                  )}

                  {/* ── ACTION CARD (Clean & Generously Padded) ── */}
                  {msg.actionCard && (
                    <div className="mt-4 p-5 rounded-2xl bg-black/60 border border-white/10 shadow-lg space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h5 className="text-base font-bold text-white tracking-tight font-outfit">
                            {msg.actionCard.title}
                          </h5>
                          {msg.actionCard.subtitle && (
                            <p className="text-xs text-[#06c006] font-medium mt-0.5">
                              {msg.actionCard.subtitle}
                            </p>
                          )}
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66] flex-shrink-0 mt-1.5" />
                      </div>

                      {/* Detail Metrics Grid */}
                      {msg.actionCard.details && (
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.08]">
                          {Object.entries(msg.actionCard.details).map(([k, v]) => (
                            <div key={k} className="bg-white/[0.04] p-3 rounded-xl border border-white/[0.06]">
                              <span className="text-white/45 block text-xs uppercase font-bold tracking-wider">{k}</span>
                              <span className="text-white font-bold text-sm truncate block mt-0.5">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {msg.actionCard.primaryActionLabel && msg.actionCard.primaryActionPayload && (
                          <button
                            type="button"
                            onClick={() => executeActionCard(msg.actionCard!.primaryActionPayload!, navigate)}
                            className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#06c006] hover:bg-[#05aa05] text-black flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,192,6,0.3)] transition-all active:scale-95"
                          >
                            <span>{msg.actionCard.primaryActionLabel}</span>
                            <ArrowRight size={14} />
                          </button>
                        )}
                        {msg.actionCard.secondaryActionLabel && msg.actionCard.secondaryActionPayload && (
                          <button
                            type="button"
                            onClick={() => executeActionCard(msg.actionCard!.secondaryActionPayload!, navigate)}
                            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all active:scale-95"
                          >
                            {msg.actionCard.secondaryActionLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── FOLLOW-UP DYNAMIC OPTIONS (Minimal, Clean Pill Chips) ── */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-white/[0.08] space-y-2">
                      <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Select Option:</p>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {msg.suggestedPrompts.slice(0, 4).map((sug, sIdx) => {
                          const cleanLabel = sug
                            .replace(/^(?:Role:\s*|Location:\s*|Publish:\s*|👉\s*|🚀\s*)/i, '')
                            .replace(/\s+for\s+[A-Z].*$/i, '');
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleExecutePrompt(sug)}
                              disabled={isThinking}
                              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-[#06c006]/15 hover:text-white text-white/90 border border-white/10 hover:border-[#06c006]/50 transition-all text-left flex items-center gap-2 active:scale-95 shadow-sm group"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#06c006] opacity-70 group-hover:opacity-100 group-hover:shadow-[0_0_6px_#06c006]" />
                              <span className="truncate max-w-[280px]">{cleanLabel}</span>
                              <ChevronRight size={13} className="text-[#06c006] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking / Tool Execution State */}
            {isThinking && (
              <div className="flex flex-col items-start space-y-2">
                <div className="rounded-2xl rounded-tl-sm px-5 py-3.5 bg-white/[0.04] border border-[#06c006]/40 text-white flex items-center gap-3 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#06c006] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#06c006] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#06c006] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs font-semibold text-[#06c006] font-mono tracking-tight">
                    {activeTool || 'Executing autonomous operation...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── FOOTER: Modern Clean Input Box with HIERO & BRIDGE CONTROLS POPUP ── */}
          <div className="relative z-10 border-t border-white/[0.08] bg-black/55 backdrop-blur-md flex-shrink-0 p-4 sm:p-5">
            {/* ── HIERO & BRIDGE CONTROLS DROPDOWN POPUP ── */}
            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute bottom-[calc(100%+10px)] left-4 right-4 sm:left-5 sm:right-5 z-50 rounded-2xl p-3 shadow-2xl border border-white/10 overflow-hidden animate-scaleIn backdrop-blur-3xl"
                style={{
                  background: 'rgba(12, 18, 14, 0.98)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(6, 192, 6, 0.2)',
                  maxHeight: '400px',
                }}
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.08] mb-2">
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-[#06c006]" />
                    <span className="text-xs font-bold text-white tracking-wide font-outfit uppercase">
                      Controls & Actions
                    </span>
                  </div>
                </div>

                {/* Options List */}
                <div className="overflow-y-auto max-h-[320px] space-y-3.5 custom-scrollbar pr-1">
                  {/* Category 1: HIERO RECRUITMENT CONTROLS */}
                  <div>
                    <span className="text-xs font-bold text-[#06c006] uppercase tracking-wider px-2.5 block mb-1.5">
                      Hiero Recruitment
                    </span>
                    <div className="space-y-1">
                      {CONTROL_OPTIONS.filter(o => o.category === 'HIERO').map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleExecutePrompt(opt.prompt)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/[0.08] text-white/90 hover:text-white transition-all group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-lg bg-white/[0.05] group-hover:bg-[#06c006]/20 flex items-center justify-center text-[#06c006] flex-shrink-0">
                                <Icon size={14} />
                              </div>
                              <span className="text-xs font-semibold truncate">{opt.title}</span>
                            </div>
                            <ChevronRight size={14} className="text-white/30 group-hover:text-[#06c006] group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 2: BRIDGE CAMPUS & TPO SYNC */}
                  <div className="border-t border-white/[0.06] pt-2.5">
                    <span className="text-xs font-bold text-[#00ff66] uppercase tracking-wider px-2.5 block mb-1.5">
                      Bridge Campus & Placement
                    </span>
                    <div className="space-y-1">
                      {CONTROL_OPTIONS.filter(o => o.category === 'BRIDGE').map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleExecutePrompt(opt.prompt)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/[0.08] text-white/90 hover:text-white transition-all group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-lg bg-white/[0.05] group-hover:bg-[#06c006]/20 flex items-center justify-center text-[#06c006] flex-shrink-0">
                                <Icon size={14} />
                              </div>
                              <span className="text-xs font-semibold truncate">{opt.title}</span>
                            </div>
                            <ChevronRight size={14} className="text-white/30 group-hover:text-[#06c006] group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 3: SYSTEM CONTROLS */}
                  <div className="border-t border-white/[0.06] pt-2.5">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-wider px-2.5 block mb-1.5">
                      System Controls
                    </span>
                    <div className="space-y-1">
                      {CONTROL_OPTIONS.filter(o => o.category === 'SYSTEM').map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleExecutePrompt(opt.prompt)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-white/[0.08] text-white/80 hover:text-white transition-all group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/50 group-hover:text-[#06c006]">
                                <Icon size={14} />
                              </div>
                              <span className="text-xs font-medium truncate">{opt.title}</span>
                            </div>
                            <ChevronRight size={14} className="text-white/30 group-hover:text-[#06c006]" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Input Form */}
            <form onSubmit={handleSend}>
              <div className="flex items-center gap-2.5 bg-white/[0.05] border border-white/10 focus-within:border-[#06c006]/60 focus-within:bg-white/[0.08] focus-within:shadow-[0_0_20px_rgba(6,192,6,0.15)] rounded-2xl px-3 py-2 transition-all">
                {/* CONTROLS POPUP TRIGGER BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isMenuOpen
                      ? 'bg-[#06c006] text-black shadow-[0_0_12px_rgba(6,192,6,0.4)]'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/80 hover:text-white border border-white/10'
                  }`}
                  title="Controls & Actions (Ctrl+/)"
                >
                  <SlidersHorizontal size={14} className={isMenuOpen ? 'text-black' : 'text-[#06c006]'} />
                  <span>Controls</span>
                  <ChevronUp size={13} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-2 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-[0_0_12px_red]'
                      : 'text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                  title={isListening ? 'Listening... click to stop' : 'Voice command (Speech-to-Text)'}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                {/* Text Input Field */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={isListening ? 'Listening to voice...' : 'Ask Orbit AI anything...'}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-medium py-1.5"
                  disabled={isThinking}
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isThinking}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    input.trim() && !isThinking
                      ? 'bg-[#06c006] text-black hover:bg-[#05aa05] shadow-[0_0_15px_rgba(6,192,6,0.4)] cursor-pointer active:scale-95'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                  title="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
