import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Sparkles, ArrowLeft, ArrowRight, CheckCircle2,
  FileText, Wand2, Loader2, Rocket, Zap, Copy
} from 'lucide-react';
import SkillExtraction from '../../components/skills/SkillExtraction';
import { extractSkillsFromJD, createOpportunity } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import type { SkillRequirement } from '../../types';

const STEP_CONFIG = [
  { id: 1, label: 'Job Details', icon: FileText, desc: 'Set role info & JD' },
  { id: 2, label: 'Skill Extraction', icon: Wand2, desc: 'HIERO AI analyzes' },
  { id: 3, label: 'Review & Publish', icon: Rocket, desc: 'Go live' },
];

const SAMPLE_PRESETS = [
  {
    id: 'sde_intern',
    name: 'SDE Intern',
    type: 'internship',
    title: 'Software Development Engineer Intern',
    department: 'Core Engineering',
    location: 'Bangalore, India',
    workMode: 'hybrid',
    employmentType: 'Internship',
    salary: '₹35,000/month',
    deadline: '2026-10-30',
    eligibility: 'B.Tech / BE in CS / IT (2025/2026 Batch)',
    description: `We are seeking a high-caliber Software Development Engineer Intern to join our core engineering team. In this role, you will build scalable web applications and REST APIs using modern technologies.

Key Responsibilities:
- Design and develop clean, maintainable code in Python, React, and TypeScript.
- Build and consume REST APIs using Node.js and Express.
- Collaborate with senior engineers to implement relational database models using PostgreSQL and MySQL.
- Use Git and GitHub for version control and workflow collaboration.
- Write unit tests and participate in technical design reviews.

Requirements & Skills:
- Strong proficiency in JavaScript, TypeScript, React, and Python.
- Hands-on experience with Node.js, REST APIs, and SQL databases.
- Familiarity with Git, Linux command line, and Docker containers.
- Strong problem-solving skills and algorithmic thinking.`,
  },
  {
    id: 'aiml_engineer',
    name: 'AI/ML Engineer',
    type: 'full-time',
    title: 'AI / Machine Learning Engineer',
    department: 'Artificial Intelligence & Data',
    location: 'Hyderabad, India',
    workMode: 'hybrid',
    employmentType: 'Full-time',
    salary: '₹14 - 18 LPA',
    deadline: '2026-11-15',
    eligibility: 'B.Tech / M.Tech in CS / AI / Data Science',
    description: `We are hiring an AI / Machine Learning Engineer to design and deploy state-of-the-art machine learning models and LLM solutions.

Key Responsibilities:
- Build, train, and evaluate machine learning models using PyTorch, TensorFlow, and scikit-learn.
- Optimize deep learning inference pipelines for production deployment.
- Integrate LLM APIs, RAG (Retrieval-Augmented Generation), and vector databases.
- Perform data preprocessing, feature engineering, and SQL analytics.
- Collaborate with cloud platform engineers to deploy ML pipelines on AWS and Docker containers.

Requirements & Skills:
- Deep expertise in Python, PyTorch, TensorFlow, and Computer Vision / NLP algorithms.
- Solid understanding of SQL, REST APIs, Docker, and AWS cloud infrastructure.
- Strong mathematical background in Linear Algebra, Calculus, and Probability.`,
  },
  {
    id: 'data_analyst',
    name: 'Data Analyst',
    type: 'full-time',
    title: 'Senior Data & Analytics Specialist',
    department: 'Analytics & Insights',
    location: 'Pune, India',
    workMode: 'on-site',
    employmentType: 'Full-time',
    salary: '₹10 - 14 LPA',
    deadline: '2026-10-15',
    eligibility: 'B.Tech / MCA / B.Stat (0-2 years exp)',
    description: `Join our analytics team to transform complex enterprise datasets into actionable data dashboards and business intelligence models.

Key Responsibilities:
- Build automated ETL data pipelines and complex analytical queries using SQL and Python.
- Create interactive business dashboards in Tableau and Power BI.
- Perform statistical analysis, hypothesis testing, and trend forecasting.
- Collaborate with cross-functional product teams to define key performance metrics.

Requirements & Skills:
- Strong proficiency in SQL, Python, Tableau, and Excel.
- Knowledge of R, Statistics, Data Warehousing, and Machine Learning basics.`,
  },
  {
    id: 'devops_cloud',
    name: 'DevOps & Cloud',
    type: 'full-time',
    title: 'DevOps & Cloud Infrastructure Engineer',
    department: 'Platform Engineering',
    location: 'Remote, India',
    workMode: 'remote',
    employmentType: 'Full-time',
    salary: '₹15 - 22 LPA',
    deadline: '2026-12-01',
    eligibility: 'B.Tech in CS/IT (1-4 years exp)',
    description: `Architect and manage robust cloud infrastructure and automated CI/CD pipelines for our global microservices architecture.

Key Responsibilities:
- Provision and maintain scalable AWS cloud environments using Infrastructure as Code (Terraform).
- Manage Docker containers and Kubernetes clusters across staging and production.
- Build resilient CI/CD pipelines using GitHub Actions and Jenkins.
- Monitor system reliability, uptime, and security metrics using Prometheus and Grafana.

Requirements & Skills:
- Advanced skills in AWS, Docker, Kubernetes, Linux, and Terraform.
- Scripting knowledge in Python, Bash, and Shell.`,
  },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">{children}</label>;
}

export default function CreateJob() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<{ core: SkillRequirement[]; additional: SkillRequirement[] } | null>(null);
  const [published, setPublished] = useState(false);
  const [filledNotice, setFilledNotice] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'internship', title: '', department: '', location: '', workMode: 'hybrid',
    employmentType: 'Internship', salary: '', deadline: '', eligibility: '', description: '',
  });

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const applySamplePreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setFormData({
      type: preset.type,
      title: preset.title,
      department: preset.department,
      location: preset.location,
      workMode: preset.workMode,
      employmentType: preset.employmentType,
      salary: preset.salary,
      deadline: preset.deadline,
      eligibility: preset.eligibility,
      description: preset.description,
    });
    setFilledNotice(`Loaded "${preset.name}" sample data!`);
    setTimeout(() => setFilledNotice(null), 3000);
  };

  const handleExtractSkills = async () => {
    if (!formData.description.trim()) return;
    setIsAnalyzing(true);
    setStep(2);
    const result = await extractSkillsFromJD(formData.description);
    setExtractedSkills({
      core: result.coreSkills.map(s => ({ ...s, category: s.category as 'required' })),
      additional: result.additionalSkills.map(s => ({ ...s, category: s.category as 'preferred' })),
    });
    setIsAnalyzing(false);
  };

  const handlePublish = async () => {
    if (user?.companyId) {
      await createOpportunity(
        {
          type: formData.type as any,
          title: formData.title || 'Software Developer Intern',
          department: formData.department || 'Engineering',
          description: formData.description,
          location: formData.location || 'Bangalore, India',
          workMode: formData.workMode as any,
          employmentType: formData.employmentType,
          salary: formData.salary || '₹25,000/mo',
          deadline: formData.deadline || '2026-10-30',
          eligibility: formData.eligibility || 'B.Tech/MCA',
          companyName: (user as any)?.companyName || 'Verified HR Partner',
          requiredSkills: extractedSkills?.core || [],
          preferredSkills: extractedSkills?.additional || [],
        },
        user.companyId
      );
    }
    setPublished(true);
    setTimeout(() => navigate('/industry/jobs'), 2200);
  };

  const inputStyle = {
    background: 'var(--color-input-bg)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  };

  return (
    <div className="max-w-3xl space-y-6 font-sans">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="hiero-btn-ghost text-sm px-0 font-bold">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>Create Opportunity</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">Post a job or internship and let HIERO match the best candidates.</p>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-0 p-1.5 rounded-2xl border"
        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        {STEP_CONFIG.map((s) => {
          const active = step === s.id;
          const done = step > s.id;
          return (
            <div key={s.id} className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'bg-black/5 dark:bg-white/[0.07]' : ''}`}>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? 'bg-[#06c006] text-white'
                    : active
                    ? 'bg-[#06c006]/20 text-[#06c006] border border-[#06c006]/40'
                    : 'bg-black/5 dark:bg-white/5 text-[var(--color-muted)]'
                }`}
              >
                {done ? <CheckCircle2 size={15} /> : s.id}
              </div>
              <div className="hidden sm:block min-w-0">
                <div className={`text-xs font-bold truncate ${active ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)]'}`}>
                  {s.label}
                </div>
                <div className="text-[10px] text-[var(--color-muted)] truncate">{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Published Overlay */}
      {published ? (
        <div className="cp-card rounded-3xl p-10 text-center space-y-4 animate-scale-in border"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="w-16 h-16 rounded-full bg-[#06c006]/15 border-2 border-[#06c006] text-[#06c006] flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Opportunity Published!
          </h2>
          <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
            Your posting is now live across the HIERO ecosystem. HIERO AI is analyzing candidate skill matches.
          </p>
          <div className="pt-2">
            <div className="w-6 h-6 border-2 border-[#06c006]/30 border-t-[#06c006] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[var(--color-muted)] mt-2 font-medium">Redirecting to jobs list...</p>
          </div>
        </div>
      ) : (
        <>
          {/* STEP 1: Job Details */}
          {step === 1 && (
            <div className="cp-card rounded-3xl p-6 sm:p-8 space-y-6 border"
              style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>

              {/* Sample Preset Buttons Bar */}
              <div className="p-4 rounded-2xl border bg-black/5 dark:bg-white/[0.03] border-slate-700/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#06c006] uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={14} /> Quick Auto-Fill Sample Data
                  </span>
                  {filledNotice && (
                    <span className="text-[11px] font-bold text-[#06c006] bg-[#06c006]/15 border border-[#06c006]/30 px-2.5 py-0.5 rounded-full animate-fade-in">
                      ✓ {filledNotice}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applySamplePreset(preset)}
                      className="p-2.5 rounded-xl border border-slate-700/20 bg-black/5 dark:bg-white/[0.02] text-left hover:border-[#06c006] hover:bg-[#06c006]/10 transition-all cursor-pointer group"
                    >
                      <div className="text-xs font-bold text-[var(--color-text)] group-hover:text-[#06c006] truncate">
                        ⚡ {preset.name}
                      </div>
                      <div className="text-[10px] text-[var(--color-muted)] capitalize truncate mt-0.5">
                        {preset.type} · {preset.salary}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Toggle */}
              <div>
                <FieldLabel>Opportunity Type</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'internship', label: 'Internship', desc: 'Stipend based · Fixed duration' },
                    { id: 'full-time', label: 'Full-Time Job', desc: 'Annual CTC · Regular employment' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        update('type', t.id);
                        update('employmentType', t.id === 'internship' ? 'Internship' : 'Full-time');
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        formData.type === t.id
                          ? 'border-[#06c006] bg-[#06c006]/10'
                          : 'border-[var(--color-border)] hover:border-[var(--color-border-md)]'
                      }`}
                      style={{ background: formData.type === t.id ? undefined : 'var(--color-surface-2)' }}
                    >
                      <div className="font-bold text-sm text-[var(--color-text)]">{t.label}</div>
                      <div className="text-xs text-[var(--color-muted)] mt-0.5 font-medium">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Department */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Role Title *</FieldLabel>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => update('title', e.target.value)}
                    placeholder="e.g. Software Developer Intern"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>Department / Team</FieldLabel>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={e => update('department', e.target.value)}
                    placeholder="e.g. Core Engineering"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Location, Mode & Salary */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <FieldLabel>Location</FieldLabel>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => update('location', e.target.value)}
                    placeholder="e.g. Bangalore, India"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>Work Mode</FieldLabel>
                  <select
                    value={formData.workMode}
                    onChange={e => update('workMode', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                    style={inputStyle}
                  >
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>Compensation / Salary</FieldLabel>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={e => update('salary', e.target.value)}
                    placeholder={formData.type === 'internship' ? 'e.g. ₹25,000/mo' : 'e.g. ₹8-12 LPA'}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Eligibility & Deadline */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Eligibility Criteria</FieldLabel>
                  <input
                    type="text"
                    value={formData.eligibility}
                    onChange={e => update('eligibility', e.target.value)}
                    placeholder="e.g. B.Tech/BE CS/IT (2025/2026 Batch)"
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <FieldLabel>Application Deadline</FieldLabel>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={e => update('deadline', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* JD Text */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel>Job Description (JD Text) *</FieldLabel>
                  <span className="text-[11px] text-[#06c006] font-semibold flex items-center gap-1">
                    <Sparkles size={12} /> HIERO AI Skill Parser
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={formData.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Paste the full job description here. HIERO AI will automatically extract required skills, preferred qualifications, and competency weights..."
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006] resize-none"
                  style={inputStyle}
                />
              </div>

              {/* Action */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleExtractSkills}
                  disabled={!formData.description.trim() || !formData.title.trim()}
                  className="hiero-btn-primary text-sm font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 size={16} /> Analyze & Extract Skills <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Skill Extraction */}
          {step === 2 && (
            <div className="space-y-6">
              {isAnalyzing ? (
                <div className="cp-card rounded-3xl p-12 text-center space-y-4 border"
                  style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                  <Loader2 size={40} className="mx-auto text-[#06c006] animate-spin" />
                  <h3 className="text-lg font-bold text-[var(--color-text)]">HIERO AI is Analyzing JD...</h3>
                  <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto font-medium">
                    Extracting technical competencies, skill importance levels, and domain requirements.
                  </p>
                </div>
              ) : (
                extractedSkills && (
                  <>
                    <SkillExtraction
                      coreSkills={extractedSkills.core}
                      additionalSkills={extractedSkills.additional}
                      onChange={(core, add) => setExtractedSkills({ core, additional: add })}
                    />
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="hiero-btn-ghost text-sm font-bold"
                      >
                        <ArrowLeft size={16} /> Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="hiero-btn-primary text-sm font-bold flex items-center gap-2 shadow-lg"
                      >
                        Proceed to Review <ArrowRight size={16} />
                      </button>
                    </div>
                  </>
                )
              )}
            </div>
          )}

          {/* STEP 3: Review & Publish */}
          {step === 3 && (
            <div className="cp-card rounded-3xl p-6 sm:p-8 space-y-6 border"
              style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <div className="border-b border-[var(--color-border)] pb-4">
                <h3 className="text-lg font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Review Opportunity Details
                </h3>
                <p className="text-xs text-[var(--color-muted)] font-medium mt-0.5">Check your role parameters before publishing live.</p>
              </div>

              {/* Summary Grid */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border bg-black/5 dark:bg-white/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-[10px] text-[var(--color-muted)] font-bold uppercase">Role Title</span>
                  <p className="font-bold text-sm text-[var(--color-text)] mt-0.5">{formData.title}</p>
                </div>
                <div className="p-3.5 rounded-xl border bg-black/5 dark:bg-white/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-[10px] text-[var(--color-muted)] font-bold uppercase">Type & Mode</span>
                  <p className="font-bold text-sm text-[var(--color-text)] mt-0.5 capitalize">{formData.type} · {formData.workMode}</p>
                </div>
                <div className="p-3.5 rounded-xl border bg-black/5 dark:bg-white/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-[10px] text-[var(--color-muted)] font-bold uppercase">Location</span>
                  <p className="font-bold text-sm text-[var(--color-text)] mt-0.5">{formData.location || 'Bangalore, India'}</p>
                </div>
                <div className="p-3.5 rounded-xl border bg-black/5 dark:bg-white/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-[10px] text-[var(--color-muted)] font-bold uppercase">Compensation</span>
                  <p className="font-bold text-sm text-[#06c006] mt-0.5">{formData.salary || 'Competitive'}</p>
                </div>
              </div>

              {/* Extracted Skills Summary */}
              {extractedSkills && (
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                    Extracted Required Skills ({extractedSkills.core.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedSkills.core.map(s => (
                      <span key={s.name} className="px-2.5 py-1 rounded-lg text-xs font-semibold tag-skill-green">
                        ✓ {s.name}
                      </span>
                    ))}
                    {extractedSkills.additional.map(s => (
                      <span key={s.name} className="px-2.5 py-1 rounded-lg text-xs font-semibold tag-skill-blue">
                        + {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="hiero-btn-ghost text-sm font-bold"
                >
                  <ArrowLeft size={16} /> Back to Skills
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="hiero-btn-primary text-sm font-bold flex items-center gap-2 shadow-lg"
                >
                  <Rocket size={16} /> Publish Opportunity Now
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
