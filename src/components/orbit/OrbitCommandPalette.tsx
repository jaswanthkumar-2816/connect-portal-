import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  Star,
  GitBranch,
  Building2,
  Settings,
  Sun,
  Moon,
  ArrowRight,
  Zap,
  Users,
  X,
  FileCode,
} from 'lucide-react';
import { useOrbitStore } from '../../store/orbitStore';
import { useThemeStore } from '../../store/themeStore';
import OrbitLogo from './OrbitLogo';

interface CommandItem {
  id: string;
  category: 'Pages' | 'Actions' | 'Talent' | 'System';
  title: string;
  subtitle: string;
  icon: any;
  action: () => void;
  keywords?: string[];
}

export default function OrbitCommandPalette() {
  const { isCommandPaletteOpen, closeCommandPalette, sendMessage, setOpen } = useOrbitStore();
  const { theme, toggleTheme } = useThemeStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const runCommand = async (actionFn: () => void) => {
    closeCommandPalette();
    actionFn();
  };

  const handleAskOrbit = async () => {
    if (!query.trim()) return;
    closeCommandPalette();
    setOpen(true);
    await sendMessage(query, navigate);
  };

  const ALL_COMMANDS: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dash',
      category: 'Pages',
      title: 'Dashboard',
      subtitle: 'View overall portal recruitment stats and analytics',
      icon: LayoutDashboard,
      action: () => navigate('/industry'),
      keywords: ['dashboard', 'home', 'stats', 'analytics', 'overview'],
    },
    {
      id: 'nav-jobs',
      category: 'Pages',
      title: 'Jobs & Internships',
      subtitle: 'Manage all published opportunities and applicant counts',
      icon: Briefcase,
      action: () => navigate('/industry/jobs'),
      keywords: ['jobs', 'internships', 'openings', 'opportunities', 'posts'],
    },
    {
      id: 'nav-create',
      category: 'Pages',
      title: 'Create Opportunity',
      subtitle: 'Post a new job or internship to Gateway and campus boards',
      icon: PlusCircle,
      action: () => navigate('/industry/create'),
      keywords: ['create', 'post', 'new job', 'new internship', 'publish'],
    },
    {
      id: 'nav-apps',
      category: 'Pages',
      title: 'Applications',
      subtitle: 'Review student and campus applicant profiles',
      icon: FileText,
      action: () => navigate('/industry/applications'),
      keywords: ['applications', 'applicants', 'students', 'resumes', 'submissions'],
    },
    {
      id: 'nav-shortlist',
      category: 'Pages',
      title: 'Shortlisted Candidates',
      subtitle: 'Manage shortlisted talent and send official selection notices',
      icon: Star,
      action: () => navigate('/industry/shortlisted'),
      keywords: ['shortlist', 'shortlisted', 'starred', 'favorites', 'selected'],
    },
    {
      id: 'nav-pipeline',
      category: 'Pages',
      title: 'Hiring Pipeline Funnel',
      subtitle: 'Interactive Kanban board across review stages',
      icon: GitBranch,
      action: () => navigate('/industry/pipeline'),
      keywords: ['pipeline', 'kanban', 'funnel', 'stages', 'hiring steps'],
    },
    {
      id: 'nav-company',
      category: 'Pages',
      title: 'Company Profile',
      subtitle: 'Update enterprise details, branding, and recruiter info',
      icon: Building2,
      action: () => navigate('/industry/company'),
      keywords: ['company', 'profile', 'branding', 'organization', 'recruiter'],
    },
    {
      id: 'nav-settings',
      category: 'Pages',
      title: 'Portal Settings',
      subtitle: 'Configure preferences, notifications, and integrations',
      icon: Settings,
      action: () => navigate('/industry/settings'),
      keywords: ['settings', 'preferences', 'config', 'options'],
    },

    // Actions via Orbit
    {
      id: 'act-summary',
      category: 'Actions',
      title: 'Recruitment Metrics Summary',
      subtitle: 'Orbit AI aggregates total applicants, shortlists, and hires',
      icon: Sparkles,
      action: () => {
        setOpen(true);
        sendMessage('Summarize recruitment metrics', navigate);
      },
      keywords: ['summary', 'metrics', 'analytics', 'report', 'stats'],
    },
    {
      id: 'act-post-ai',
      category: 'Actions',
      title: 'Quick Create AI Engineer Opening',
      subtitle: 'Auto-publish a high-priority Full-time AI Engineer job',
      icon: Zap,
      action: () => {
        setOpen(true);
        sendMessage('Create a Full-time AI Software Engineer job in Bangalore', navigate);
      },
      keywords: ['create ai job', 'quick post', 'publish opening'],
    },
    {
      id: 'act-shortlist-jaswanth',
      category: 'Actions',
      title: 'Shortlist Jaswanth Kumar',
      subtitle: 'Shortlist top campus applicant and notify placement cell',
      icon: Star,
      action: () => {
        setOpen(true);
        sendMessage('Shortlist Jaswanth Kumar', navigate);
      },
      keywords: ['shortlist jaswanth', 'jaswanth kumar', 'nit warangal candidate'],
    },
    {
      id: 'act-offer-jaswanth',
      category: 'Actions',
      title: 'Send Selection Offer to Jaswanth Kumar',
      subtitle: 'Dispatch official hire notice and notify placement cell on Bridge',
      icon: FileCode,
      action: () => {
        setOpen(true);
        sendMessage('Send selection notice to Jaswanth Kumar', navigate);
      },
      keywords: ['offer', 'hire', 'send selection', 'congratulations'],
    },
    {
      id: 'act-extract-jd',
      category: 'Actions',
      title: 'Extract Skills from Job Description',
      subtitle: 'Use Orbit AI taxonomy extractor to map required skills',
      icon: Sparkles,
      action: () => {
        setOpen(true);
        sendMessage('Extract skills from JD: We need Python, React, Docker, AWS, PostgreSQL', navigate);
      },
      keywords: ['extract skills', 'jd parser', 'skills analysis'],
    },

    // Talent Search
    {
      id: 'talent-python',
      category: 'Talent',
      title: 'Find Top Python & ML Candidates',
      subtitle: 'Search candidates with verified Python competencies > 85%',
      icon: Users,
      action: () => {
        setOpen(true);
        sendMessage('Find candidates with Python > 85%', navigate);
      },
      keywords: ['python', 'ml', 'machine learning', 'ai candidates'],
    },
    {
      id: 'talent-react',
      category: 'Talent',
      title: 'Find React & TypeScript Talent',
      subtitle: 'Search candidates with frontend mastery and verified projects',
      icon: Users,
      action: () => {
        setOpen(true);
        sendMessage('Find candidates with React and TypeScript', navigate);
      },
      keywords: ['react', 'typescript', 'frontend', 'ui developers'],
    },
    {
      id: 'talent-nitw',
      category: 'Talent',
      title: 'Campus Talent: NIT Warangal / IITs',
      subtitle: 'Filter tier-1 autonomous university candidate batches',
      icon: Users,
      action: () => {
        setOpen(true);
        sendMessage('Show campus candidates from NIT Warangal or IIT', navigate);
      },
      keywords: ['nit warangal', 'iit', 'campus', 'tier 1', 'college'],
    },

    // System
    {
      id: 'sys-theme',
      category: 'System',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: 'Toggle connect portal theme appearance',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => toggleTheme(),
      keywords: ['theme', 'dark mode', 'light mode', 'appearance', 'toggle'],
    },
  ];

  // Filter commands
  const filtered = ALL_COMMANDS.filter(cmd => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const inTitle = cmd.title.toLowerCase().includes(q);
    const inSubtitle = cmd.subtitle.toLowerCase().includes(q);
    const inKeywords = (cmd.keywords || []).some(k => k.toLowerCase().includes(q));
    return inTitle || inSubtitle || inKeywords;
  });

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered.length > 0 && selectedIndex < filtered.length) {
        runCommand(filtered[selectedIndex].action);
      } else {
        handleAskOrbit();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeCommandPalette();
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={closeCommandPalette}
      />

      {/* Modal Box */}
      <div
        className="relative w-full max-w-2xl bg-[#090d0a] border border-[#06c006]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-scaleIn"
        style={{
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(6, 192, 6, 0.25)',
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Top glow */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#06c006] to-transparent" />

        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-black/40">
          <OrbitLogo size={32} rounded="lg" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or ask Orbit anything (e.g. 'Shortlist Jaswanth', 'Go to jobs', 'Find Python talent')..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-medium"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-white/40 hover:text-white rounded-md transition-colors"
            >
              <X size={15} />
            </button>
          )}

          <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-white/60 text-[10px] font-mono border border-white/10">
            <span>ESC</span>
          </div>
        </div>

        {/* Free-form Ask Orbit Suggestion banner if user typed query */}
        {query.trim() && (
          <div
            onClick={handleAskOrbit}
            className="px-4 py-2.5 bg-[#06c006]/10 border-b border-[#06c006]/20 flex items-center justify-between cursor-pointer hover:bg-[#06c006]/15 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={15} className="text-[#06c006] animate-pulse" />
              <span className="text-xs text-white">
                Ask Orbit AI to execute: <strong className="text-[#06c006]">"{query}"</strong>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#06c006] group-hover:translate-x-1 transition-transform">
              <span>Execute with AI</span>
              <ArrowRight size={13} />
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-white/40">
              <OrbitLogo size={48} className="mx-auto mb-3 opacity-90" />
              <p className="text-sm font-semibold text-white/60">No direct static shortcuts found</p>
              <p className="text-xs mt-1">Press <strong>Enter</strong> to run "{query}" through Orbit's Autonomous AI Engine</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => runCommand(item.action)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#06c006]/15 border border-[#06c006]/40 text-white'
                      : 'hover:bg-white/5 text-white/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#06c006] text-black shadow-[0_0_10px_rgba(6,192,6,0.5)]'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate">{item.title}</span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                            isSelected
                              ? 'bg-[#06c006]/20 text-[#06c006] border-[#06c006]/30'
                              : 'bg-white/5 text-white/40 border-white/10'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight
                    size={15}
                    className={`flex-shrink-0 ml-2 transition-transform ${
                      isSelected ? 'text-[#06c006] translate-x-0.5' : 'text-white/20'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-[10px] mr-1">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-[10px] mr-1">↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono text-[10px] mr-1">↵</kbd>
              Select / Run
            </span>
          </div>
          <span className="text-[#06c006] font-semibold">Orbit AI v2.4 Enabled</span>
        </div>
      </div>
    </div>
  );
}
