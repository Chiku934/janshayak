import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { CaseStatusType, CasePriority } from '../../types/case';

interface CaseFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  departmentFilter: string;
  onDepartmentChange: (val: string) => void;
  priorityFilter: string;
  onPriorityChange: (val: string) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Case Statuses' },
  { value: 'SUBMITTED', label: 'Grievance Submitted' },
  { value: 'AI_TRIAGED', label: 'AI Triaged' },
  { value: 'ASSIGNED', label: 'Officer Assigned' },
  { value: 'UNDER_INVESTIGATION', label: 'Under Review' },
  { value: 'FIELD_INSPECTION', label: 'Field Inspection' },
  { value: 'ACTION_IN_PROGRESS', label: 'Resolution In Progress' },
  { value: 'RESOLVED', label: 'Resolved & Closed' },
  { value: 'ESCALATED', label: 'Escalated to Collector' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'ALL', label: 'All Departments' },
  { value: 'Municipal Water Supply & Sanitation', label: 'Water Supply & Sanitation' },
  { value: 'Electricity & Power Distribution (DISCOM)', label: 'Electricity / DISCOM' },
  { value: 'Public Works & Roads (PWD)', label: 'Public Works & Roads (PWD)' },
  { value: 'Social Welfare & Pensions', label: 'Social Welfare & Pensions' },
  { value: 'Urban Development & Housing (PMAY)', label: 'Urban Development (PMAY)' },
  { value: 'Food, Civil Supplies & Consumer Affairs', label: 'Food & Civil Supplies' },
];

const PRIORITY_OPTIONS = [
  { value: 'ALL', label: 'All Priorities' },
  { value: 'CRITICAL', label: 'Critical (24h SLA)' },
  { value: 'HIGH', label: 'High Priority (3d)' },
  { value: 'MEDIUM', label: 'Medium Priority (7d)' },
  { value: 'LOW', label: 'Standard SLA' },
];

export const CaseFilterBar: React.FC<CaseFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
  priorityFilter,
  onPriorityChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs mb-5 flex flex-col md:flex-row items-center gap-3">
      {/* Search Input */}
      <div className="flex-1 w-full">
        <Input
          placeholder="Search by Case ID, Ward, Citizen name, or keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="w-full bg-slate-50 border-slate-200"
        />
      </div>

      {/* Status Filter */}
      <div className="w-full md:w-48">
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        />
      </div>

      {/* Department Filter */}
      <div className="w-full md:w-56">
        <Select
          options={DEPARTMENT_OPTIONS}
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
        />
      </div>

      {/* Priority Filter */}
      <div className="w-full md:w-44">
        <Select
          options={PRIORITY_OPTIONS}
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
        />
      </div>

      {/* Reset button */}
      <Button
        variant="ghost"
        size="md"
        onClick={onReset}
        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        className="w-full md:w-auto text-slate-500 hover:text-slate-800"
      >
        Reset
      </Button>
    </div>
  );
};
