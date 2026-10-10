import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { ClientDemoToolbar } from '../features/demo/ClientDemoToolbar';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ShieldCheck,
  Tag,
  Building2,
  FileCheck2,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Shield,
  Menu,
  X,
  Search,
  Bell,
  Activity,
  ArrowRight,
  LogOut,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface AdminNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Cases', path: '/admin/cases', icon: FolderKanban, badge: 'Live', badgeColor: 'bg-blue-100 text-blue-700' },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Roles & Permissions', path: '/admin/roles', icon: ShieldCheck },
  { label: 'Categories', path: '/admin/categories', icon: Tag },
  { label: 'Departments', path: '/admin/departments', icon: Building2 },
  { label: 'Services', path: '/admin/services', icon: FileCheck2 },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Audit Logs', path: '/admin/audit', icon: FileSpreadsheet, badge: 'Secured', badgeColor: 'bg-emerald-100 text-emerald-700' },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminCommandLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cases, notifications, setRole } = useAppStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const escalatedCount = cases.filter((c) => c.status === 'ESCALATED').length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    navigate(`/admin/cases?q=${encodeURIComponent(globalSearch.trim())}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Enterprise Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm sm:text-base tracking-tight text-white">
                    JAN SAHAYAK
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-widest bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 hidden sm:inline-block">
                    Administrator Command Centre
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search across cases, departments, officers, or audit logs..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
              />
            </form>
          </div>

          {/* Right Profile & Quick Stats */}
          <div className="flex items-center gap-3">
            {/* System Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Engine Active (99.98% SLA)</span>
            </div>

            {/* Notification Bell */}
            <Link
              to="/citizen/notifications"
              className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Audit Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
              )}
            </Link>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-purple-400/30">
                NR
              </div>
              <div className="hidden xl:block text-left text-xs">
                <p className="font-bold text-white leading-tight">Dr. Neha Rajvanshi, IAS</p>
                <p className="text-[10px] text-purple-300">District Magistrate & Collector</p>
              </div>
            </div>

            {/* Exit to Demo Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setRole('CITIZEN');
                navigate('/demo');
              }}
              className="hidden lg:inline-flex text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700 h-8"
            >
              Exit Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Main App Body with 10-Item Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex gap-6 min-w-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Administration & Governance
            </div>

            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin/dashboard'
                  ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group',
                    isActive
                      ? 'bg-purple-50 text-purple-900 border border-purple-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-purple-700' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-md font-bold', item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Authority Seal Card */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-purple-900 to-indigo-950 text-white shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-black tracking-wide">IAS Apex Oversight</span>
            </div>
            <p className="text-[11px] text-purple-200 leading-relaxed">
              Executive authority mode. Changes to categories, departments, and user ACLs are logged under Public Records Act.
            </p>
          </div>
        </aside>

        {/* Mobile Flyout Sidebar */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-72 bg-white h-full p-4 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Shield className="w-4 h-4 text-purple-700" />
                    <span>Administrator Navigation</span>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {ADMIN_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.path === '/admin/dashboard'
                        ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                        : location.pathname.startsWith(item.path);

                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all',
                          isActive
                            ? 'bg-purple-50 text-purple-900 border border-purple-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn('w-4 h-4', isActive ? 'text-purple-700' : 'text-slate-400')} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-bold', item.badgeColor)}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRole('CITIZEN');
                  navigate('/demo');
                }}
                className="w-full text-xs font-bold"
              >
                Exit Administrator Mode
              </Button>
            </div>
          </div>
        )}

        {/* Dynamic Outlet Page Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Global Presentation Demo Toolbar */}
      <ClientDemoToolbar />
    </div>
  );
};
