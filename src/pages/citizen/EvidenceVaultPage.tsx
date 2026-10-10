import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DigiLockerSyncModal } from '../../features/evidence/DigiLockerSyncModal';
import { DocumentUploadModal } from '../../features/evidence/DocumentUploadModal';
import {
  ShieldCheck,
  Lock,
  FileText,
  Upload,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { maskAadhaar } from '../../utils/formatters';

interface VaultDoc {
  id: string;
  name: string;
  category: string;
  issuer: string;
  docId: string;
  issueDate: string;
  status: 'VERIFIED' | 'SELF_UPLOADED';
  isDigiLocker: boolean;
}

export const EvidenceVaultPage: React.FC = () => {
  const { currentUser } = useAppStore();
  const [isDigiLockerOpen, setIsDigiLockerOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [docs, setDocs] = useState<VaultDoc[]>([
    {
      id: 'doc-1',
      name: 'Aadhaar Card (UIDAI)',
      category: 'Identity Proof',
      issuer: 'Unique Identification Authority of India',
      docId: maskAadhaar(currentUser.aadhaarMasked),
      issueDate: '12 Jan 2018',
      status: 'VERIFIED',
      isDigiLocker: true,
    },
    {
      id: 'doc-2',
      name: 'National Food Security (NFSA) BPL Ration Card',
      category: 'Welfare & Subsidy',
      issuer: 'Department of Food, Civil Supplies, Maharashtra',
      docId: currentUser.rationCardNo || 'MH-PUN-BPL-88190',
      issueDate: '04 Mar 2021',
      status: 'VERIFIED',
      isDigiLocker: true,
    },
    {
      id: 'doc-3',
      name: '7/12 Land Record Extract (RoR)',
      category: 'Land & Agriculture',
      issuer: 'Revenue Department, Govt of Maharashtra',
      docId: 'MH-REV-2024-41802',
      issueDate: '18 Nov 2024',
      status: 'VERIFIED',
      isDigiLocker: true,
    },
    {
      id: 'doc-4',
      name: 'Pension Sanction Certificate (IGNOAPS)',
      category: 'Social Security',
      issuer: 'Department of Social Justice and Empowerment',
      docId: 'DL-PEN-2023-99120',
      issueDate: '15 Aug 2023',
      status: 'VERIFIED',
      isDigiLocker: true,
    },
    {
      id: 'doc-5',
      name: 'Income & Domicile Certificate',
      category: 'Revenue',
      issuer: 'Sub-Divisional Magistrate (SDM), Pune Sub-Division',
      docId: 'INC-2026-99014',
      issueDate: '02 Feb 2026',
      status: 'VERIFIED',
      isDigiLocker: true,
    },
  ]);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* DigiLocker Vault Banner */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/10 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                DigiLocker National Gateway
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Sync Active
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Citizen Digital Evidence Vault
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl leading-relaxed">
              Legally recognized under IT Act 2000. Verified documents automatically attach to civic grievances, eliminating notarization and paper visits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleManualSync}
              isLoading={isSyncing}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Sync DigiLocker
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsDigiLockerOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-500 shadow-md font-bold"
            >
              Import More Docs
            </Button>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {docs.map((doc) => (
          <Card key={doc.id} hoverable className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  VERIFIED
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                {doc.name}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                {doc.issuer}
              </p>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] font-mono text-slate-600 space-y-0.5 mb-4">
                <div><span className="text-slate-400">Doc ID:</span> {doc.docId}</div>
                <div><span className="text-slate-400">Issued:</span> {doc.issueDate}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                DigiLocker Original
              </span>

              <button
                onClick={() => alert(`Viewing verified document: ${doc.name} (${doc.docId})`)}
                className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* DigiLocker and Upload Modals */}
      <DigiLockerSyncModal
        isOpen={isDigiLockerOpen}
        onClose={() => setIsDigiLockerOpen(false)}
        onDocsImported={(names) => {
          const newEntries: VaultDoc[] = names.map((n, i) => ({
            id: `doc-new-${Date.now()}-${i}`,
            name: `${n}`,
            category: 'Government Certificate',
            issuer: 'Government of India Repository',
            docId: `DL-${Math.floor(100000 + Math.random() * 900000)}`,
            issueDate: new Date().toLocaleDateString(),
            status: 'VERIFIED',
            isDigiLocker: true,
          }));
          setDocs((prev) => [...prev, ...newEntries]);
        }}
      />

      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={(ev) => {
          const newEntry: VaultDoc = {
            id: `doc-up-${Date.now()}`,
            name: ev.name,
            category: 'Citizen Upload',
            issuer: 'Self-Uploaded Evidence',
            docId: `UP-${Date.now()}`,
            issueDate: new Date().toLocaleDateString(),
            status: 'SELF_UPLOADED',
            isDigiLocker: false,
          };
          setDocs((prev) => [...prev, newEntry]);
        }}
      />
    </div>
  );
};
