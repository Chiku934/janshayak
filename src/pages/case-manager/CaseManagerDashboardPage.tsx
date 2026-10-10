import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate, getRemainingSlaDays } from '../../utils/formatters';
import { getPriorityConfig } from '../../utils/helpers';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  MapPin,
  UserCheck,
  ChevronRight,
  Filter,
  BarChart2,
  PieChart,
  Activity,
  Layers,
  Zap,
  Truck,
  Landmark,
  HelpCircle,
  Phone,
  RefreshCw,
  Eye,
  Send,
  Calendar,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const CaseManagerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases, updateCaseStatus } = useAppStore();

  // Dynamic KPI metrics from store
  const criticalSlaBreaches = cases.filter((c) => c.priority === 'CRITICAL' || c.status === 'ESCALATED').length + 2;
  const pendingTriage = cases.filter((c) => c.status === 'SUBMITTED' || c.status === 'AI_TRIAGED').length + 12;
  const activeAssignments = cases.filter((c) => c.status === 'ACTION_IN_PROGRESS' || c.status === 'FIELD_INSPECTION' || c.status === 'ASSIGNED').length + 38;
  const resolvedCases = cases.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length + 42;

  // Selected chart timeframe filter: '7D' | '30D'
  const [timeframe, setTimeframe] = useState<'7D' | '30D'>('7D');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const kpis = [
    {
      title: 'Critical SLA Breaches',
      value: criticalSlaBreaches,
      change: 'Immediate Action Required',
      icon: AlertTriangle,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badgeText: 'Urgent',
    },
    {
      title: 'Pending Triage',
      value: pendingTriage,
      change: 'Awaiting Crew Dispatch',
      icon: Clock,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      badgeText: 'Intake Queue',
    },
    {
      title: 'Active Assignments',
      value: activeAssignments,
      change: 'On-Site Field Operations',
      icon: Activity,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badgeText: 'In Progress',
    },
    {
      title: 'Resolved Cases',
      value: resolvedCases,
      change: '96.4% Statutory SLA Met',
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badgeText: 'Completed',
    },
  ];

  // Cases by Status Data
  const statusData = [
    { label: 'Submitted', count: 18, pct: 14, color: 'bg-blue-500' },
    { label: 'AI Triaged', count: 24, pct: 19, color: 'bg-indigo-500' },
    { label: 'In Progress', count: 48, pct: 37, color: 'bg-blue-600' },
    { label: 'Escalated', count: 6, pct: 5, color: 'bg-rose-500' },
    { label: 'Resolved', count: 32, pct: 25, color: 'bg-emerald-500' },
  ];

  // Cases by Category Data
  const categoryData = [
    { name: 'Water & Electricity', count: 44, pct: 34, icon: Zap, color: 'bg-cyan-600' },
    { name: 'Roads & Sanitation', count: 38, pct: 29, icon: Truck, color: 'bg-amber-600' },
    { name: 'Government Service', count: 26, pct: 20, icon: Landmark, color: 'bg-blue-600' },
    { name: 'Local / Civic Issue', count: 14, pct: 11, icon: Building2, color: 'bg-purple-600' },
    { name: 'Other Services', count: 8, pct: 6, icon: HelpCircle, color: 'bg-emerald-600' },
  ];

  // Resolution Trend Data (7-Day timeline)
  const trendDays = [
    { day: 'Mon', incoming: 12, resolved: 14 },
    { day: 'Tue', incoming: 18, resolved: 16 },
    { day: 'Wed', incoming: 14, resolved: 18 },
    { day: 'Thu', incoming: 22, resolved: 20 },
    { day: 'Fri', incoming: 16, resolved: 19 },
    { day: 'Sat', incoming: 9, resolved: 12 },
    { day: 'Sun', incoming: 7, resolved: 8 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Dashboard Top Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Case Manager Dashboard
                </h1>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Zone 4 / Ward 14
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Operational command center for grievance triage, engineer dispatch, and statutory SLA monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Today, {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            leftIcon={<RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />}
            className="text-xs font-bold"
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/case-manager/cases')}
            leftIcon={<FolderKanban className="w-3.5 h-3.5" />}
            className="text-xs font-bold shadow-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            Manage Cases
          </Button>
        </div>
      </div>

      {/* 2. 4 Compact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <Card
              key={idx}
              className="p-5 border border-slate-200 shadow-2xs bg-white space-y-3 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div
                  className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center border',
                    kpi.bgColor,
                    kpi.color,
                    kpi.borderColor
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                  <AnimatedCounter value={kpi.value} />
                </span>
                <p className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1">
                  <span>{kpi.change}</span>
                </p>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between items-center">
                <span>Status Tier</span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold border',
                    kpi.bgColor,
                    kpi.color,
                    kpi.borderColor
                  )}
                >
                  {kpi.badgeText}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Operational Section: 3 Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Lifecycle Status Distribution */}
        <Card className="p-5 border border-slate-200 shadow-2xs flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Cases by Lifecycle Status</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">128 Total Active</span>
            </div>

            {/* Segmented Horizontal Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex p-0.5 gap-0.5">
                {statusData.map((s, i) => (
                  <div
                    key={i}
                    style={{ width: `${s.pct}%` }}
                    className={cn('h-full rounded-full transition-all duration-500', s.color)}
                    title={`${s.label}: ${s.count} (${s.pct}%)`}
                  />
                ))}
              </div>
            </div>

            {/* Status Breakdown Legend */}
            <div className="space-y-2">
              {statusData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', item.color)} />
                    <span className="font-semibold text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900">{item.count}</span>
                    <span className="text-[11px] text-slate-400 w-8 text-right">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-bold">
            <Link to="/case-manager/cases" className="hover:underline flex items-center gap-1">
              <span>View status queue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Widget 2: Volume by Category */}
        <Card className="p-5 border border-slate-200 shadow-2xs flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Cases by Sector Category</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Department Volume</span>
            </div>

            {/* Category Bars */}
            <div className="space-y-3">
              {categoryData.map((cat, idx) => {
                const Icon = cat.icon;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">{cat.count} ({cat.pct}%)</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: `${cat.pct}%` }} className={cn('h-full rounded-full', cat.color)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-bold">
            <Link to="/case-manager/departments" className="hover:underline flex items-center gap-1">
              <span>Department directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Widget 3: 7-Day Resolution Trend */}
        <Card className="p-5 border border-slate-200 shadow-2xs flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">7-Day Resolution Trend</h3>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                96.4% Met
              </span>
            </div>

            {/* Daily Bar Comparison Chart */}
            <div className="space-y-2">
              <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1">
                {trendDays.map((t, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-20">
                      <div
                        style={{ height: `${(t.incoming / 24) * 100}%` }}
                        className="w-2.5 bg-blue-300 rounded-t-sm"
                        title={`Incoming: ${t.incoming}`}
                      />
                      <div
                        style={{ height: `${(t.resolved / 24) * 100}%` }}
                        className="w-2.5 bg-emerald-500 rounded-t-sm"
                        title={`Resolved: ${t.resolved}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{t.day}</span>
                  </div>
                ))}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-4 text-[11px] pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-300" />
                  <span>Incoming</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span>Resolved</span>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
            <Link to="/case-manager/reports" className="hover:underline flex items-center gap-1">
              <span>Statutory SLA report</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* 4. Priority Triage & Active Operations Queue */}
      <Card className="p-6 border border-slate-200 shadow-2xs space-y-4 bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              High-Priority Cases Requiring Action
            </h3>
            <p className="text-xs text-slate-500">
              Grievances requiring engineer assignment, clarification review, or statutory dispatch.
            </p>
          </div>

          <Link
            to="/case-manager/cases"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
          >
            <span>View All ({cases.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Triage Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[760px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3.5">Case ID</th>
                <th className="py-2.5 px-3.5">Grievance Title</th>
                <th className="py-2.5 px-3.5">Category</th>
                <th className="py-2.5 px-3.5">Location</th>
                <th className="py-2.5 px-3.5">SLA Countdown</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.slice(0, 5).map((c) => {
                const priorityConfig = getPriorityConfig(c.priority);
                const slaInfo = getRemainingSlaDays(c.slaDeadline);

                return (
                  <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-blue-700">
                      {c.id}
                    </td>

                    <td className="py-3 px-3.5">
                      <p className="font-bold text-slate-900 line-clamp-1 max-w-xs">
                        {c.title}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Citizen: {c.citizen.name}
                      </p>
                    </td>

                    <td className="py-3 px-3.5 text-slate-700 font-medium">
                      {c.category}
                    </td>

                    <td className="py-3 px-3.5 text-slate-600">
                      {c.ward}
                    </td>

                    <td className="py-3 px-3.5">
                      <span
                        className={cn(
                          'font-bold text-[11px]',
                          slaInfo.isBreached ? 'text-rose-600' : 'text-amber-600'
                        )}
                      >
                        {slaInfo.text}
                      </span>
                    </td>

                    <td className="py-3 px-3.5">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/case-manager/cases/${c.id}`)}
                          className="text-[11px] py-1 h-7 font-semibold"
                        >
                          View Details
                        </Button>

                        {c.status !== 'RESOLVED' && c.status !== 'CLOSED' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              updateCaseStatus(c.id, 'ACTION_IN_PROGRESS', 'Assigned crew dispatched to site.');
                              alert(`Case #${c.id} updated to Action in Progress!`);
                            }}
                            className="text-[11px] py-1 h-7 font-bold bg-blue-600 hover:bg-blue-700"
                          >
                            Dispatch
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
