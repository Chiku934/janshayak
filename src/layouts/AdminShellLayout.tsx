import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { NotificationCenter } from '../features/notifications/NotificationCenter';
import { ClientDemoToolbar } from '../features/demo/ClientDemoToolbar';
import { ClientDemoModal } from '../features/demo/ClientDemoModal';
import { RoleSwitcher } from '../features/users/RoleSwitcher';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  FileText,
  Bell,
  BarChart3,
  Search,
  ChevronDown,
  LogOut,
  Calendar,
  Grid,
  ShieldCheck,
  Tag,
  Layers,
  FileSpreadsheet,
  Settings,
  Sparkles,
  Menu,
  X,
  MapPin,
  ExternalLink,
  PlusCircle,
  Mic,
  Gift,
  UserCheck,
  User,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export const AdminShellLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, currentUser, notifications, cases, setRole } = useAppStore();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isCitizenView = location.pathname.startsWith('/citizen') || activeRole === 'CITIZEN';
  const isCaseManagerView = location.pathname.startsWith('/case-manager') || (activeRole === 'CASE_MANAGER' && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/demo') && location.pathname !== '/');
  const isAdminView = location.pathname.startsWith('/admin') || (activeRole === 'ADMIN' && !location.pathname.startsWith('/case-manager') && !location.pathname.startsWith('/citizen') && !location.pathname.startsWith('/demo') && location.pathname !== '/');
  const isDemoView = location.pathname.startsWith('/demo') || location.pathname === '/' || location.pathname === '/design-system';

  // Build role-appropriate navigation sections
  let navSections: NavSection[] = [];

  if (isCitizenView && !isDemoView) {
    navSections = [
      {
        items: [
          { label: 'Citizen Home', path: '/citizen/home', icon: LayoutDashboard },
          { label: 'Report Grievance', path: '/citizen/report', icon: PlusCircle },
          { label: 'Voice AI Assistant', path: '/citizen/report/voice', icon: Mic },
          { label: 'My Cases', path: '/citizen/cases', icon: Briefcase, badge: cases.length, badgeColor: 'bg-blue-600 text-white' },
          { label: 'DigiLocker Vault', path: '/citizen/vault', icon: FileText },
          { label: 'Welfare Schemes', path: '/citizen/schemes', icon: Gift },
          { label: 'Notifications', path: '/citizen/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined, badgeColor: 'bg-rose-500 text-white' },
          { label: 'My Profile', path: '/citizen/my-profile', icon: User },
        ],
      },
      {
        title: 'SWITCH PORTAL',
        items: [
          { label: 'Officer Desk', path: '/case-manager/dashboard', icon: Briefcase },
          { label: 'Admin Command', path: '/admin/dashboard', icon: ShieldCheck },
          { label: 'Demo Hub', path: '/demo', icon: Sparkles },
        ],
      },
    ];
  } else if (isCaseManagerView && !isDemoView) {
    navSections = [
      {
        items: [
          { label: 'Dashboard', path: '/case-manager/dashboard', icon: LayoutDashboard },
          { label: 'Cases', path: '/case-manager/cases', icon: Briefcase, badge: cases.length, badgeColor: 'bg-blue-600 text-white' },
          { label: 'Assignments', path: '/case-manager/assignments', icon: Users },
          { label: 'Departments', path: '/case-manager/departments', icon: Building2 },
          { label: 'Evidence', path: '/case-manager/evidence', icon: FileText },
          { label: 'Notifications', path: '/case-manager/notifications', icon: Bell, badge: 8, badgeColor: 'bg-rose-500 text-white' },
          { label: 'Reports', path: '/case-manager/reports', icon: FileSpreadsheet },
        ],
      },
      {
        title: 'TRIAGE & OPERATIONS',
        items: [
          { label: 'Case Queue', path: '/case-manager/queue', icon: Grid },
          { label: 'Field Inspection', path: '/case-manager/field-inspection', icon: ShieldCheck },
        ],
      },
      {
        title: 'SWITCH PORTAL',
        items: [
          { label: 'Citizen Portal', path: '/citizen/home', icon: User },
          { label: 'Admin Command', path: '/admin/dashboard', icon: ShieldCheck },
          { label: 'Demo Hub', path: '/demo', icon: Sparkles },
        ],
      },
    ];
  } else if (isAdminView && !isDemoView) {
    navSections = [
      {
        items: [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Cases', path: '/admin/cases', icon: Briefcase },
          { label: 'Assignments', path: '/case-manager/assignments', icon: Users },
          { label: 'Departments', path: '/admin/departments', icon: Building2 },
          { label: 'Evidence', path: '/case-manager/evidence', icon: FileText },
          { label: 'Notifications', path: '/case-manager/notifications', icon: Bell, badge: 8, badgeColor: 'bg-rose-500 text-white' },
          { label: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
        ],
      },
      {
        title: 'ADMINISTRATION',
        items: [
          { label: 'Users', path: '/admin/users', icon: Users },
          { label: 'Roles & Permissions', path: '/admin/roles', icon: Grid },
          { label: 'Categories', path: '/admin/categories', icon: Tag },
          { label: 'Services', path: '/admin/services', icon: Layers },
          { label: 'Audit Logs', path: '/admin/audit', icon: FileSpreadsheet },
          { label: 'Settings', path: '/admin/settings', icon: Settings },
        ],
      },
    ];
  } else {
    // Demo / Root Overview
    navSections = [
      {
        title: 'DEMO & SYSTEM',
        items: [
          { label: 'Demo Overview', path: '/demo', icon: Sparkles },
          { label: 'Design System', path: '/design-system', icon: Layers },
        ],
      },
      {
        title: 'PERSONA WORKSPACES',
        items: [
          { label: 'Citizen Portal', path: '/citizen/home', icon: User },
          { label: 'Case Manager Desk', path: '/case-manager/dashboard', icon: Briefcase },
          { label: 'Administrator Command', path: '/admin/dashboard', icon: ShieldCheck },
        ],
      },
    ];
  }

  // Profile Info
  const profileName = isCitizenView
    ? 'Rameshwar Patil'
    : isAdminView
    ? 'Dr. Neha Rajvanshi, IAS'
    : 'Er. Sachin Deshmukh';

  const profileRole = isCitizenView
    ? 'Citizen Resident'
    : isAdminView
    ? 'District Administrator'
    : 'Case Manager';

  const profileInitials = isCitizenView ? 'RP' : isAdminView ? 'NR' : 'SD';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const targetPath = isCitizenView
      ? '/citizen/cases'
      : isAdminView
      ? '/admin/cases'
      : '/case-manager/cases';
    navigate(`${targetPath}?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = () => {
    setRole('CITIZEN');
    navigate('/demo');
  };

  return (
    <div className="min-h-screen flex bg-[#F4F6FB] text-slate-900 antialiased font-sans">
      {/* ========================================================================= */}
      {/* 1. CLEAN LIGHT SIDEBAR (Universal Light Government Shell) */}
      {/* ========================================================================= */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white text-slate-800 flex flex-col justify-between border-r border-slate-200/90 shadow-2xs transition-transform duration-200 shrink-0 lg:static',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="p-5 pb-4 flex items-center justify-between shrink-0 border-b border-slate-100">
            <Link
              to={isCitizenView ? '/citizen/home' : isAdminView ? '/admin/dashboard' : '/case-manager/dashboard'}
              className="flex items-center gap-3 overflow-hidden group"
            >
              {/* Saffron Emblem Icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shrink-0 shadow-xs shadow-orange-500/20">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-bold text-xs text-orange-600">जन सहायक</span>
                </div>
                <h1 className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">
                  Jan Sahayak
                </h1>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">
                  CIVIC ASSISTANCE PLATFORM
                </p>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
            {navSections.map((sec, sIdx) => (
              <div key={sIdx} className={cn('space-y-1', sIdx > 0 && 'pt-3 border-t border-slate-100')}>
                {sec.title && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    {sec.title}
                  </p>
                )}
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path.endsWith('/dashboard') &&
                      (location.pathname === '/admin' || location.pathname === '/case-manager')) ||
                    (item.path.includes('/cases') && location.pathname.includes('/cases') && !item.path.includes('citizen') && location.pathname.includes('case-manager'));

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative',
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs border border-blue-200/70'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      <span className="truncate">{item.label}</span>

                      {/* Badge */}
                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            'ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full',
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Profile Area & Logout */}
          <div className="p-3 border-t border-slate-200/80 space-y-2 shrink-0 bg-slate-50/70">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-slate-100/80 border border-slate-200/80 shadow-2xs transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {profileInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {profileName}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate font-medium">
                    {profileRole}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Logout Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit to Demo Hub</span>
            </button>
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

      {/* ========================================================================= */}
      {/* 2. MAIN APPLICATION WORKSPACE & TOP HEADER */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shrink-0 z-20 shadow-2xs">
          {/* Left: Mobile Menu Toggle & Global Search */}
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Global Search Bar with Ctrl K */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, citizens, departments, services..."
                className="w-full bg-[#F8FAFC] hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-14 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
              <span className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2 shadow-2xs">
                Ctrl K
              </span>
            </form>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Date Range Selector Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Oct 1, 2026 – Oct 31, 2026</span>
            </div>

            {/* Notification Bell with Badge */}
            <button
              type="button"
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                8
              </span>
            </button>

            {/* User Profile Header Chip */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full bg-[#1D68FF] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {profileInitials}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-xs font-bold text-slate-900">
                    {profileName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {profileRole}
                  </p>
                </div>
              </button>

              {/* Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="w-10 h-10 rounded-full bg-[#1D68FF] text-white font-black text-sm flex items-center justify-center shrink-0">
                        {profileInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">
                          {profileName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {isCitizenView ? 'rameshwar.patil@example.com' : isAdminView ? 'neha.rajvanshi@ias.gov.in' : 'sachin.deshmukh@pmc.gov.in'}
                        </p>
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {profileRole}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsDemoModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-left cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Launch 5 Demo Scenarios</span>
                      </button>

                      <Link
                        to="/case-manager/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>Officer Profile & Jurisdiction</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                        Switch Persona
                      </p>
                      <RoleSwitcher />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Page Body (Enforces 95% width across all pages) */}
        <main className="flex-1 overflow-y-auto bg-[#F4F6FB] py-6 px-2 sm:px-4">
          <div className="w-[95%] max-w-[95%] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notifications Drawer & Global Demo Tools */}
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <ClientDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      <ClientDemoToolbar />
    </div>
  );
};
