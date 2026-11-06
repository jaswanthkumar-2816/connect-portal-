import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Fingerprint, Loader2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import {
  getEmployees,
  getAttendance,
  markAttendance,
  type Employee,
  type AttendanceRecord,
  type AttendanceStatus,
} from '../../services/workforceService';

// ============================================================
// Who turned up
// ============================================================
// The plan was always to read punches off the fingerprint machine on the
// wall, and that is still right. But every manufacturer speaks its own
// protocol and it cannot be written honestly without a device on the desk to
// test against — meanwhile a salon owner with no device still needs to know
// who came in.
//
// So it is marked by hand: one tap each, thirty seconds a morning. The
// records are the same shape a device would write, so when one is wired in
// it fills the same rows rather than starting a second history beside this
// one.

const STATUSES: { value: AttendanceStatus; label: string; colour: string; bg: string }[] = [
  { value: 'present', label: 'In',      colour: 'var(--color-accent)', bg: 'var(--color-accent-bg)' },
  { value: 'late',    label: 'Late',    colour: '#b45309',             bg: 'rgba(251,191,36,0.16)' },
  { value: 'absent',  label: 'Off',     colour: '#dc2626',             bg: 'rgba(239,68,68,0.12)' },
  { value: 'leave',   label: 'Leave',   colour: '#6366f1',             bg: 'rgba(99,102,241,0.14)' },
];

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function human(dateIso: string) {
  const d = new Date(`${dateIso}T00:00:00`);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function Attendance() {
  const today = iso(new Date());
  const [date, setDate] = useState(today);
  const [team, setTeam] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async (forDate: string) => {
    setLoading(true);
    // A month back, so the strip under each name has something to show.
    const from = iso(new Date(new Date(`${forDate}T00:00:00`).getTime() - 29 * 864e5));
    const [people, marks] = await Promise.all([getEmployees(), getAttendance(from, forDate)]);
    setLoading(false);
    if (!people.ok) { setError(people.error || 'Could not load your team.'); return; }
    if (!marks.ok) { setError(marks.error || 'Could not load attendance.'); return; }
    setError('');
    setTeam(people.employees);
    setRecords(marks.attendance);
  }, []);

  useEffect(() => { load(date); }, [date, load]);

  const forToday = useMemo(() => {
    const map: Record<string, AttendanceStatus> = {};
    for (const r of records) if (r.date === date) map[r.employeeId] = r.status;
    return map;
  }, [records, date]);

  const lastDays = useMemo(() => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      days.push(iso(new Date(new Date(`${date}T00:00:00`).getTime() - i * 864e5)));
    }
    return days;
  }, [date]);

  const byPerson = useMemo(() => {
    const map: Record<string, Record<string, AttendanceStatus>> = {};
    for (const r of records) {
      map[r.employeeId] = map[r.employeeId] || {};
      map[r.employeeId][r.date] = r.status;
    }
    return map;
  }, [records]);

  const mark = async (employeeId: string, status: AttendanceStatus) => {
    setBusy(employeeId + status);
    const res = await markAttendance({ employeeId, date, status });
    setBusy('');
    if (!res.ok) { setError(res.error || 'Could not save that.'); return; }
    setError('');
    setRecords(prev => [
      res.record as AttendanceRecord,
      ...prev.filter(r => !(r.employeeId === employeeId && r.date === date)),
    ]);
  };

  const shift = (days: number) => {
    const next = iso(new Date(new Date(`${date}T00:00:00`).getTime() + days * 864e5));
    if (next > today) return;             // tomorrow is not a fact yet
    setDate(next);
  };

  const marked = Object.keys(forToday).length;
  const present = Object.values(forToday).filter(s => s === 'present' || s === 'late').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--color-text)' }}>
          Attendance
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
          {team.length === 0
            ? 'Nobody on your team yet'
            : `${present} of ${team.length} in${marked < team.length ? ` · ${team.length - marked} not marked` : ''}`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => shift(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
          aria-label="Previous day">
          <ChevronLeft size={15} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
            {date === today ? 'Today' : human(date)}
          </p>
          {date !== today && (
            <button onClick={() => setDate(today)} className="text-[11px] font-bold" style={{ color: 'var(--color-accent)' }}>
              back to today
            </button>
          )}
        </div>
        <button onClick={() => shift(1)} disabled={date === today}
          className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-35"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
          aria-label="Next day">
          <ChevronRight size={15} />
        </button>
      </div>

      {error && (
        <div className="text-xs font-semibold rounded-xl px-3 py-2"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 size={22} className="animate-spin" style={{ color: 'var(--color-muted)' }} />
        </div>
      ) : team.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl text-center px-6"
          style={{ background: 'var(--color-surface-3)', border: '1px dashed var(--color-border)' }}>
          <Users size={32} className="mb-3" style={{ color: 'var(--color-muted-2)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>Nobody to mark yet</p>
          <p className="text-xs mt-1.5 mb-4 max-w-xs" style={{ color: 'var(--color-muted-2)' }}>
            Attendance reads from your team. Add the people who work for you first.
          </p>
          <Link to="/industry/employees" className="text-xs px-3.5 py-2 rounded-xl font-bold"
            style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}>
            Go to Employees
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {team.map(e => {
            const current = forToday[e.id];
            return (
              <div key={e.id} className="rounded-2xl p-4"
                style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{e.name}</p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--color-muted)' }}>{e.role || 'Team'}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {STATUSES.map(s => {
                      const on = current === s.value;
                      return (
                        <button
                          key={s.value}
                          onClick={() => mark(e.id, s.value)}
                          disabled={busy === e.id + s.value}
                          className="text-xs px-3 py-1.5 rounded-lg font-bold transition-all disabled:opacity-60"
                          style={on
                            ? { background: s.bg, color: s.colour, border: `1px solid ${s.colour}55` }
                            : { background: 'var(--color-surface-2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
                        >
                          {busy === e.id + s.value ? <Loader2 size={11} className="animate-spin inline" /> : s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* The last seven days, so a pattern is visible without
                    opening anything. */}
                <div className="flex items-center gap-1">
                  {lastDays.map(d => {
                    const st = byPerson[e.id]?.[d];
                    const spec = STATUSES.find(s => s.value === st);
                    return (
                      <div
                        key={d}
                        title={`${human(d)} — ${st || 'not marked'}`}
                        className="h-1.5 flex-1 rounded-full"
                        style={{ background: spec ? spec.colour : 'var(--color-surface-2)', opacity: spec ? 0.85 : 1 }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-muted-2)' }}>
        <Fingerprint size={11} className="inline mb-0.5 mr-1" />
        Marked by hand for now. When a fingerprint machine is wired in it writes these same records, so nothing
        here is thrown away.
      </p>
    </div>
  );
}
