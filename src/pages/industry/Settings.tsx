import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User, Save, LogOut, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

type Section = 'account' | 'notifications' | 'security';

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const NOTIF_OPTIONS = [
  'New application received',
  'Candidate shortlisted',
  'Interview scheduled',
  'Weekly recruitment summary',
  'Pipeline stage updates',
];

function Toggle({ defaultChecked = true }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer"
      style={{ background: on ? '#06c006' : 'var(--color-border)' }}
    >
      <span
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
        style={{ left: on ? '24px' : '4px' }}
      />
    </button>
  );
}

function FieldRow({ label, defaultValue, type = 'text' }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="hiero-input w-full font-medium"
        style={{
          background: 'var(--color-input-bg)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
        }}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

export default function Settings() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('account');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)] flex items-center gap-2.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <SettingsIcon className="text-[#06c006]" size={22} />
          Settings
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Section Tabs */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="cp-card rounded-2xl p-2 space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  section === s.id ? 'nav-item-active' : 'nav-item'
                }`}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {section === 'account' && (
            <div className="cp-card rounded-2xl p-6 space-y-5 animate-fade-in">
              <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>Account Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FieldRow label="Full Name" defaultValue={user?.name} />
                <FieldRow label="Email" defaultValue={user?.email} type="email" />
                <FieldRow label="Designation" defaultValue={user?.designation} />
                <FieldRow label="Phone" defaultValue={user?.phone} />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleSave}
                  className="hiero-btn-primary text-sm font-bold shadow-[0_0_20px_rgba(6,192,6,0.2)]"
                >
                  {saved ? <Check size={15} /> : <Save size={15} />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div className="cp-card rounded-2xl p-6 space-y-4 animate-fade-in">
              <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>Notification Preferences</h2>
              <div className="space-y-2">
                {NOTIF_OPTIONS.map((item, i) => (
                  <div
                    key={item}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl border"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                  >
                    <span className="text-sm font-semibold text-[var(--color-text)]">{item}</span>
                    <Toggle defaultChecked={i < 3} />
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="hiero-btn-primary text-sm font-bold mt-2 shadow-[0_0_20px_rgba(6,192,6,0.2)]">
                {saved ? <Check size={15} /> : <Save size={15} />}
                {saved ? 'Saved!' : 'Save Preferences'}
              </button>
            </div>
          )}

          {section === 'security' && (
            <div className="space-y-4 animate-fade-in">
              <div className="cp-card rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>Change Password</h2>
                <FieldRow label="Current Password" type="password" />
                <FieldRow label="New Password" type="password" />
                <FieldRow label="Confirm New Password" type="password" />
                <button className="px-5 py-2.5 rounded-xl font-bold text-sm border text-[var(--color-text)]" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>Update Password</button>
              </div>

              {/* Danger Zone */}
              <div className="rounded-2xl p-6 space-y-3 bg-red-500/5 border border-red-500/20">
                <h2 className="text-base font-bold text-red-500" style={{ fontFamily: 'Outfit, sans-serif' }}>Danger Zone</h2>
                <p className="text-sm font-medium text-[var(--color-muted)]">Sign out of your recruiter account across all sessions.</p>
                <button onClick={handleLogout} className="hiero-btn-danger text-sm font-bold">
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
