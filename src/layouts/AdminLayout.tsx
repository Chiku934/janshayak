import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, Activity, BarChart3, Users, FileSpreadsheet, MapPin } from 'lucide-react';
import { cn } from '../utils/cn';

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Collectorate Command Center', path: '/admin', icon: <Shield className="w-4 h-4 text-purple-600" /> },
    { label: 'SLA Sentinel & Escalations', path: '/admin/sla-monitor', icon: <Activity className="w-4 h-4 text-rose-600" /> },
    { label: 'Department Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4 text-blue-600" /> },
    { label: 'Ward Heatmaps', path: '/admin/wards', icon: <MapPin className="w-4 h-4 text-emerald-600" /> },
    { label: 'Staff Workload', path: '/admin/staff', icon: <Users className="w-4 h-4 text-amber-600" /> },
    { label: 'Audit Log & MIS', path: '/admin/audit', icon: <FileSpreadsheet className="w-4 h-4 text-slate-600" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Title Info */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
            IAS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Dr. Neha Rajvanshi, IAS (District Magistrate & Collector)
              </h3>
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold border border-purple-200">
                DISTRICT OVERSIGHT
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Executive Governance Dashboard • 95.5% District SLA Compliance Rate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            136,420 Grievances Resolved
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
            4 SLA Escalations Active
          </span>
        </div>
      </div>

      {/* Sub-navigation pill bar */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0',
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
};
