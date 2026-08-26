import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Candidate } from '../../types';
import MatchScore from './MatchScore';

interface CandidateCardProps {
  candidate: Candidate;
  matchScore: number;
  matchingSkills: { name: string; score: number }[];
  matchExplanation?: string;
  onShortlist?: (candidateId: string) => void;
  isShortlisted?: boolean;
}

export default function CandidateCard({ candidate, matchScore, matchingSkills, matchExplanation, onShortlist, isShortlisted }: CandidateCardProps) {
  const highMatch = matchScore >= 85;

  return (
    <div className={`cp-card border rounded-2xl p-5 transition-all duration-300 group ${
      highMatch
        ? 'border-[#06c006]/30 hover:border-[#06c006]/50'
        : 'border-[var(--color-border)] hover:border-[var(--color-border-md)]'
    }`}>
      <div className="flex items-start gap-4">
        <MatchScore score={matchScore} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <Link
                to={`/industry/candidate/${candidate.id}`}
                className="text-lg font-bold text-[var(--color-text)] hover:text-[#06c006] transition-colors"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {candidate.name}
              </Link>
              <p className="text-sm text-[var(--color-muted)] font-medium mt-0.5">{candidate.headline}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-muted)] font-semibold">
                <span className="flex items-center gap-1"><MapPin size={12} />{candidate.location}</span>
                {candidate.education[0] && (
                  <span>{candidate.education[0].institution}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onShortlist && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShortlist(candidate.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isShortlisted
                      ? 'bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30 shadow-sm'
                      : 'border text-[var(--color-muted)] hover:text-[#06c006] hover:bg-[#06c006]/10'
                  }`}
                  style={{
                    background: isShortlisted ? undefined : 'var(--color-surface-2)',
                    borderColor: isShortlisted ? undefined : 'var(--color-border)',
                  }}
                >
                  <Star size={12} className="inline mr-1" fill={isShortlisted ? 'currentColor' : 'none'} />
                  {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                </button>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {matchingSkills.slice(0, 5).map(skill => (
              <span
                key={skill.name}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  skill.score >= 80
                    ? 'bg-[#06c006]/10 text-[#06c006] border-[#06c006]/20'
                    : skill.score >= 60
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}
              >
                {skill.name}
                <span className="opacity-80">{skill.score}%</span>
              </span>
            ))}
          </div>

          {/* Match Explanation */}
          {matchExplanation && (
            <p
              className="mt-3 text-xs text-[var(--color-muted)] font-medium leading-relaxed rounded-xl px-3.5 py-2.5 border"
              style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
            >
              {matchExplanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
