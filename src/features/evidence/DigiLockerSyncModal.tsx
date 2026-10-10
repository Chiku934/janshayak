import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, CheckCircle2, Lock, FileText, Check, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface DigiLockerSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocsImported?: (docNames: string[]) => void;
}

const AVAILABLE_DOCS = [
  { id: 'aadhaar', title: 'Aadhaar Card (UIDAI)', issuer: 'Unique Identification Authority of India', verified: true, docId: 'UIDAI-XXXX-4812' },
  { id: 'ration', title: 'NFSA BPL Ration Card', issuer: 'Food & Civil Supplies Dept, Maharashtra', verified: true, docId: 'MH-PUN-BPL-88190' },
  { id: 'pension', title: 'Pension Sanction Certificate', issuer: 'Dept of Social Justice & Empowerment', verified: true, docId: 'DL-PEN-2023-9912' },
  { id: 'land', title: 'Land Record (7/12 RoR Extract)', issuer: 'Revenue & Land Records Dept', verified: true, docId: 'ROR-2025-4180' },
  { id: 'income', title: 'Income & Domicile Certificate', issuer: 'Sub-Divisional Magistrate (SDM) Office', verified: true, docId: 'INC-2026-0041' },
];

export const DigiLockerSyncModal: React.FC<DigiLockerSyncModalProps> = ({
  isOpen,
  onClose,
  onDocsImported,
}) => {
  const { currentUser } = useAppStore();
  const [selectedDocs, setSelectedDocs] = useState<string[]>(['aadhaar', 'ration', 'pension']);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  const toggleDoc = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncedSuccess(true);
      setTimeout(() => {
        if (onDocsImported) {
          const names = AVAILABLE_DOCS.filter((d) => selectedDocs.includes(d.id)).map((d) => d.title);
          onDocsImported(names);
        }
        setSyncedSuccess(false);
        onClose();
      }, 900);
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">DigiLocker National Vault</h4>
            <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
              Govt of India Secure API Integration
            </span>
          </div>
        </div>
      }
      size="md"
    >
      <div className="space-y-4">
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-blue-900">Authenticated Citizen: {currentUser.name}</p>
              <p className="text-blue-700 text-[11px]">Aadhaar Verified • 100% Cryptographic Tamper-Proof</p>
            </div>
          </div>
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
            ACTIVE
          </span>
        </div>

        <p className="text-xs text-slate-600 font-medium">
          Select verified documents to automatically attach as official evidence:
        </p>

        <div className="space-y-2">
          {AVAILABLE_DOCS.map((doc) => {
            const isSelected = selectedDocs.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => toggleDoc(doc.id)}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-300'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{doc.title}</h5>
                    <p className="text-[10px] text-slate-500">{doc.issuer}</p>
                    <span className="font-mono text-[9px] text-slate-400">Doc ID: {doc.docId}</span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {selectedDocs.length} document(s) selected
          </span>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSyncing}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSync}
              isLoading={isSyncing}
              leftIcon={syncedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            >
              {syncedSuccess ? 'Imported!' : 'Import Verified Docs'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
