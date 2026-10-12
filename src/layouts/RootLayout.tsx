import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { GovEmblem } from '../components/ui/GovEmblem';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { RoleSwitcher } from '../features/users/RoleSwitcher';
import { NotificationCenter } from '../features/notifications/NotificationCenter';
import { SmsSimulationToast } from '../features/notifications/SmsSimulationToast';
import { VoiceAssistantWidget } from '../features/voice/VoiceAssistantWidget';
import { BottomNav } from '../components/ui/BottomNav';
import { ClientDemoToolbar } from '../features/demo/ClientDemoToolbar';
import { useAppStore } from '../store/useAppStore';
import { useVoiceStore } from '../store/useVoiceStore';
import {
  Bell,
  Mic,
  Shield,
  User,
  Briefcase,
  HelpCircle,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Smartphone,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

export const RootLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, notifications, currentUser, setRole } = useAppStore();
  const { openVoiceAssistant } = useVoiceStore();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const isDemo = location.pathname.startsWith('/demo');
  const isCitizen = location.pathname.startsWith('/citizen') || (!isDemo && activeRole === 'CITIZEN');
  const isOfficer = location.pathname.startsWith('/officer') || (!isDemo && activeRole === 'CASE_MANAGER');
  const isAdmin = location.pathname.startsWith('/admin') || (!isDemo && activeRole === 'ADMIN');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* Top National Header Bar (Gov Tricolor Stripe) */}
      <div className="gov-tricolor-bar" />

      {/* Official Government of India & State Civic Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* National Emblem & Title */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <GovEmblem size="md" className="shrink-0 group-hover:scale-105 transition-transform" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-extrabold text-blue-950 tracking-tight">
                      JAN SAHAYAK
                    </span>
                    <span className="hidden sm:inline-block text-xs font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                      ଜନ ସହାୟକ
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium hidden md:block">
                    Unified Citizen Empowerment & Public Grievance Redressal System
                  </p>
                </div>
              </Link>
            </div>

            {/* Middle Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/design-system"
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5',
                  location.pathname === '/design-system'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100'
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Design System</span>
              </Link>
              <Link
                to="/demo"
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  location.pathname === '/demo' || location.pathname === '/'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                Overview
              </Link>
              <Link
                to="/citizen"
                onClick={() => setRole('CITIZEN')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  location.pathname.startsWith('/citizen')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                Citizen Portal
              </Link>
              <Link
                to="/case-manager/dashboard"
                onClick={() => setRole('CASE_MANAGER')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  location.pathname.startsWith('/case-manager') || location.pathname.startsWith('/officer')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                Case Manager
              </Link>
              <Link
                to="/admin"
                onClick={() => setRole('ADMIN')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  location.pathname.startsWith('/admin')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                Admin Command
              </Link>
            </nav>

            {/* Right Action Bar */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Voice Sahayak Trigger Button */}
              <button
                onClick={() => openVoiceAssistant()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-xs hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Voice Sahayak</span>
                <span className="text-[10px] bg-white/20 px-1 rounded">AI</span>
              </button>

              {/* Language Selector */}
              <LanguageSelector compact />

              {/* Notification Bell */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Notifications & SMS Log"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Active User Badge & Role Switcher Popup */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-300 shrink-0"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {activeRole === 'CITIZEN'
                        ? 'Citizen'
                        : activeRole === 'CASE_MANAGER'
                        ? 'Assistant Engineer'
                        : 'District Collector'}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {showRoleMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                    <div className="absolute right-0 mt-2 w-80 z-50 animate-in fade-in zoom-in-95">
                      <RoleSwitcher />
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileNavOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            <Link
              to="/design-system"
              onClick={() => setIsMobileNavOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-bold text-blue-700 bg-blue-50"
            >
              Design System Showcase (20 Tokens & Components)
            </Link>
            <Link
              to="/demo"
              onClick={() => setIsMobileNavOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Executive Overview
            </Link>
            <Link
              to="/citizen"
              onClick={() => {
                setRole('CITIZEN');
                setIsMobileNavOpen(false);
              }}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Citizen Portal
            </Link>
            <Link
              to="/case-manager/dashboard"
              onClick={() => {
                setRole('CASE_MANAGER');
                setIsMobileNavOpen(false);
              }}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Case Manager Command
            </Link>
            <Link
              to="/admin"
              onClick={() => {
                setRole('ADMIN');
                setIsMobileNavOpen(false);
              }}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Admin Command Center
            </Link>
            <div className="pt-2 border-t border-slate-100">
              <RoleSwitcher />
            </div>
          </div>
        )}
      </header>

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Global Interactive Overlays */}
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <SmsSimulationToast />
      <VoiceAssistantWidget />
      <ClientDemoToolbar />

      {/* Mobile Bottom Navigation Bar (Visible on <768px viewports) */}
      <BottomNav />

      {/* Official Government Footer */}
      <footer className="bg-white text-slate-600 text-xs mt-auto border-t border-slate-200 pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <GovEmblem size="sm" />
                <span>JAN SAHAYAK (ଜନ ସହାୟକ)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                National Unified Civic Assistance Platform. Powered by AI-driven triage, multi-channel citizen communication & DigiLocker integration.
              </p>
            </div>

            <div>
              <h5 className="text-slate-900 font-semibold text-xs mb-2">Design System & Tech</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link to="/design-system" className="text-blue-600 hover:text-blue-700 font-bold">Design System Gallery (20 Parts)</Link></li>
                <li><Link to="/citizen/report" className="hover:text-slate-900 text-slate-600">Voice-First Intake Wizard</Link></li>
                <li><Link to="/citizen/cases" className="hover:text-slate-900 text-slate-600">SLA Tracking & Timelines</Link></li>
                <li><Link to="/citizen/vault" className="hover:text-slate-900 text-slate-600">DigiLocker Integration</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-slate-900 font-semibold text-xs mb-2">Administrative Portals</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link to="/case-manager/field-inspection" className="hover:text-slate-900 text-slate-600">Field Inspection Desk</Link></li>
                <li><Link to="/case-manager/queue" className="hover:text-slate-900 text-slate-600">Triage & Work Order Queue</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-slate-900 text-slate-600">Collectorate SLA Command Center</Link></li>
                <li><Link to="/admin/reports" className="hover:text-slate-900 text-slate-600">Department Heatmaps</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-slate-900 font-semibold text-xs mb-2">Help & Compliance</h5>
              <p className="text-[11px] text-slate-500 mb-2">
                24x7 Toll-Free Civic Helpline: <b className="text-slate-800">1800-11-2026</b>
              </p>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <span>● 100% Client-Side Prototype Active</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <p>© 2026 Government of India / State Administration. Prototype Demonstration.</p>
            <div className="flex gap-4">
              <span>National Informatics Center (NIC) Compliant</span>
              <span>•</span>
              <span>DigiLocker Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
