import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, CheckSquare, Camera, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

export const CaseManagerLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Officer Dashboard', path: '/officer', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Triage & Case Queue', path: '/officer/queue', icon: <ListOrdered className="w-4 h-4 text-blue-600" /> },
    { label: 'Document Verification', path: '/officer/verification', icon: <CheckSquare className="w-4 h-4 text-emerald-600" /> },
    { label: 'Field Inspections', path: '/officer/field-inspections', icon: <Camera className="w-4 h-4 text-orange-600" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Officer Header Badge Info */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            AE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Er. Sachin Deshmukh (Assistant Executive Engineer)
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">
                ACTIVE DUTY
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Department: Municipal Water Supply & Sanitation • Zone 4 / Ward 14
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
            2 SLA Critical Cases
          </span>
          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
            14 Active Cases
          </span>
        </div>
      </div>

      {/* Sub-navigation pill bar */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === '/officer'
              ? location.pathname === '/officer'
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
