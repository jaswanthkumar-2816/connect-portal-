interface SkillBarProps {
  name: string;
  competency: number;
  verified?: boolean;
  showLabel?: boolean;
}

export default function SkillBar({ name, competency, verified, showLabel = true }: SkillBarProps) {
  const getColor = (score: number) => {
    if (score >= 85) return 'bg-hiero-green';
    if (score >= 70) return 'bg-yellow-400';
    if (score >= 50) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getGlow = (score: number) => {
    if (score >= 85) return 'shadow-[0_0_8px_rgba(0,255,102,0.3)]';
    return '';
  };

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-white font-medium">{name}</span>
          <div className="flex items-center gap-2">
            {verified && (
              <div className="flex items-center gap-0.5 text-hiero-green">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span className="text-[9px] uppercase tracking-wider font-medium">Verified</span>
              </div>
            )}
            <span className="text-sm text-hiero-muted font-medium">{competency}%</span>
          </div>
        </div>
      )}
      <div className="w-full h-2 bg-hiero-dark-3 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getColor(competency)} ${getGlow(competency)}`}
          style={{ width: `${competency}%` }}
        />
      </div>
    </div>
  );
}
