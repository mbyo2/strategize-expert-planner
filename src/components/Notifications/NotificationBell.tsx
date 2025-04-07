
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { useAuth } from '@/hooks/useAuth';
import NotificationsList from './NotificationsList';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationBell() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAllAsRead, loading } = useRealTimeNotifications(user?.id);
  const [open, setOpen] = useState(false);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              disabled={loading}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <NotificationsList 
          notifications={notifications}
          loading={loading}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
