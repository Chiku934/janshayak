import React from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { NotificationItem } from '../../components/ui/NotificationItem';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button';
import { CheckCheck, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
      onClose();
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <span>Notifications ({unreadCount} unread)</span>
        </div>
      }
      description="Real-time multi-channel alerts across SMS, WhatsApp & Portal updates."
      size="md"
    >
      <div className="flex flex-col h-full">
        {unreadCount > 0 && (
          <div className="flex justify-end mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllNotificationsRead}
              leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
              className="text-xs text-blue-600"
            >
              Mark all as read
            </Button>
          </div>
        )}

        <div className="space-y-3 flex-1 overflow-y-auto">
          {notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onClick={handleNotificationClick}
              onMarkRead={markNotificationRead}
            />
          ))}
        </div>
      </div>
    </Drawer>
  );
};
