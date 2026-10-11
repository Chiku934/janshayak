import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CaseCard } from '../../features/cases/CaseCard';
import { formatDateTime, getRemainingSlaDays } from '../../utils/formatters';
import { AlertTriangle, Clock, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SlaMonitorPage: React.FC = () => {
  const { cases, updateCaseStatus } = useAppStore();

  const escalatedCases = cases.filter((c) => c.status === 'ESCALATED' || c.isSlaBreached);
  const criticalCases = cases.filter((c) => c.priority === 'CRITICAL');

  const handleCollectorIntervention = (caseId: string) => {
    updateCaseStatus(
      caseId,
      'ACTION_IN_PROGRESS',
      'Direct District Magistrate Intervention: Special Engineering Taskforce deployed under executive order #DM-PUN-2026-081.'
    );
  };

  return (
    <div className="space-y-6">
      {/* SLA Sentinel Banner */}
      <div className="bg-linear-to-r from-rose-50 via-red-50/60 to-orange-50 text-slate-900 rounded-2xl p-6 shadow-xs border border-rose-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-600" />
                AUTOMATED ESCALATION SENTINEL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              District Collectorate SLA Oversight Sentinel
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              When grievances breach 24h/48h statutory delivery limits without field resolution, Jan Sahayak automatically routes them directly to the District Collector’s executive action docket.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black text-rose-700">
              {escalatedCases.length} Escalations
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Requiring Collector Order</p>
          </div>
        </div>
      </div>

      {/* Escalated Cases Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Active Collectorate Escalations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {escalatedCases.map((item) => (
            <Card key={item.id} className="p-5 border-l-4 border-l-rose-600 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  {item.id}
                </span>
                <StatusBadge status={item.status} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-600" />
                  <span>SLA Breached Deadline: {formatDateTime(item.slaDeadline)}</span>
                </p>
                <p className="text-[11px] text-rose-800">
                  Responsible: {item.department} • {item.ward}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Escalated to DM Desk</span>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleCollectorIntervention(item.id)}
                >
                  Issue Special DM Order
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
