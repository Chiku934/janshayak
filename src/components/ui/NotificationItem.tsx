import React from 'react';
import { AppNotification } from '../../types/notification';
import { formatRelativeTime } from '../../utils/formatters';
import { MessageSquare, Bell, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NotificationItemProps {
  notification: AppNotification;
  onClick?: (notif: AppNotification) => void;
  onMarkRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  onMarkRead,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'CASE_UPDATE':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'SLA_ALERT':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'SCHEME_MATCH':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'DOC_VERIFIED':
        return <FileCheck className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getChannelBadge = () => {
    switch (notification.channel) {
      case 'SMS':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">SMS Alert</span>;
      case 'WHATSAPP':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">WhatsApp</span>;
      case 'VOICE_IVR':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">Voice IVR</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">In-App</span>;
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(notification)}
      className={cn(
        'p-3.5 rounded-xl transition-all border flex items-start gap-3 text-left',
        notification.read
          ? 'bg-white border-slate-200/70 opacity-80'
          : 'bg-blue-50/40 border-blue-200/90 shadow-2xs',
        onClick && 'cursor-pointer hover:bg-blue-50/70'
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4 className="text-xs font-bold text-slate-900 truncate">
            {notification.title}
          </h4>
          {getChannelBadge()}
        </div>

        <p className="text-xs text-slate-600 leading-snug line-clamp-2">
          {notification.message}
        </p>

        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/60">
          <span className="text-[10px] text-slate-400">
            {formatRelativeTime(notification.timestamp)}
          </span>

          {!notification.read && onMarkRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead(notification.id);
              }}
              className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold"
            >
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
