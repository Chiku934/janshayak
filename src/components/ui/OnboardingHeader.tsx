import React from 'react';
import { GovEmblem } from './GovEmblem';
import { ShieldCheck, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface OnboardingHeaderProps {
  currentStep: 1 | 2 | 3;
  title: string;
  subtitle: string;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  currentStep,
  title,
  subtitle,
}) => {
  const steps = [
    { num: 1, label: 'OTP Verification', labelHi: 'ମୋବାଇଲ୍ ଯାଞ୍ଚ' },
    { num: 2, label: 'Citizen Profile', labelHi: 'ନାଗରିକ ପ୍ରୋଫାଇଲ୍' },
    { num: 3, label: 'Consent & Privacy', labelHi: 'ସମ୍ମତି ଓ ଗୋପନୀୟତା' },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-5 text-center">
      {/* Emblem & National Title */}
      <div className="flex flex-col items-center gap-2">
        <GovEmblem size="md" />
        <div>
          <span className="text-sm font-extrabold text-blue-950 tracking-tight">
            JAN SAHAYAK • ଜନ ସହାୟକ
          </span>
          <p className="text-[10px] text-slate-500 font-medium">
            National Citizen Onboarding & Authentication Gateway
          </p>
        </div>
      </div>

      {/* 3-Step Progress Indicator */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between relative px-2">
          {/* Connector line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-100 -z-0">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {steps.map((s) => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;

            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs border-2',
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 scale-105'
                      : isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-400 border-slate-300'
                  )}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-semibold mt-1.5 whitespace-nowrap',
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Heading & Subtitle */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
