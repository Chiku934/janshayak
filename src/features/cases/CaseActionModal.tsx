import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Input } from '../../components/ui/Input';
import { CaseItem, CaseStatusType } from '../../types/case';
import { useAppStore } from '../../store/useAppStore';
import { CheckCircle, AlertTriangle, Send, Camera, ShieldCheck } from 'lucide-react';

interface CaseActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CaseItem;
}

export const CaseActionModal: React.FC<CaseActionModalProps> = ({
  isOpen,
  onClose,
  caseItem,
}) => {
  const { updateCaseStatus } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState<CaseStatusType>(
    caseItem.status === 'SUBMITTED' ? 'FIELD_INSPECTION' : 'RESOLVED'
  );
  const [officerNote, setOfficerNote] = useState('');
  const [workOrderRef, setWorkOrderRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'ASSIGNED', label: 'Assign / Reallocate Officer' },
    { value: 'UNDER_INVESTIGATION', label: 'Mark Under Investigation' },
    { value: 'FIELD_INSPECTION', label: 'Dispatch Field Inspection Crew' },
    { value: 'ACTION_IN_PROGRESS', label: 'Issue Work Order / Action In Progress' },
    { value: 'RESOLVED', label: 'Resolve & Close Grievance (Verified)' },
    { value: 'ESCALATED', label: 'Escalate to District Collectorate' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullComment = `${officerNote} ${
      workOrderRef ? `(Work Order / Token Ref: ${workOrderRef})` : ''
    }`.trim();

    setTimeout(() => {
      updateCaseStatus(caseItem.id, selectedStatus, fullComment);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Take Workflow Action on Case #${caseItem.id}`}
      description="Update status, record official inspection logs, and trigger automated citizen SMS updates."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Select
            label="Next Workflow Status"
            options={statusOptions}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as CaseStatusType)}
          />
        </div>

        {selectedStatus === 'ACTION_IN_PROGRESS' && (
          <Input
            label="Govt Work Order / Sanction Reference ID"
            placeholder="e.g. WO-PWD-2026-9912 or SANCTION-7721"
            value={workOrderRef}
            onChange={(e) => setWorkOrderRef(e.target.value)}
          />
        )}

        <div>
          <Textarea
            label="Official Resolution / Field Inspection Note"
            placeholder="Document actions taken, materials deployed, technician findings, or inspection timestamps..."
            rows={4}
            value={officerNote}
            onChange={(e) => setOfficerNote(e.target.value)}
            required
          />
        </div>

        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-start gap-2 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Automated SMS & WhatsApp Dispatch:</span>
            <p className="text-[11px] text-blue-700 mt-0.5">
              The citizen ({caseItem.citizen.phone}) will immediately receive an official bilingual notification regarding this update.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={selectedStatus === 'RESOLVED' ? 'success' : selectedStatus === 'ESCALATED' ? 'danger' : 'primary'}
            type="submit"
            isLoading={isSubmitting}
            leftIcon={selectedStatus === 'RESOLVED' ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          >
            {selectedStatus === 'RESOLVED' ? 'Close & Resolve Case' : 'Submit Action'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
