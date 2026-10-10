import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, XCircle, ShieldCheck, Lock, FileText, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VerifItem {
  id: string;
  citizenName: string;
  docType: string;
  docId: string;
  submittedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  caseRef: string;
}

export const VerificationDeskPage: React.FC = () => {
  const [items, setItems] = useState<VerifItem[]>([
    {
      id: 'vf-1',
      citizenName: 'Rameshwar Patil',
      docType: 'NFSA BPL Ration Card (Maharashtra)',
      docId: 'MH-PUN-BPL-88190',
      submittedAt: 'Today 08:30 AM',
      status: 'VERIFIED',
      caseRef: 'JS-2026-8942',
    },
    {
      id: 'vf-2',
      citizenName: 'Kamla Devi Sharma',
      docType: 'IGNOAPS Pension Sanction Order',
      docId: 'DL-PEN-2023-99120',
      submittedAt: 'Today 09:15 AM',
      status: 'VERIFIED',
      caseRef: 'JS-2026-8920',
    },
    {
      id: 'vf-3',
      citizenName: 'Mohan Ram Meghwal',
      docType: 'PMAY-G Plinth Inspection Geotag Certificate',
      docId: 'AwaasSoft-RJ-41890',
      submittedAt: 'Yesterday',
      status: 'PENDING',
      caseRef: 'JS-2026-8550',
    },
  ]);

  const handleAction = (id: string, newStatus: 'VERIFIED' | 'REJECTED') => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    if (newStatus === 'VERIFIED') {
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            DigiLocker & Citizen KYC Verification Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated cryptographic checks with UIDAI & State Repositories.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> 88.6% Auto-Verified Rate
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{item.citizenName}</h4>
                  <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {item.caseRef}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.docType}</p>
                <p className="text-[11px] text-slate-400">Doc ID: {item.docId} • {item.submittedAt}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.status === 'VERIFIED' ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Digitally Verified
                </span>
              ) : item.status === 'REJECTED' ? (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" /> Rejected
                </span>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(item.id, 'REJECTED')}
                    className="text-rose-700 border-rose-200 hover:bg-rose-50"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleAction(item.id, 'VERIFIED')}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Approve & Verify
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
