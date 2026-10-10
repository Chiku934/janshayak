import React from 'react';
import { CaseItem } from '../../types/case';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Badge } from '../../components/ui/Badge';
import { formatDate, getRemainingSlaDays } from '../../utils/formatters';
import { getPriorityConfig } from '../../utils/helpers';
import { Clock, MapPin, Building2, User, ChevronRight, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface CaseCardProps {
  item: CaseItem;
  viewMode?: 'citizen' | 'officer' | 'admin';
  onActionClick?: (item: CaseItem) => void;
  className?: string;
}

export const CaseCard: React.FC<CaseCardProps> = ({
  item,
  viewMode = 'citizen',
  onActionClick,
  className,
}) => {
  const navigate = useNavigate();
  const priorityConfig = getPriorityConfig(item.priority);
  const slaInfo = getRemainingSlaDays(item.slaDeadline);

  const getDetailLink = () => {
    if (viewMode === 'officer') return `/officer/cases/${item.id}`;
    if (viewMode === 'admin') return `/admin/cases/${item.id}`;
    return `/citizen/cases/${item.id}`;
  };

  return (
    <Card
      hoverable
      onClick={() => navigate(getDetailLink())}
      className={cn('p-5 flex flex-col justify-between cursor-pointer group', className)}
    >
      <div>
        {/* Card Top Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {item.id}
            </span>
            <span
              className={cn(
                'text-[11px] px-2 py-0.5 rounded-full font-semibold border',
                priorityConfig.badge
              )}
            >
              {priorityConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
          {item.title}
        </h4>
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {item.description}
        </p>

        {/* Key Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.department}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.ward}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium">{item.citizen.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span
              className={cn(
                'font-semibold text-xs',
                slaInfo.isBreached
                  ? 'text-rose-600'
                  : item.status === 'RESOLVED'
                  ? 'text-emerald-600'
                  : 'text-amber-600'
              )}
            >
              {item.status === 'RESOLVED' ? 'Resolved within SLA' : slaInfo.text}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>Logged: {formatDate(item.submittedAt)}</span>
          {item.evidence.length > 0 && (
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <FileText className="w-3 h-3 text-slate-400" />
              {item.evidence.length} files
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Card>
  );
};
