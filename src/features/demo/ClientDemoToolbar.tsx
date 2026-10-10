import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_SCENARIOS } from '../../types/demoScenario';
import { UserRole } from '../../types/user';
import { ClientDemoModal } from './ClientDemoModal';
import {
  Sparkles,
  User,
  Briefcase,
  Shield,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Layers,
  Check,
  Play,
  Flame,
  AlertCircle,
  ExternalLink,
  Sliders,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import confetti from 'canvas-confetti';

export const ClientDemoToolbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeRole,
    setRole,
    isDemoModeActive,
    activeScenarioId,
    activeDemoCaseId,
    resetToDefaultData,
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Collapsed by default to never obstruct main UI
  const [resetFeedback, setResetFeedback] = useState(false);

  const activeScenario =
    DEMO_SCENARIOS.find((s) => s.id === activeScenarioId) || DEMO_SCENARIOS[0];

  const currentCaseId =
    activeDemoCaseId ||
    (location.pathname.match(/JS-2026-\d+/) ? location.pathname.match(/JS-2026-\d+/)![0] : 'JS-2026-8942');

  const handleRoleSwitch = (targetRole: UserRole) => {
    setRole(targetRole);

    // Map intelligent route preservation
    if (targetRole === 'CITIZEN') {
      if (currentCaseId) {
        navigate(`/citizen/cases/${currentCaseId}`);
      } else {
        navigate('/citizen/cases');
      }
    } else if (targetRole === 'CASE_MANAGER') {
      if (currentCaseId) {
        navigate(`/case-manager/cases/${currentCaseId}`);
      } else {
        navigate('/case-manager/cases');
      }
    } else if (targetRole === 'ADMIN') {
      navigate('/admin/dashboard');
    }
  };

  const handleReset = () => {
    resetToDefaultData();
    setResetFeedback(true);
    confetti({ particleCount: 40, spread: 45 });
    setTimeout(() => setResetFeedback(false), 2500);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            /* Minimized Discreet Floating Action Pill */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="bg-slate-900/95 text-white text-xs font-bold px-3.5 py-2 rounded-full border border-slate-700 shadow-xl flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer group hover:scale-105"
                title="Open Client Presentation Demo Controls"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">
                  Demo Hub
                </span>
                <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </motion.div>
          ) : (
            /* Compact Expanded Floating Controller Panel */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl border border-slate-700 shadow-2xl p-3.5 w-80 sm:w-96 space-y-3"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-black tracking-tight text-white">Client Presentation Controls</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Minimize Demo Panel"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Role Switcher */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Persona (Preserving Case Context)
                </span>
                <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('CITIZEN')}
                    className={cn(
                      'px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      activeRole === 'CITIZEN'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    )}
                  >
                    <User className="w-3 h-3" />
                    <span>Citizen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('CASE_MANAGER')}
                    className={cn(
                      'px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      activeRole === 'CASE_MANAGER'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    )}
                  >
                    <Briefcase className="w-3 h-3" />
                    <span>Officer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('ADMIN')}
                    className={cn(
                      'px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      activeRole === 'ADMIN'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    )}
                  >
                    <Shield className="w-3 h-3" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Actions: Scenarios Launcher + Reset Demo */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>5 Demo Scenarios</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Reset Demo Data to Initial State"
                >
                  <RotateCcw className={cn('w-3.5 h-3.5', resetFeedback && 'animate-spin text-emerald-400')} />
                  <span>{resetFeedback ? 'Reset!' : 'Reset'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scenarios Picker Modal */}
      <ClientDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
