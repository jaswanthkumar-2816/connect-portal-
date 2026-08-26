import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}

export default function StatCard({ label, value, icon, change, changeType = 'neutral' }: StatCardProps) {
  return (
    <div className="bg-hiero-card border border-hiero-border rounded-xl p-5 hover:border-hiero-border-light transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-hiero-green/10 text-hiero-green">
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            changeType === 'up' ? 'bg-green-500/15 text-green-400' :
            changeType === 'down' ? 'bg-red-500/15 text-red-400' :
            'bg-hiero-card text-hiero-muted'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-hiero-muted">{label}</div>
    </div>
  );
}
