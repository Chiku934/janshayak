import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDate, formatDateTime } from '../../utils/formatters';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  RefreshCw,
  Hash,
  Laptop,
  Terminal,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/useAppStore';
import { AuditLogEntry } from '../../types/audit';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actor.name.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchEntity = log.entity.toLowerCase().includes(q);
      const matchIp = log.ipAddress.toLowerCase().includes(q);
      if (!matchActor && !matchAction && !matchEntity && !matchIp) return false;
    }
    return true;
  });

  const getStatusBadge = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Success
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Flame className="w-3 h-3" /> Escalated
          </span>
        );
      case 'AUDITED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3 h-3" /> Audited
          </span>
        );
    }
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Log ID,Actor Name,Actor Role,Action,Entity,Timestamp,IP Address,Status,Block Hash']
        .concat(
          filteredLogs.map(
            (l) =>
              `"${l.id}","${l.actor.name}","${l.actor.role}","${l.action}","${l.entity}","${l.timestamp}","${l.ipAddress}","${l.status}","${l.blockHash}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jansahayak_audit_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Cryptographic MIS & Audit Log Ledger
              </h1>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                SHA-256 Immutable
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tamper-proof administrative audit trail recording every grievance action, officer transfer, and statutory SLA override.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleExportCsv}
          leftIcon={<Download className="w-3.5 h-3.5" />}
          className="text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-2xs"
        >
          Export CSV Ledger
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3 bg-white">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by actor, action description, entity (#JS-2026-8942), or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-purple-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Audit Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="ESCALATED">Escalated</option>
              <option value="AUDITED">Audited</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card className="border border-slate-200 shadow-2xs overflow-hidden bg-white">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[850px] text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action & Operational Event</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">IP Placeholder</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right font-mono">Block Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Actor */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-bold text-slate-900">{log.actor.name}</p>
                    <p className="text-[11px] text-purple-700 font-semibold">{log.actor.role}</p>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-medium text-slate-800 leading-snug">{log.action}</p>
                  </td>

                  {/* Entity */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-blue-700">
                    {log.entity}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    <p className="font-medium">{formatDate(log.timestamp)}</p>
                    <p className="text-[10px] text-slate-400">{formatDateTime(log.timestamp).split(',')[1] || ''}</p>
                  </td>

                  {/* IP Placeholder */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.ipAddress}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(log.status)}</td>

                  {/* Block Hash */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-[10px] text-slate-400">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      {log.blockHash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
