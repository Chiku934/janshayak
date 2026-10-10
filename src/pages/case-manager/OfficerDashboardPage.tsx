import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { DashboardCard } from '../../components/ui/DashboardCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CaseCard } from '../../features/cases/CaseCard';
import {
  ListOrdered,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Camera,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building,
  UserCheck,
} from 'lucide-react';

export const OfficerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases, currentUser } = useAppStore();

  const officerCases = cases.filter(
    (c) => c.department === 'Municipal Water Supply & Sanitation' || c.priority === 'CRITICAL' || true
  );

  const criticalCases = officerCases.filter((c) => c.priority === 'CRITICAL');
  const pendingTriage = officerCases.filter((c) => c.status === 'SUBMITTED' || c.status === 'AI_TRIAGED');
  const inAction = officerCases.filter((c) => c.status === 'FIELD_INSPECTION' || c.status === 'ACTION_IN_PROGRESS');
  const resolved = officerCases.filter((c) => c.status === 'RESOLVED');

  return (
    <div className="space-y-8">
      {/* Top Officer KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Critical SLA Breaches"
          value="1 Active"
          subtitle="Ward 19 High-Voltage Transformer"
          accentColor="rose"
          icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
          trend={{ value: 'Collector Alerted', isPositive: false }}
          onClick={() => navigate('/officer/queue')}
        />

        <DashboardCard
          title="Pending Triage & Assign"
          value={pendingTriage.length}
          subtitle="Auto-classified by AI Engine"
          accentColor="blue"
          icon={<Clock className="w-5 h-5 text-blue-600" />}
          trend={{ value: '4.2 min avg triage', isPositive: true }}
          onClick={() => navigate('/officer/queue')}
        />

        <DashboardCard
          title="Field Inspections Active"
          value={inAction.length}
          subtitle="Work trucks deployed"
          accentColor="orange"
          icon={<Camera className="w-5 h-5 text-orange-600" />}
          trend={{ value: '2 Trucks on Site', neutral: true }}
          onClick={() => navigate('/officer/field-inspections')}
        />

        <DashboardCard
          title="Resolved (This Month)"
          value="98.2%"
          subtitle="SLA Compliance Rate"
          accentColor="emerald"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          trend={{ value: '+2.4% vs last month', isPositive: true }}
        />
      </div>

      {/* Immediate Attention: Critical Grievances */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-base font-bold text-slate-900">
              High Priority & SLA Critical Action Required ({criticalCases.length})
            </h3>
          </div>
          <Link
            to="/officer/queue"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View all queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {criticalCases.map((item) => (
            <CaseCard key={item.id} item={item} viewMode="officer" />
          ))}
        </div>
      </div>

      {/* Quick Action Work Order Dispatcher */}
      <Card className="p-6 bg-linear-to-r from-blue-50/60 to-indigo-50/60 border-blue-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              Emergency Field Repair Deployment Desk
            </h4>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              Dispatch municipal emergency maintenance trucks with GPS tracking and auto-send citizen SMS tokens upon deployment.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/officer/queue')}
            leftIcon={<ListOrdered className="w-4 h-4" />}
          >
            Open Dispatch Queue
          </Button>
        </div>
      </Card>
    </div>
  );
};
