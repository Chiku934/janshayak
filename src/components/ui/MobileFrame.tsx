import React from 'react';
import { cn } from '../../utils/cn';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  className,
  title = 'JAN SAHAYAK Mobile',
}) => {
  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-[380px] h-[740px] bg-slate-200 rounded-[44px] p-3 shadow-xl ring-1 ring-slate-300 flex flex-col',
        className
      )}
    >
      {/* Outer physical bezel buttons */}
      <div className="absolute -left-1 top-24 w-1 h-12 bg-slate-300 rounded-l-md" />
      <div className="absolute -left-1 top-40 w-1 h-12 bg-slate-300 rounded-l-md" />
      <div className="absolute -right-1 top-32 w-1 h-16 bg-slate-300 rounded-r-md" />

      {/* Screen Container */}
      <div className="relative w-full h-full bg-slate-50 rounded-[34px] overflow-hidden flex flex-col border border-slate-300/60">
        {/* Dynamic Island / Notch */}
        <div className="w-full bg-white text-slate-800 px-6 py-2 flex items-center justify-between text-xs z-30 select-none border-b border-slate-200/60 shadow-2xs">
          <span className="font-semibold text-[11px] tracking-tight">09:41</span>
          <div className="w-20 h-4 bg-slate-200 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-500">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto flex flex-col relative">
          {children}
        </div>

        {/* Home Bar Indicator */}
        <div className="w-full py-2 bg-white/80 backdrop-blur-sm flex justify-center items-center shrink-0 border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
