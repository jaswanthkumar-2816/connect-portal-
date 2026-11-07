import { ArrowRight, CheckCircle2, Dumbbell, Target, TrendingUp } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import type { PracticeRecord as PracticeRecordData, PracticeSkillTrend } from '../../types';

// HIERO grades out of 10.
const MAX_SCORE = 10;

function pct(score: number): number {
  return Math.max(0, Math.min(100, (score / MAX_SCORE) * 100));
}

function fmt(score: number): string {
  return (Math.round(score * 10) / 10).toFixed(1);
}

function deltaLabel(from: number, to: number): string {
  const d = Math.round((to - from) * 10) / 10;
  return `${d > 0 ? '+' : ''}${d.toFixed(1)}`;
}

function SkillTrendRow({ trend }: { trend: PracticeSkillTrend }) {
  const improved = trend.latest > trend.first;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-[var(--color-text)] truncate">{trend.name}</span>
        <span className="text-xs font-bold whitespace-nowrap" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          <span className="text-[var(--color-muted)]">{fmt(trend.first)}</span>
          <ArrowRight size={10} className="inline mx-1 text-[var(--color-muted-2)]" />
          <span style={{ color: improved ? 'var(--color-accent)' : 'var(--color-text)' }}>
            {fmt(trend.latest)}
          </span>
        </span>
      </div>
      {/* Muted segment = where they started. Green segment = what they added. */}
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-3)' }}>
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${pct(Math.min(trend.first, trend.latest))}%`, background: 'var(--color-muted-2)' }}
        />
        <div
          className="absolute inset-y-0"
          style={{
            left: `${pct(Math.min(trend.first, trend.latest))}%`,
            width: `${Math.abs(pct(trend.latest) - pct(trend.first))}%`,
            background: improved ? 'var(--color-accent)' : 'var(--color-danger, #ef4444)',
          }}
        />
      </div>
    </div>
  );
}

function RecordBody({ record }: { record: PracticeRecordData }) {
  const improved = record.latestScore > record.firstScore;
  const attemptCount = record.attempts.length;
  const multiple = attemptCount > 1 || record.latestScore !== record.firstScore;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-bold text-[var(--color-text)] flex items-center gap-1.5">
          <Target size={13} className="text-[#06c006] flex-shrink-0" />
          <span className="truncate">Practised for {record.role}</span>
        </p>
        <p className="text-[11px] text-[var(--color-muted)] font-medium mt-0.5">
          {attemptCount > 0 && (
            <>
              {attemptCount} {attemptCount === 1 ? 'attempt' : 'attempts'}
              {record.firstAt && ' · '}
            </>
          )}
          {record.firstAt && formatDate(record.firstAt)}
          {record.latestAt && record.latestAt !== record.firstAt && <> to {formatDate(record.latestAt)}</>}
        </p>
      </div>

      {/* The headline: where they started against where they got to. */}
      <div
        className="rounded-lg px-3 py-2.5 border flex items-center justify-between gap-3"
        style={{
          background: improved ? 'var(--color-accent-bg)' : 'var(--color-surface-3)',
          borderColor: improved ? 'var(--color-accent-border)' : 'var(--color-border)',
        }}
      >
        <div className="flex items-baseline gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {multiple && (
            <>
              <span className="text-xl font-black text-[var(--color-muted)]">{fmt(record.firstScore)}</span>
              <ArrowRight size={14} className="text-[var(--color-muted-2)]" />
            </>
          )}
          <span className="text-3xl font-black" style={{ color: improved ? '#06c006' : 'var(--color-text)' }}>
            {fmt(record.latestScore)}
          </span>
          <span className="text-xs font-bold text-[var(--color-muted)]">/ {MAX_SCORE}</span>
        </div>
        {improved && (
          <span className="inline-flex items-center gap-1 text-xs font-black text-[#06c006] whitespace-nowrap">
            <TrendingUp size={13} />
            {deltaLabel(record.firstScore, record.latestScore)}
          </span>
        )}
      </div>

      {record.skills.length > 0 && (
        <div className="space-y-2">
          {record.skills.map(trend => (
            <SkillTrendRow key={trend.name} trend={trend} />
          ))}
        </div>
      )}

      {record.resolved.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Fixed since the first attempt
          </p>
          <div className="space-y-1">
            {record.resolved.map(item => (
              <p key={item} className="text-xs text-[var(--color-text-dim)] font-medium flex items-start gap-1.5">
                <CheckCircle2 size={12} className="text-[#06c006] mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {record.outstanding.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Still working on
          </p>
          <div className="flex flex-wrap gap-1.5">
            {record.outstanding.map(item => (
              <span
                key={item}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md border text-[var(--color-muted)]"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-3)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const FOOTNOTE = 'Practised on HIERO before applying — not a test set by you.';

interface PracticeRecordProps {
  record: PracticeRecordData | null;
  loading?: boolean;
  // 'drawer' carries its own small heading and card; 'page' expects the caller
  // to supply the surrounding Card, as the candidate profile page does.
  variant?: 'drawer' | 'page';
}

export default function PracticeRecord({ record, loading, variant = 'drawer' }: PracticeRecordProps) {
  const empty = !record || (!record.attempts.length && !record.skills.length);
  const message = loading ? 'Checking HIERO…' : 'No practice record for this candidate yet.';

  if (variant === 'page') {
    return (
      <>
        <h2
          className="text-lg font-bold text-[var(--color-text)] mb-5 flex items-center gap-2"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          <Dumbbell size={18} className="text-[#06c006]" />
          Practice record
        </h2>
        {loading || empty ? (
          <p className="text-xs text-[var(--color-muted)] font-medium">{message}</p>
        ) : (
          <>
            <RecordBody record={record} />
            <p className="text-[10px] text-[var(--color-muted-2)] font-medium mt-3">{FOOTNOTE}</p>
          </>
        )}
      </>
    );
  }

  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2 flex items-center gap-1.5">
        <Dumbbell size={13} /> Practice record
      </h3>
      {loading || empty ? (
        <div
          className="rounded-xl p-3 border"
          style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs text-[var(--color-muted)] font-medium">{message}</p>
        </div>
      ) : (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
        >
          <div className="p-3">
            <RecordBody record={record} />
          </div>
          <p
            className="text-[10px] text-[var(--color-muted-2)] font-medium px-3 py-2 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {FOOTNOTE}
          </p>
        </div>
      )}
    </section>
  );
}
