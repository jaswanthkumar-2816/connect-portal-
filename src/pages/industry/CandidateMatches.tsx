import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, SlidersHorizontal } from 'lucide-react';
import CandidateCard from '../../components/candidates/CandidateCard';
import { getMatchResults, getOpportunityById, getCandidates } from '../../services/hiroService';
import type { MatchResult, Opportunity, Candidate } from '../../types';

export default function CandidateMatches() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<(MatchResult & { candidate?: Candidate })[]>([]);
  const [job, setJob] = useState<Opportunity | null>(null);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const [matchResults, jobData, candidates] = await Promise.all([
        getMatchResults(id),
        getOpportunityById(id),
        getCandidates(),
      ]);
      const enriched = matchResults.map(m => ({
        ...m,
        candidate: candidates.find(c => c.id === m.candidateId),
      }));
      setMatches(enriched);
      setJob(jobData);
      setLoading(false);
      setTimeout(() => setVisible(true), 100);
    };
    load();
  }, [id]);

  const toggleShortlist = (candidateId: string) => {
    setShortlisted(prev => {
      const next = new Set(prev);
      if (next.has(candidateId)) next.delete(candidateId);
      else next.add(candidateId);
      return next;
    });
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
        <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <Users className="text-[#06c006]" />
          HIERO Matched Candidates
        </h1>
        <p className="text-[var(--color-muted)] text-sm mt-1 font-medium">
          {job?.title} — {matches.length} candidate{matches.length !== 1 ? 's' : ''} matched
        </p>
      </div>

      <div className={`flex items-center gap-4 text-sm text-[var(--color-muted)] font-semibold transition-all duration-500 delay-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}>
        <span className="flex items-center gap-1.5"><SlidersHorizontal size={14} /> Sorted by match score</span>
        <span>·</span>
        <span className="text-[#06c006] font-bold">{shortlisted.size} shortlisted</span>
      </div>

      <div className="space-y-4">
        {matches.map((match, i) => {
          const candidate = match.candidate;
          if (!candidate) return null;
          return (
            <div
              key={match.candidateId}
              className={`transition-all duration-600 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${250 + i * 100}ms` }}
            >
              <CandidateCard
                candidate={candidate}
                matchScore={match.overallScore}
                matchingSkills={match.skillMatches}
                matchExplanation={match.matchExplanation}
                onShortlist={toggleShortlist}
                isShortlisted={shortlisted.has(match.candidateId)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
