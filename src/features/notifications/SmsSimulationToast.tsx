import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MessageSquare, X, Smartphone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SmsSimulationToast: React.FC = () => {
  const { activeSmsAlert, dismissSmsSimulation } = useAppStore();
  const navigate = useNavigate();

  if (!activeSmsAlert || !activeSmsAlert.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 ring-1 ring-white/10">
        {/* SMS Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Smartphone className="w-4 h-4 animate-bounce" />
            <span>Simulated SMS Alert</span>
          </div>
          <button
            onClick={dismissSmsSimulation}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sender & Phone */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span className="font-bold text-slate-200">{activeSmsAlert.sender}</span>
          <span className="font-mono">{activeSmsAlert.phone}</span>
        </div>

        {/* SMS Content */}
        <div className="p-3 bg-slate-800/90 rounded-xl text-xs text-slate-100 font-mono leading-relaxed border border-slate-700/60 mb-3">
          {activeSmsAlert.text}
        </div>

        {/* Dismiss / Action */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Just received via Gov SMS Gateway</span>
          <button
            onClick={dismissSmsSimulation}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
};
