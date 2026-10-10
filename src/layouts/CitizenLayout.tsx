import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Search, FileText, Gift, UserCircle, Mic } from 'lucide-react';
import { useVoiceStore } from '../store/useVoiceStore';
import { cn } from '../utils/cn';

export const CitizenLayout: React.FC = () => {
  const location = useLocation();
  const { openVoiceAssistant } = useVoiceStore();

  const navItems = [
    { label: 'Citizen Home', path: '/citizen', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Report a Problem', path: '/citizen/report', icon: <PlusCircle className="w-4 h-4 text-orange-600" /> },
    { label: 'My Cases', path: '/citizen/cases', icon: <Search className="w-4 h-4" /> },
    { label: 'DigiLocker Vault', path: '/citizen/vault', icon: <FileText className="w-4 h-4" /> },
    { label: 'Welfare Schemes', path: '/citizen/schemes', icon: <Gift className="w-4 h-4 text-emerald-600" /> },
    { label: 'My Profile', path: '/citizen/my-profile', icon: <UserCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation pill bar */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const isActive =
              item.path === '/citizen'
                ? location.pathname === '/citizen'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => openVoiceAssistant()}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 transition-colors ml-2 shrink-0 cursor-pointer"
        >
          <Mic className="w-3.5 h-3.5 animate-pulse text-orange-600" />
          <span>बोलकर शिकायत दर्ज करें (Voice AI)</span>
        </button>
      </div>

      <Outlet />
    </div>
  );
};
