import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading verified government records...',
  submessage = 'Connecting to Jan Sahayak National Data Gateway',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center',
        className
      )}
    >
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-blue-600">
          <Loader2 className="w-5 h-5 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-800">{message}</p>
      {submessage && (
        <p className="text-xs text-slate-400 mt-1">{submessage}</p>
      )}
    </div>
  );
};
