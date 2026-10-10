import React from 'react';
import { CaseTimelineItem } from '../../types/case';
import { StatusBadge } from './StatusBadge';
import { formatDateTime } from '../../utils/formatters';
import { Bot, User, CheckCircle, Clock, Check, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface TimelineProps {
  items: CaseTimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'relative pl-7 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200',
        className
      )}
    >
      {items.map((item, idx) => {
        const isLatest = idx === items.length - 1;
        const isFirst = idx === 0;

        return (
          <motion.div key={item.id} variants={itemVariants} className="relative group">
            {/* Timeline node marker */}
            <div
              className={cn(
                'absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-all shadow-2xs',
                isLatest
                  ? 'border-emerald-500 text-emerald-600 ring-4 ring-emerald-100 scale-105'
                  : item.isAutomated
                  ? 'border-indigo-500 text-indigo-600 ring-2 ring-indigo-50'
                  : 'border-blue-600 text-blue-600 ring-2 ring-blue-50'
              )}
            >
              {isLatest ? (
                <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
              ) : item.isAutomated ? (
                <Bot className="w-3 h-3 text-indigo-600" />
              ) : (
                <User className="w-3 h-3 text-blue-600" />
              )}
            </div>

            {/* Event content card */}
            <div
              className={cn(
                'rounded-2xl p-4 border transition-all duration-200',
                isLatest
                  ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                  : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-50'
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  {item.status && <StatusBadge status={item.status} showDot={false} />}
                </div>

                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {formatDateTime(item.timestamp)}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

              {item.comment && (
                <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 italic shadow-2xs">
                  <span className="font-bold not-italic text-slate-900 mr-1">
                    Officer Action Note:
                  </span>
                  "{item.comment}"
                </div>
              )}

              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                <span className="font-bold text-slate-700">{item.actor.name}</span>
                <span>•</span>
                <span>{item.actor.role}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
