import React, { useState } from 'react';
import { Sparkles, Check, Edit3, Plus, X, Brain } from 'lucide-react';
import SkillTag from './SkillTag';
import Button from '../ui/Button';

interface SkillData {
  name: string;
  importance: 'high' | 'medium' | 'low';
  category: 'required' | 'preferred';
}

interface SkillExtractionProps {
  coreSkills: SkillData[];
  additionalSkills: SkillData[];
  isAnalyzing?: boolean;
  onComplete?: (core: SkillData[], additional: SkillData[]) => void;
  onChange?: (core: any, additional: any) => void;
}

export default function SkillExtraction({ coreSkills, additionalSkills, isAnalyzing = false, onComplete }: SkillExtractionProps) {
  const [skills, setSkills] = useState<{ core: SkillData[]; additional: SkillData[] }>({
    core: coreSkills,
    additional: additionalSkills,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'core' | 'additional'>('core');

  const removeSkill = (category: 'core' | 'additional', index: number) => {
    setSkills(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skill: SkillData = { name: newSkill.trim(), importance: 'medium', category: newSkillCategory === 'core' ? 'required' : 'preferred' };
    setSkills(prev => ({
      ...prev,
      [newSkillCategory]: [...prev[newSkillCategory], skill],
    }));
    setNewSkill('');
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-2xl bg-hiero-green/10 border border-hiero-green/20 flex items-center justify-center animate-logo-pulse">
            <Brain className="w-10 h-10 text-hiero-green" />
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-hiero-green rounded-full" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-hiero-green/60 rounded-full" />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">HIERO Skill Intelligence</h3>
        <p className="text-hiero-muted text-sm mb-6">Analyzing this opportunity for required skills...</p>

        {/* Animated progress */}
        <div className="w-72 space-y-2">
          <div className="h-1.5 bg-hiero-dark-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-hiero-green/60 to-hiero-green rounded-full"
              style={{ animation: 'loading 2s ease-in-out infinite' }}
            />
          </div>
          <div className="flex justify-between text-xs text-hiero-muted">
            <span>Parsing job description</span>
            <span className="text-hiero-green">HIERO AI</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-hiero-green" />
          HIERO Identified Skills
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
          <Edit3 size={14} />
          {isEditing ? 'Done' : 'Edit'}
        </Button>
      </div>

      {/* Core Skills */}
      <div>
        <h4 className="text-sm font-medium text-hiero-muted mb-3 uppercase tracking-wider">Required Skills</h4>
        <div className="flex flex-wrap gap-2">
          {skills.core.map((skill, i) => (
            <div key={i} className="flex items-center gap-1 animate-scale-in" style={{ animationDelay: `${i * 50}ms` }}>
              <SkillTag name={skill.name} variant="required" size="md" />
              {isEditing && (
                <button onClick={() => removeSkill('core', i)} className="p-0.5 rounded hover:bg-red-500/20 text-hiero-muted hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Skills */}
      {skills.additional.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-hiero-muted mb-3 uppercase tracking-wider">Preferred Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skills.additional.map((skill, i) => (
              <div key={i} className="flex items-center gap-1 animate-scale-in" style={{ animationDelay: `${(skills.core.length + i) * 50}ms` }}>
                <SkillTag name={skill.name} variant="preferred" size="md" />
                {isEditing && (
                  <button onClick={() => removeSkill('additional', i)} className="p-0.5 rounded hover:bg-red-500/20 text-hiero-muted hover:text-red-400 transition-colors">
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Skill */}
      {isEditing && (
        <div className="flex items-center gap-2 pt-2 border-t border-hiero-border animate-fade-in">
          <input
            type="text"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSkill()}
            placeholder="Add a skill..."
            className="flex-1 bg-hiero-dark-2 border border-hiero-border rounded-lg px-3 py-2 text-sm text-white placeholder-hiero-muted focus:outline-none focus:border-hiero-green transition-colors"
          />
          <select
            value={newSkillCategory}
            onChange={e => setNewSkillCategory(e.target.value as 'core' | 'additional')}
            className="bg-hiero-dark-2 border border-hiero-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-hiero-green"
          >
            <option value="core">Required</option>
            <option value="additional">Preferred</option>
          </select>
          <Button size="sm" onClick={addSkill}>
            <Plus size={14} /> Add
          </Button>
        </div>
      )}

      {/* Skill Importance Table */}
      <div className="bg-hiero-dark-2/60 rounded-xl border border-hiero-border overflow-hidden">
        <div className="grid grid-cols-3 gap-4 px-4 py-3 text-xs font-medium text-hiero-muted uppercase tracking-wider border-b border-hiero-border">
          <span>Skill</span>
          <span>Importance</span>
          <span>Category</span>
        </div>
        {[...skills.core.map(s => ({ ...s, importance: s.importance as string })), ...skills.additional.map(s => ({ ...s, importance: s.importance as string }))].map((skill, i) => (
          <div key={i} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm border-b border-hiero-border/50 last:border-0 hover:bg-hiero-dark-3/50 transition-colors">
            <span className="font-medium">{skill.name}</span>
            <span className={`font-medium ${skill.importance === 'high' ? 'text-hiero-green' : skill.importance === 'medium' ? 'text-yellow-400' : 'text-hiero-muted'}`}>
              {skill.importance.toUpperCase()}
            </span>
            <span className="text-hiero-muted">{skill.category === 'required' ? 'Required' : 'Preferred'}</span>
          </div>
        ))}
      </div>

      {onComplete && (
        <div className="flex justify-end">
          <Button onClick={() => onComplete(skills.core, skills.additional)}>
            <Check size={16} /> Confirm & Publish Skills
          </Button>
        </div>
      )}
    </div>
  );
}
