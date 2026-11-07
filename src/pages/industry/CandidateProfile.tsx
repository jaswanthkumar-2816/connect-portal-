import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Mail, Phone, GraduationCap, Award, ExternalLink, Briefcase, FolderGit2, FileText, Sparkles, CheckCircle2, Download, Eye } from 'lucide-react';
import Card from '../../components/ui/Card';
import SkillBar from '../../components/skills/SkillBar';
import PdfResumeModal from '../../components/ui/PdfResumeModal';
import { getCandidateById, getPracticeRecord } from '../../services/hiroService';
import PracticeRecord from '../../components/candidates/PracticeRecord';
import type { Candidate, PracticeRecord as PracticeRecordData } from '../../types';

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [practice, setPractice] = useState<PracticeRecordData | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getCandidateById(id).then(c => {
        setCandidate(c);
        setLoading(false);
        setTimeout(() => setVisible(true), 100);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setPracticeLoading(true);
    getPracticeRecord(id)
      .then(record => {
        if (!cancelled) setPractice(record);
      })
      .catch(() => {
        if (!cancelled) setPractice(null);
      })
      .finally(() => {
        if (!cancelled) setPracticeLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-[#06c006] border-t-transparent rounded-full" /></div>;
  }

  if (!candidate) {
    return <div className="text-center py-20 text-[var(--color-muted)] font-medium">Candidate not found</div>;
  }

  const primaryEdu = candidate.education && candidate.education[0];
  const cgpa = candidate.cgpa ?? primaryEdu?.cgpa;
  const projectCount = candidate.projects?.length ?? 0;
  const expCount = candidate.experience?.length ?? 0;
  const resumeFileName = candidate.resumeUrl ? candidate.resumeUrl.split('/').pop()?.split('?')[0] : null;
  const passingYear = candidate.passingYear || primaryEdu?.endYear;
  const fitScore =
    typeof candidate.score === 'number'
      ? candidate.score
      : typeof (candidate as any)?.matchScore === 'number'
      ? (candidate as any).matchScore
      : typeof (candidate as any)?.hieroScore === 'number'
      ? (candidate as any).hieroScore
      : null;

  return (
    <div className="max-w-4xl space-y-6">
      {/* In-page High-Fidelity PDF Resume Modal */}
      <PdfResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        candidate={candidate}
      />

      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] font-bold transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
      >
        <ArrowLeft size={16} /> Back to Candidates
      </button>

      {/* Profile Header Card */}
      <Card className={`p-8 hiero-hover-glow transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#06c006]/15 border border-[#06c006]/30 flex items-center justify-center text-2xl font-black text-[#06c006] flex-shrink-0" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{candidate.name}</h1>
                <p className="text-[var(--color-muted)] font-medium mt-0.5 text-sm">{candidate.headline}</p>
              </div>

              {typeof fitScore === 'number' ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30 flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> {fitScore}% HIERO Fit Score
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/5 dark:bg-white/5 text-[var(--color-muted)] border border-[var(--color-border)] flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Direct Applicant
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[var(--color-muted)] font-medium">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{candidate.location}</span>
              <span className="flex items-center gap-1.5"><Mail size={14} />{candidate.email}</span>
              {candidate.phone && <span className="flex items-center gap-1.5"><Phone size={14} />{candidate.phone}</span>}
            </div>

            {candidate.aboutMe && <p className="mt-4 text-xs text-[var(--color-text)] font-medium leading-relaxed bg-black/5 dark:bg-white/[0.02] p-3 rounded-xl border border-[var(--color-border)]">{candidate.aboutMe}</p>}
          </div>
        </div>

        {/* Uploaded Application Resume Banner */}
        <div className="mt-6 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-slate-700/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center flex-shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--color-text)] flex items-center gap-1.5">
                Application Resume Document
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${candidate.resumeUrl ? 'bg-[#06c006]/20 text-[#06c006]' : 'bg-black/10 dark:bg-white/10 text-[var(--color-muted)]'}`}>
                  {candidate.resumeUrl ? 'Uploaded via Apply Now' : 'Not attached'}
                </span>
              </div>
              <div className="text-xs font-mono font-semibold text-[#06c006] mt-0.5 truncate max-w-md">
                📄 {resumeFileName || 'No resume file attached'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-[#06c006] text-black hover:bg-[#06c006]/90 transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Eye size={14} /> View Resume File
            </button>
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold border text-[var(--color-text)] flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
              title="Download / Print PDF"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      </Card>

      {/* HIERO Resume Executive Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Academic CGPA</div>
          <div className="text-xl font-black text-[#06c006] mt-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {typeof cgpa === 'number' ? (
              <>
                {cgpa} <span className="text-xs text-[var(--color-muted)] font-normal">/ 10</span>
              </>
            ) : (
              <span className="text-base font-bold text-[var(--color-muted)]">—</span>
            )}
          </div>
          <div className="text-[10px] text-[var(--color-muted)] font-medium mt-0.5 truncate">
            {primaryEdu?.institution || (typeof cgpa === 'number' ? 'Verified Record' : 'No CGPA on file')}
          </div>
        </Card>

        <Card className="p-4 text-center border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Major Projects</div>
          <div className="text-xl font-black text-[var(--color-text)] mt-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {projectCount} <span className="text-xs text-[var(--color-muted)] font-normal">Built</span>
          </div>
          <div className="text-[10px] text-[var(--color-muted)] font-medium mt-0.5">
            {projectCount > 0 ? 'Verified Portfolio' : 'None on file'}
          </div>
        </Card>

        <Card className="p-4 text-center border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Work Experience</div>
          <div className="text-xl font-black text-[var(--color-text)] mt-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {expCount} <span className="text-xs text-[var(--color-muted)] font-normal">{expCount === 1 ? 'Role' : 'Roles'}</span>
          </div>
          <div className="text-[10px] text-[var(--color-muted)] font-medium mt-0.5">
            {expCount > 0 ? 'Internship / Full-time' : 'No prior roles'}
          </div>
        </Card>

        <Card className="p-4 text-center border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">Passing Year</div>
          <div className="text-xl font-black text-[#06c006] mt-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {passingYear || '—'}
          </div>
          <div className="text-[10px] text-[var(--color-muted)] font-medium mt-0.5">
            {passingYear ? 'Graduating Class' : 'Not specified'}
          </div>
        </Card>
      </div>

      {/* Practice record — what the student did on HIERO before applying */}
      <Card className={`p-6 hiero-hover-glow transition-all duration-600 delay-75 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <PracticeRecord record={practice} loading={practiceLoading} variant="page" />
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills & Competency */}
        <Card className={`p-6 hiero-hover-glow transition-all duration-600 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-5 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <Award size={18} className="text-[#06c006]" />
            Verified Skills & Competency
          </h2>
          <div className="space-y-4">
            {candidate.skills && candidate.skills.length > 0 ? (
              candidate.skills.map((skill, i) => (
                <div key={skill.name} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <SkillBar name={skill.name} competency={skill.competency} verified={skill.verified} />
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--color-muted)] font-medium">No verified skills on file.</p>
            )}
          </div>
        </Card>

        {/* Education */}
        <Card className={`p-6 hiero-hover-glow transition-all duration-600 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-5 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <GraduationCap size={18} className="text-[#06c006]" />
            Education & CGPA
          </h2>
          <div className="space-y-4">
            {candidate.education && candidate.education.length > 0 ? (
              candidate.education.map((edu, i) => (
                <div key={i} className="p-4 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[var(--color-text)]">{edu.institution}</p>
                    {typeof edu.cgpa === 'number' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#06c006]/20 text-[#06c006] border border-[#06c006]/30">
                        CGPA: {edu.cgpa}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-muted)] font-medium mt-1">{edu.degree} in {edu.field}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-muted)] font-medium">
                    <span>Batch: {edu.startYear} - {edu.endYear}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[var(--color-muted)] font-medium">No education history on file.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Projects Portfolio */}
      {candidate.projects && candidate.projects.length > 0 && (
        <Card className={`p-6 hiero-hover-glow transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <FolderGit2 size={18} className="text-[#06c006]" />
            Projects Portfolio ({candidate.projects.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {candidate.projects.map((proj, i) => (
              <div key={i} className="p-4 rounded-xl border bg-black/5 dark:bg-white/[0.02] border-slate-700/20 space-y-2">
                <div className="font-bold text-sm text-[var(--color-text)]">{proj.title}</div>
                <p className="text-xs text-[var(--color-muted)] font-medium leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(proj.skills || (proj.tech ? proj.tech.split(',').map(s => s.trim()) : [])).map(s => (
                    <span key={s} className="tag-skill-green text-[10px] px-2 py-0.5 rounded-md font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Work Experience */}
      {candidate.experience && candidate.experience.length > 0 && (
        <Card className={`p-6 hiero-hover-glow transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-lg font-bold text-[var(--color-text)] mb-4 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <Briefcase size={18} className="text-[#06c006]" />
            Work Experience & Internships
          </h2>
          <div className="space-y-3">
            {candidate.experience.map((exp, i) => (
              <div key={i} className="p-4 rounded-xl border bg-black/5 dark:bg-white/[0.02] border-slate-700/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--color-text)]">{exp.role}</span>
                  <span className="text-xs font-semibold text-[#06c006]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-xs font-bold text-[var(--color-muted)]">{exp.company}</div>
                <p className="text-xs text-[var(--color-muted)] font-medium leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
