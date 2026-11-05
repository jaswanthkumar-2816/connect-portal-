import { useEffect, useRef, useState } from 'react';
import { Mic, Square, RotateCcw, Keyboard, AlertCircle } from 'lucide-react';
import { MAX_ANSWER_SECONDS, type VoiceAnswer } from '../../hooks/useVoiceAnswer';

// ============================================================
// Answering one question
// ============================================================
// Three states, and the candidate should never have to guess which one they
// are in: tap to start, a ring that moves with their voice while they talk,
// and their own words on screen afterwards to correct before sending.
//
// Showing the words as they are recognised is the whole trick. Without them a
// candidate talks into a dark screen and has no idea whether anything is
// being heard, and the first they learn of a dead microphone is a bad score.

/** How many moments of their voice the waveform holds. */
const BAR_COUNT = 26;

/** Roughly fifteen frames a second — movement, without re-rendering on every
 *  animation frame for a decoration. */
const BAR_TICK_MS = 68;

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function AnswerRecorder({
  voice,
  speechOk,
}: {
  voice: VoiceAnswer;
  speechOk: boolean;
}) {
  const { status, transcript, interim, level, seconds, silent, cappedOut, error, meterLive } = voice;

  // The waveform is a rolling window of recent loudness. The level itself
  // changes every animation frame, which is far more often than anyone can
  // see — so it is read from a ref on a timer rather than driving a render
  // sixty times a second.
  const [bars, setBars] = useState<number[]>(() => new Array(BAR_COUNT).fill(0));
  const levelNow = useRef(level);
  levelNow.current = level;

  useEffect(() => {
    if (status !== 'recording' && status !== 'starting') {
      setBars(new Array(BAR_COUNT).fill(0));
      return;
    }
    const tick = setInterval(() => {
      setBars(prev => [...prev.slice(1), levelNow.current]);
    }, BAR_TICK_MS);
    return () => clearInterval(tick);
  }, [status]);

  // No recogniser in this browser — Firefox, mostly. Typing is not the
  // experience we wanted, but it beats turning a candidate away over the
  // browser their phone came with.
  if (!speechOk) {
    return (
      <div className="space-y-3">
        <div
          className="flex items-start gap-2.5 rounded-xl p-3"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
        >
          <Keyboard size={15} style={{ color: 'var(--color-muted)' }} className="mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            This browser cannot turn speech into text, so type your answer instead. Chrome or Safari
            will let you answer out loud.
          </p>
        </div>
        <textarea
          value={transcript}
          onChange={e => voice.edit(e.target.value)}
          rows={6}
          placeholder="Type your answer here…"
          className="w-full rounded-xl px-3.5 py-3 text-sm leading-relaxed focus:outline-none resize-y"
          style={{
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
      </div>
    );
  }

  const ringScale = 1 + Math.min(level * 1.7, 0.34);
  const recording = status === 'recording' || status === 'starting';

  return (
    <div className="space-y-4">
      {/* The mic */}
      <div className="flex flex-col items-center">
        {status === 'idle' && (
          <>
            <button
              type="button"
              onClick={() => { void voice.start(); }}
              className="relative flex items-center justify-center rounded-full transition-transform active:scale-95"
              style={{
                width: 92,
                height: 92,
                background: 'var(--color-accent-bg)',
                border: '2px solid var(--color-accent-border)',
                boxShadow: 'var(--shadow-glow)',
              }}
              aria-label="Start answering"
            >
              <Mic size={34} style={{ color: 'var(--color-accent)' }} />
            </button>
            <p className="text-sm font-bold mt-3" style={{ color: 'var(--color-text)' }}>
              Tap to answer
            </p>
            <p className="text-xs mt-1 text-center max-w-[15rem]" style={{ color: 'var(--color-muted)' }}>
              The microphone usually opens by itself once the question has been read. Tap if it did not.
            </p>
          </>
        )}

        {recording && (
          <>
            {/* A bar for every moment of the last two seconds, tall where
                they were loud. It replaced a green disc, which looked like
                a record button and told them nothing: this says "we can
                hear you, right now" without a word, which is the one doubt
                worth killing before somebody answers a question that
                decides whether they get a job. */}
            <div
              className="w-full rounded-2xl px-3.5 py-3 flex items-center gap-3"
              style={{
                background: 'rgba(8,8,10,0.82)',
                border: '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#ef4444', animation: 'statusPulse 2s ease-in-out infinite' }}
                />
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: 'var(--color-text)', fontFamily: 'Outfit, sans-serif' }}
                >
                  {clock(seconds)}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center gap-[2px] h-9 overflow-hidden">
                {bars.map((value, i) => {
                  const height = meterLive
                    ? Math.max(3, Math.min(34, 3 + value * 110))
                    : 3;
                  return (
                    <span
                      key={i}
                      className="rounded-full flex-1"
                      style={{
                        height,
                        maxWidth: 4,
                        background: 'var(--color-accent)',
                        // The oldest bars fade out, so the waveform reads as
                        // moving rather than as a static pattern.
                        opacity: 0.25 + (i / Math.max(bars.length - 1, 1)) * 0.75,
                        transition: 'height 90ms linear',
                        // With no level meter there is nothing to draw, so
                        // the line breathes instead of lying flat and dead.
                        animation: meterLive ? 'none' : `glowPulse 1.6s ease-in-out ${i * 45}ms infinite`,
                      }}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={voice.stop}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl flex-shrink-0 transition-all active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  color: 'var(--color-text)',
                }}
                aria-label="Stop answering"
              >
                <Square size={11} fill="currentColor" /> Stop
              </button>
            </div>

            <p
              className="text-xs font-semibold text-center"
              style={{ color: silent ? 'var(--color-accent)' : 'var(--color-muted)' }}
            >
              {silent
                ? 'Keep going if you are not finished — a pause ends the answer.'
                : 'Listening. Stop talking when you are done.'}
            </p>

            {!meterLive && (
              <p className="text-[11px] text-center" style={{ color: 'var(--color-muted-2)' }}>
                We cannot show the level meter, but your words are still coming through below.
              </p>
            )}
          </>
        )}

        {status === 'stopped' && (
          <button
            type="button"
            onClick={() => { voice.reset(); void voice.start(); }}
            className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted)',
            }}
          >
            <RotateCcw size={13} /> Record again
          </button>
        )}
      </div>

      {cappedOut && (
        <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>
          That is the two-minute limit for one answer — everything up to here was kept.
        </p>
      )}

      {error && (
        <div
          className="flex items-start gap-2 rounded-xl p-3"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#f87171' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#f87171' }}>{error}</p>
        </div>
      )}

      {/* What we heard */}
      {status === 'stopped' ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted-2)' }}>
            Your answer — fix anything we misheard
          </p>
          <textarea
            value={transcript}
            onChange={e => voice.edit(e.target.value)}
            rows={5}
            placeholder="Nothing came through. Record again, or type your answer here."
            className="w-full rounded-xl px-3.5 py-3 text-sm leading-relaxed focus:outline-none resize-y"
            style={{
              background: 'var(--color-input-bg)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>
      ) : (
        (transcript || interim) && (
          <div
            className="rounded-xl px-3.5 py-3 max-h-40 overflow-y-auto"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-dim)' }}>
              {transcript}{' '}
              <span style={{ color: 'var(--color-muted-2)' }}>{interim}</span>
            </p>
          </div>
        )
      )}
    </div>
  );
}
