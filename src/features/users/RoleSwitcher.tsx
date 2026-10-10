import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types/user';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, Briefcase, ChevronRight, Check, RotateCcw, Sparkles, Sliders } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ClientDemoModal } from '../demo/ClientDemoModal';
import confetti from 'canvas-confetti';

export const RoleSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { activeRole, setRole, currentUser, resetToDefaultData } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [resetDone, setResetDone] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode; defaultPath: string }[] = [
    {
      role: 'CITIZEN',
      label: 'Citizen Portal',
      desc: 'Lodge grievances, track status, view schemes & DigiLocker documents',
      icon: <User className="w-4 h-4 text-emerald-600" />,
      defaultPath: '/citizen',
    },
    {
      role: 'CASE_MANAGER',
      label: 'Case Manager',
      desc: 'Ward triage, field investigation, work orders & SLA compliance',
      icon: <Briefcase className="w-4 h-4 text-blue-600" />,
      defaultPath: '/case-manager/dashboard',
    },
    {
      role: 'ADMIN',
      label: 'District Admin',
      desc: 'Macro analytics, SLA command center, ward heatmaps & audit trail',
      icon: <Shield className="w-4 h-4 text-purple-600" />,
      defaultPath: '/admin',
    },
  ];

  const handleRoleChange = (role: UserRole, defaultPath: string) => {
    setRole(role);
    navigate(defaultPath);
  };

  const handleReset = () => {
    resetToDefaultData();
    setResetDone(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <>
      <div className={cn('bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xl', className)}>
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Demo Persona Switcher
          </span>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
            {currentUser.name}
          </span>
        </div>

        {/* Dedicated Client Demo Presentation Mode Launcher */}
        <button
          onClick={() => setIsDemoModalOpen(true)}
          className="w-full mb-2.5 p-2.5 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-xs hover:shadow-md hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
                <span>Client Demo Scenarios</span>
                <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">5 READY</span>
              </p>
              <p className="text-[10px] text-blue-100/90 font-medium">
                Launch preloaded water, road, outage & SLA flows
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="space-y-1.5">
          {roles.map((item) => {
            const isActive = activeRole === item.role;

            return (
              <button
                key={item.role}
                onClick={() => handleRoleChange(item.role, item.defaultPath)}
                className={cn(
                  'w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer',
                  isActive
                    ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500/50 shadow-2xs'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 leading-tight truncate">
                      {item.label}
                    </h5>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
                {isActive && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between px-1">
          <span className="text-[10px] text-slate-400">Local State Persisted</span>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-rose-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{resetDone ? '✓ Reset Done' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>

      <ClientDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </>
  );
};


