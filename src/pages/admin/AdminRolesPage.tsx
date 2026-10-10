import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  Shield,
  Users,
  Check,
  X,
  Lock,
  Sparkles,
  Info,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface PermissionRule {
  id: string;
  name: string;
  category: string;
  description: string;
  citizen: boolean;
  caseManager: boolean;
  admin: boolean;
}

const INITIAL_PERMISSIONS: PermissionRule[] = [
  {
    id: 'perm-1',
    name: 'Report & Track Own Grievances',
    category: 'Citizen Redressal',
    description: 'Submit civic issues with photos/voice dictation and track real-time SLA milestones.',
    citizen: true,
    caseManager: true,
    admin: true,
  },
  {
    id: 'perm-2',
    name: 'Voice-Enabled AI Intake',
    category: 'Citizen Redressal',
    description: 'Use audio dictation and automated Marathi/Hindi transcription tools.',
    citizen: true,
    caseManager: true,
    admin: true,
  },
  {
    id: 'perm-3',
    name: 'Access Evidence Vault',
    category: 'Evidence & Documents',
    description: 'View authenticated DigiLocker property tax records and site inspection photos.',
    citizen: true,
    caseManager: true,
    admin: true,
  },
  {
    id: 'perm-4',
    name: 'View Full District Case Queue',
    category: 'Operations & Triage',
    description: 'Inspect multi-department operational table and filter by ward and SLA status.',
    citizen: false,
    caseManager: true,
    admin: true,
  },
  {
    id: 'perm-5',
    name: 'Assign & Dispatch Field Engineers',
    category: 'Operations & Triage',
    description: 'Transfer grievances to specialized zonal inspection teams and contractors.',
    citizen: false,
    caseManager: true,
    admin: true,
  },
  {
    id: 'perm-6',
    name: 'Official Citizen Communication',
    category: 'Communications',
    description: 'Send direct SMS notices and request missing property documents from citizens.',
    citizen: false,
    caseManager: true,
    admin: true,
  },
  {
    id: 'perm-7',
    name: 'Trigger Case Escalation (Tier 2)',
    category: 'Operations & Triage',
    description: 'Elevate overdue grievances to District Collectorate oversight docket.',
    citizen: false,
    caseManager: true,
    admin: true,
  },
  {
    id: 'perm-8',
    name: 'Mark Work Completed & Resolve',
    category: 'Operations & Triage',
    description: 'Record resolution summaries and trigger citizen satisfaction rating workflows.',
    citizen: false,
    caseManager: true,
    admin: true,
  },
  {
    id: 'perm-9',
    name: 'Configure Categories & SLA Turnaround',
    category: 'Governance & Config',
    description: 'Create/modify grievance categories, statutory days (1-30d), and routing rules.',
    citizen: false,
    caseManager: false,
    admin: true,
  },
  {
    id: 'perm-10',
    name: 'Manage Departments & Nodal Leads',
    category: 'Governance & Config',
    description: 'Register municipal bodies, assign categories, and track compliance metrics.',
    citizen: false,
    caseManager: false,
    admin: true,
  },
  {
    id: 'perm-11',
    name: 'User Account Access Control (ACL)',
    category: 'Governance & Config',
    description: 'Activate, deactivate, and assign role permissions to executive staff.',
    citizen: false,
    caseManager: false,
    admin: true,
  },
  {
    id: 'perm-12',
    name: 'Inspect Cryptographic MIS Audit Logs',
    category: 'Security & Audit',
    description: 'Access SHA-256 immutable system block ledger and export legal audit trails.',
    citizen: false,
    caseManager: false,
    admin: true,
  },
];

export const AdminRolesPage: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionRule[]>(() => {
    const saved = localStorage.getItem('jansahayak_permissions_matrix_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PERMISSIONS;
      }
    }
    return INITIAL_PERMISSIONS;
  });

  const savePermissions = (newPerms: PermissionRule[]) => {
    setPermissions(newPerms);
    localStorage.setItem('jansahayak_permissions_matrix_v1', JSON.stringify(newPerms));
  };

  const handleToggle = (id: string, roleKey: 'citizen' | 'caseManager' | 'admin') => {
    const updated = permissions.map((p) =>
      p.id === id ? { ...p, [roleKey]: !p[roleKey] } : p
    );
    savePermissions(updated);
  };

  const handleResetDefaults = () => {
    savePermissions(INITIAL_PERMISSIONS);
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Role-Based Access Control (RBAC)
              </h1>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                3 Standard Roles
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Configure system privileges and capability matrix across Citizen, Case Manager, and Administrator tiers.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="text-xs font-bold"
        >
          Reset to Policy Defaults
        </Button>
      </div>

      {/* 3 Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Role 1: Citizen */}
        <Card className="p-5 border border-slate-200 shadow-2xs bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Level 1 Access
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Citizen Role</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Public user tier. Authorized to log grievances, submit photo/voice evidence, track SLA countdowns, and rate resolved cases.
            </p>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Active Privileges:</span>
            <span className="font-bold text-emerald-700">
              {permissions.filter((p) => p.citizen).length} / {permissions.length}
            </span>
          </div>
        </Card>

        {/* Role 2: Case Manager */}
        <Card className="p-5 border border-slate-200 shadow-2xs bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Level 2 Access
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Case Manager Role</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Municipal operations tier. Review triaged grievances, assign field engineers, communicate via SMS, escalate, and resolve.
            </p>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Active Privileges:</span>
            <span className="font-bold text-blue-700">
              {permissions.filter((p) => p.caseManager).length} / {permissions.length}
            </span>
          </div>
        </Card>

        {/* Role 3: Administrator */}
        <Card className="p-5 border border-slate-200 shadow-2xs bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Level 3 (Apex)
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Administrator Role</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              District Collectorate tier. Full system configuration, category SLA limits, user management, and cryptographic audit log access.
            </p>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Active Privileges:</span>
            <span className="font-bold text-purple-700">
              {permissions.filter((p) => p.admin).length} / {permissions.length} (Full Access)
            </span>
          </div>
        </Card>
      </div>

      {/* Complete Permission Matrix Table */}
      <Card className="border border-slate-200 shadow-2xs overflow-hidden bg-white">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Granular Privilege Matrix
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Click checkboxes to toggle privileges</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">System Capability / Privilege</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Citizen</th>
                <th className="py-3 px-4 text-center">Case Manager</th>
                <th className="py-3 px-4 text-center">Administrator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Capability Details */}
                  <td className="py-3 px-4 max-w-sm">
                    <p className="font-bold text-slate-900">{perm.name}</p>
                    <p className="text-[11px] text-slate-500">{perm.description}</p>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                      {perm.category}
                    </span>
                  </td>

                  {/* Citizen Toggle */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(perm.id, 'citizen')}
                      className={cn(
                        'w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer',
                        perm.citizen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                      )}
                    >
                      {perm.citizen ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>

                  {/* Case Manager Toggle */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(perm.id, 'caseManager')}
                      className={cn(
                        'w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer',
                        perm.caseManager ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400'
                      )}
                    >
                      {perm.caseManager ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                  </td>

                  {/* Administrator Toggle */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(perm.id, 'admin')}
                      className={cn(
                        'w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer',
                        perm.admin ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-400'
                      )}
                    >
                      {perm.admin ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
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
