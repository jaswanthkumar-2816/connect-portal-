import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import CandidateCard from '../../components/candidates/CandidateCard';
import { getMatchResults, getOpportunityById, getCandidates, getApplications, shortlistCandidate } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import type { Application, MatchResult, Opportunity, Candidate } from '../../types';

type MatchRow = MatchResult & { candidate?: Candidate; application?: Application };

export default function CandidateMatches() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [job, setJob] = useState<Opportunity | null>(null);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const jobId = decodeURIComponent(id);
        const [matchResults, jobData, candidates, apps] = await Promise.all([
          getMatchResults(jobId),
          getOpportunityById(jobId),
          getCandidates(),
          getApplications(user?.companyId),
        ]);
        const related = (apps || []).filter(a =>
          a.opportunityId === jobId || (jobData && a.jobTitle === jobData.title)
        );
        const already = new Set(
          related
            .filter(a => a.status === 'shortlisted' || a.status === 'selected' || a.status === 'interview')
            .map(a => a.studentId)
        );
        const enriched = matchResults.map(m => {
          const app = related.find(a => a.studentId === m.candidateId || a.id === m.candidateId);
          const fromPool = candidates.find(c => c.id === m.candidateId);
          const candidate = fromPool || {
            id: m.candidateId,
            name: app?.studentName || 'Matched candidate',
            email: app?.email || '',
            headline: [app?.department, app?.campusName].filter(Boolean).join(' · ') || (jobData?.title ? `Match for ${jobData.title}` : 'Matched talent'),
            location: app?.campusLocation || 'India',
            skills: m.skillMatches.map(s => ({ name: s.name, competency: s.score, verified: true, lastAssessedAt: new Date().toISOString() })),
            projects: [],
            education: app?.campusName ? [{
              institution: app.campusName,
              degree: 'B.Tech',
              field: app.department || 'Computer Science',
              startYear: 2022,
              endYear: 2026,
              cgpa: app.cgpa,
            }] : [],
            experience: [],
            certifications: [],
            authorizedSections: ['all'],
            cgpa: app?.cgpa,
            phone: app?.phone,
            resumeUrl: app?.resumeUrl,
          } as Candidate;
          return { ...m, candidate, application: app };
        });
        setMatches(enriched);
        setJob(jobData);
        setShortlisted(already);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
        setTimeout(() => setVisible(true), 100);
      }
    };
    load();
  }, [id, user?.companyId]);

  const toggleShortlist = async (candidateId: string) => {
    if (!job || pendingId) return;
    const match = matches.find(m => m.candidateId === candidateId);
    const candidate = match?.candidate;
    if (!candidate) return;
    const next = !shortlisted.has(candidateId);
    setShortlisted(prev => {
      const copy = new Set(prev);
      if (next) copy.add(candidateId);
      else copy.delete(candidateId);
      return copy;
    });
    setPendingId(candidateId);
    try {
      const saved = await shortlistCandidate({
        candidate,
        job,
        matchScore: match.overallScore,
        matchingSkills: match.skillMatches,
        companyId: user?.companyId,
        companyName: (user as { companyName?: string } | null)?.companyName || job.companyName,
        existing: match.application,
        shortlist: next,
      });
      setMatches(prev => prev.map(m => m.candidateId === candidateId ? { ...m, application: saved } : m));
    } catch {
      setShortlisted(prev => {
        const copy = new Set(prev);
        if (next) copy.delete(candidateId);
        else copy.add(candidateId);
        return copy;
      });
    } finally {
      setPendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-[#06c006] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] font-bold transition-all duration-500 ${
          visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className={`transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1
          className="text-[28px] leading-tight font-black tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Matched Candidates
        </h1>
        <p className="text-[var(--color-muted)] text-sm mt-1.5 font-medium">
          {job?.title} — {matches.length} candidate{matches.length !== 1 ? 's' : ''} matched
          {shortlisted.size > 0 ? ` · ${shortlisted.size} shortlisted` : ''}
        </p>
      </div>

      <div className="space-y-4">
        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-3)' }}>
            <Users size={32} className="mx-auto mb-3 text-[var(--color-muted)] opacity-50" />
            <p className="text-sm font-bold text-[var(--color-text)]">No matched candidates yet</p>
            <p className="text-xs text-[var(--color-muted)] mt-1 font-medium">Campus applications from Bridge will appear here as matches.</p>
          </div>
        ) : matches.map((match, i) => {
          const candidate = match.candidate;
          if (!candidate) return null;
          return (
            <div
              key={match.candidateId}
              className={`transition-all duration-600 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${250 + i * 100}ms`, opacity: pendingId === match.candidateId ? 0.7 : undefined }}
            >
              <CandidateCard
                candidate={candidate}
                matchScore={match.overallScore}
                matchingSkills={match.skillMatches}
                matchExplanation={match.matchExplanation}
                onShortlist={toggleShortlist}
                isShortlisted={shortlisted.has(match.candidateId)}
                showSkills={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
