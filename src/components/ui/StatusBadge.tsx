import React from 'react';
import { CaseStatusType } from '../../types/case';
import { getStatusConfig } from '../../utils/helpers';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: CaseStatusType;
  showDot?: boolean;
  className?: string;
  hindiSubtext?: boolean;
  odiaSubtext?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
  className,
  hindiSubtext = false,
  odiaSubtext,
}) => {
  const config = getStatusConfig(status);
  const showVernacular = odiaSubtext ?? hindiSubtext;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showDot && <span className={cn('w-2 h-2 rounded-full shrink-0', config.dot)} />}
      <span>{config.label}</span>
      {showVernacular && (
        <span className="opacity-75 text-[10px] font-normal ml-1">({config.labelHi})</span>
      )}
    </span>
  );
};
