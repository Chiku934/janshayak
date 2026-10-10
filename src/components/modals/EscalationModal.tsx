import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { CaseItem, CasePriority, DepartmentType } from '../../types/case';
import { AlertOctagon, AlertTriangle, Flame, ShieldAlert, Sparkles, Building2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem?: CaseItem;
  onSuccess?: () => void;
}

const DEPARTMENTS: DepartmentType[] = [
  'Public Works & Roads (PWD)',
  'Municipal Water Supply & Sanitation',
  'Electricity & Power Distribution (DISCOM)',
  'Social Welfare & Pensions',
  'Urban Development & Housing (PMAY)',
  'Public Health & Family Welfare',
  'Revenue & Land Records',
  'Food, Civil Supplies & Consumer Affairs',
  'Education & Scholarships',
];

const ESCALATION_REASON_PRESETS = [
  'SLA Breached — Turnaround limit exceeded without field resolution',
  'Severe Public Safety / Hazard risk requiring urgent intervention',
  'Contractor non-compliance / repeated field inspection delays',
  'Multi-departmental jurisdiction dispute requiring Collectorate order',
  'Distressed citizen petition escalated to District Nodal Officer',
];

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  onSuccess,
}) => {
  const { escalateCase } = useAppStore();

  const [reason, setReason] = useState(ESCALATION_REASON_PRESETS[0]);
  const [targetDepartment, setTargetDepartment] = useState<DepartmentType>(
    caseItem?.department || DEPARTMENTS[0]
  );
  const [priority, setPriority] = useState<CasePriority>('CRITICAL');
  const [notes, setNotes] = useState('');

  if (!caseItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    escalateCase(caseItem.id, {
      reason: reason.trim(),
      targetDepartment,
      priority,
      notes: notes.trim(),
    });

    onSuccess?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-rose-700">
          <AlertOctagon className="w-5 h-5" />
          <span>Escalate Grievance #{caseItem.id}</span>
        </div>
      }
      description={`Initiate high-priority escalation and transfer oversight for "${caseItem.title}".`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Warning Banner */}
        <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">District Executive Escalation Directive</p>
            <p className="text-rose-800">
              Escalating flags this case to the District Collector’s Taskforce, overrides SLA deadlines, and dispatches automated priority notifications.
            </p>
          </div>
        </div>

        {/* 1. Reason */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
            <span>Escalation Reason *</span>
            <span className="text-[10px] text-slate-400 font-normal">Select or type</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-medium text-slate-800 shadow-2xs focus:border-rose-600 focus:outline-none cursor-pointer"
          >
            {ESCALATION_REASON_PRESETS.map((preset, i) => (
              <option key={i} value={preset}>
                {preset}
              </option>
            ))}
            <option value="CUSTOM">Other Specific Reason (Write in Notes)...</option>
          </select>
        </div>

        {/* 2. Target Department */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Target Department / Executive Cell *</span>
          </label>
          <select
            value={targetDepartment}
            onChange={(e) => setTargetDepartment(e.target.value as DepartmentType)}
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800 shadow-2xs focus:border-rose-600 focus:outline-none cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Priority */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Escalation Priority *</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                value: 'CRITICAL',
                label: 'CRITICAL (24h SLA)',
                badge: 'border-rose-600 bg-rose-50 text-rose-800 ring-1 ring-rose-600',
              },
              {
                value: 'HIGH',
                label: 'HIGH (48h SLA)',
                badge: 'border-amber-600 bg-amber-50 text-amber-800 ring-1 ring-amber-600',
              },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value as CasePriority)}
                className={cn(
                  'p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer',
                  priority === p.value
                    ? p.badge
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase">
            Executive Notes / Field Directives
          </label>
          <textarea
            rows={3}
            placeholder="Specify required emergency deployment, contractor penalties, or mandatory on-site inspection instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all shadow-2xs"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
          >
            Confirm & Execute Escalation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
