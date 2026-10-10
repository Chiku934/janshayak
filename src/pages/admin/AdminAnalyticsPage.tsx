import React from 'react';
import { DashboardCard } from '../../components/ui/DashboardCard';
import { Card } from '../../components/ui/Card';
import { DataTable, Column } from '../../components/ui/DataTable';
import { SYSTEM_ANALYTICS_DATA } from '../../mock/statsData';
import { DepartmentKpi, WardMetric } from '../../types/analytics';
import {
  Shield,
  Activity,
  BarChart3,
  TrendingUp,
  MapPin,
  Clock,
  Mic,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const stats = SYSTEM_ANALYTICS_DATA;

  const departmentColumns: Column<DepartmentKpi>[] = [
    {
      header: 'Department',
      accessorKey: 'department',
      cell: (row) => <span className="font-bold text-slate-900">{row.department}</span>,
    },
    {
      header: 'Total Cases',
      accessorKey: 'totalGrievances',
      cell: (row) => <span className="font-semibold">{row.totalGrievances.toLocaleString()}</span>,
    },
    {
      header: 'Resolved',
      accessorKey: 'resolved',
      cell: (row) => (
        <span className="text-emerald-700 font-bold">{row.resolved.toLocaleString()}</span>
      ),
    },
    {
      header: 'SLA Adherence',
      accessorKey: 'slaAdherenceRate',
      cell: (row) => (
        <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
          {row.slaAdherenceRate}%
        </span>
      ),
    },
    {
      header: 'Avg Resolution',
      accessorKey: 'avgResolutionDays',
      cell: (row) => <span>{row.avgResolutionDays} Days</span>,
    },
    {
      header: 'Satisfaction',
      accessorKey: 'citizenSatisfactionScore',
      cell: (row) => (
        <span className="text-amber-700 font-bold">★ {row.citizenSatisfactionScore} / 5.0</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Admin Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Grievances Logged"
          value={stats.totalCasesLogged.toLocaleString()}
          subtitle="Cumulative District Volume"
          accentColor="blue"
          icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
          trend={{ value: '+8.4% vs Q2', isPositive: true }}
        />

        <DashboardCard
          title="Overall SLA Adherence"
          value={`${stats.overallSlaAdherence}%`}
          subtitle="District Public Service Standard"
          accentColor="emerald"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          trend={{ value: '+1.2% this quarter', isPositive: true }}
        />

        <DashboardCard
          title="Voice-First Grievance Rate"
          value={`${stats.voiceGrievancePercent}%`}
          subtitle="Multilingual Voice Intake"
          accentColor="orange"
          icon={<Mic className="w-5 h-5 text-orange-600" />}
          trend={{ value: '41.8% of Total Intake', neutral: true }}
        />

        <DashboardCard
          title="DigiLocker Auto-Verification"
          value={`${stats.digiLockerAutoVerificationRate}%`}
          subtitle="Aadhaar / NFSA Instant Match"
          accentColor="purple"
          icon={<FileCheck className="w-5 h-5 text-purple-600" />}
          trend={{ value: 'Zero Fake Complaints', isPositive: true }}
        />
      </div>

      {/* Department KPI Performance Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Departmental SLA Compliance & Redressal Performance
            </h3>
            <p className="text-xs text-slate-500">
              Real-time monitoring across all municipal, utility, and welfare nodal departments.
            </p>
          </div>
        </div>

        <DataTable
          columns={departmentColumns}
          data={stats.departmentKpis}
          className="shadow-xs"
        />
      </div>

      {/* Ward Level Hotspots Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Ward Level Civic Hotspots & Risk Radar
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.recentWards.map((w, idx) => (
            <Card key={idx} className="p-5 border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {w.wardNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    w.slaRisk === 'HIGH'
                      ? 'bg-rose-100 text-rose-800'
                      : w.slaRisk === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {w.slaRisk} RISK
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">{w.wardName}</h4>
              <p className="text-xs text-slate-600 mb-2">
                Hotspot: <b className="text-slate-800">{w.hotspotCategory}</b>
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{w.activeIssues} Active Issues</span>
                <span className="font-medium text-slate-700">{w.officerInCharge}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
