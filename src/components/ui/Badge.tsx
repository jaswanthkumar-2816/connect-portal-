import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'orange';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-hiero-card text-hiero-muted border-hiero-border',
    green: 'bg-hiero-green/15 text-hiero-green border-hiero-green/30',
    yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    red: 'bg-red-500/15 text-red-400 border-red-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium border rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}
