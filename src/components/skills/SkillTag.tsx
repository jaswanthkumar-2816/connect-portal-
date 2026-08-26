interface SkillTagProps {
  name: string;
  variant?: 'default' | 'required' | 'preferred';
  size?: 'sm' | 'md';
}

export default function SkillTag({ name, variant = 'default', size = 'sm' }: SkillTagProps) {
  const variantClasses = {
    default: 'bg-hiero-card/50 text-hiero-muted border-hiero-border/50',
    required: 'bg-hiero-green/10 text-hiero-green border-hiero-green/20',
    preferred: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium border rounded-md ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {variant === 'required' && <span className="mr-1">✓</span>}
      {variant === 'preferred' && <span className="mr-1">○</span>}
      {name}
    </span>
  );
}
