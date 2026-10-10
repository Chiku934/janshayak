import React from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'gov';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onDismiss,
  action,
  className,
  icon,
}) => {
  const variantStyles = {
    info: 'bg-blue-50/90 border-blue-200 text-blue-950',
    success: 'bg-emerald-50/90 border-emerald-200 text-emerald-950',
    warning: 'bg-amber-50/90 border-amber-200 text-amber-950',
    error: 'bg-rose-50/90 border-rose-200 text-rose-950',
    gov: 'bg-slate-900 border-slate-700 text-white',
  };

  const defaultIcons = {
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    gov: <Shield className="w-5 h-5 text-orange-400 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={cn(
        'relative flex items-start gap-3.5 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all shadow-2xs',
        variantStyles[variant],
        className
      )}
    >
      <div className="mt-0.5 shrink-0">{icon || defaultIcons[variant]}</div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-bold text-sm tracking-tight mb-1 leading-tight">
            {title}
          </h4>
        )}
        <div className="opacity-90">{children}</div>

        {action && <div className="mt-3">{action}</div>}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
