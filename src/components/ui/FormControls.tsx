import React from 'react';
import { cn } from '../../utils/cn';
import { Check } from 'lucide-react';

// 1. Checkbox
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, ...props }, ref) => {
    const inputId = id || `cb-${Math.random()}`;

    return (
      <label htmlFor={inputId} className="inline-flex items-start gap-2.5 cursor-pointer select-none">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            className={cn(
              'peer w-4 h-4 rounded border border-slate-300 bg-white text-blue-600 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 checked:bg-blue-600 checked:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
              className
            )}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="text-xs">
            {label && <span className="font-semibold text-slate-800">{label}</span>}
            {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// 2. Radio
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const inputId = id || `rad-${Math.random()}`;

    return (
      <label htmlFor={inputId} className="inline-flex items-start gap-2.5 cursor-pointer select-none">
        <input
          id={inputId}
          ref={ref}
          type="radio"
          className={cn(
            'mt-0.5 w-4 h-4 border border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
            className
          )}
          {...props}
        />
        {(label || description) && (
          <div className="text-xs">
            {label && <span className="font-semibold text-slate-800">{label}</span>}
            {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
          </div>
        )}
      </label>
    );
  }
);
Radio.displayName = 'Radio';

// 3. Switch (Toggle)
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, checked, onChange, disabled, ...props }, ref) => {
    const inputId = id || `sw-${Math.random()}`;

    return (
      <label htmlFor={inputId} className="inline-flex items-center justify-between gap-3 cursor-pointer select-none">
        {(label || description) && (
          <div className="text-xs">
            {label && <span className="font-semibold text-slate-800">{label}</span>}
            {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
          </div>
        )}
        <div className="relative inline-flex items-center">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50" />
        </div>
      </label>
    );
  }
);
Switch.displayName = 'Switch';
