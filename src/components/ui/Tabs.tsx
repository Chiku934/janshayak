import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  labelHi?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'pill' | 'underline' | 'boxed';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'pill',
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== index && !tabs[nextIndex].disabled) {
      e.preventDefault();
      handleSelect(tabs[nextIndex].id);
      const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  const activeTabItem = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className={cn('w-full', className)}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Civic navigation tabs"
        className={cn(
          'flex items-center gap-1 overflow-x-auto pb-1',
          variant === 'pill' && 'p-1 bg-slate-100/80 rounded-xl border border-slate-200/80',
          variant === 'boxed' && 'p-1 bg-white rounded-xl border border-slate-200 shadow-2xs',
          variant === 'underline' && 'border-b border-slate-200 gap-6'
        )}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => handleSelect(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all rounded-lg select-none whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed',
                variant === 'underline'
                  ? isActive
                    ? 'text-blue-600 font-bold border-b-2 border-blue-600 rounded-none pb-2.5 -mb-px'
                    : 'text-slate-600 hover:text-slate-900 pb-2.5'
                  : isActive
                  ? 'text-blue-700 font-bold bg-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.labelHi && (
                <span className="text-[11px] opacity-75 hidden sm:inline">({tab.labelHi})</span>
              )}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isActive
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-200 text-slate-700'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panel */}
      <div
        role="tabpanel"
        id={`panel-${activeTabItem.id}`}
        aria-labelledby={`tab-${activeTabItem.id}`}
        className="mt-4 focus-visible:outline-none"
      >
        <motion.div
          key={activeTabItem.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {activeTabItem.content}
        </motion.div>
      </div>
    </div>
  );
};
