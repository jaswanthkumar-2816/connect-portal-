import { useCallback, useEffect, useState } from 'react';
import { Users, UserPlus, Loader2, X, Phone, Mail, Briefcase, CalendarDays } from 'lucide-react';
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  type Employee,
} from '../../services/workforceService';
import { getApplications } from '../../services/hiroService';
import type { Application } from '../../types';
import { formatDate } from '../../lib/utils';

// ============================================================
// Everyone working for you
// ============================================================
// The point of this page is the first button on it: somebody who applied is
// already here, with their phone number, their resume and their interview.
// Typing them in again would lose all of that and leave two slightly
// different versions of the same person.
//
// Typing one in by hand is the second option, not the first, because most
// salons have staff who were working there long before any of this existed.

const quiet = {
  background: 'var(--color-surface-2)',
  color: 'var(--color-muted)',
  border: '1px solid var(--color-border)',
};

const accent = {
  background: 'var(--color-accent-bg)',
  color: 'var(--color-accent)',
  border: '1px solid var(--color-accent-border)',
};

const field: React.CSSProperties = {
  background: 'var(--color-input-bg)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-muted)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none"
        style={field}
      />
    </div>
  );
}

export default function Employees() {
  const [rows, setRows] = useState<Employee[]>([]);
  const [hired, setHired] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState('');

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [joinedOn, setJoinedOn] = useState(new Date().toISOString().slice(0, 10));

  const load = useCallback(async () => {
    setLoading(true);
    const [team, apps] = await Promise.all([getEmployees(), getApplications()]);
    setLoading(false);
    if (!team.ok) {
      setError(team.error || 'Could not load your team.');
      return;
    }
    setError('');
    setRows(team.employees);

    // Anyone you interviewed or shortlisted who is not already on the team.
    const onTeam = new Set(team.employees.map(e => e.applicationId).filter(Boolean));
    setHired(
      apps.filter(a => !onTeam.has(a.id) && ['interview', 'shortlisted', 'selected'].includes(String(a.status)))
    );
  }, []);

  useEffect(() => { load(); }, [load]);

  const hire = async (app: Application) => {
    setBusy(app.id);
    const res = await addEmployee({ applicationId: app.id });
    setBusy('');
    if (!res.ok) { setError(res.error || 'Could not add this person.'); return; }
    setError('');
    setNote(`${res.employee?.name} is on your team. Their resume and interview came across with them.`);
    setTimeout(() => setNote(''), 7000);
    load();
  };

  const addByHand = async () => {
    if (!name.trim()) { setError('A name is required.'); return; }
    setBusy('new');
    const res = await addEmployee({ name, role, phone, joinedOn });
    setBusy('');
    if (!res.ok) { setError(res.error || 'Could not add this person.'); return; }
    setAdding(false);
    setName(''); setRole(''); setPhone('');
    setError('');
    load();
  };

  const markLeft = async (e: Employee) => {
    setBusy(e.id);
    const res = await updateEmployee(e.id, { status: 'left' });
    setBusy('');
    if (!res.ok) { setError(res.error || 'Could not save that.'); return; }
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--color-text)' }}>
            Employees
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            {rows.length === 0
              ? 'Nobody on your team yet'
              : `${rows.length} ${rows.length === 1 ? 'person' : 'people'} working for you`}
          </p>
        </div>
        <button
          onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-bold transition-all"
          style={accent}
        >
          <UserPlus size={13} /> Add someone
        </button>
      </div>

      {error && (
        <div
          className="text-xs font-semibold rounded-xl px-3 py-2"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626' }}
        >
          {error}
        </div>
      )}

      {note && (
        <div className="text-xs font-semibold rounded-xl px-3 py-2" style={accent}>
          {note}
        </div>
      )}

      {adding && (
        <div className="rounded-2xl p-4" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <p className="text-xs mb-3" style={{ color: 'var(--color-muted)' }}>
            For someone who was already working here. Anyone who applied through HIERO is better added from the
            list below — their resume and interview come with them.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <Field label="Name" value={name} onChange={setName} placeholder="Full name" />
            <Field label="Role" value={role} onChange={setRole} placeholder="Stylist, receptionist…" />
            <Field label="Phone" value={phone} onChange={setPhone} placeholder="+91…" />
            <Field label="Started on" value={joinedOn} onChange={setJoinedOn} type="date" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setAdding(false)} className="text-xs px-3.5 py-2 rounded-xl font-semibold" style={quiet}>
              Cancel
            </button>
            <button
              onClick={addByHand}
              disabled={busy === 'new'}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-bold disabled:opacity-60"
              style={accent}
            >
              {busy === 'new' && <Loader2 size={12} className="animate-spin" />} Add
            </button>
          </div>
        </div>
      )}

      {/* The whole reason this page exists. */}
      {hired.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: 'var(--color-surface-3)', border: '1px dashed var(--color-border)' }}>
          <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--color-text)' }}>
            Ready to bring across
          </p>
          <p className="text-[11px] mb-3" style={{ color: 'var(--color-muted)' }}>
            People you interviewed or shortlisted. Adding them keeps their resume and interview attached.
          </p>
          <div className="space-y-2">
            {hired.map(a => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--color-text)' }}>
                    {a.studentName || 'Candidate'}
                  </p>
                  <p className="text-[11px] truncate" style={{ color: 'var(--color-muted)' }}>
                    {a.jobTitle || 'Applied'} · {a.email}
                  </p>
                </div>
                <button
                  onClick={() => hire(a)}
                  disabled={busy === a.id}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-bold flex-shrink-0 disabled:opacity-60"
                  style={accent}
                >
                  {busy === a.id ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                  Hired
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 size={22} className="animate-spin" style={{ color: 'var(--color-muted)' }} />
        </div>
      ) : rows.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl text-center px-6"
          style={{ background: 'var(--color-surface-3)', border: '1px dashed var(--color-border)' }}
        >
          <Users size={32} className="mb-3" style={{ color: 'var(--color-muted-2)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>Nobody on your team yet</p>
          <p className="text-xs mt-1.5 max-w-xs" style={{ color: 'var(--color-muted-2)' }}>
            Hire someone from your applications and they appear here, or add a person who already works for you.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {rows.map(e => (
            <div
              key={e.id}
              className="rounded-2xl p-4"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
                >
                  {e.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{e.name}</p>
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    {e.role && (
                      <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-text-dim)' }}>
                        <Briefcase size={11} /> {e.role}
                      </span>
                    )}
                    {e.phone && (
                      <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-muted)' }}>
                        <Phone size={11} /> {e.phone}
                      </span>
                    )}
                    {e.email && (
                      <span className="text-xs flex items-center gap-1.5 truncate" style={{ color: 'var(--color-muted)' }}>
                        <Mail size={11} /> {e.email}
                      </span>
                    )}
                    <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-muted)' }}>
                      <CalendarDays size={11} /> since {formatDate(e.joinedOn)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => markLeft(e)}
                  disabled={busy === e.id}
                  title="They no longer work here. Their record and attendance are kept."
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0 disabled:opacity-60"
                  style={quiet}
                >
                  {busy === e.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />} Left
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
