import React from 'react';
import { Card } from '../../components/ui/Card';
import { DataTable, Column } from '../../components/ui/DataTable';
import { formatDateTime } from '../../utils/formatters';
import { ShieldCheck, FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetId: string;
  ipAddress: string;
  verificationHash: string;
}

const AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'AUD-88910',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    actor: 'Er. Sachin Deshmukh (Assistant Engineer)',
    action: 'DISPATCHED_WORK_ORDER',
    targetId: 'JS-2026-8942',
    ipAddress: '10.14.82.19 (Municipal VPN)',
    verificationHash: 'SHA256: 8f4a9b...00e1',
  },
  {
    id: 'AUD-88909',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actor: 'Jan Sahayak AI Triage Daemon',
    action: 'AUTO_TRIAGE_CLASSIFICATION',
    targetId: 'JS-2026-8942',
    ipAddress: '10.0.0.1 (Internal Cluster)',
    verificationHash: 'SHA256: 412b1a...f89c',
  },
  {
    id: 'AUD-88908',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    actor: 'UIDAI e-KYC Bridge',
    action: 'AADHAAR_OTP_AUTHENTICATION',
    targetId: 'UIDAI-XXXX-4812',
    ipAddress: '164.100.12.8 (Govt NIC-UIDAI)',
    verificationHash: 'SHA256: cc88a2...3319',
  },
  {
    id: 'AUD-88907',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    actor: 'State Treasury Gateway',
    action: 'DBT_PFMS_BATCH_RETRY',
    targetId: 'TR-RJ-2026-88192',
    ipAddress: '10.22.4.91 (State Treasury Net)',
    verificationHash: 'SHA256: 7710ee...99a0',
  },
];

export const AuditLogsPage: React.FC = () => {
  const columns: Column<AuditEntry>[] = [
    {
      header: 'Audit ID',
      accessorKey: 'id',
      cell: (row) => <span className="font-mono text-xs font-bold text-blue-700">{row.id}</span>,
    },
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      cell: (row) => <span>{formatDateTime(row.timestamp)}</span>,
    },
    {
      header: 'Actor / System',
      accessorKey: 'actor',
      cell: (row) => <span className="font-semibold text-slate-900">{row.actor}</span>,
    },
    {
      header: 'Security Action',
      accessorKey: 'action',
      cell: (row) => (
        <span className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Target Ref',
      accessorKey: 'targetId',
      cell: (row) => <span className="font-bold text-slate-700">{row.targetId}</span>,
    },
    {
      header: 'Tamper Hash',
      accessorKey: 'verificationHash',
      cell: (row) => (
        <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
          {row.verificationHash}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Immutable Audit Trail & Regulatory MIS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete cryptographic audit trail of all AI triages, officer interventions, and SMS dispatches.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Exporting encrypted audit report for State Vigilance & CAG audit...')}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV / PDF for Audit
        </Button>
      </div>

      <DataTable columns={columns} data={AUDIT_LOGS} />
    </div>
  );
};
