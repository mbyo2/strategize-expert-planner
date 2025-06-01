
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  isRead: boolean;
  userId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, isLoading } = useRealTimeNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900';
      case 'error':
        return 'bg-red-100 dark:bg-red-900';
      default:
        return 'bg-blue-100 dark:bg-blue-900';
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.isRead
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="text-xs"
          >
            {filter === 'all' ? 'Show Unread' : 'Show All'}
          </Button>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b transition-colors ${
                    !notification.isRead 
                      ? getTypeColor(notification.type)
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <div className={`w-2 h-2 rounded-full ${
                        !notification.isRead ? 'bg-primary' : 'bg-transparent'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
