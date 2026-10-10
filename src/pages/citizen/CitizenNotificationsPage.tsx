import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { AppNotification, NotificationCategory } from '../../types/notification';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatDateTime } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  FileCheck2,
  UserCheck,
  HelpCircle,
  Clock,
  Building2,
  AlertTriangle,
  Star,
  ArrowRight,
  Filter,
  Trash2,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Radio,
  Check,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const CATEGORY_CONFIG: Record<
  NotificationCategory,
  { icon: React.FC<{ className?: string }>; bg: string; text: string; border: string }
> = {
  'Case Received': {
    icon: FileCheck2,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  Assigned: {
    icon: UserCheck,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  'Information Required': {
    icon: HelpCircle,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  Reminder: {
    icon: Clock,
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
  },
  'Authority Response': {
    icon: Building2,
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  Escalation: {
    icon: AlertTriangle,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  Resolution: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  Feedback: {
    icon: Star,
    bg: 'bg-yellow-50',
    text: 'text-amber-700',
    border: 'border-yellow-200',
  },
};

const ALL_CATEGORIES: NotificationCategory[] = [
  'Case Received',
  'Assigned',
  'Information Required',
  'Reminder',
  'Authority Response',
  'Escalation',
  'Resolution',
  'Feedback',
];

export const CitizenNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();

  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalCount = notifications.length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'UNREAD' && item.read) return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    } else if (notif.caseId) {
      navigate(`/citizen/cases/${notif.caseId}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Citizen Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Official milestone dispatches, officer assignments, and statutory SLA alerts.
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
            leftIcon={<CheckCheck className="w-4 h-4 text-blue-600" />}
            className="text-xs font-bold text-blue-700 bg-blue-50/60 border-blue-200"
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Tabs & Category Filter Pills */}
      <div className="space-y-3">
        {/* All vs Unread Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2',
                activeTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span>All Alerts</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('UNREAD')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2',
                activeTab === 'UNREAD'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <span>Unread Only</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredNotifications.length} of {totalCount} notifications
          </span>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border',
              selectedCategory === 'ALL'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            )}
          >
            All Categories
          </button>

          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5',
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                )}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center space-y-4 border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">All Caught Up!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You have no unread notifications in this category. You will receive live updates when field actions occur.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveTab('ALL');
              setSelectedCategory('ALL');
            }}
          >
            Show All Notifications
          </Button>
        </Card>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filteredNotifications.map((notif) => {
            const cat = notif.category || 'Case Received';
            const catConfig = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Case Received'];
            const Icon = catConfig.icon;

            return (
              <motion.div key={notif.id} variants={itemVariants}>
                <div
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    'p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group relative',
                    !notif.read
                      ? 'bg-white border-blue-300 shadow-xs ring-2 ring-blue-50/70 hover:border-blue-500'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  )}
                >
                  {/* Left Side: Icon & Details */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Category Icon Badge */}
                    <div
                      className={cn(
                        'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 shadow-2xs',
                        catConfig.bg,
                        catConfig.text,
                        catConfig.border
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      {/* Top Category Tag & Time */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'text-[10px] font-black px-2 py-0.5 rounded border',
                            catConfig.bg,
                            catConfig.text,
                            catConfig.border
                          )}
                        >
                          {cat}
                        </span>

                        {notif.caseId && (
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {notif.caseId}
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(notif.timestamp)}
                        </span>
                      </div>

                      {/* Title */}
                      <h4
                        className={cn(
                          'text-sm transition-colors',
                          !notif.read
                            ? 'font-black text-slate-900 group-hover:text-blue-700'
                            : 'font-semibold text-slate-800'
                        )}
                      >
                        {notif.title}
                      </h4>

                      {/* Message */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Unread Dot / Action */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {!notif.read ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                          <span>New</span>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(notif.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg text-xs font-semibold cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1 text-xs font-bold">
                        <span>View Case</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
