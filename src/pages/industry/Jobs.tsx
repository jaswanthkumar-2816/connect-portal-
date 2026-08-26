import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Clock, Briefcase, ChevronRight } from 'lucide-react';
import { getOpportunities } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import type { Opportunity } from '../../types';
import { formatDate } from '../../lib/utils';

const TABS = [
  { id: 'active', label: 'Active', dot: 'bg-[#06c006]' },
  { id: 'draft',  label: 'Drafts', dot: 'bg-amber-500' },
  { id: 'closed', label: 'Closed', dot: 'bg-slate-400' },
];

export default function Jobs() {
  const user = useAuthStore(s => s.user);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getOpportunities(user.companyId).then(o => {
        setOpportunities(o);
        setLoading(false);
      });
    }
  }, [user]);

  const filtered = opportunities.filter(o => o.status === activeTab);
  const counts: Record<string, number> = {
    active: opportunities.filter(o => o.status === 'active').length,
    draft:  opportunities.filter(o => o.status === 'draft').length,
    closed: opportunities.filter(o => o.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-[#06c006]/30 border-t-[#06c006] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Jobs & Internships
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">{opportunities.length} total opportunities</p>
        </div>
        <Link to="/industry/create" className="hiero-btn-primary text-sm font-bold shadow-[0_0_20px_rgba(6,192,6,0.2)]">
          <Plus size={16} /> Create Opportunity
        </Link>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 p-1 rounded-xl w-fit border"
        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30 shadow-sm'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.id ? tab.dot : 'bg-[var(--color-muted)]'}`} />
            {tab.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-0.5 ${
              activeTab === tab.id ? 'bg-[#06c006]/20 text-[#06c006]' : 'bg-black/5 dark:bg-white/5 text-[var(--color-muted)]'
            }`}>
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Job List */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed"
          style={{ background: 'var(--color-surface-3)', borderColor: 'var(--color-border)' }}
        >
          <Briefcase size={36} className="text-[var(--color-muted)] mb-3 opacity-40" />
          <p className="text-sm font-bold text-[var(--color-muted)]">No {activeTab} opportunities</p>
          <p className="text-xs text-[var(--color-muted)] mt-1 mb-4 font-medium">Create a new opportunity to get started.</p>
          <Link to="/industry/create" className="hiero-btn-primary text-sm font-bold">
            <Plus size={15} /> Create Opportunity
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job, i) => (
            <Link
              key={job.id}
              to={`/industry/jobs/${job.id}`}
              className="block cp-card rounded-2xl p-5 hiero-card-hover transition-all duration-300 group animate-card-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Left: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[#06c006] transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {job.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${
                      job.type === 'internship' ? 'tag-skill-purple' : 'tag-skill-blue'
                    }`}>
                      {job.type === 'internship' ? 'Internship' : 'Full-time'}
                    </span>
                    {job.status === 'draft' && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Draft
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)] font-semibold mb-3">
                    <span className="flex items-center gap-1.5"><MapPin size={12} />{job.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={12} />{job.workMode}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} />Deadline: {formatDate(job.deadline)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 4).map(s => (
                      <span key={s.name} className="tag-skill-green">{s.name}</span>
                    ))}
                    {job.preferredSkills.slice(0, 2).map(s => (
                      <span key={s.name} className="tag-skill-purple">{s.name}</span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="tag-skill-gray">+{job.requiredSkills.length - 4}</span>
                    )}
                  </div>
                </div>

                {/* Right: stats */}
                <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-2 text-center sm:text-right">
                  <div>
                    <div className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{job.applicantsCount}</div>
                    <div className="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wide">Applicants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#06c006]" style={{ fontFamily: 'Outfit, sans-serif' }}>{job.shortlistedCount}</div>
                    <div className="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wide">Shortlisted</div>
                  </div>
                  <ChevronRight size={16} className="text-[var(--color-muted)] group-hover:text-[#06c006] group-hover:translate-x-0.5 transition-all hidden sm:block" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
