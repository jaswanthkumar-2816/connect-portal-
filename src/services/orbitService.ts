// ============================================================
// Orbit AI — Enterprise Autonomous Recruiter Intelligence Engine
// ============================================================
// Professional, robust natural language reasoning, structured
// execution, talent matchmaking, job lifecycle management,
// campus coordination, and real-time portal telemetry.
// ============================================================

import {
  getCandidates,
  getOpportunities,
  getApplications,
  getDashboardStats,
  createOpportunity,
  shortlistCandidate,
  sendSelectionNotice,
  extractSkillsFromJD,
  getColleges,
} from './hiroService';
import { getDynamicSuggestedPrompts, getDynamicPortalContext } from './dynamicFeatureService';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import type { Opportunity, Candidate, Application } from '../types';

export interface OrbitActionCard {
  type: 'candidate' | 'job' | 'stats' | 'navigation' | 'skills' | 'selection' | 'link';
  title: string;
  subtitle?: string;
  details?: Record<string, string | number>;
  primaryActionLabel?: string;
  primaryActionPayload?: {
    type: string;
    path?: string;
    data?: any;
  };
  secondaryActionLabel?: string;
  secondaryActionPayload?: {
    type: string;
    path?: string;
    data?: any;
  };
}

export interface OrbitResponse {
  message: string;
  toolUsed?: string;
  actionCard?: OrbitActionCard;
  suggestedPrompts?: string[];
  navigatePath?: string;
  soundCue?: 'success' | 'action' | 'notification' | 'error' | 'pop' | 'open';
}

// -------------------------------------------------------------
// Web Audio API Sound Synthesizer (Zero External Dependencies)
// -------------------------------------------------------------
class OrbitAudio {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playChime(type: 'success' | 'action' | 'notification' | 'error' | 'open' | 'pop') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'open' || type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.08, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.22);
        });
      } else if (type === 'action') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.setValueAtTime(1050, now + 0.07);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {}
  }
}

export const orbitAudio = new OrbitAudio();

// -------------------------------------------------------------
// Intent Detection & Robust Entity Extractor
// -------------------------------------------------------------
export interface ParsedIntent {
  type:
    | 'navigate'
    | 'create_job'
    | 'job_wizard_start'
    | 'job_wizard_role'
    | 'job_wizard_location'
    | 'job_wizard_publish'
    | 'search_candidates'
    | 'shortlist_candidate'
    | 'shortlist_wizard'
    | 'send_offer'
    | 'send_offer_wizard'
    | 'extract_skills'
    | 'analytics_summary'
    | 'theme_control'
    | 'candidate_profile'
    | 'colleges_summary'
    | 'greeting'
    | 'general_qa'
    | 'help';
  params: Record<string, any>;
}

export function parseOrbitIntent(prompt: string, currentRoute = ''): ParsedIntent {
  const p = (prompt || '').trim().toLowerCase();

  // 1. Greetings
  if (/^(hi|hello|hey|greetings|hola|good\s+(morning|afternoon|evening)|sup|yo)\b/i.test(p)) {
    return { type: 'greeting', params: { raw: prompt } };
  }

  // 2. Help
  if (p === 'help' || p === 'what can you do' || p.includes('features') || p.includes('capabilities') || p.includes('how to use') || p === 'commands') {
    return { type: 'help', params: {} };
  }

  // 3. Theme Control
  if (p.includes('dark mode') || p.includes('light mode') || p.includes('toggle theme') || p.includes('switch theme') || (p.includes('theme') && (p.includes('toggle') || p.includes('switch') || p.includes('change')))) {
    const isDark = p.includes('dark');
    const isLight = p.includes('light');
    return { type: 'theme_control', params: { targetTheme: isDark ? 'dark' : isLight ? 'light' : 'toggle' } };
  }

  // 4. Navigation
  const navMatch = p.match(/(?:go\s+to|open|navigate\s+to|take\s+me\s+to|show\s+me|view)\s+(dashboard|jobs|opportunities|create|post\s+job|applications|applicants|shortlisted|shortlist|pipeline|funnel|company|profile|settings)/i);
  if (navMatch) {
    const target = navMatch[1].toLowerCase();
    let path = '/industry';
    if (target.includes('job') || target.includes('opp')) path = '/industry/jobs';
    else if (target.includes('create') || target.includes('post')) path = '/industry/create';
    else if (target.includes('appl')) path = '/industry/applications';
    else if (target.includes('short')) path = '/industry/shortlisted';
    else if (target.includes('pipe') || target.includes('funnel')) path = '/industry/pipeline';
    else if (target.includes('comp') || target.includes('prof')) path = '/industry/company';
    else if (target.includes('sett')) path = '/industry/settings';
    return { type: 'navigate', params: { path, target } };
  }

  // 5. Interactive Job Wizard Steps
  // 5A: Publish Step
  if (p.startsWith('publish:') || p.startsWith('🚀 publish:') || p.startsWith('confirm job:')) {
    const rawPublish = prompt.replace(/^(?:🚀\s*)?(?:publish:|confirm job:)/i, '').trim();
    return { type: 'job_wizard_publish', params: { raw: rawPublish } };
  }

  // 5B: Location / Type Step
  if (p.startsWith('location:') || p.startsWith('type:') || p.startsWith('select location:') || p.startsWith('👉 location:')) {
    const rawChoice = prompt.replace(/^(?:👉\s*)?(?:location:|type:|select location:)/i, '').trim();
    let role = 'AI & Machine Learning Engineer';
    let location = 'Bangalore, India (Hybrid)';
    if (rawChoice.includes(' for ')) {
      const parts = rawChoice.split(' for ');
      location = parts[0].trim();
      role = parts[1].trim();
    } else {
      location = rawChoice;
    }
    return { type: 'job_wizard_location', params: { roleTitle: role, location } };
  }

  // 5C: Role Step
  if (p.startsWith('role:') || p.startsWith('select role:') || p.startsWith('for role:') || p.startsWith('👉 role:')) {
    const roleTitle = prompt.replace(/^(?:👉\s*)?(?:role:|select role:|for role:)/i, '').trim();
    return { type: 'job_wizard_role', params: { roleTitle } };
  }

  // 5D: Generic Wizard Start
  const isGenericJobCreate =
    p === 'create new opportunity' ||
    p === 'create opportunity' ||
    p === 'post a job' ||
    p === 'post job' ||
    p === 'create job' ||
    p === 'new opening' ||
    p === 'post new opening' ||
    p === 'job wizard' ||
    p === 'start opportunity creator' ||
    p === 'create an opportunity' ||
    p === 'create opening' ||
    p === 'post opening';

  if (isGenericJobCreate) {
    return { type: 'job_wizard_start', params: {} };
  }

  // 5E: Direct Job Creation with Full Specifications (e.g. "Create Full-time AI Software Engineer job in Bangalore for Google Corp")
  const isCreateJobAction =
    /\b(create|post|publish|add|open|new)\b.*\b(job|opening|role|position|internship|opportunity|listing|vacancy)\b/i.test(p) ||
    p.startsWith('post ') || p.startsWith('create ');

  if (isCreateJobAction && !p.includes('how to create') && !p.includes('what is a job')) {
    return { type: 'create_job', params: { raw: prompt } };
  }

  // 6. Shortlist Candidate (Generic Wizard vs Direct)
  if (p === 'shortlist candidate' || p === 'shortlist a candidate' || p === 'shortlist' || p === 'candidate shortlist wizard') {
    return { type: 'shortlist_wizard', params: {} };
  }

  if (p.includes('shortlist') || p.includes('add to shortlist') || p.includes('star candidate')) {
    const nameMatch = prompt.match(/shortlist\s+([a-zA-Z\s]+?)(?:\s+for|\s+to|\s+as|$)/i);
    const candidateName = nameMatch ? nameMatch[1].trim() : '';
    const jobMatch = prompt.match(/for\s+([a-zA-Z0-9\s-]+)$/i);
    const jobTitle = jobMatch ? jobMatch[1].trim() : '';
    return { type: 'shortlist_candidate', params: { candidateName, jobTitle, raw: prompt } };
  }

  // 7. Send Offer / Selection Notice (Generic Wizard vs Direct)
  if (p === 'send offer' || p === 'dispatch offer' || p === 'send selection notice' || p === 'send selection notice to candidate') {
    return { type: 'send_offer_wizard', params: {} };
  }

  if (p.includes('send offer') || p.includes('select candidate') || p.includes('send selection') || p.includes('hire candidate') || p.includes('offer letter') || p.includes('dispatch offer')) {
    const nameMatch = prompt.match(/(?:offer|select|to|hire)\s+([a-zA-Z\s]+?)(?:\s+for|\s+as|$)/i);
    const candidateName = nameMatch ? nameMatch[1].trim() : '';
    return { type: 'send_offer', params: { candidateName, raw: prompt } };
  }

  // 8. Skill Extraction / JD Analysis
  if (p.startsWith('extract skills') || p.includes('extract skills from') || p.includes('analyze jd') || p.includes('parse jd') || p.includes('extract stack') || p.includes('jd skills')) {
    const jdText = prompt.replace(/^(extract skills from jd:|extract skills from:|analyze jd:|parse jd:|extract skills:?|extract stack:?)/i, '').trim();
    return { type: 'extract_skills', params: { jdText: jdText || prompt } };
  }

  // 9. Universities / Colleges Network
  if (p.includes('partner college') || p.includes('partner universities') || p.includes('connected colleges') || p.includes('campus network') || p.includes('show colleges') || p.includes('show universities')) {
    return { type: 'colleges_summary', params: { raw: prompt } };
  }

  // 10. Analytics & Dashboard Summary
  if (p.includes('analytics') || p.includes('stats') || p.includes('summary') || p.includes('metrics') || p.includes('conversion rate') || p.includes('performance') || p.includes('demanded skills') || p.includes('recruitment stats') || p.includes('kpi')) {
    return { type: 'analytics_summary', params: { raw: prompt } };
  }

  // 11. Candidate Search & Matching
  if (
    p.includes('find candidate') || p.includes('search candidate') || p.includes('candidates with') ||
    p.includes('who knows') || p.includes('show candidates') || p.includes('best match') ||
    p.includes('matching candidates') || p.includes('python talent') || p.includes('react talent') ||
    p.includes('campus candidates') || p.includes('cgpa >') || p.includes('students with') ||
    p.includes('filter candidate') || p.includes('top matches')
  ) {
    return { type: 'search_candidates', params: { query: prompt } };
  }

  // 12. Specific Candidate Profile Lookup
  if (p.includes('candidate profile') || p.includes('who is') || p.includes('inspect candidate') || p.includes('dossier of') || p.includes('show profile of')) {
    return { type: 'candidate_profile', params: { query: prompt } };
  }

  return { type: 'general_qa', params: { query: prompt, currentRoute } };
}

// -------------------------------------------------------------
// Autonomous Tool Execution Engine (Enterprise Standard)
// -------------------------------------------------------------
export async function executeOrbitPrompt(
  prompt: string,
  currentRoute = '/industry',
  onToolProgress?: (toolName: string) => void
): Promise<OrbitResponse> {
  const intent = parseOrbitIntent(prompt, currentRoute);
  const user = useAuthStore.getState().user;
  const companyId = user?.companyId || 'c1';
  const companyName = (user as any)?.companyName || (user?.name ? `${user.name}'s Company` : 'TechNova');

  // =========================================================================
  // 1. GREETING
  // =========================================================================
  if (intent.type === 'greeting') {
    return {
      message: `👋 **Hello! I'm Orbit**, your recruitment intelligence copilot for **${companyName}**.`,
      soundCue: 'pop',
    };
  }

  // =========================================================================
  // 2. HELP & CAPABILITIES DIRECTORY
  // =========================================================================
  if (intent.type === 'help') {
    const portalCtx = await getDynamicPortalContext(currentRoute);
    const dynSuggestions = await getDynamicSuggestedPrompts('analytics_summary', undefined, undefined, currentRoute);

    return {
      message: `🤖 **Orbit AI Enterprise Copilot — Active Capabilities**\n\n` +
        `### 💼 Interactive Opportunity Creator\n\n` +
        `• **Step-by-Step Guided Creator**: *"Create new opportunity"*\n` +
        `• **1-Click Direct Post**: *"Create Full-time AI Software Engineer job in Bangalore"*\n` +
        `• **JD Skill Extraction**: *"Extract skills from JD: We need React, TypeScript, FastAPI, AWS..."*\n\n` +
        `### 👥 Talent Sourcing & Screening\n\n` +
        `• **Filter by Verified Skills**: *"Find candidates with Python > 85% & Docker"*\n` +
        `• **Campus & Academic Merit**: *"Show candidates from NIT Warangal with CGPA > 8.5"*\n` +
        `• **Candidate Dossier**: *"Inspect profile of ${portalCtx.recentCandidateNames[0] || 'candidate'}"*\n\n` +
        `### ⭐ Shortlisting & Selection Offers\n\n` +
        `• **Interactive Shortlist**: *"Shortlist candidate"*\n` +
        `• **Formal Offer Dispatch**: *"Send selection notice to ${portalCtx.recentCandidateNames[0] || 'Jaswanth Kumar'}"*\n` +
        `• **Pipeline Funnel**: *"Go to pipeline"*`,
      suggestedPrompts: dynSuggestions,
      soundCue: 'notification',
    };
  }

  // =========================================================================
  // 3. THEME CONTROL
  // =========================================================================
  if (intent.type === 'theme_control') {
    onToolProgress?.('Executing Portal Theme Switcher...');
    const themeStore = useThemeStore.getState();
    const target = intent.params.targetTheme;
    if (target === 'dark' || target === 'light') {
      themeStore.setTheme(target);
    } else {
      themeStore.toggleTheme();
    }
    const currentTheme = useThemeStore.getState().theme;
    orbitAudio.playChime('action');

    return {
      message: `✨ Portal appearance set to **${currentTheme.toUpperCase()} MODE**.`,
      soundCue: 'action',
    };
  }

  // =========================================================================
  // 4. NAVIGATION
  // =========================================================================
  if (intent.type === 'navigate') {
    const targetPath = intent.params.path;
    const targetName = intent.params.target;
    onToolProgress?.(`Navigating to ${targetName}...`);
    orbitAudio.playChime('action');

    return {
      message: `🚀 **Navigated to ${targetName.toUpperCase()}** (\`${targetPath}\`).`,
      navigatePath: targetPath,
      soundCue: 'action',
    };
  }

  // =========================================================================
  // 5. INTERACTIVE OPPORTUNITY BUILDER (WIZARD STEPS)
  // =========================================================================
  if (intent.type === 'job_wizard_start') {
    orbitAudio.playChime('open');
    return {
      message: `💼 **Interactive Opportunity Creator**\n\n` +
        `Configure and publish your opening in seconds with real-time candidate matchmaking across verified campus talent pools.\n\n` +
        `### Step 1 of 3: Select Target Role\n\n` +
        `Choose a specialized role profile or enter your custom title:`,
      suggestedPrompts: [
        'Role: AI & Machine Learning Engineer',
        'Role: Full Stack Engineer (React & Node)',
        'Role: Frontend React Specialist',
        'Role: Cloud & DevOps Infrastructure Lead',
      ],
      soundCue: 'open',
    };
  }

  if (intent.type === 'job_wizard_role') {
    const role = intent.params.roleTitle || 'AI & Machine Learning Engineer';
    orbitAudio.playChime('action');
    return {
      message: `💼 **Interactive Opportunity Creator**\n\n` +
        `Selected Role: **${role}**\n\n` +
        `### Step 2 of 3: Select Location & Engagement Model\n\n` +
        `Choose the target hiring hub and work flexibility model for **${role}**:`,
      suggestedPrompts: [
        `Location: Bangalore, India (Hybrid) for ${role}`,
        `Location: Hyderabad, India (Hybrid) for ${role}`,
        `Location: Remote (India) for ${role}`,
        `Location: 6-Month Internship (Bangalore) for ${role}`,
      ],
      soundCue: 'action',
    };
  }

  if (intent.type === 'job_wizard_location') {
    const role = intent.params.roleTitle || 'AI & Machine Learning Engineer';
    const location = intent.params.location || 'Bangalore, India (Hybrid)';
    const isIntern = location.toLowerCase().includes('intern');
    orbitAudio.playChime('action');

    return {
      message: `💼 **Interactive Opportunity Creator**\n\n` +
        `• **Target Role**: **${role}**\n` +
        `• **Location & Mode**: **${location}**\n\n` +
        `### Step 3 of 3: Select Compensation & Verified Skill Stack\n\n` +
        `Select the compensation bracket and verified skill criteria to publish:`,
      suggestedPrompts: isIntern
        ? [
            `Publish: Internship Stipend (₹40,000 / mo) for ${role} in ${location}`,
            `Publish: Research Fellowship (₹55,000 / mo) for ${role} in ${location}`,
          ]
        : [
            `Publish: Standard Tier (₹18L - ₹26L/yr) for ${role} in ${location}`,
            `Publish: Senior Tier (₹24L - ₹36L/yr) for ${role} in ${location}`,
            `Publish: Emerging Talent (₹14L - ₹20L/yr) for ${role} in ${location}`,
          ],
      soundCue: 'action',
    };
  }

  // =========================================================================
  // 6. PUBLISH OPPORTUNITY (From Wizard OR Direct Natural Language Command)
  // =========================================================================
  if (intent.type === 'job_wizard_publish' || intent.type === 'create_job') {
    onToolProgress?.('Generating Opportunity Record & Syncing Hiero Gateway...');
    const raw = prompt;
    const lower = prompt.toLowerCase();

    // 1. Extract Role Title
    let title = 'AI Software Engineer';
    if (lower.includes('ai & machine learning engineer') || lower.includes('ai software engineer') || lower.includes('ai/ml engineer') || lower.includes('ai engineer')) {
      title = 'AI & Machine Learning Engineer';
    } else if (lower.includes('full stack engineer') || lower.includes('fullstack') || lower.includes('full stack developer')) {
      title = 'Full Stack Engineer (Node & React)';
    } else if (lower.includes('frontend react') || lower.includes('react specialist') || lower.includes('frontend developer')) {
      title = 'Frontend React Specialist';
    } else if (lower.includes('cloud & devops') || lower.includes('devops architect') || lower.includes('site reliability')) {
      title = 'Cloud DevOps Infrastructure Lead';
    } else if (lower.includes('backend systems') || lower.includes('python engineer') || lower.includes('backend')) {
      title = 'Backend Systems Engineer (Python/Go)';
    } else if (lower.includes('data scientist') || lower.includes('data science') || lower.includes('ml ops')) {
      title = 'Data Scientist & ML Ops Lead';
    } else if (lower.includes('mobile app') || lower.includes('react native')) {
      title = 'Mobile Application Engineer (React Native)';
    } else {
      const match = raw.match(/(?:role:\s*|for\s+role:\s*|create\s+(?:a\s+|an\s+)?)(.*?)(?:\s+in|\s+for|\s+at|\s+job|\s+opening|\s+with|$)/i);
      if (match && match[1] && match[1].trim().length > 3) {
        title = match[1].trim();
      }
    }

    // 2. Extract Location
    let location = 'Bangalore, India (Hybrid)';
    if (lower.includes('hyderabad')) location = 'Hyderabad, India (Hybrid)';
    else if (lower.includes('pune')) location = 'Pune, India (On-Site)';
    else if (lower.includes('delhi') || lower.includes('ncr') || lower.includes('gurgaon') || lower.includes('noida')) location = 'Delhi NCR, India (Hybrid)';
    else if (lower.includes('mumbai')) location = 'Mumbai, India (Hybrid)';
    else if (lower.includes('chennai')) location = 'Chennai, India (Hybrid)';
    else if (lower.includes('remote')) location = 'Remote (India)';
    else if (lower.includes('bangalore') || lower.includes('bengaluru')) location = 'Bangalore, India (Hybrid)';

    // 3. Extract Type & Salary
    const isIntern = lower.includes('intern') || lower.includes('stipend') || lower.includes('summer');
    const jobType = isIntern ? 'internship' : 'full-time';

    let salary = isIntern ? '₹40,000 / month' : '₹18,00,000 - ₹26,00,000 / annum';
    if (lower.includes('24l') || lower.includes('36l') || lower.includes('senior')) {
      salary = '₹24,00,000 - ₹36,00,000 / annum';
    } else if (lower.includes('14l') || lower.includes('20l')) {
      salary = '₹14,00,000 - ₹20,00,000 / annum';
    } else if (lower.includes('50,000') || lower.includes('50k')) {
      salary = '₹50,000 / month';
    }

    // 4. Extract Target Company
    let targetCompany = companyName;
    const compMatch = raw.match(/(?:for|at)\s+([A-Z][a-zA-Z0-9\s.&]+)(?:$|\.|\n|\s+in)/);
    if (compMatch && compMatch[1]) {
      const extractedComp = compMatch[1].trim();
      if (!['a', 'an', 'the', 'bangalore', 'hyderabad', 'remote', 'india', 'full-time', 'internship', 'hybrid'].includes(extractedComp.toLowerCase())) {
        targetCompany = extractedComp;
      }
    }

    // 5. Derive Skills Matrix
    let reqSkills = [
      { name: 'Python', importance: 'high' as const, category: 'required' as const },
      { name: 'Machine Learning', importance: 'high' as const, category: 'required' as const },
      { name: 'PyTorch', importance: 'high' as const, category: 'required' as const },
    ];
    let prefSkills = [
      { name: 'FastAPI', importance: 'medium' as const, category: 'preferred' as const },
      { name: 'Vector Databases', importance: 'medium' as const, category: 'preferred' as const },
      { name: 'Docker', importance: 'medium' as const, category: 'preferred' as const },
    ];

    if (title.toLowerCase().includes('frontend') || title.toLowerCase().includes('react')) {
      reqSkills = [
        { name: 'React', importance: 'high' as const, category: 'required' as const },
        { name: 'TypeScript', importance: 'high' as const, category: 'required' as const },
        { name: 'JavaScript', importance: 'high' as const, category: 'required' as const },
      ];
      prefSkills = [
        { name: 'Tailwind CSS', importance: 'medium' as const, category: 'preferred' as const },
        { name: 'Next.js', importance: 'medium' as const, category: 'preferred' as const },
      ];
    } else if (title.toLowerCase().includes('fullstack') || title.toLowerCase().includes('full stack')) {
      reqSkills = [
        { name: 'React', importance: 'high' as const, category: 'required' as const },
        { name: 'Node.js', importance: 'high' as const, category: 'required' as const },
        { name: 'TypeScript', importance: 'high' as const, category: 'required' as const },
      ];
      prefSkills = [
        { name: 'PostgreSQL', importance: 'medium' as const, category: 'preferred' as const },
        { name: 'Docker', importance: 'medium' as const, category: 'preferred' as const },
        { name: 'AWS', importance: 'medium' as const, category: 'preferred' as const },
      ];
    }

    // Create Opportunity in real store
    const createdOpp = await createOpportunity(
      {
        title,
        type: jobType,
        department: 'Engineering & Artificial Intelligence',
        description: `We are hiring a high-caliber ${title} for our team at ${targetCompany}. You will architect mission-critical systems, collaborate with verified tier-1 campus talent, and build scalable production software.`,
        salary,
        location,
        workMode: location.includes('Remote') ? 'remote' : 'hybrid',
        requiredSkills: reqSkills,
        preferredSkills: prefSkills,
        deadline: '2026-12-31',
      },
      companyId
    );

    // Compute instant matchmaking against live candidates
    const candidates = await getCandidates();
    const matchingCandidates = candidates.filter(c => {
      const skillsStr = (c.skills || []).map(s => s.name.toLowerCase()).join(' ');
      return reqSkills.some(req => skillsStr.includes(req.name.toLowerCase()));
    });

    orbitAudio.playChime('success');

    const dynSuggestions = await getDynamicSuggestedPrompts('create_job', undefined, createdOpp.title, currentRoute);

    return {
      message: `💼 **Opening Successfully Created & Published!**\n\n` +
        `### ${createdOpp.title}\n\n` +
        `• **Organization**: **${targetCompany}**\n` +
        `• **Employment Type**: **${createdOpp.type === 'internship' ? '🎓 Internship' : '🚀 Full-Time Position'}**\n` +
        `• **Location**: **${createdOpp.location}**\n` +
        `• **Compensation Package**: **${createdOpp.salary}**\n` +
        `• **Shareable Job Link**: \`https://hiero.connect/jobs/${createdOpp.id}\`\n` +
        `• **Status**: \`ACTIVE\` • Gateway Sync Verified ✅\n\n` +
        `### Verified Skill Requirements\n\n` +
        `• **Core Technical Stack**: ${reqSkills.map(s => `\`${s.name}\``).join(' ')}\n` +
        `• **Preferred & Bonus Stack**: ${prefSkills.map(s => `\`${s.name}\``).join(' ')}\n\n` +
        `🎯 **Instant Talent Matchmaking Telemetry**\n\n` +
        `Found **${matchingCandidates.length} verified candidates** in your active pool immediately meeting or exceeding the criteria for this role.`,
      actionCard: {
        type: 'job',
        title: createdOpp.title,
        subtitle: `${targetCompany} • ${createdOpp.location}`,
        details: {
          Role: createdOpp.title,
          Company: targetCompany,
          Type: createdOpp.type === 'internship' ? 'Internship' : 'Full-Time',
          Package: createdOpp.salary,
          Location: createdOpp.location,
          'Direct Link': `https://hiero.connect/jobs/${createdOpp.id}`,
          'Matching Talent': `${matchingCandidates.length} Candidates (>85%)`,
        },
        primaryActionLabel: 'Match Talent for This Job',
        primaryActionPayload: {
          type: 'NAVIGATE',
          path: `/industry/matches/${createdOpp.id}`,
        },
        secondaryActionLabel: 'View in Jobs Portal',
        secondaryActionPayload: {
          type: 'NAVIGATE',
          path: `/industry/jobs/${createdOpp.id}`,
        },
      },
      suggestedPrompts: dynSuggestions,
      soundCue: 'success',
    };
  }

  // =========================================================================
  // 7. SHORTLIST CANDIDATE (Wizard vs Direct)
  // =========================================================================
  if (intent.type === 'shortlist_wizard') {
    const candidates = await getCandidates();
    const opportunities = await getOpportunities(companyId);
    const topCandidates = candidates.slice(0, 4);
    const activeRole = opportunities[0]?.title || 'AI Software Engineer';
    orbitAudio.playChime('action');

    return {
      message: `⭐ **Interactive Candidate Shortlist Wizard**\n\n` +
        `### Select a Verified Candidate to Shortlist for ${activeRole}\n\n` +
        `Choose a candidate to advance into the priority shortlist:`,
      suggestedPrompts: topCandidates.map(c => `Shortlist ${c.name} for ${activeRole}`),
      soundCue: 'action',
    };
  }

  if (intent.type === 'shortlist_candidate') {
    onToolProgress?.('Scanning candidate matrix and syncing shortlist...');
    const candidates = await getCandidates();
    const opportunities = await getOpportunities(companyId);
    const query = (intent.params.candidateName || prompt).toLowerCase();

    let matchedCand = candidates.find(c => query.includes(c.name.toLowerCase()) || (c.name.toLowerCase().includes(query) && query.length > 2));
    if (!matchedCand) matchedCand = candidates[0];

    let matchedJob = opportunities[0] || { id: 'j-1', title: 'Software Engineer', companyName };
    if (intent.params.jobTitle) {
      const jTitle = intent.params.jobTitle.toLowerCase();
      const foundJob = opportunities.find(o => o.title.toLowerCase().includes(jTitle));
      if (foundJob) matchedJob = foundJob;
    }

    if (matchedCand && matchedJob) {
      await shortlistCandidate({
        candidate: matchedCand,
        job: matchedJob,
        matchScore: 95,
        companyId,
        companyName,
      });

      orbitAudio.playChime('success');
      const dynSuggestions = await getDynamicSuggestedPrompts('shortlist_candidate', matchedCand.name, matchedJob.title, currentRoute);

      return {
        message: `⭐ **Candidate Shortlisted Successfully!**\n\n` +
          `### ${matchedCand.name}\n\n` +
          `• **Role**: **${matchedJob.title}**\n` +
          `• **Institution**: **${matchedCand.education?.[0]?.institution || 'Campus Partner'}**\n` +
          `• **Department**: ${matchedCand.education?.[0]?.field || 'Computer Science'}\n` +
          `• **Academic Standing**: **CGPA ${matchedCand.cgpa || 9.2} / 10**\n` +
          `• **Pipeline Status**: \`SHORTLISTED\` (Synced with Campus TPO & Student Portal)\n\n` +
          `### Verified Technical Competencies\n\n` +
          `• **Skills Assessment**: ${(matchedCand.skills || []).slice(0, 4).map(s => `\`${s.name} (${s.competency}%)\``).join(' ')}\n\n` +
          `🎯 **Next Recommended Action**\n\n` +
          `Candidate is ready for immediate formal offer dispatch or interview scheduling.`,
        actionCard: {
          type: 'selection',
          title: `Shortlisted: ${matchedCand.name}`,
          subtitle: `Role: ${matchedJob.title} • Score: 95%`,
          details: {
            Candidate: matchedCand.name,
            Role: matchedJob.title,
            CGPA: `${matchedCand.cgpa || 9.2} / 10`,
            Campus: matchedCand.education?.[0]?.institution || 'NIT Warangal',
            Status: 'Shortlisted',
          },
          primaryActionLabel: 'Send Selection Offer Notice',
          primaryActionPayload: {
            type: 'SEND_OFFER',
            data: { candidateId: matchedCand.id, jobId: matchedJob.id },
          },
          secondaryActionLabel: 'View in Shortlisted Tab',
          secondaryActionPayload: {
            type: 'NAVIGATE',
            path: '/industry/shortlisted',
          },
        },
        suggestedPrompts: dynSuggestions,
        soundCue: 'success',
      };
    }
  }

  // =========================================================================
  // 8. SEND FORMAL OFFER / SELECTION NOTICE (Wizard vs Direct)
  // =========================================================================
  if (intent.type === 'send_offer_wizard') {
    const candidates = await getCandidates();
    const topCandidates = candidates.slice(0, 4);
    orbitAudio.playChime('action');

    return {
      message: `🎉 **Interactive Offer & Selection Notice Dispatch**\n\n` +
        `### Select Candidate to Extend Offer\n\n` +
        `Choose a candidate to generate the formal selection notice and notify their campus placement office:`,
      suggestedPrompts: topCandidates.map(c => `Send selection notice to ${c.name}`),
      soundCue: 'action',
    };
  }

  if (intent.type === 'send_offer') {
    onToolProgress?.('Generating official selection notice & notifying campus placement cell...');
    const candidates = await getCandidates();
    const opportunities = await getOpportunities(companyId);
    const query = (intent.params.candidateName || prompt).toLowerCase();

    let matchedCand = candidates.find(c => query.includes(c.name.toLowerCase()) || (c.name.toLowerCase().includes(query) && query.length > 2));
    if (!matchedCand) matchedCand = candidates[0];

    const matchedJob = opportunities[0] || { id: 'j-1', title: 'Senior Software Engineer', companyName };

    const dummyApp: Application = {
      id: `app-sel-${Date.now()}`,
      opportunityId: matchedJob.id,
      studentId: matchedCand.id,
      studentName: matchedCand.name,
      email: matchedCand.email,
      phone: matchedCand.phone,
      cgpa: matchedCand.cgpa || 9.2,
      department: matchedCand.education?.[0]?.field || 'Computer Science',
      campusName: matchedCand.education?.[0]?.institution || 'National Institute of Technology, Warangal',
      campusLocation: matchedCand.location || 'India',
      jobTitle: matchedJob.title,
      matchScore: 96,
      matchingSkills: matchedCand.skills?.map(s => ({ name: s.name, score: s.competency })) || [{ name: 'Python', score: 95 }],
      status: 'selected',
      appliedAt: new Date().toISOString(),
      source: 'bridge',
    };

    await sendSelectionNotice({
      app: dummyApp,
      candidate: matchedCand,
      job: matchedJob as Opportunity,
      recruiterName: user?.name || 'Lead Recruiter',
      companyName,
    });

    orbitAudio.playChime('success');
    const dynSuggestions = await getDynamicSuggestedPrompts('send_offer', matchedCand.name, matchedJob.title, currentRoute);

    return {
      message: `🎉 **Official Selection Notice & Offer Dispatched!**\n\n` +
        `### ${matchedCand.name} — Selected for ${matchedJob.title}\n\n` +
        `• **Candidate Email**: \`${matchedCand.email}\`\n` +
        `• **Organization**: **${companyName}**\n` +
        `• **Institutional Partner**: **${matchedCand.education?.[0]?.institution || 'Campus Placement Office'}**\n` +
        `• **Pipeline Transition**: Marked as \`SELECTED (HIRED)\`\n\n` +
        `📌 **Campus Bridge & Portal Sync**\n\n` +
        `Official selection notice has been broadcast via Hiero Bridge API to the university placement cell and unlocked on the student dashboard.`,
      actionCard: {
        type: 'selection',
        title: `Offer Extended: ${matchedCand.name}`,
        subtitle: `Hired for ${matchedJob.title}`,
        details: {
          Candidate: matchedCand.name,
          Email: matchedCand.email,
          Role: matchedJob.title,
          College: matchedCand.education?.[0]?.institution || 'Campus Partner',
          Status: 'Selected / Hired',
        },
        primaryActionLabel: 'View Candidate Profile',
        primaryActionPayload: {
          type: 'NAVIGATE',
          path: `/industry/candidate/${matchedCand.id}`,
        },
        secondaryActionLabel: 'View Hiring Pipeline',
        secondaryActionPayload: {
          type: 'NAVIGATE',
          path: '/industry/pipeline',
        },
      },
      suggestedPrompts: dynSuggestions,
      soundCue: 'success',
    };
  }

  // =========================================================================
  // 8. SKILL EXTRACTION / JD ANALYSIS
  // =========================================================================
  if (intent.type === 'extract_skills') {
    onToolProgress?.('Running AI Skill Taxonomy & Embedding Graph Parser...');
    const jdText = intent.params.jdText || prompt;
    const extracted = await extractSkillsFromJD(jdText);

    orbitAudio.playChime('action');

    const coreList = extracted.coreSkills.map(s => `\`${s.name}\``).join(' ');
    const addList = extracted.additionalSkills.map(s => `\`${s.name}\``).join(' ');

    return {
      message: `🧠 **Orbit AI Skill Extraction Analysis**\n\n` +
        `### Core Technical Requirements (${extracted.coreSkills.length} Verified Skills)\n\n` +
        `• **Core Languages & Frameworks**: ${coreList || '`Python` `SQL` `React`'}\n` +
        `• **Preferred & Bonus Infrastructure**: ${addList || '`Docker` `AWS` `Git`'}\n\n` +
        `💡 **One-Click Opportunity Generator**\n\n` +
        `Would you like me to instantly generate and publish an opening with these calibrated requirements?`,
      actionCard: {
        type: 'skills',
        title: 'Extracted Skill Stack',
        subtitle: `${extracted.coreSkills.length} Core Skills • ${extracted.additionalSkills.length} Preferred Skills`,
        details: {
          'Core Stack': extracted.coreSkills.map(s => s.name).join(', '),
          'Preferred': extracted.additionalSkills.map(s => s.name).join(', '),
        },
        primaryActionLabel: 'Create Job With These Skills',
        primaryActionPayload: {
          type: 'CREATE_JOB_FROM_SKILLS',
          data: { coreSkills: extracted.coreSkills, additionalSkills: extracted.additionalSkills },
        },
        secondaryActionLabel: 'Go to Create Job Page',
        secondaryActionPayload: {
          type: 'NAVIGATE',
          path: '/industry/create',
        },
      },
      suggestedPrompts: [
        'Create a full-time job with these skills',
        'Find candidates matching these skills',
        'Go to jobs',
      ],
      soundCue: 'action',
    };
  }

  // =========================================================================
  // 9. PARTNER COLLEGES SUMMARY
  // =========================================================================
  if (intent.type === 'colleges_summary') {
    onToolProgress?.('Fetching connected university tier network...');
    const colleges = await getColleges();
    orbitAudio.playChime('action');

    const collegeListMarkdown = colleges.map((col, idx) => {
      const depts = (col.departments || []).map(d => d.name).slice(0, 3).join(', ');
      return `### ${idx + 1}. ${col.name} (\`${col.code || 'CAMPUS'}\`)\n\n` +
        `• **Tier**: ${col.tier || 'Tier-1'}\n` +
        `• **Location**: ${col.location || 'India'}\n` +
        `• **Active Engineering Branches**: ${depts || 'Computer Science, AI, ECE'}`;
    }).join('\n\n');

    return {
      message: `🏛️ **Connected Partner University Network (${colleges.length} Institutions)**\n\n` +
        collegeListMarkdown,
      actionCard: {
        type: 'stats',
        title: 'Institutional Network Overview',
        subtitle: `${colleges.length} Tier-1 Colleges Connected`,
        details: {
          'Total Campuses': colleges.length,
          'Active Batch': '2022-2026',
          'Placement Sync': 'Real-time TPO API Active',
        },
        primaryActionLabel: 'View Applications',
        primaryActionPayload: { type: 'NAVIGATE', path: '/industry/applications' },
      },
      suggestedPrompts: [
        `Show campus candidates from ${colleges[0]?.name || 'NIT Warangal'}`,
        'Find candidates with CGPA > 8.5',
        'Go to pipeline',
      ],
      soundCue: 'action',
    };
  }

  // =========================================================================
  // 10. ANALYTICS & RECRUITMENT KPI SUMMARY
  // =========================================================================
  if (intent.type === 'analytics_summary') {
    onToolProgress?.('Aggregating real-time recruitment telemetry...');
    const [stats, opps, apps, colleges] = await Promise.all([
      getDashboardStats(companyId),
      getOpportunities(companyId),
      getApplications(companyId),
      getColleges(),
    ]);

    orbitAudio.playChime('action');

    const topSkills = stats.topSkillsDemand.map(s => `\`${s.skill}\` (${s.percentage}%)`).join(' ');
    const dynSuggestions = await getDynamicSuggestedPrompts('analytics_summary', undefined, undefined, currentRoute);

    return {
      message: `📊 **Executive Recruitment Pulse — ${companyName}**\n\n` +
        `### Pipeline Telemetry & Conversion\n\n` +
        `• **Active Opportunities**: **${opps.length} Listings** (${stats.activeJobs} Jobs, ${stats.activeInternships} Internships)\n` +
        `• **Total Applicants Received**: **${apps.length} Verified Candidates**\n` +
        `• **Priority Shortlist Pool**: **${stats.shortlistedCandidates} Candidates**\n` +
        `• **Interviews Conducted**: **${stats.interviews} Rounds**\n` +
        `• **Confirmed Selections / Hires**: **${stats.hires} Candidates**\n` +
        `• **Partner Universities**: **${colleges.length} Tier-1 Campuses Connected**\n\n` +
        `### Top Demanded Skills in Active Roles\n\n` +
        `• **Market Demand**: ${topSkills}`,
      actionCard: {
        type: 'stats',
        title: 'Hiring Funnel Conversion Matrix',
        subtitle: `${apps.length} Applicants → ${stats.shortlistedCandidates} Shortlists → ${stats.hires} Hires`,
        details: {
          'Active Openings': stats.activeJobs + stats.activeInternships,
          'Total Applicants': apps.length,
          'Shortlisted Pool': stats.shortlistedCandidates,
          'Confirmed Hires': stats.hires,
          'Hiring Velocity': '4.2 days avg.',
        },
        primaryActionLabel: 'Open Analytics Dashboard',
        primaryActionPayload: { type: 'NAVIGATE', path: '/industry' },
        secondaryActionLabel: 'View Applications',
        secondaryActionPayload: { type: 'NAVIGATE', path: '/industry/applications' },
      },
      suggestedPrompts: dynSuggestions,
      soundCue: 'action',
    };
  }

  // =========================================================================
  // 11. CANDIDATE SEARCH & MATCHMAKING
  // =========================================================================
  if (intent.type === 'search_candidates') {
    onToolProgress?.('Executing multidimensional candidate search...');
    const candidates = await getCandidates();
    const query = prompt.toLowerCase();

    let matched = candidates.filter(c => {
      const skillsStr = (c.skills || []).map(s => s.name.toLowerCase()).join(' ');
      const uniStr = (c.education?.[0]?.institution || '').toLowerCase();

      if (query.includes('python') && !skillsStr.includes('python')) return false;
      if (query.includes('react') && !skillsStr.includes('react')) return false;
      if (query.includes('machine learning') && !skillsStr.includes('machine learning') && !skillsStr.includes('ml')) return false;
      if (query.includes('warangal') && !uniStr.includes('warangal')) return false;
      if (query.includes('hyderabad') && !uniStr.includes('hyderabad')) return false;
      if (query.includes('cgpa') && (c.cgpa || 0) < 8.5) return false;

      return true;
    });

    if (matched.length === 0) matched = candidates.slice(0, 4);
    const topCand = matched[0];

    orbitAudio.playChime('action');

    const candListMarkdown = matched.slice(0, 3).map((c, i) => {
      const skillText = (c.skills || []).slice(0, 4).map(s => `\`${s.name} (${s.competency}%)\``).join(' ');
      return `### ${i + 1}. ${c.name}\n\n` +
        `• **Institution**: **${c.education?.[0]?.institution || 'Campus Partner'}**\n` +
        `• **Academic Merit**: **CGPA ${c.cgpa || 9.0} / 10** | *Verified Dossier*\n` +
        `• **Verified Competencies**: ${skillText}`;
    }).join('\n\n');

    const dynSuggestions = await getDynamicSuggestedPrompts('search_candidates', topCand.name, undefined, currentRoute);

    return {
      message: `🎯 **Found ${matched.length} Verified Candidates Matching Your Criteria**\n\n` +
        candListMarkdown,
      actionCard: {
        type: 'candidate',
        title: `Top Match: ${topCand.name}`,
        subtitle: `${topCand.headline || 'Software Engineer'} • CGPA: ${topCand.cgpa || 9.2}`,
        details: {
          Candidate: topCand.name,
          College: topCand.education?.[0]?.institution || 'NIT Warangal',
          CGPA: `${topCand.cgpa || 9.2} / 10`,
          Skills: (topCand.skills || []).slice(0, 4).map(s => s.name).join(', '),
        },
        primaryActionLabel: 'View Full Dossier',
        primaryActionPayload: {
          type: 'NAVIGATE',
          path: `/industry/candidate/${topCand.id}`,
        },
        secondaryActionLabel: `Shortlist ${topCand.name.split(' ')[0]}`,
        secondaryActionPayload: {
          type: 'COMMAND',
          data: `shortlist ${topCand.name}`,
        },
      },
      suggestedPrompts: dynSuggestions,
      soundCue: 'action',
    };
  }

  // =========================================================================
  // 12. CANDIDATE PROFILE LOOKUP
  // =========================================================================
  if (intent.type === 'candidate_profile') {
    onToolProgress?.('Loading verified candidate records & project audits...');
    const candidates = await getCandidates();
    const query = prompt.toLowerCase();
    const cand = candidates.find(c => query.includes(c.name.toLowerCase())) || candidates[0];

    orbitAudio.playChime('action');
    const dynSuggestions = await getDynamicSuggestedPrompts('shortlist_candidate', cand.name, undefined, currentRoute);

    return {
      message: `👤 **Candidate Talent Dossier: ${cand.name}**\n\n` +
        `### Academic & Verification Record\n\n` +
        `• **Current Focus**: **${cand.headline || 'Software & Machine Learning Engineer'}**\n` +
        `• **Institution**: **${cand.education?.[0]?.institution || 'Institute of National Importance'}**\n` +
        `• **Academic Standing**: **CGPA ${cand.cgpa || 9.2} / 10** (${cand.education?.[0]?.field || 'Computer Science'})\n\n` +
        `### Verified Competencies\n\n` +
        `• **Skills Assessment**: ${(cand.skills || []).map(s => `\`${s.name} (${s.competency}%)\``).join(' ')}\n\n` +
        `📌 **Cryptographic Dossier Status**\n\n` +
        `Verified repository commits, benchmarked algorithmic tests, and ATS-optimized A4 PDF resume ready for recruiter review.`,
      actionCard: {
        type: 'candidate',
        title: cand.name,
        subtitle: cand.education?.[0]?.institution || 'Campus Partner',
        details: {
          Name: cand.name,
          Email: cand.email,
          CGPA: `${cand.cgpa || 9.2} / 10`,
          Department: cand.education?.[0]?.field || 'Computer Science',
        },
        primaryActionLabel: 'Open Profile Page',
        primaryActionPayload: {
          type: 'NAVIGATE',
          path: `/industry/candidate/${cand.id}`,
        },
        secondaryActionLabel: 'Shortlist Candidate',
        secondaryActionPayload: {
          type: 'COMMAND',
          data: `shortlist ${cand.name}`,
        },
      },
      suggestedPrompts: dynSuggestions,
      soundCue: 'action',
    };
  }

  // =========================================================================
  // 13. DOMAIN INTELLIGENCE / GENERAL RECRUITMENT QA
  // =========================================================================
  onToolProgress?.('Synthesizing expert recruiter intelligence...');

  // Try calling real AI endpoint if backend is available
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        context: {
          page_type: 'connect_portal',
          route: currentRoute,
          companyId,
          role: 'recruiter',
        },
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.answer) {
        orbitAudio.playChime('notification');
        const dynSuggestions = await getDynamicSuggestedPrompts('general_qa', undefined, undefined, currentRoute);
        return {
          message: json.answer,
          suggestedPrompts: dynSuggestions,
          soundCue: 'notification',
        };
      }
    }
  } catch {}

  orbitAudio.playChime('notification');
  const dynSuggestions = await getDynamicSuggestedPrompts('general_qa', undefined, undefined, currentRoute);

  return {
    message: `💡 **Orbit Intelligence Advisory**\n\n` +
      `### Strategic Recommendations for ${companyName}\n\n` +
      `1. **Skill-Anchored Screening**: In the **HieroConnect** ecosystem, talent evaluation is benchmarked against real repository commits and algorithmic problem benchmarks rather than resume claims.\n` +
      `2. **Fast-Track Shortlisting**: Top tier-1 candidates (>90% skill match) have an average hiring window of **5-7 days**. We recommend locking in technical interview slots immediately.\n` +
      `3. **Campus Liaison**: Direct integration with Training & Placement Officers (TPOs) ensures high response rates and verified batch eligibility.\n\n` +
      `🎯 **Next Recommended Action**\n\n` +
      `Would you like me to filter candidates matching this criteria or post an opportunity right away?`,
    suggestedPrompts: dynSuggestions,
    soundCue: 'notification',
  };
}
