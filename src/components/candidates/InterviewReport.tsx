import { useEffect, useState } from 'react';
import { X, Mic, Loader2, Clock, Check, AlertTriangle, Target } from 'lucide-react';
import {
  getInterviewReport,
  type InterviewReport as Report,
  type ScoreLine,
  type ReportPoint,
} from '../../services/hiroService';
import type { Application } from '../../types';

// ============================================================
// What came back from the interview
// ============================================================
// Scores, the reasoning behind them, and a view on whether this person fits
// the role — never the recording or the transcript. Those belong to the
// candidate; the company asked them questions, it did not buy the tape.
//
// Nothing here is a bare number. A recruiter who can see why an answer
// scored 54 can disagree with the reasoning; one who sees only "54" can
// either accept it or ignore it, and both of those are worse than an
// argument they can weigh. It is also the only version of this screen that
// could be read out to the candidate who asks why they were turned down.
//
// The recommendation supports a decision, it does not make one.

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

function ScoreBar({ label, line }: { label: string; line: ScoreLine }) {
  const value = line.score ?? 0;
  const colour = scoreColour(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs font-bold" style={{ color: colour }}>{line.score}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: colour }}
        />
      </div>
      {/* The reason sits with the number rather than in a block at the
          bottom, because a reason you have to go looking for is a reason
          nobody reads. */}
      {line.why && (
        <p className="text-[11px] leading-relaxed text-white/40 mt-1.5">{line.why}</p>
      )}
    </div>
  );
}

function PointList({
  title,
  points,
  tone,
}: {
  title: string;
  points: ReportPoint[];
  tone: 'good' | 'watch';
}) {
  if (!points.length) return null;
  const colour = tone === 'good' ? '#00FF66' : '#fbbf24';
  return (
    <div className="mb-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2">{title}</p>
      <ul className="space-y-2.5">
        {points.map(item => (
          <li key={item.point} className="flex items-start gap-2">
            {tone === 'good' ? (
              <Check size={12} className="mt-1 flex-shrink-0" style={{ color: colour }} />
            ) : (
              <AlertTriangle size={11} className="mt-1 flex-shrink-0" style={{ color: colour }} />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/80">{item.point}</p>
              {item.evidence && (
                <p className="text-[11px] leading-relaxed text-white/40 mt-0.5">{item.evidence}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
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
    ? (Object.entries(report.scores || {}).filter(
        ([, line]) => line && typeof line.score === 'number'
      ) as [string, ScoreLine][])
    : [];

  // A session that was started and abandoned exists, but its scorecard is
  // all nulls — the engine fills it at the end. Treating "a session exists"
  // as "there is a report" rendered a header, a footer and nothing between.
  const hasFindings = Boolean(
    report &&
    (typeof report.overall === 'number' ||
      scores.length > 0 ||
      report.summary ||
      report.fit?.reasoning ||
      report.strengths?.length ||
      report.concerns?.length)
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
                className="rounded-2xl p-4 mb-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center gap-4">
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

                {report.overallWhy && (
                  <p
                    className="text-xs leading-relaxed text-white/55 mt-3 pt-3"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {report.overallWhy}
                  </p>
                )}
              </div>
            )}

            {/* Fit comes before the breakdown: it is the question the
                recruiter actually opened this to answer. */}
            {(report.fit?.verdict || report.fit?.reasoning) && (
              <div
                className="rounded-2xl p-4 mb-4"
                style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.22)' }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300/70 mb-2 flex items-center gap-1.5">
                  <Target size={11} /> Fit for {app.jobTitle || 'this role'}
                </p>
                {report.fit.verdict && (
                  <p className="text-sm font-bold text-white/85 leading-snug mb-1.5">{report.fit.verdict}</p>
                )}
                {report.fit.reasoning && (
                  <p className="text-xs leading-relaxed text-white/55">{report.fit.reasoning}</p>
                )}
              </div>
            )}

            {scores.length > 0 && (
              <div className="space-y-3.5 mb-4">
                {scores.map(([key, line]) => (
                  <ScoreBar key={key} label={SCORE_LABELS[key] || key} line={line} />
                ))}
              </div>
            )}

            {report.summary && (
              <p className="text-sm text-white/65 leading-relaxed mb-4">{report.summary}</p>
            )}

            <PointList title="What went well" points={report.strengths || []} tone="good" />
            <PointList title="Worth probing" points={report.concerns || []} tone="watch" />

            <p className="text-[11px] text-white/25 mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              The recording and what they said word-for-word stay with the candidate.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
