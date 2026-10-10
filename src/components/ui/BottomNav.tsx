import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Home, FolderClock, Layers, User, LucideIcon } from 'lucide-react';
import { useVoiceStore } from '../../store/useVoiceStore';

export interface BottomNavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

interface BottomNavProps {
  items?: BottomNavItem[];
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ items, className }) => {
  const { openVoiceAssistant } = useVoiceStore();

  const defaultItems: BottomNavItem[] = items || [
    { label: 'Home', path: '/citizen', icon: <Home className="w-5 h-5" /> },
    { label: 'My Cases', path: '/citizen/cases', icon: <FolderClock className="w-5 h-5" /> },
    { label: 'Services', path: '/citizen/schemes', icon: <Layers className="w-5 h-5" /> },
    { label: 'Profile', path: '/citizen/my-profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-lg md:hidden',
        className
      )}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {defaultItems.map((item, idx) => {
          // Center special item if it's Grievance / Voice
          const isGrievance = item.path === '/citizen/new';

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative select-none',
                  isActive
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'relative p-1 rounded-full transition-transform',
                      isActive && 'scale-110'
                    )}
                  >
                    {item.icon}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight leading-tight">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 bg-blue-600 rounded-full mt-0.5" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
