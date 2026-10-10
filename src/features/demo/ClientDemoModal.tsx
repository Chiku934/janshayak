import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_SCENARIOS, DemoScenario } from '../../types/demoScenario';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types/user';
import {
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  Briefcase,
  Shield,
  Layers,
  ArrowRight,
  Flame,
  Clock,
  ExternalLink,
  Info,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import confetti from 'canvas-confetti';

interface ClientDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDemoModal: React.FC<ClientDemoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    activeScenarioId,
    startDemoScenario,
    resetToDefaultData,
    activeRole,
    setRole,
  } = useAppStore();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    activeScenarioId || DEMO_SCENARIOS[0].id
  );
  const [resetSuccess, setResetSuccess] = useState(false);

  const selectedScenario =
    DEMO_SCENARIOS.find((s) => s.id === selectedScenarioId) || DEMO_SCENARIOS[0];

  const handleStartDemo = (scenario: DemoScenario) => {
    const result = startDemoScenario(scenario.id);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onClose();
    navigate(result.route);
  };

  const handleReset = () => {
    resetToDefaultData();
    setResetSuccess(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'CITIZEN':
        return <User className="w-3.5 h-3.5 text-emerald-600" />;
      case 'CASE_MANAGER':
        return <Briefcase className="w-3.5 h-3.5 text-blue-600" />;
      case 'ADMIN':
        return <Shield className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client Presentation Demo Controller"
      description="Select a predefined civic lifecycle scenario to preload realistic mock state and launch an executive walkthrough."
      size="xl"
    >
      <div className="space-y-5 pt-1">
        {/* Scenario Select Grid (5 Scenarios) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {DEMO_SCENARIOS.map((sc) => {
            const isSelected = selectedScenarioId === sc.id;
            const isActiveRunning = activeScenarioId === sc.id;

            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedScenarioId(sc.id)}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer group',
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/30 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={cn(
                        'text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider',
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      Scenario {sc.number}
                    </span>
                    {isActiveRunning && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" title="Active" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                    {sc.title.replace('Citizen reports ', '')}
                  </h4>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100/80 flex items-center gap-1 text-[10px] text-slate-500">
                  {getRoleIcon(sc.initialRole)}
                  <span className="capitalize">{sc.initialRole.toLowerCase().replace('_', ' ')}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Selected Scenario Detail Card */}
        <div className="bg-linear-to-br from-slate-900 to-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-400/30">
                  Scenario 0{selectedScenario.number} Selected
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {selectedScenario.subtitle}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                {selectedScenario.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="md"
                onClick={() => handleStartDemo(selectedScenario)}
                leftIcon={<Play className="w-4 h-4 fill-white" />}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer px-4"
              >
                Start Demo Scenario
              </Button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedScenario.description}
          </p>

          {/* Key Talking Points for Presenter */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Key Presentation Talking Points</span>
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
              {selectedScenario.keyTalkingPoints.map((tp, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{tp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Role Switcher Bar during Presentation */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 text-center sm:text-left">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Switch personas during your presentation without losing preloaded case data:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRole('CITIZEN');
                onClose();
                navigate(`/citizen/cases/${selectedScenario.targetCaseId}`);
              }}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer',
                activeRole === 'CITIZEN'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              )}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>

            <button
              onClick={() => {
                setRole('CASE_MANAGER');
                onClose();
                navigate(`/case-manager/cases/${selectedScenario.targetCaseId}`);
              }}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer',
                activeRole === 'CASE_MANAGER'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              )}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Case Manager</span>
            </button>

            <button
              onClick={() => {
                setRole('ADMIN');
                onClose();
                navigate('/admin/dashboard');
              }}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer',
                activeRole === 'ADMIN'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Footer Actions: Reset & Close */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
            className="text-xs text-slate-600 hover:text-slate-900 border-slate-300"
          >
            {resetSuccess ? '✓ Demo State Reset!' : 'Reset Demo State'}
          </Button>

          <Button size="sm" variant="ghost" onClick={onClose} className="text-xs font-semibold">
            Close Panel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
