import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe, MapPin, Edit3, Users, Save, X, Building2, CheckCircle2,
  ShieldCheck, Mail, Phone, ExternalLink, Briefcase, Plus,
  Sparkles, Award, Heart, Code2, Zap, ArrowRight, Check, Camera, Upload, Image as ImageIcon
} from 'lucide-react';
import { getCompanyById, updateCompanyProfile, getOpportunities } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import type { Company, Opportunity } from '../../types';
import { formatDate } from '../../lib/utils';

const DEFAULT_PERKS = [
  'Hybrid & Remote Flexibility',
  'Comprehensive Health Insurance',
  'Learning & Certification Allowance',
  'Performance Bonuses',
  'Flexible Working Hours',
  'ESOPs & Equity Options',
];

const DEFAULT_TECH_STACK = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Tailwind CSS'
];

export default function CompanyProfile() {
  const user = useAuthStore(s => s.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'team' | 'edit'>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '11-50',
    location: '',
    website: '',
    description: '',
    logoUrl: '',
    techStack: DEFAULT_TECH_STACK.join(', '),
    perks: DEFAULT_PERKS.join(', '),
  });

  useEffect(() => {
    if (user?.companyId) {
      Promise.all([
        getCompanyById(user.companyId),
        getOpportunities(user.companyId),
      ]).then(([c, opps]) => {
        if (c) {
          const name = (user as any).companyName || c.name || 'Company Profile';
          const compData = { ...c, name };
          setCompany(compData);
          setFormData({
            name: compData.name || '',
            industry: compData.industry || 'Information Technology',
            size: compData.size || '11-50',
            location: compData.location || 'Bangalore, India',
            website: compData.website || '',
            description: compData.description || '',
            logoUrl: compData.logoUrl || '',
            techStack: DEFAULT_TECH_STACK.join(', '),
            perks: DEFAULT_PERKS.join(', '),
          });
        }
        setOpportunities(opps);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData(prev => ({ ...prev, logoUrl: dataUrl }));
        if (company) {
          const updated = { ...company, logoUrl: dataUrl };
          setCompany(updated);
          if (user?.companyId) {
            updateCompanyProfile(user.companyId, { logoUrl: dataUrl });
          }

          // Sync logo to all custom opportunities for this company
          try {
            const oppsStr = localStorage.getItem('hc_custom_opportunities');
            if (oppsStr) {
              const opps = JSON.parse(oppsStr);
              opps.forEach((o: any) => {
                if (o.companyId === user?.companyId || o.companyName === (user as any)?.companyName) {
                  o.logoUrl = dataUrl;
                }
              });
              localStorage.setItem('hc_custom_opportunities', JSON.stringify(opps));
            }
          } catch {}
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user?.companyId) return;
    setSaving(true);

    const updated = await updateCompanyProfile(user.companyId, {
      name: formData.name,
      industry: formData.industry,
      size: formData.size as any,
      location: formData.location,
      website: formData.website,
      description: formData.description,
      logoUrl: formData.logoUrl,
    });

    // Sync logo to custom opportunities
    try {
      const oppsStr = localStorage.getItem('hc_custom_opportunities');
      if (oppsStr) {
        const opps = JSON.parse(oppsStr);
        opps.forEach((o: any) => {
          if (o.companyId === user?.companyId || o.companyName === (user as any)?.companyName) {
            o.logoUrl = formData.logoUrl;
          }
        });
        localStorage.setItem('hc_custom_opportunities', JSON.stringify(opps));
      }
    } catch {}

    if (user) {
      (user as any).companyName = updated.name;
      localStorage.setItem('hc_user', JSON.stringify(user));
    }

    setCompany(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setActiveTab('overview');
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#06c006]/30 border-t-[#06c006] rounded-full animate-spin" />
          <p className="text-xs text-[var(--color-muted)] font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = company?.name || (user as any)?.companyName || 'Organization Profile';
  const initials = displayName.split(' ').map((w: string) => w[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'CO';
  const cleanWebsite = (company?.website || '').replace(/^https?:\/\//, '');
  const activeJobs = opportunities.filter(o => o.status === 'active');
  const techStackList = formData.techStack.split(',').map(s => s.trim()).filter(Boolean);
  const perksList = formData.perks.split(',').map(s => s.trim()).filter(Boolean);

  const inputStyle = {
    background: 'var(--color-input-bg)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  };

  return (
    <div className="max-w-5xl space-y-8 pb-16 font-sans">

      {/* Hidden File Input for Logo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLogoFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* ── Top Header ── */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Company Profile
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">
            Manage your organization identity, logo, culture, and hiring presence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'edit' ? 'overview' : 'edit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'edit'
                ? 'hiero-btn-ghost'
                : 'bg-[var(--color-surface-2)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[#06c006]/40'
            }`}
          >
            {activeTab === 'edit' ? <><X size={15} /> Exit Editing</> : <><Edit3 size={15} /> Edit Profile</>}
          </button>
        </div>
      </div>

      {/* ── Hero Profile Card ── */}
      <div className="cp-card rounded-3xl overflow-hidden animate-card-in border shadow-2xl"
        style={{ borderColor: 'var(--color-border)' }}>

        {/* Cover Banner */}
        <div className="h-44 sm:h-52 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6,192,6,0.22) 0%, rgba(168,85,247,0.15) 50%, rgba(6,192,6,0.04) 100%)',
          }}>
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(6,192,6,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,192,6,0.4) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-lg">
              <ShieldCheck size={13} className="text-[#06c006]" /> Verified Employer
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#06c006]/20 backdrop-blur-md text-[#06c006] border border-[#06c006]/30 flex items-center gap-1.5">
              <Sparkles size={13} /> AI Partner
            </span>
          </div>
        </div>

        {/* Header Info & Avatar Overlay */}
        <div className="px-6 sm:px-8 pb-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            
            {/* Logo Badge with Upload Trigger */}
            <div className="flex items-end gap-5">
              <div className="relative group">
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center text-4xl font-black border-4 flex-shrink-0 shadow-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6,192,6,0.2) 0%, rgba(6,192,6,0.08) 100%)',
                    borderColor: 'var(--color-card)',
                    color: '#06c006',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  {company?.logoUrl || formData.logoUrl ? (
                    <img
                      src={formData.logoUrl || company?.logoUrl}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    initials
                  )}
                </div>

                {/* Upload Hover Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/70 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                >
                  <Camera size={20} className="text-[#06c006]" />
                  <span>Upload Logo</span>
                </button>
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text)] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {displayName}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-muted)] font-medium mt-1">
                  <span className="flex items-center gap-1.5"><Building2 size={14} className="text-[#06c006]" /> {company?.industry || 'Technology'}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#06c006]" /> {company?.location || 'Bangalore, India'}</span>
                  <span className="flex items-center gap-1.5"><Users size={14} className="text-[#06c006]" /> {company?.size || '11-50'} Employees</span>
                </div>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex items-center gap-3 pb-1">
              {company?.website && (
                <a
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 text-[var(--color-text)] hover:border-[#06c006]/40"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                >
                  <Globe size={14} className="text-[#06c006]" /> {cleanWebsite} <ExternalLink size={12} />
                </a>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#06c006]/15 border border-[#06c006]/30 text-[#06c006] hover:bg-[#06c006]/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Upload size={14} /> Upload Logo
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pt-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Culture', icon: Building2 },
              { id: 'jobs', label: `Active Roles (${activeJobs.length})`, icon: Briefcase },
              { id: 'team', label: 'Recruitment Team', icon: Users },
              { id: 'edit', label: 'Edit Info & Logo', icon: Edit3 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#06c006] text-[#06c006]'
                    : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Main 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="cp-card rounded-3xl p-6 border space-y-3" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                <Sparkles size={16} className="text-[#06c006]" /> About {displayName}
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed font-medium">
                {company?.description || `${displayName} is an innovative organization connected with HIERO to recruit top verified tech candidates.`}
              </p>
            </div>

            {/* Core Tech Stack */}
            <div className="cp-card rounded-3xl p-6 border space-y-3" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                <Code2 size={16} className="text-[#06c006]" /> Core Tech Stack & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStackList.map(tech => (
                  <span key={tech} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#06c006]/10 border border-[#06c006]/20 text-[#06c006]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Perks */}
            <div className="cp-card rounded-3xl p-6 border space-y-4" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                <Heart size={16} className="text-[#06c006]" /> Employee Perks & Culture
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {perksList.map(perk => (
                  <div key={perk} className="p-3 rounded-2xl border flex items-center gap-3"
                    style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                    <div className="p-1.5 rounded-xl bg-[#06c006]/15 text-[#06c006]">
                      <Check size={14} />
                    </div>
                    <span className="text-xs font-bold text-[var(--color-text)]">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col Sidebar */}
          <div className="space-y-6">
            <div className="cp-card rounded-3xl p-6 border space-y-4" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">Company Snapshot</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-muted)]">Industry</span>
                  <span className="font-bold text-[var(--color-text)]">{company?.industry}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-muted)]">Company Size</span>
                  <span className="font-bold text-[var(--color-text)]">{company?.size} employees</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-muted)]">Location</span>
                  <span className="font-bold text-[var(--color-text)]">{company?.location}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[var(--color-muted)]">HIERO Status</span>
                  <span className="font-bold text-[#06c006]">✓ Verified Partner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TAB */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSave} className="cp-card rounded-3xl p-6 sm:p-8 border space-y-6 animate-fade-in"
          style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            <div>
              <h3 className="text-lg font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Edit Organization Profile
              </h3>
              <p className="text-xs text-[var(--color-muted)] font-medium">Update your company details, logo, tech stack, and benefits.</p>
            </div>
            {saved && (
              <span className="text-xs font-bold text-[#06c006] bg-[#06c006]/15 border border-[#06c006]/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Profile Saved!
              </span>
            )}
          </div>

          {/* Dedicated Company Logo Upload Box */}
          <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/[0.03] space-y-4" style={{ borderColor: 'var(--color-border)' }}>
            <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={16} className="text-[#06c006]" /> Company Brand Logo Upload
            </h4>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Preview Avatar */}
              <div className="w-20 h-20 rounded-2xl border-2 border-[#06c006]/40 flex items-center justify-center overflow-hidden flex-shrink-0 bg-black/10"
                style={{ fontFamily: 'Outfit, sans-serif' }}>
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black text-[#06c006]">{initials}</span>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="hiero-btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Upload size={14} /> Choose Logo File (PNG/JPG/SVG)
                  </button>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 border border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-muted)] mb-1">Or Paste Direct Logo Image URL</label>
                  <input
                    type="text"
                    value={formData.logoUrl.startsWith('data:') ? '' : formData.logoUrl}
                    onChange={e => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder={formData.logoUrl.startsWith('data:') ? '✓ File Uploaded (Base64 Logo Image Attached)' : 'https://example.com/company-logo.png'}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-[#06c006]"
                    style={inputStyle}
                  />
                  {formData.logoUrl.startsWith('data:') && (
                    <p className="text-[10px] text-[#06c006] font-semibold mt-1">
                      ✓ Local logo file successfully attached and saved!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">Company Size</label>
              <select
                value={formData.size}
                onChange={e => setFormData(prev => ({ ...prev, size: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                style={inputStyle}
              >
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="501-1000">501-1000 Employees</option>
                <option value="1000+">1000+ Employees</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">Website URL</label>
              <input
                type="text"
                value={formData.website}
                onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://company.com"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006]"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] uppercase mb-1">About Company</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#06c006] resize-none"
              style={inputStyle}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
            <button
              type="submit"
              disabled={saving}
              className="hiero-btn-primary text-sm font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              Save Profile Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
