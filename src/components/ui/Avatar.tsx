import { getInitials } from '../../lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-hiero-green/30 to-hiero-green/10 border border-hiero-green/20 flex items-center justify-center font-semibold text-hiero-green flex-shrink-0 ${className}`}>
      {getInitials(name)}
    </div>
  );
}
