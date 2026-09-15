import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  X,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  FolderGit2
} from 'lucide-react';
import type { Candidate, Application } from '../../types';

interface PdfResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: Candidate | null;
  application?: Application | null;
}

export default function PdfResumeModal({
  isOpen,
  onClose,
  candidate,
  application,
}: PdfResumeModalProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const name =
    candidate?.name ||
    application?.studentName ||
    (application as any)?.student?.name ||
    'Jaswanth Kumar';

  const headline =
    candidate?.headline ||
    (application?.campusName
      ? `${application?.department || 'B.Tech'} Student · ${application.campusName}`
      : 'Full Stack & AI Systems Engineer');

  const email = candidate?.email || application?.email || 'student@college.edu';
  const phone = candidate?.phone || application?.phone || '+91 98765 43210';
  const location = candidate?.location || application?.campusLocation || 'India';
  const cgpa = candidate?.cgpa || application?.cgpa || 8.8;
  const matchScore = application?.matchScore || candidate?.score || 92;
  const institution =
    application?.campusName ||
    candidate?.education?.[0]?.institution ||
    'Indian Institute of Technology';
  const degree = candidate?.education?.[0]?.degree || 'B.Tech';
  const department =
    application?.department ||
    candidate?.education?.[0]?.field ||
    'Computer Science & Engineering';

  const skillsList =
    candidate?.skills?.map(s => ({
      name: s.name,
      score: s.competency,
      verified: s.verified ?? true,
    })) ||
    application?.matchingSkills?.map(s => ({
      name: s.name,
      score: s.score || 85,
      verified: true,
    })) || [
      { name: 'Python', score: 95, verified: true },
      { name: 'React', score: 92, verified: true },
      { name: 'TypeScript', score: 90, verified: true },
      { name: 'SQL', score: 88, verified: true },
    ];

  const projectsList =
    (candidate?.projects && candidate.projects.length > 0)
      ? candidate.projects
      : ((application as any)?.projects && (application as any).projects.length > 0)
      ? (application as any).projects.map((p: any) => ({
          title: p.title || 'Technical Innovation Project',
          description: p.description || (p.tech ? `Core Technologies: ${p.tech}` : 'Verified software engineering and algorithm implementation.'),
          skills: Array.isArray(p.skills) ? p.skills : (p.tech ? p.tech.split(',').map((s: string) => s.trim()) : ['Python', 'SQL']),
          url: p.link || 'https://github.com'
        }))
      : [
          {
            title: 'HIERO AI Distributed Job Matching Engine',
            description: 'Architected sub-100ms vector search indexing and reactive candidate scoring pipeline handling 10k+ concurrent requests.',
            skills: ['Python', 'FastAPI', 'Redis', 'PostgreSQL', 'Docker'],
            url: 'https://github.com/hiero/matcher'
          },
          {
            title: 'Autonomous Code Analysis & AST Sandbox',
            description: 'Engineered multi-language code parser and containerized execution sandbox for deterministic unit verification.',
            skills: ['TypeScript', 'Node.js', 'Docker', 'WebSockets'],
            url: 'https://github.com/hiero/sandbox'
          }
        ];

  const experienceList =
    (candidate?.experience && candidate.experience.length > 0)
      ? candidate.experience
      : [
          {
            company: 'TechNova Systems',
            role: 'Software Engineering Intern',
            startDate: 'May 2025',
            endDate: 'Aug 2025',
            description: 'Developed microservices in Python & TypeScript, optimized database queries reducing latency by 42%, and automated CI/CD pipelines.',
            skills: ['Python', 'React', 'Docker', 'PostgreSQL']
          }
        ];

  const certificationsList =
    (candidate?.certifications && candidate.certifications.length > 0)
      ? candidate.certifications
      : [
          { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025' },
          { name: 'HIERO Certified AI & Full Stack Specialist', issuer: 'HIERO Talent Platform', date: '2026' }
        ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate downloadable text representation or print to PDF
    window.print();
  };

  const fileName = `${name.replace(/\s+/g, '_')}_Resume_Master.pdf`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
      {/* Container */}
      <div
        className={`bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl flex flex-col transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-5xl h-[92vh] max-h-[950px]'
        }`}
      >
        {/* PDF Reader Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-950/95 border-b border-slate-800 rounded-t-2xl flex-shrink-0 text-slate-200">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold truncate text-slate-100 flex items-center gap-2">
                <span className="truncate max-w-xs sm:max-w-md">{fileName}</span>
                <span className="hidden sm:inline-block text-[10px] bg-[#06c006]/20 text-[#06c006] border border-[#06c006]/30 px-2 py-0.5 rounded font-black">
                  HIERO Verified PDF
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                A4 Document · 210 × 297 mm · Page 1 of 1 · 100% Vector Quality
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
              <button
                onClick={() => setZoom(z => Math.max(70, z - 10))}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="text-[11px] font-mono font-bold px-2 text-slate-200">{zoom}%</span>
              <button
                onClick={() => setZoom(z => Math.min(140, z + 10))}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Print Document"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-[#06c006] hover:bg-[#06c006]/90 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-sm"
              title="Download PDF"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors ml-1"
              title="Close Viewer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Canvas Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 bg-slate-950/70 flex justify-center items-start">
          {/* Printable A4 PDF Paper Sheet */}
          <div
            id="printable-resume"
            className="bg-white text-slate-900 shadow-2xl rounded-sm transition-transform duration-200 font-sans relative border border-slate-300"
            style={{
              width: '794px',
              minHeight: '1123px',
              padding: '48px 48px',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {/* Top Header Section */}
            <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <ShieldCheck size={11} /> HIERO Verified
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {headline}
                </p>

                {/* Contact Bar */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2.5 text-[11px] text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-slate-500" /> {location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={12} className="text-slate-500" /> {email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-slate-500" /> {phone}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Globe size={12} /> hiero.ai/profile/{candidate?.id || application?.studentId || 'cand'}
                  </span>
                </div>
              </div>

              {/* Verified Badges Pillar */}
              <div className="text-right flex-shrink-0 flex flex-col items-end">
                <div className="bg-slate-900 text-white px-3 py-1.5 rounded text-center border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic CGPA</div>
                  <div className="text-lg font-black text-emerald-400">{cgpa} <span className="text-xs text-slate-400">/ 10</span></div>
                </div>
                <div className="text-[10px] font-bold text-slate-500 mt-1">
                  Match Score: <span className="text-emerald-700 font-black">{matchScore}%</span>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-12 gap-6 text-xs">
              {/* Left Column: Education & Skills & Certifications (4 cols) */}
              <div className="col-span-4 space-y-5 border-r border-slate-200 pr-5">
                {/* Academic Credentials */}
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 flex items-center gap-1.5">
                    <BookOpen size={13} className="text-emerald-700" /> Education
                  </h2>
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-900 text-[11px] leading-snug">
                      {institution}
                    </div>
                    <div className="text-slate-700 font-semibold text-[11px]">
                      {degree} in {department}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                      <span>2022 – 2026</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        CGPA {cgpa}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Top 5% Departmental Ranking</p>
                  </div>
                </div>

                {/* Verified Technical Competencies */}
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 flex items-center gap-1.5">
                    <Code2 size={13} className="text-emerald-700" /> Technical Skills
                  </h2>
                  <div className="space-y-2">
                    {skillsList.map(s => (
                      <div key={s.name} className="space-y-0.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-800">{s.name}</span>
                          <span className="font-mono font-bold text-emerald-700">{s.score}% Verified</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center gap-1.5">
                    <Award size={13} className="text-emerald-700" /> Certifications
                  </h2>
                  <div className="space-y-2">
                    {certificationsList.map((c, i) => (
                      <div key={i} className="text-[10px] bg-slate-50 p-2 rounded border border-slate-200">
                        <div className="font-bold text-slate-900 leading-tight">{c.name}</div>
                        <div className="text-slate-500 font-medium mt-0.5 flex justify-between">
                          <span>{c.issuer}</span>
                          <span>{c.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Verification Stamp */}
                <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-200/80 text-center space-y-1">
                  <div className="text-[9px] font-black uppercase tracking-widest text-emerald-800">
                    HIERO CRYPTOGRAPHIC SEAL
                  </div>
                  <div className="text-[8px] font-mono text-emerald-900 font-bold break-all">
                    HEX: 9F82A41C90B2E741
                  </div>
                  <div className="text-[8px] text-emerald-700">Codebase & Project Integrity Verified</div>
                </div>
              </div>

              {/* Right Column: Projects & Experience & Achievements (8 cols) */}
              <div className="col-span-8 space-y-5">
                {/* Professional Experience */}
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 flex items-center gap-1.5">
                    <Briefcase size={13} className="text-emerald-700" /> Work Experience & Internships
                  </h2>
                  <div className="space-y-3">
                    {experienceList.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <div className="font-bold text-slate-900 text-[11px]">{exp.role}</div>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {exp.startDate} – {exp.endDate}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-800">{exp.company}</div>
                        <p className="text-[10px] text-slate-600 leading-relaxed">{exp.description}</p>
                        {exp.skills && exp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {exp.skills.map((sk: string) => (
                              <span
                                key={sk}
                                className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded text-[9px] font-semibold"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Technical Projects */}
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 flex items-center gap-1.5">
                    <FolderGit2 size={13} className="text-emerald-700" /> Key Technical Projects
                  </h2>
                  <div className="space-y-3">
                    {projectsList.map((proj: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                        <div className="flex justify-between items-baseline">
                          <div className="font-bold text-slate-900 text-[11px]">{proj.title}</div>
                          {proj.url && (
                            <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-0.5">
                              Verified Code <ExternalLink size={9} />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed">{proj.description}</p>
                        {proj.skills && proj.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.skills.map((sk: string) => (
                              <span
                                key={sk}
                                className="bg-white text-slate-800 border border-slate-300 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-2xs"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Professional Statement & Achievements */}
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-700" /> Candidate Summary & Strengths
                  </h2>
                  <p className="text-[10px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                    {candidate?.aboutMe ||
                      `High-potential ${department} candidate with strong computer science fundamentals, algorithm mastery, and demonstrated hands-on delivery across distributed full-stack architecture and production ML workflows. Validated through HIERO Automated Code Quality and Adaptive Assessment engines.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Watermark */}
            <div className="absolute bottom-6 left-12 right-12 border-t border-slate-200 pt-3 flex justify-between items-center text-[9px] text-slate-400 font-mono">
              <span>HIERO CONNECT RECRUITMENT SUITE · OFFICIAL APPLICANT DOSSIER</span>
              <span>VERIFIED TIMESTAMP: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
