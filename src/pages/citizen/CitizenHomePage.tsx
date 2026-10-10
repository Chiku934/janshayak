import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { GovEmblem } from '../../components/ui/GovEmblem';
import { NotificationCenter } from '../../features/notifications/NotificationCenter';
import { formatDate } from '../../utils/formatters';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  FileClock,
  Scale,
  Search,
  Bell,
  Mic,
  ArrowRight,
  MapPin,
  Clock,
  ChevronRight,
  PlusCircle,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const CitizenHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, cases, notifications } = useAppStore();
  const { openVoiceAssistant, simulateScenario } = useVoiceStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  // Filter recent cases for current citizen
  const recentCases = cases.slice(0, 3);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="space-y-8 w-full pb-12">
      {/* 1. Header Bar: Jan Sahayak Logo, Notification Bell, Profile Avatar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-4"
      >
        {/* Jan Sahayak Logo & Branding */}
        <div className="flex items-center gap-3">
          <GovEmblem size="md" className="shrink-0 drop-shadow-2xs" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-blue-950 tracking-tight">
                JAN SAHAYAK
              </span>
              <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/80">
                जन सहायक
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Civic Assistance & Public Grievance Redressal Platform
            </p>
          </div>
        </div>

        {/* Right Header Actions: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Icon */}
          <button
            type="button"
            onClick={() => setIsNotifOpen(true)}
            aria-label="Open Notifications"
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition-all cursor-pointer shadow-2xs group"
          >
            <Bell className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white animate-pulse">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* Profile Avatar */}
          <Link
            to="/citizen/my-profile"
            className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition-all group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-lg object-cover border border-slate-300 group-hover:scale-105 transition-transform"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Citizen
              </p>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* 2. Greeting Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="space-y-1.5"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          <span>Active Citizen Redressal Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Hello, {currentUser.name ? currentUser.name.split(' ')[0] : 'Citizen'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium">
          How can we help you today?
        </p>
      </motion.div>

      {/* 3. Primary Action: REPORT A PROBLEM */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 shadow-lg border border-blue-700/50">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold border border-white/10 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Instant 24/7 AI-Assisted Intake</span>
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                REPORT A PROBLEM
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Report road damage, water disruption, sanitation, electricity, or municipal issues.
                Our AI triages and assigns designated government field engineers with guaranteed statutory SLAs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              <Button
                variant="saffron"
                size="lg"
                onClick={() => {
                  openVoiceAssistant('WATER_CRISIS');
                  simulateScenario('WATER_CRISIS');
                }}
                leftIcon={<Mic className="w-5 h-5 text-white animate-pulse" />}
                className="font-black text-sm shadow-md py-3.5 px-5 justify-center"
              >
                बोलकर शिकायत करें (Voice AI)
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/citizen/report')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-bold text-sm py-3.5 px-5 justify-center"
              >
                File Online Form
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. Secondary Quick Actions: 4 Key Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Quick Assistance Services
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">1-Click Fast Redressal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. My Application Is Stuck */}
          <motion.div variants={itemVariants}>
            <div
              onClick={() => navigate('/citizen/report')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full group"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-2xs border border-amber-100">
                  <FileClock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  1. My Application Is Stuck
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Escalate delayed pensions, ration card issues, caste certificates & land records.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                <span>Escalate Delay</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* 2. Legal / Civic Help */}
          <motion.div variants={itemVariants}>
            <div
              onClick={() => navigate('/citizen/report')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full group"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-2xs border border-purple-100">
                  <Scale className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  2. Legal / Civic Help
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Right to Service Act advisories, pro-bono legal aid, and municipal by-law guidance.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform">
                <span>Get Advice</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* 3. Track My Case */}
          <motion.div variants={itemVariants}>
            <div
              onClick={() => navigate('/citizen/track')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full group"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-2xs border border-blue-100">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  3. Track My Case
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Real-time SLA countdowns, assigned field officer details, and inspection stages.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                <span>Live Tracker</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* 4. Notifications */}
          <motion.div variants={itemVariants}>
            <div
              onClick={() => navigate('/citizen/notifications')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full group"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-2xs border border-emerald-100 relative">
                  <Bell className="w-5 h-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  4. Notifications
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Official SMS tokens, municipal notices, and case milestone broadcast updates.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                <span>{unreadNotifs > 0 ? `${unreadNotifs} New Updates` : 'View Alerts'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 5. Recent Cases Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Cases</h3>
            <p className="text-xs text-slate-500">
              Track resolution progress, field team deployments, and statutory SLA milestones.
            </p>
          </div>
          <Link
            to="/citizen/track"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
          >
            <span>View All ({cases.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentCases.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card
                hoverable
                className="p-5 flex flex-col justify-between h-full border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-3">
                  {/* Top: Case ID & Status */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {item.id}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>

                  {/* Title & Category */}
                  <div>
                    <span className="inline-block text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mb-1.5">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </h4>
                  </div>

                  {/* Location & Last Updated */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{item.ward}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Last updated: {formatDate(item.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action: View Case Button */}
                <div className="pt-4 mt-3 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/citizen/cases/${item.id}`)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                    className="w-full font-bold justify-center"
                  >
                    View Case
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Notifications Drawer */}
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  );
};
