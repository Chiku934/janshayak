import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CaseCard } from '../../features/cases/CaseCard';
import { CaseFilterBar } from '../../features/cases/CaseFilterBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';

export const TrackCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

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
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Track Civic Grievances & Applications
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status updates, field inspection timeline, and statutory SLA timers.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/citizen/new')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Lodge New Grievance
        </Button>
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

      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-slate-400" />}
          title="No grievances match your criteria"
          description="Try modifying your search keywords or resetting the department & status filters."
          actionText="Reset All Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCases.map((item) => (
            <CaseCard key={item.id} item={item} viewMode="citizen" />
          ))}
        </div>
      )}
    </div>
  );
};
