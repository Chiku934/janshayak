import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types/user';
import { DEMO_SCENARIOS } from '../../types/demoScenario';
import { motion } from 'framer-motion';
import {
  User,
  Briefcase,
  Shield,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  PhoneCall,
  Check,
  Info,
  Smartphone,
  Play,
  Zap,
  Clock,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../utils/cn';

interface RoleCardData {
  role: UserRole;
  title: string;
  tagline: string;
  description: string;
  personaName: string;
  personaTitle: string;
  initials: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  route: string;
  onboardingRoute?: string;
  features: string[];
}

export const DemoOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRole, resetToDefaultData, activeRole, startDemoScenario } = useAppStore();
  const [resetSuccess, setResetSuccess] = useState(false);

  const roles: RoleCardData[] = [
    {
      role: 'CITIZEN',
      title: 'Citizen',
      tagline: 'CITIZEN PORTAL',
      description: 'Report civic issues, track real-time resolution status, and access welfare schemes.',
      personaName: 'Rameshwar Patil',
      personaTitle: 'Resident, Ward 14 Pune',
      initials: 'RP',
      icon: User,
      accentColor: 'border-blue-500/80',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeText: 'Resident',
      route: '/citizen/home',
      onboardingRoute: '/citizen/login',
      features: [
        'Multilingual voice-first grievance filing',
        'Real-time SLA status tracking',
        'DigiLocker certificate auto-attachment',
        'Central & State welfare scheme discovery',
      ],
    },
    {
      role: 'CASE_MANAGER',
      title: 'Case Manager',
      tagline: 'OFFICER WORKSPACE',
      description: 'Operational triage desk, engineer dispatch, and statutory SLA monitoring.',
      personaName: 'Er. Sachin Deshmukh',
      personaTitle: 'Assistant Executive Engineer (Water Supply)',
      initials: 'SD',
      icon: Briefcase,
      accentColor: 'border-[#1D68FF]',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeText: 'Officer Desk',
      route: '/case-manager/dashboard',
      features: [
        'AI triage & duplicate detection queue',
        'Field crew dispatch & work order tokening',
        'Mobile GPS camera proof verification',
        'Automated citizen SMS trigger updates',
      ],
    },
    {
      role: 'ADMIN',
      title: 'Administrator',
      tagline: 'COMMAND CENTER',
      description: 'District-wide governance analytics, departmental SLAs, and audit control.',
      personaName: 'Dr. Neha Rajvanshi, IAS',
      personaTitle: 'District Magistrate & Collector',
      initials: 'NR',
      icon: Shield,
      accentColor: 'border-slate-700',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      badgeText: 'Command Center',
      route: '/admin/dashboard',
      features: [
        'Macro district analytics & resolution KPIs',
        'Automated SLA breach escalation sentinel',
        'Ward hotspot heatmaps & risk radar',
        'Immutable cryptographic audit trail & MIS',
      ],
    },
  ];

  const handleSelectRole = (role: UserRole, route: string) => {
    setRole(role);
    navigate(route);
  };

  const handleResetDemo = () => {
    resetToDefaultData();
    setResetSuccess(true);
    confetti({ particleCount: 50, spread: 50 });
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-7 w-full pb-12">
      {/* ========================================================================= */}
      {/* 1. HERO HEADER BANNER (Clean Enterprise Style - No Cartoonish Images) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-[#1D68FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D68FF]" />
              <span>Multi-Role Civic Platform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
              Interactive Workspace & Demo Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Select a persona workspace to test full civic service delivery workflows, or launch a predefined scenario.
            </p>
          </div>

          {/* Quick System Action Chips */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDemo}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
              className="text-xs font-bold border-slate-200 hover:bg-slate-50 shadow-2xs"
            >
              {resetSuccess ? 'Reset Complete!' : 'Reset Demo State'}
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 3 PRIMARY ROLE SELECTION CARDS (Clean Structured Cards) */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Persona Workspaces</h2>
            <p className="text-xs text-slate-500">Access end-to-end portals tailored for citizens, officers, and administrators.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((item) => {
            const isSelected = activeRole === item.role;
            const Icon = item.icon;

            return (
              <div
                key={item.role}
                className={cn(
                  'rounded-2xl border bg-white p-6 shadow-2xs transition-all duration-200 flex flex-col justify-between space-y-6 hover:shadow-md hover:border-slate-300',
                  isSelected ? 'ring-2 ring-[#1D68FF]/30 border-[#1D68FF]' : 'border-slate-200/90'
                )}
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D68FF] flex items-center justify-center font-bold border border-blue-100">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {item.tagline}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', item.badgeBg)}>
                      {item.badgeText}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                    {item.description}
                  </p>

                  {/* Officer / Citizen Persona Card */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1D68FF] text-white font-black text-xs flex items-center justify-center shrink-0">
                      {item.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.personaName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.personaTitle}
                      </p>
                    </div>
                  </div>

                  {/* Capabilities List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Key Capabilities
                    </p>
                    <ul className="space-y-1.5">
                      {item.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-slate-600 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleSelectRole(item.role, item.route)}
                    className="w-full justify-center text-xs font-bold bg-[#1D68FF] hover:bg-blue-700 text-white shadow-xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Enter {item.title} Workspace
                  </Button>

                  {item.onboardingRoute && (
                    <button
                      type="button"
                      onClick={() => handleSelectRole(item.role, item.onboardingRoute!)}
                      className="w-full text-center py-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      Experience Citizen OTP Onboarding →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PREDEFINED CLIENT DEMO SCENARIOS (5 Scenarios) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Predefined Client Demo Scenarios</h2>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                5 Interactive Flows
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Launch preloaded, end-to-end civic grievance journeys ready for client demonstrations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DEMO_SCENARIOS.map((sc, idx) => {
            return (
              <Card
                key={sc.id}
                className="p-4 border border-slate-200/90 shadow-2xs bg-white flex flex-col justify-between space-y-4 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-wider text-slate-400">
                      SCENARIO 0{idx + 1}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {sc.initialRole.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {sc.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      startDemoScenario(sc.id);
                      navigate(sc.startRoute);
                    }}
                    className="w-full justify-center text-xs font-bold bg-[#F8FAFC] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all"
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                  >
                    Start Demo
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FOOTER NOTE */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Frontend Demonstration Store:</strong> All case workflows, SMS triggers, DigiLocker docs, and SLA countdowns run in local browser state with zero external servers.
          </span>
        </div>

        <button
          type="button"
          onClick={handleResetDemo}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 shrink-0 cursor-pointer"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
