import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    // enter → hold → exit (extended +2 seconds)
    const t1 = setTimeout(() => setPhase('hold'), 700);
    const t2 = setTimeout(() => setPhase('exit'), 3800);
    const t3 = setTimeout(() => onDone(), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="splash-root"
      style={{
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
        transition: phase === 'exit' ? 'opacity 0.65s ease, transform 0.65s ease' : 'none',
      }}
    >
      {/* Beautiful ambient background */}
      <div className="splash-bg-mesh" />
      <div className="splash-bg-grid" />
      <div className="splash-center-aura" />

      {/* Content — ONLY centered logo image */}
      <div
        className="splash-logo-wrap"
        style={{
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'scale(0.7)' : 'scale(1)',
          transition: 'opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <img
          src="/logo.png"
          alt="Connect"
          className="splash-logo-img"
        />
      </div>
    </div>
  );
}
