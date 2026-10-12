import React, { useState } from 'react';
import { useVoiceStore } from '../../store/useVoiceStore';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Mic, MicOff, Volume2, Sparkles, Send, CheckCircle2, RotateCcw, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';

export const VoiceAssistantWidget: React.FC = () => {
  const {
    isOpen,
    closeVoiceAssistant,
    conversation,
    isListening,
    isProcessing,
    startListening,
    stopListening,
    simulateScenario,
    resetConversation,
    selectedLanguage,
    setLanguage,
  } = useVoiceStore();

  const [inputCustomText, setInputCustomText] = useState('');

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeVoiceAssistant}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Jan Sahayak AI Voice Assistant (ଜନ ସହାୟକ)
            </h3>
            <p className="text-[11px] text-slate-500 font-normal">
              Voice-First Multilingual Civic Redressal & Scheme Engine
            </p>
          </div>
        </div>
      }
      size="lg"
    >
      <div className="flex flex-col h-[520px]">
        {/* Language selector strip & Preset Quick Scenarios */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <span>Spoken Dialect:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-bold text-blue-900 focus:outline-none"
            >
              <option value="or-IN">Odia (ଓଡ଼ିଆ)</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
              <option value="mr-IN">Marathi (मराठी)</option>
              <option value="en-IN">English (India)</option>
              <option value="bn-IN">Bengali (বাংলা)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
              <option value="te-IN">Telugu (తెలుగు)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetConversation}
              leftIcon={<RotateCcw className="w-3 h-3" />}
              className="text-xs text-slate-500 hover:text-slate-800 py-1 h-7"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Preset scenario triggers for instant demo wow */}
        <div className="mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Demo Voice Scenarios:
          </span>
          <button
            onClick={() => simulateScenario('WATER_CRISIS')}
            disabled={isProcessing}
            className="text-xs px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition-colors shrink-0 cursor-pointer"
          >
            💧 Water Pipeline Burst (Ward 14)
          </button>
          <button
            onClick={() => simulateScenario('PENSION_HELP')}
            disabled={isProcessing}
            className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200 transition-colors shrink-0 cursor-pointer"
          >
            👵 Pension DBT Banking Delay
          </button>
          <button
            onClick={() => simulateScenario('ELECTRICITY_HAZARD')}
            disabled={isProcessing}
            className="text-xs px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200 transition-colors shrink-0 cursor-pointer"
          >
            ⚡ Transformer Hazard (School)
          </button>
        </div>

        {/* Conversation Message Feed */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
          {conversation.map((msg) => {
            const isCitizen = msg.sender === 'CITIZEN';

            return (
              <div
                key={msg.id}
                className={cn(
                  'flex items-start gap-2.5 max-w-[88%]',
                  isCitizen ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs',
                    isCitizen
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 text-white'
                  )}
                >
                  {isCitizen ? 'Citizen' : 'AI'}
                </div>

                <div
                  className={cn(
                    'p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs',
                    isCitizen
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-900 border border-slate-200/80 rounded-tl-xs'
                  )}
                >
                  <p>{msg.text}</p>
                  {msg.textHi && !isCitizen && (
                    <p className="mt-1 pt-1 border-t border-slate-200/60 text-[11px] text-slate-600 font-medium">
                      {msg.textHi}
                    </p>
                  )}

                  {/* Detected Entity Tag Pill */}
                  {msg.detectedEntities && (
                    <div className="mt-2.5 pt-2 border-t border-blue-500/40 text-[10px] space-y-1 bg-blue-700/40 p-2 rounded-lg">
                      <div className="flex items-center gap-1 font-bold text-amber-200">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Entity Extraction:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-slate-100">
                        {msg.detectedEntities.category && (
                          <span>Dept: <b>{msg.detectedEntities.category}</b></span>
                        )}
                        {msg.detectedEntities.location && (
                          <span>Location: <b>{msg.detectedEntities.location}</b></span>
                        )}
                        {msg.detectedEntities.urgency && (
                          <span>Severity: <b className="text-amber-300">{msg.detectedEntities.urgency}</b></span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 text-xs rounded-xl animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
              <span>Jan Sahayak AI is transcribing speech, running NLP entity extraction & routing...</span>
            </div>
          )}
        </div>

        {/* Voice Equalizer Audio Waves & Mic Action */}
        <div className="pt-3 border-t border-slate-100 flex flex-col items-center gap-3">
          {isListening && (
            <div className="flex items-center gap-1 h-6">
              <span className="w-1.5 h-3 bg-blue-600 rounded-full animate-wave-1" />
              <span className="w-1.5 h-6 bg-blue-600 rounded-full animate-wave-2" />
              <span className="w-1.5 h-8 bg-blue-600 rounded-full animate-wave-3" />
              <span className="w-1.5 h-5 bg-blue-600 rounded-full animate-wave-4" />
              <span className="w-1.5 h-3 bg-blue-600 rounded-full animate-wave-5" />
              <span className="text-xs font-semibold text-blue-700 ml-2 animate-pulse">
                Listening in real-time... Speak now
              </span>
            </div>
          )}

          <div className="flex items-center justify-between w-full gap-3">
            <button
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                  setTimeout(() => {
                    simulateScenario('WATER_CRISIS');
                    stopListening();
                  }, 2500);
                }
              }}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all shadow-md cursor-pointer',
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-200 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-100'
              )}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Tap to Speak Voice Grievance</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-slate-400">
              Zero typing required • Built for 1.4B Citizens
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
