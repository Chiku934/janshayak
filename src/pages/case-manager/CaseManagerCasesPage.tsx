import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SlaIndicator } from '../../components/ui/SlaIndicator';
import { EscalationModal } from '../../components/modals/EscalationModal';
import { formatDate, formatDateTime, getRemainingSlaDays } from '../../utils/formatters';
import { getPriorityConfig } from '../../utils/helpers';
import { CaseStatusType, CasePriority, DepartmentType, CaseItem } from '../../types/case';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  FolderKanban,
  UserCheck,
  Building2,
  Calendar,
  Clock,
  ArrowUpDown,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  PlusCircle,
  Eye,
  AlertOctagon,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const DEPARTMENTS: DepartmentType[] = [
  'Municipal Water Supply & Sanitation',
  'Public Works & Roads (PWD)',
  'Electricity & Power Distribution (DISCOM)',
  'Social Welfare & Pensions',
  'Urban Development & Housing (PMAY)',
  'Public Health & Family Welfare',
  'Revenue & Land Records',
  'Food, Civil Supplies & Consumer Affairs',
];

const STATUSES: { value: string; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'AI_TRIAGED', label: 'Triaged' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'ACTION_IN_PROGRESS', label: 'Action in Progress' },
  { value: 'RESPONSE', label: 'Response' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const CATEGORIES = [
  'All Categories',
  'Water & Electricity',
  'Roads & Sanitation',
  'Government Service',
  'Local / Civic Issue',
  'Other',
];

export const CaseManagerCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [selectedEscalationCase, setSelectedEscalationCase] = useState<CaseItem | null>(null);

  const filteredCases = cases.filter((item) => {
    // Search filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchId = item.id.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCitizen = item.citizen.name.toLowerCase().includes(q);
      const matchWard = item.ward.toLowerCase().includes(q);
      const matchDept = item.department.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchCitizen && !matchWard && !matchDept) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'AI_TRIAGED' && (item.status === 'AI_TRIAGED' || item.status === 'TRIAGED')) {
        // match
      } else if (item.status !== statusFilter) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== 'All Categories' && item.category !== categoryFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) {
      return false;
    }

    // Department filter
    if (departmentFilter !== 'ALL' && item.department !== departmentFilter) {
      return false;
    }

    // Date filter
    if (dateFilter === 'TODAY') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (!item.submittedAt.startsWith(todayStr)) return false;
    } else if (dateFilter === '7D') {
      const sevenDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;
      if (new Date(item.submittedAt).getTime() < sevenDaysAgo) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('All Categories');
    setPriorityFilter('ALL');
    setDepartmentFilter('ALL');
    setDateFilter('ALL');
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Case Management & Triage Hub
                </h1>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {filteredCases.length} Cases Listed
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Full-spectrum operational table for citizen grievance dispatch, assignment & SLA monitoring.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            Export Table
          </Button>
        </div>
      </div>

      {/* Multi-Attribute Filter Bar */}
      <Card className="p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3 bg-white">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search cases by ID, title, citizen name, ward, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Priority Dropdown */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical (24h SLA)</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            {/* Department Dropdown */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-600 focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Date Dropdown */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Logged Today</option>
              <option value="7D">Last 7 Days</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Professional Case Table */}
      <Card className="border border-slate-200 shadow-2xs overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Cases Match Filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or reset the status and department filters.
            </p>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[960px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Citizen</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">SLA</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.map((item) => {
                  const priorityConfig = getPriorityConfig(item.priority);
                  const slaInfo = getRemainingSlaDays(item.slaDeadline);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/case-manager/cases/${item.id}`)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {/* 1. Case ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {item.id}
                      </td>

                      {/* 2. Citizen */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 leading-tight">
                          {item.citizen.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.citizen.phone}
                        </p>
                      </td>

                      {/* 3. Category */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                          {item.category}
                        </span>
                      </td>

                      {/* 4. Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-bold border',
                            priorityConfig.badge
                          )}
                        >
                          {priorityConfig.label}
                        </span>
                      </td>

                      {/* 5. Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* 6. Assigned To */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.assignedOfficer ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[9px] flex items-center justify-center">
                              AE
                            </div>
                            <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                              {item.assignedOfficer.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* 7. Created Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        {formatDate(item.submittedAt)}
                      </td>

                      {/* 8. SLA Countdown & Visual Indicators */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <SlaIndicator
                          slaDays={item.slaDays}
                          slaDeadline={item.slaDeadline}
                          submittedAt={item.submittedAt}
                          status={item.status}
                          compact
                        />
                      </td>

                      {/* 9. Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== 'ESCALATED' && item.status !== 'RESOLVED' && item.status !== 'CLOSED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEscalationCase(item);
                              }}
                              leftIcon={<AlertOctagon className="w-3.5 h-3.5 text-rose-600" />}
                              className="text-[11px] font-bold py-1 h-7 text-rose-700 bg-rose-50/50 hover:bg-rose-100 border-rose-200"
                            >
                              Escalate
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/case-manager/cases/${item.id}`);
                            }}
                            className="text-[11px] font-bold py-1 h-7 text-blue-700 bg-white hover:bg-blue-50 border-slate-200 group-hover:border-blue-300"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Structured Escalation Modal with 4 Fields */}
      <EscalationModal
        isOpen={Boolean(selectedEscalationCase)}
        onClose={() => setSelectedEscalationCase(null)}
        caseItem={selectedEscalationCase || undefined}
      />
    </div>
  );
};
