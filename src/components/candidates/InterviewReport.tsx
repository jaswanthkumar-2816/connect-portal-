import { useEffect, useState } from 'react';
import { X, Mic, Loader2, Clock, Check } from 'lucide-react';
import { getInterviewReport, type InterviewReport as Report } from '../../services/hiroService';
import type { Application } from '../../types';

// ============================================================
// What came back from the interview
// ============================================================
// Scores, strengths and a recommendation — never the recording or the
// transcript. Those belong to the candidate; the company asked them
// questions, it did not buy the tape.
//
// The recommendation supports a decision, it does not make one. A salon owner
// reading "83/100" should still open the resume and meet the person.

const SCORE_LABELS: Record<string, string> = {
  communication: 'Communication',
  problemSolving: 'Problem solving',
  roleKnowledge: 'Knows the work',
  relevance: 'Relevance',
  confidence: 'Confidence',
};

function scoreColour(value: number): string {
  if (value >= 80) return '#00FF66';
  if (value >= 60) return '#fbbf24';
  return '#ff8f8f';
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const colour = scoreColour(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs font-bold" style={{ color: colour }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: colour }}
        />
      </div>
    </div>
  );
}

export default function InterviewReport({
  app,
  onClose,
}: {
  app: Application;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    let live = true;
    getInterviewReport(app.id).then(res => {
      if (!live) return;
      setReport(res.report);
      setLoading(false);
    });
    return () => { live = false; };
  }, [app.id]);

  const scores = report
    ? Object.entries(report.scores).filter(([, v]) => typeof v === 'number') as [string, number][]
    : [];

  // A session that was started and abandoned exists, but its scorecard is all
  // nulls — the engine fills it at the end. Treating "a session exists" as
  // "there is a report" rendered a header, a footer and nothing between them.
  const hasFindings = Boolean(
    report &&
    (typeof report.overall === 'number' ||
      scores.length > 0 ||
      report.summary ||
      report.strengths.length ||
      report.areasToImprove.length)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-5 max-h-[88vh] overflow-y-auto"
        style={{ background: '#0e0e18', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              <Mic size={15} className="text-indigo-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-white truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {app.studentName || 'Candidate'}
              </h3>
              <p className="text-[11px] text-white/40 truncate">{app.jobTitle || 'Interview'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 size={20} className="animate-spin text-white/30" />
          </div>
        ) : !hasFindings || !report ? (
          // Sent but not taken. Say which, rather than showing an empty
          // report that looks like a failed one.
          <div className="flex flex-col items-center text-center py-12">
            <Clock size={30} className="text-white/15 mb-3" />
            <p className="text-sm font-semibold text-white/55">
              {report ? 'Interview not finished' : 'Not taken yet'}
            </p>
            <p className="text-xs text-white/30 mt-1.5 max-w-xs">
              {report
                ? `They started answering${report.questionsAnswered ? ` and got through ${report.questionsAnswered} question${report.questionsAnswered === 1 ? '' : 's'}` : ''}, but did not reach the end. Scores are only worked out once the interview finishes.`
                : 'The link has been sent. Nothing comes back until they complete the interview.'}
            </p>
          </div>
        ) : (
          <>
            {typeof report.overall === 'number' && (
              <div
                className="flex items-center gap-4 rounded-2xl p-4 mb-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{
                    background: `${scoreColour(report.overall)}14`,
                    border: `1.5px solid ${scoreColour(report.overall)}44`,
                  }}
                >
                  <span
                    className="text-xl font-black leading-none"
                    style={{ color: scoreColour(report.overall), fontFamily: 'Outfit, sans-serif' }}
                  >
                    {report.overall}
                  </span>
                  <span className="text-[9px] text-white/35 mt-0.5">of 100</span>
                </div>
                <div className="min-w-0">
                  {report.recommendation && (
                    <p className="text-sm font-bold text-white/85 mb-0.5">{report.recommendation}</p>
                  )}
                  <p className="text-xs text-white/40">
                    {report.questionsAnswered} of {report.questionsAsked} questions answered
                  </p>
                  <p className="text-[11px] text-white/25 mt-1">
                    A score supports your decision. It does not replace meeting them.
                  </p>
                </div>
              </div>
            )}

            {scores.length > 0 && (
              <div className="space-y-2.5 mb-4">
                {scores.map(([key, value]) => (
                  <ScoreBar key={key} label={SCORE_LABELS[key] || key} value={value} />
                ))}
              </div>
            )}

            {report.summary && (
              <p className="text-sm text-white/65 leading-relaxed mb-4">{report.summary}</p>
            )}

            {report.strengths.length > 0 && (
              <div className="mb-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2">Strengths</p>
                <ul className="space-y-1.5">
                  {report.strengths.map(line => (
                    <li key={line} className="flex items-start gap-2 text-xs text-white/70">
                      <Check size={12} className="text-hiero-green mt-0.5 flex-shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {report.areasToImprove.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2">Weaker on</p>
                <ul className="space-y-1.5">
                  {report.areasToImprove.map(line => (
                    <li key={line} className="flex items-start gap-2 text-xs text-white/55">
                      <span className="w-1 h-1 rounded-full bg-white/25 mt-1.5 flex-shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[11px] text-white/25 mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              The recording and what they said word-for-word stay with the candidate.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
