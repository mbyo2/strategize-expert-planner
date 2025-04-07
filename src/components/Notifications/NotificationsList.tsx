
import React from 'react';
import { format } from 'date-fns';
import { Check, Trash2, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Notification, useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  onClose?: () => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({ 
  notifications, 
  loading,
  onClose
}) => {
  const { markAsRead, deleteNotification } = useRealTimeNotifications();
  const navigate = useNavigate();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleClick = async (notification: Notification) => {
    // Mark as read
    await markAsRead(notification.id);
    
    // Navigate to related entity if applicable
    if (notification.relatedEntityId && notification.relatedEntityType) {
      switch (notification.relatedEntityType) {
        case 'strategy_review':
          navigate(`/planning?reviewId=${notification.relatedEntityId}`);
          break;
        case 'strategic_goal':
          navigate(`/goals?goalId=${notification.relatedEntityId}`);
          break;
        case 'planning_initiative':
          navigate(`/planning?initiativeId=${notification.relatedEntityId}`);
          break;
        // Add more entity types as needed
        default:
          break;
      }
      
      // Close popover if provided
      if (onClose) {
        onClose();
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start space-x-4 mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>No notifications yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[350px]">
      <div className="p-2">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`mb-2 p-2 rounded-md flex items-start gap-3 transition-colors hover:bg-muted/50 cursor-pointer ${
              !notification.isRead ? 'bg-muted/30' : ''
            }`}
          >
            <div className="flex-shrink-0 mt-1">
              {getIcon(notification.type)}
            </div>
            <div 
              className="flex-1"
              onClick={() => handleClick(notification)}
            >
              <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(notification.timestamp), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}
                  title="Mark as read"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
                title="Delete notification"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationsList;
