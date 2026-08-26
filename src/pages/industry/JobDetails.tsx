import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Briefcase, DollarSign, Eye } from 'lucide-react';
import Card from '../../components/ui/Card';
import SkillTag from '../../components/skills/SkillTag';
import { getOpportunityById } from '../../services/hiroService';
import type { Opportunity } from '../../types';
import { formatDate } from '../../lib/utils';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (id) {
      getOpportunityById(id).then(j => { setJob(j); setLoading(false); setTimeout(() => setVisible(true), 100); });
    }
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-[#06c006] border-t-transparent rounded-full" /></div>;
  }

  if (!job) {
    return <div className="text-center py-20 text-[var(--color-muted)] font-medium">Job not found</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <button onClick={() => navigate(-1)} className={`flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] font-bold transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Outfit, sans-serif' }}>{job.title}</h1>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30">
              {job.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)] font-semibold">
            <span className="flex items-center gap-1"><Briefcase size={14} />{job.type === 'internship' ? 'Internship' : 'Full-time'}</span>
            <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
            <span className="flex items-center gap-1"><Clock size={14} />Deadline: {formatDate(job.deadline)}</span>
          </div>
        </div>
        <Link to={`/industry/matches/${job.id}`}>
          <button className="hiero-btn-primary text-sm font-bold shadow-[0_0_20px_rgba(6,192,6,0.2)]">
            <Eye size={16} /> View Matches
          </button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`p-6 hiero-hover-glow transition-all duration-500 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Description</h2>
            <p className="text-[var(--color-text)] text-sm font-medium leading-relaxed whitespace-pre-line">{job.description}</p>
          </Card>

          <Card className={`p-6 hiero-hover-glow transition-all duration-500 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map(s => <SkillTag key={s.name} name={s.name} variant="required" size="md" />)}
            </div>
          </Card>

          {job.preferredSkills.length > 0 && (
            <Card className={`p-6 hiero-hover-glow transition-all duration-500 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Preferred Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.preferredSkills.map(s => <SkillTag key={s.name} name={s.name} variant="preferred" size="md" />)}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className={`p-6 hiero-hover-glow transition-all duration-500 delay-150 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="font-bold text-[var(--color-text)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold">
                <DollarSign size={16} className="text-[#06c006]" />
                <div><span className="text-[var(--color-muted)]">Salary:</span> <span className="font-bold text-[var(--color-text)]">{job.salary}</span></div>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <MapPin size={16} className="text-[#06c006]" />
                <div><span className="text-[var(--color-muted)]">Work Mode:</span> <span className="font-bold text-[var(--color-text)] capitalize">{job.workMode}</span></div>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <Briefcase size={16} className="text-[#06c006]" />
                <div><span className="text-[var(--color-muted)]">Department:</span> <span className="font-bold text-[var(--color-text)]">{job.department}</span></div>
              </div>
            </div>
          </Card>

          <Card className={`p-6 hiero-hover-glow transition-all duration-500 delay-250 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="font-bold text-[var(--color-text)] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Application Stats</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                <div className="text-2xl font-black text-[var(--color-text)]">{job.applicantsCount}</div>
                <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase">Applicants</div>
              </div>
              <div className="p-3 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                <div className="text-2xl font-black text-[#06c006]">{job.shortlistedCount}</div>
                <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase">Shortlisted</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
