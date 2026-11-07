import { Link } from 'react-router-dom';
import {
  Users, Fingerprint, CalendarClock, TrendingUp, Receipt, BarChart3, Mic,
  ArrowRight, Lock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// Workforce modules
// ============================================================
// Connect runs the hiring half today: post a role, read the applies, send the
// interview. The other half — the people you have already hired — is mapped
// out here but not built, and these pages say so rather than showing an empty
// table that looks broken.
//
// Each one names what it will do and what it is waiting on, so the shape of
// the product is visible while the work is honest about where it stops.

export type ModuleSlug =
  | 'interviews' | 'employees' | 'attendance' | 'shifts' | 'performance' | 'payroll' | 'analytics';

interface ModuleSpec {
  title: string;
  icon: LucideIcon;
  purpose: string;
  does: string[];
  /** What has to exist before this can be built. Stated plainly. */
  needs: string;
  /** The module this one reads from, so the order of work is visible. */
  after?: { slug: ModuleSlug | 'hiring'; label: string };
}

export const MODULES: Record<ModuleSlug, ModuleSpec> = {
  interviews: {
    title: 'AI Interviews',
    icon: Mic,
    purpose: 'Voice interviews run by HIERO, with a report you read before you meet anyone.',
    does: [
      'Send a candidate a voice interview for the role they applied to',
      'Score the answers against the skills on the job post',
      'Show a summary on the application — never the raw recording',
    ],
    needs: 'HIERO already runs practice interviews and can return a recruiter-facing summary. What is missing is sending one from an application and getting the result back on it.',
    after: { slug: 'hiring', label: 'Applications' },
  },
  employees: {
    title: 'Employees',
    icon: Users,
    purpose: 'Everyone working for you, continuing from the person you hired — not typed in again.',
    does: [
      'Turn a hired applicant into an employee record in one step',
      'Keep the resume, contact details and interview history attached',
      'Onboarding checklist: documents, joining date, role, salary',
      'Branches, so a second shop is not a second account',
    ],
    needs: 'Marking an application "hired" has to create the employee record and carry the file across. That link is the whole point — everything below reads from it.',
    after: { slug: 'hiring', label: 'Applications' },
  },
  attendance: {
    title: 'Attendance',
    icon: Fingerprint,
    purpose: 'Who actually turned up, from the fingerprint machine on the wall.',
    does: [
      'Pull punches from a biometric device on a schedule',
      'Daily present / absent / late per employee',
      'Flag missing punch-outs instead of silently losing the day',
      'Month view that payroll can read',
    ],
    needs: 'A real device. Each manufacturer speaks its own protocol, and this cannot be written honestly without one on the desk to test against.',
    after: { slug: 'employees', label: 'Employees' },
  },
  shifts: {
    title: 'Shift & Leave',
    icon: CalendarClock,
    purpose: 'Who is rostered when, and who asked to be off.',
    does: [
      'Weekly roster per employee and per branch',
      'Leave requests with approve / reject',
      'Leave balance per person',
      'Attendance read against the shift, so late means late for that shift',
    ],
    needs: 'Employee records first. Attendance becomes far more useful once it knows the shift a punch belongs to.',
    after: { slug: 'employees', label: 'Employees' },
  },
  performance: {
    title: 'Performance',
    icon: TrendingUp,
    purpose: 'Reviews and targets, kept next to the rest of the record.',
    does: [
      'Review cycles with notes against each employee',
      'Targets per role — a stylist and a receptionist are not judged the same',
      'History, so a review reads against the last one',
    ],
    needs: 'Employee records, and enough attendance history for a review to mean anything.',
    after: { slug: 'employees', label: 'Employees' },
  },
  payroll: {
    title: 'Payroll Reports',
    icon: Receipt,
    purpose: 'What each person is owed this month, worked out from days present.',
    does: [
      'Monthly sheet: days present, leave taken, salary due',
      'Export for whoever actually makes the payment',
      'Advances and deductions recorded against the month',
    ],
    needs: 'Attendance has to be real first — a payroll figure from guessed attendance is worse than none. This stays a report you check and act on, not automatic payment: moving money brings statutory obligations that belong in a deliberate decision, not a side effect.',
    after: { slug: 'attendance', label: 'Attendance' },
  },
  analytics: {
    title: 'Analytics',
    icon: BarChart3,
    purpose: 'The business view across hiring and the people you already have.',
    does: [
      'Time to hire, applies per role, where candidates drop out',
      'Attendance and absence trends by branch',
      'Headcount and cost of the team over time',
    ],
    needs: 'Everything above. An analytics page is only as honest as the data underneath it, so this one comes last on purpose.',
    after: { slug: 'employees', label: 'the modules above' },
  },
};

export default function ModulePage({ slug }: { slug: ModuleSlug }) {
  const mod = MODULES[slug];
  const Icon = mod.icon;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="animate-slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent-border)' }}
          >
            <Icon size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-text)' }}>
                {mod.title}
              </h1>
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
              >
                <Lock size={9} /> Not built yet
              </span>
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>{mod.purpose}</p>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-5 animate-card-in"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted-2)' }}>What this will do</p>
        <ul className="space-y-2.5">
          {mod.does.map(line => (
            <li key={line} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-text-dim)' }}>
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-accent)' }} />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="rounded-2xl p-5 animate-card-in"
        style={{ background: 'var(--color-bg-2)', border: '1px dashed var(--color-border)', animationDelay: '60ms' }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-muted-2)' }}>Before this can be built</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{mod.needs}</p>

        {mod.after && (
          <Link
            to={mod.after.slug === 'hiring' ? '/industry/applications' : `/industry/${mod.after.slug}`}
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-accent)' }}
          >
            Reads from {mod.after.label} <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}
