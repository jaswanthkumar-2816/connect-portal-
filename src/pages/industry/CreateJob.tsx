import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, X } from 'lucide-react';
import { createOpportunity } from '../../services/hiroService';
import { useAuthStore } from '../../store/authStore';
import { employmentTypeFor, getOpportunityTypeLabel } from '../../lib/utils';
import { profileFor } from '../../lib/industries';
import type { OpportunityType, SkillRequirement } from '../../types';

// What a company is offered depends on its trade. A salon is shown Full-time,
// Part-time, Trainee and Contract with salon examples; a software company
// still gets Internship and Project. See src/lib/industries.ts for why.

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">{children}</label>;
}

function parseSkillChips(raw: string): SkillRequirement[] {
  return raw
    .split(/[,;\n]+/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(name => ({ name, importance: 'high' as const, category: 'required' as const }));
}

export default function CreateJob() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const profile = profileFor(user?.industry);
  const POST_TYPES = profile.types;

  const [formData, setFormData] = useState({
    // The first shape this trade actually hires in, not a campus internship.
    type: profile.types[0].id as OpportunityType,
    title: '',
    description: '',
    eligibility: '',
    location: '',
    salary: '',
    deadline: '',
  });

  const update = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const placeholders = profile.example;
  const typeMeta = POST_TYPES.find(t => t.id === formData.type);

  const addSkillsFromInput = (raw: string) => {
    const next = parseSkillChips(raw).map(s => s.name);
    if (!next.length) return;
    setSkills(prev => [...prev, ...next.filter(n => !prev.some(p => p.toLowerCase() === n.toLowerCase()))]);
    setSkillInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user?.companyId) {
      setError('Sign in with a company account first.');
      return;
    }
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    const fromInput = parseSkillChips(skillInput).map(s => s.name);
    const requiredSkills = [...skills, ...fromInput.filter(n => !skills.some(s => s.toLowerCase() === n.toLowerCase()))]
      .map(name => ({ name, importance: 'high' as const, category: 'required' as const }));
    if (!requiredSkills.length) {
      setError('Add at least one required skill — Hiero scores applies against this JD.');
      return;
    }

    const employmentType = employmentTypeFor(formData.type);

    setPublishing(true);
    try {
      const opp = await createOpportunity({
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        requiredSkills,
        preferredSkills: [],
        eligibility: formData.eligibility.trim() || 'Open',
        location: formData.location.trim() || 'India',
        workMode: 'hybrid',
        employmentType,
        salary: formData.salary.trim() || 'Not specified',
        deadline: formData.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        department: employmentType,
        companyName: user.companyName,
      }, user.companyId);
      navigate(`/industry/applications?job=${encodeURIComponent(opp.id)}`);
    } catch {
      setError('Publish failed. The post was saved locally if the backends were unreachable.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--color-text)]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Post opportunity</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1 font-medium">
          Published as {user?.companyName || 'your company'}. The skills you list are what applicants are scored against.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 cp-card rounded-2xl p-6">
        <div>
          <FieldLabel>Type</FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POST_TYPES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => update('type', t.id)}
                className={`px-3 py-2.5 rounded-xl text-left transition-all ${
                  formData.type === t.id
                    ? 'bg-[#06c006]/15 text-[#06c006] border border-[#06c006]/30'
                    : 'text-[var(--color-muted)] border border-[var(--color-border)] hover:border-[#06c006]/30'
                }`}
              >
                <div className="text-sm font-bold">{t.label}</div>
                <div className="text-[10px] font-medium mt-0.5 opacity-80 leading-snug">{t.hint}</div>
              </button>
            ))}
          </div>
          {typeMeta && (
            <p className="text-[11px] text-[var(--color-muted)] mt-2 font-medium">
              Posting as <span className="text-[var(--color-text)] font-bold">{getOpportunityTypeLabel(formData.type)}</span>
            </p>
          )}
        </div>

        <div>
          <FieldLabel>Title</FieldLabel>
          <input
            value={formData.title}
            onChange={e => update('title', e.target.value)}
            placeholder={placeholders.title}
            className="hiero-input w-full"
          />
        </div>

        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            value={formData.description}
            onChange={e => update('description', e.target.value)}
            rows={6}
            placeholder={placeholders.description}
            className="hiero-input w-full resize-y min-h-[140px]"
          />
        </div>

        <div>
          <FieldLabel>Required skills</FieldLabel>
          <p className="text-[11px] text-[var(--color-muted)] mb-2 font-medium">Hiero scores applies against these skills. Press Enter or comma to add.</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {skills.map(s => (
              <span key={s} className="inline-flex items-center gap-1 tag-skill-green">
                {s}
                <button type="button" onClick={() => setSkills(prev => prev.filter(x => x !== s))} aria-label={`Remove ${s}`}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <input
            value={skillInput}
            onChange={e => {
              const v = e.target.value;
              if (v.endsWith(',') || v.endsWith(';')) addSkillsFromInput(v);
              else setSkillInput(v);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkillsFromInput(skillInput);
              }
            }}
            onBlur={() => addSkillsFromInput(skillInput)}
            placeholder={placeholders.skills}
            className="hiero-input w-full"
          />
        </div>

        <div>
          <FieldLabel>Eligibility</FieldLabel>
          <input
            value={formData.eligibility}
            onChange={e => update('eligibility', e.target.value)}
            placeholder={placeholders.eligibility}
            className="hiero-input w-full"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Location</FieldLabel>
            <input
              value={formData.location}
              onChange={e => update('location', e.target.value)}
              placeholder="Bangalore / Remote"
              className="hiero-input w-full"
            />
          </div>
          <div>
            <FieldLabel>
              {formData.type === 'full-time' ? 'CTC' : formData.type === 'project' ? 'Pay / stipend' : 'Stipend / CTC'}
            </FieldLabel>
            <input
              value={formData.salary}
              onChange={e => update('salary', e.target.value)}
              placeholder={placeholders.salary}
              className="hiero-input w-full"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Deadline</FieldLabel>
          <input
            type="date"
            value={formData.deadline}
            onChange={e => update('deadline', e.target.value)}
            className="hiero-input w-full"
          />
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm text-red-500 font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={publishing}
          className="hiero-btn-primary w-full justify-center py-3.5 font-bold"
        >
          {publishing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>Publish {getOpportunityTypeLabel(formData.type).toLowerCase()} <ArrowRight size={16} /></>
          )}
        </button>
      </form>
    </div>
  );
}
