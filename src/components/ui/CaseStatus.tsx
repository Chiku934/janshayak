import React from 'react';
import { CaseStatusType } from '../../types/case';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Search, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CaseStatusProgressProps {
  currentStatus: CaseStatusType;
  className?: string;
}

const STEPS: { status: CaseStatusType; label: string; sublabel: string }[] = [
  { status: 'SUBMITTED', label: '1. Registered', sublabel: 'Voice/Web intake' },
  { status: 'AI_TRIAGED', label: '2. Triaged', sublabel: 'AI classification' },
  { status: 'ASSIGNED', label: '3. Assigned', sublabel: 'Ward Officer allocated' },
  { status: 'ACTION_IN_PROGRESS', label: '4. In Action', sublabel: 'Field crew resolving' },
  { status: 'RESOLVED', label: '5. Resolved', sublabel: 'Verified & closed' },
];

export const CaseStatus: React.FC<CaseStatusProgressProps> = ({ currentStatus, className }) => {
  const getStepIndex = (status: CaseStatusType) => {
    switch (status) {
      case 'SUBMITTED':
        return 0;
      case 'AI_TRIAGED':
        return 1;
      case 'ASSIGNED':
      case 'UNDER_INVESTIGATION':
        return 2;
      case 'FIELD_INSPECTION':
      case 'ACTION_IN_PROGRESS':
        return 3;
      case 'RESOLVED':
        return 4;
      case 'ESCALATED':
        return 2.5;
      case 'REJECTED':
        return -1;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);
  const isEscalated = currentStatus === 'ESCALATED';
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div className={cn('w-full py-3', className)}>
      {isEscalated && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Case escalated to District Collectorate Oversight Cell due to SLA urgency.</span>
        </div>
      )}

      {isRejected && (
        <div className="mb-4 p-3 rounded-lg bg-slate-100 border border-slate-300 flex items-center gap-2 text-slate-700 text-xs font-medium">
          <XCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Case rejected / duplicate detected. Contact ward helpline if you believe this is an error.</span>
        </div>
      )}

      <div className="relative flex items-center justify-between">
        {/* Progress connecting track */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(0, (activeIndex / (STEPS.length - 1)) * 100))}%`,
            }}
          />
        </div>

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= activeIndex && !isRejected;
          const isCurrent = idx === Math.floor(activeIndex) && !isRejected;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center group">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs border-2',
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 scale-110'
                    : isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-400 border-slate-300'
                )}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-semibold mt-2 whitespace-nowrap',
                  isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                )}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block">
                {step.sublabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
