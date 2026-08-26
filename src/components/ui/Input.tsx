import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({ label, error, helperText, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-hiero-muted mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`hiero-input ${error ? 'border-red-500 focus:border-red-500 focus:shadow-red-500/10' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-hiero-muted">{helperText}</p>}
    </div>
  );
}
