import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CaseCard } from '../../features/cases/CaseCard';
import { CaseFilterBar } from '../../features/cases/CaseFilterBar';
import { CaseActionModal } from '../../features/cases/CaseActionModal';
import { CaseItem } from '../../types/case';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Zap, ListOrdered, CheckCircle2 } from 'lucide-react';

export const CaseQueuePage: React.FC = () => {
  const { cases } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [activeActionCase, setActiveActionCase] = useState<CaseItem | null>(null);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      searchQuery === '' ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizen.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || c.department === departmentFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesDept && matchesPriority;
  });

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setDepartmentFilter('ALL');
    setPriorityFilter('ALL');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Officer Triage & Work Order Queue
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review AI triaged civic cases, dispatch field engineers, and update SLA milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredCases.length} of {cases.length} Total Cases
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <CaseFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        onReset={handleReset}
      />

      {/* Grid of Cases */}
      {filteredCases.length === 0 ? (
        <EmptyState
          title="No cases match your filters"
          description="Try broadening your search query or reset the filters."
          actionText="Reset Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCases.map((item) => (
            <div key={item.id} className="relative flex flex-col">
              <CaseCard item={item} viewMode="officer" />
              <div className="mt-2 flex items-center justify-end gap-2 px-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveActionCase(item)}
                  className="w-full text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border-blue-200"
                >
                  ⚡ Quick Action / Update Status
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action modal */}
      {activeActionCase && (
        <CaseActionModal
          isOpen={!!activeActionCase}
          onClose={() => setActiveActionCase(null)}
          caseItem={activeActionCase}
        />
      )}
    </div>
  );
};
