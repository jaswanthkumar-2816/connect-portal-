const ORBIT_LOGO_SRC = '/brand/orbit-logo.jpg';

type OrbitLogoProps = {
  size?: number;
  className?: string;
  rounded?: 'full' | 'xl' | 'lg';
  alt?: string;
};

export default function OrbitLogo({
  size = 40,
  className = '',
  rounded = 'full',
  alt = 'Orbit',
}: OrbitLogoProps) {
  const radius = rounded === 'full' ? '9999px' : rounded === 'xl' ? '12px' : '10px';
  return (
    <img
      src={ORBIT_LOGO_SRC}
      alt={alt}
      width={size}
      height={size}
      className={`object-cover flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        boxShadow: '0 0 0 1px rgba(6,192,6,0.35), 0 0 14px rgba(6,192,6,0.25)',
      }}
      draggable={false}
    />
  );
}
