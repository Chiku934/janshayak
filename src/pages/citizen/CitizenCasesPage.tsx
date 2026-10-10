import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate, formatDateTime, getRemainingSlaDays } from '../../utils/formatters';
import { getPriorityConfig } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  PlusCircle,
  Clock,
  MapPin,
  Calendar,
  Building2,
  ChevronRight,
  Filter,
  FileText,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw,
  FolderClock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { cn } from '../../utils/cn';

type CaseTabFilter = 'ALL' | 'ACTIVE' | 'RESOLVED';

export const CitizenCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases } = useAppStore();

  const [activeTab, setActiveTab] = useState<CaseTabFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Filter calculations
  const totalCount = cases.length;
  const activeCount = cases.filter(
    (c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED'
  ).length;
  const resolvedCount = cases.filter(
    (c) => c.status === 'RESOLVED' || c.status === 'CLOSED'
  ).length;

  const filteredCases = cases.filter((item) => {
    // Tab Filter
    if (activeTab === 'ACTIVE' && (item.status === 'RESOLVED' || item.status === 'CLOSED')) {
      return false;
    }
    if (activeTab === 'RESOLVED' && item.status !== 'RESOLVED' && item.status !== 'CLOSED') {
      return false;
    }

    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchId = item.id.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchWard = item.ward.toLowerCase().includes(q);
      const matchDept = item.department.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchCategory && !matchWard && !matchDept) {
        return false;
      }
    }

    // Department filter
    if (selectedDept !== 'ALL' && item.department !== selectedDept) {
      return false;
    }

    // Priority filter
    if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) {
      return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('ALL');
    setSelectedPriority('ALL');
    setActiveTab('ALL');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Grievances & Cases
            </h1>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {totalCount} Total Logged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time statutory SLA countdowns, officer assignments, and field inspection stages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/citizen/report/voice')}
            className="text-xs font-bold text-orange-700 bg-orange-50/70 border-orange-200"
          >
            Voice Intake
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/citizen/report')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="font-bold shadow-xs flex-1 sm:flex-initial justify-center"
          >
            Report a Problem
          </Button>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="space-y-4">
        {/* Tab Filters: All | Active | Resolved */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2',
                activeTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span>All Cases</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 text-[10px] rounded-full font-bold',
                  activeTab === 'ALL'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-200 text-slate-600'
                )}
              >
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ACTIVE')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2',
                activeTab === 'ACTIVE'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span>Active</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 text-[10px] rounded-full font-bold',
                  activeTab === 'ACTIVE'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                )}
              >
                {activeCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('RESOLVED')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2',
                activeTab === 'RESOLVED'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span>Resolved</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 text-[10px] rounded-full font-bold',
                  activeTab === 'RESOLVED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                )}
              >
                {resolvedCount}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Case ID, category, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 shadow-2xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <Card className="p-12 text-center space-y-4 border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Cases Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No civic grievances match your active tab or search filters.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredCases.map((item) => {
            const priorityConfig = getPriorityConfig(item.priority);
            const slaInfo = getRemainingSlaDays(item.slaDeadline);

            return (
              <motion.div key={item.id} variants={itemVariants}>
                <Card
                  hoverable
                  onClick={() => navigate(`/citizen/cases/${item.id}`)}
                  className="p-5 flex flex-col justify-between h-full border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Case ID & Priority & Status */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                          {item.id}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded-full font-bold border',
                            priorityConfig.badge
                          )}
                        >
                          {priorityConfig.label}
                        </span>
                      </div>

                      <StatusBadge status={item.status} />
                    </div>

                    {/* Title & Category */}
                    <div>
                      <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mb-1.5">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Location, Date & Last Updated Meta Block */}
                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-medium">{item.ward}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Lodged: {formatDate(item.submittedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Updated: {formatDate(item.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action: View Case */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {item.timeline.length} Timeline Milestones
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
