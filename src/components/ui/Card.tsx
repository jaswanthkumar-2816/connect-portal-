import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Card({ children, className = '', hover = false, onClick, style }: CardProps) {
  return (
    <div
      style={style}
      className={`cp-card border border-[var(--color-border)] rounded-2xl ${hover ? 'hiero-card-hover transition-all duration-200 cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
