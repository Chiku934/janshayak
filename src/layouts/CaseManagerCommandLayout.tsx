import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { GovEmblem } from '../components/ui/GovEmblem';
import { NotificationCenter } from '../features/notifications/NotificationCenter';
import { ClientDemoToolbar } from '../features/demo/ClientDemoToolbar';
import {
  LayoutDashboard,
  FolderKanban,
  UserCheck,
  Building2,
  FileText,
  Bell,
  BarChart3,
  User,
  Search,
  ChevronRight,
  ShieldCheck,
  Phone,
  LogOut,
  Sparkles,
  Menu,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { cn } from '../utils/cn';

export const CaseManagerCommandLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, currentUser } = useAppStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const sidebarLinks = [
    { label: 'Dashboard', path: '/case-manager/dashboard', icon: LayoutDashboard },
    { label: 'Cases', path: '/case-manager/cases', icon: FolderKanban },
    { label: 'Assignments', path: '/case-manager/assignments', icon: UserCheck },
    { label: 'Departments', path: '/case-manager/departments', icon: Building2 },
    { label: 'Evidence', path: '/case-manager/evidence', icon: FileText },
    { label: 'Notifications', path: '/case-manager/notifications', icon: Bell, badge: unreadCount },
    { label: 'Reports', path: '/case-manager/reports', icon: BarChart3 },
    { label: 'Profile', path: '/case-manager/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900">
      {/* 1. Desktop Command Centre Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white text-slate-800 flex flex-col justify-between border-r border-slate-200/90 shadow-2xs transition-transform duration-300 lg:translate-x-0 lg:static',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Brand Header */}
        <div>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/case-manager/dashboard" className="flex items-center gap-3">
              <GovEmblem size="sm" className="shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                    JAN SAHAYAK
                  </span>
                  <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                    OPS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Case Manager Command Centre
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
              Operations Navigation
            </div>

            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/case-manager/dashboard'
                  ? location.pathname === '/case-manager/dashboard' || location.pathname === '/case-manager'
                  : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group',
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-200/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Officer Status Card */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/70">
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Zone
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              Zone 4 / Ward 14 (Shivaji Nagar)
            </p>
            <p className="text-[10px] text-slate-500">
              Assigned SLA Target: 95%+
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
            <Link to="/demo" className="hover:text-slate-900 flex items-center gap-1">
              <span>Switch Role</span>
            </Link>
            <Link to="/design-system" className="hover:text-blue-600 flex items-center gap-1">
              <span>Design System</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header: Search, Notifications, Case Manager Profile */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3.5 shadow-2xs flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Global Command Search */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search cases, tokens, ward engineers, departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Right: Notifications Bell & Case Manager Profile */}
          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <button
              type="button"
              onClick={() => setIsNotifOpen(true)}
              aria-label="View notifications"
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition-all cursor-pointer shadow-2xs group"
            >
              <Bell className="w-4 h-4 group-hover:scale-105 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Case Manager Profile Summary */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                AE
              </div>

              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    Er. Sachin Deshmukh
                  </span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                    ON DUTY
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Assistant Executive Engineer (Water & PWD)
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Notifications Drawer & Global Client Demo Toolbar */}
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <ClientDemoToolbar />
    </div>
  );
};
