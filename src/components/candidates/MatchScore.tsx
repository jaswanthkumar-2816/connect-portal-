interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function MatchScore({ score, size = 'md' }: MatchScoreProps) {
  const getColor = (s: number) => {
    if (s >= 85) return { text: 'text-hiero-green', ring: 'stroke-hiero-green', bg: 'bg-hiero-green/10', glow: true };
    if (s >= 70) return { text: 'text-yellow-400', ring: 'stroke-yellow-400', bg: 'bg-yellow-400/10', glow: false };
    if (s >= 50) return { text: 'text-orange-400', ring: 'stroke-orange-400', bg: 'bg-orange-400/10', glow: false };
    return { text: 'text-red-400', ring: 'stroke-red-400', bg: 'bg-red-400/10', glow: false };
  };

  const sizeConfig = {
    sm: { dim: 48, stroke: 3, text: 'text-sm', font: 'text-xs' },
    md: { dim: 64, stroke: 4, text: 'text-lg', font: 'text-xs' },
    lg: { dim: 88, stroke: 5, text: 'text-2xl', font: 'text-sm' },
  };

  const colors = getColor(score);
  const config = sizeConfig[size];
  const radius = (config.dim - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl ${colors.bg} ${colors.glow ? 'hiero-logo-glow-sm' : ''}`}
      style={{ width: config.dim, height: config.dim }}
    >
      <svg width={config.dim} height={config.dim} className="absolute -rotate-90">
        <circle
          cx={config.dim / 2} cy={config.dim / 2} r={radius}
          fill="none" stroke="currentColor" strokeWidth={config.stroke}
          className="text-hiero-dark-3"
        />
        <circle
          cx={config.dim / 2} cy={config.dim / 2} r={radius}
          fill="none" strokeWidth={config.stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colors.ring} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className={`font-bold ${colors.text} ${config.text}`}>{score}%</span>
      </div>
    </div>
  );
}
