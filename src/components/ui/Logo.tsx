interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showGlow?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { img: 'w-8 h-8',   textImg: 'h-4',  sub: 'text-[8px]' },
  md: { img: 'w-11 h-11', textImg: 'h-6',  sub: 'text-[9px]' },
  lg: { img: 'w-16 h-16', textImg: 'h-9',  sub: 'text-[10px]' },
  xl: { img: 'w-32 h-32', textImg: 'h-16', sub: 'text-xs' },
};

const gapMap = {
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
  xl: 'gap-3',
};

export default function Logo({ size = 'md', showText = true, showGlow = true, className = '' }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center ${gapMap[size]} ${className}`}>
      <img
        src="/logo.png"
        alt="Connect"
        className={`${config.img} object-contain flex-shrink-0 ${showGlow ? 'hiero-logo-glow' : ''}`}
      />
      {showText && (
        <div className="leading-none">
          <img
            src="/connect_text.png"
            alt="CONNECT"
            className={`${config.textImg} object-contain`}
          />
          {size !== 'sm' && (
            <div className={`${config.sub} tracking-[0.18em] uppercase mt-1`} style={{ color: 'var(--color-muted)' }}>
              Industry Portal
            </div>
          )}
        </div>
      )}
    </div>
  );
}
