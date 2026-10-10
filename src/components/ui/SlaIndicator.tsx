import React from 'react';
import { getCaseSlaStatus, SlaStatusState } from '../../utils/formatters';
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SlaIndicatorProps {
  slaDays?: number;
  slaDeadline?: string;
  submittedAt?: string;
  status?: string;
  showProgressBar?: boolean;
  compact?: boolean;
  className?: string;
}

export const SlaIndicator: React.FC<SlaIndicatorProps> = ({
  slaDays = 3,
  slaDeadline,
  submittedAt,
  status,
  showProgressBar = false,
  compact = false,
  className,
}) => {
  const slaInfo = getCaseSlaStatus(slaDays, slaDeadline, submittedAt, status);

  const getStatusIcon = (slaState: SlaStatusState) => {
    switch (slaState) {
      case 'Breached':
        return <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />;
      case 'At Risk':
        return <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />;
      case 'SLA Safe':
        return <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />;
    }
  };

  if (compact) {
    return (
      <div className={cn('inline-flex items-center gap-1.5', className)}>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border',
            slaInfo.badgeClass
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full', slaInfo.dotColor)} />
          <span>{slaInfo.status}</span>
        </span>
        <span className="text-[11px] font-medium text-slate-500">
          {slaInfo.timeRemainingText}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs',
            slaInfo.badgeClass
          )}
        >
          <span className={cn('w-2 h-2 rounded-full', slaInfo.dotColor)} />
          {getStatusIcon(slaInfo.status)}
          <span>{slaInfo.status}</span>
        </span>

        <span className="text-xs font-bold text-slate-800">
          {slaInfo.timeRemainingText}
        </span>
      </div>

      {showProgressBar && (
        <div className="space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                slaInfo.isBreached
                  ? 'bg-rose-600'
                  : slaInfo.isAtRisk
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              )}
              style={{ width: `${Math.max(8, slaInfo.percentRemaining)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Duration: {slaInfo.durationText}</span>
            <span>Target SLA</span>
          </div>
        </div>
      )}
    </div>
  );
};
