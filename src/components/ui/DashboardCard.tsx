import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    neutral?: boolean;
    label?: string;
  };
  accentColor?: 'blue' | 'emerald' | 'orange' | 'purple' | 'rose' | 'amber';
  className?: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'blue',
  className,
  onClick,
}) => {
  const accentBorders = {
    blue: 'border-l-4 border-l-blue-600',
    emerald: 'border-l-4 border-l-emerald-600',
    orange: 'border-l-4 border-l-orange-500',
    purple: 'border-l-4 border-l-purple-600',
    rose: 'border-l-4 border-l-rose-500',
    amber: 'border-l-4 border-l-amber-500',
  };

  const iconBg = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={cn(
        'p-5 relative overflow-hidden transition-all',
        accentBorders[accentColor],
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
          </div>

          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{subtitle}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px]',
                  trend.neutral
                    ? 'bg-slate-100 text-slate-600'
                    : trend.isPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                )}
              >
                {trend.neutral ? (
                  <Minus className="w-3 h-3" />
                ) : trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trend.value}
              </span>
              {trend.label && (
                <span className="text-slate-400 text-[11px] font-normal">{trend.label}</span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs',
              iconBg[accentColor]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
