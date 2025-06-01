
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  userId?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  created_at: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  createNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'created_at'>) => Promise<void>;
}

export const useRealTimeNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'New strategic goal "Increase Market Share" has been created',
      type: 'success',
      isRead: false,
      timestamp: new Date().toISOString(),
      userId: 'user-1',
      relatedEntityId: 'goal-1',
      relatedEntityType: 'strategic_goal',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      message: 'Industry metrics have been updated',
      type: 'info',
      isRead: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: 'user-1',
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const createNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notification-${Date.now()}`,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast(notificationData.message, {
      description: new Date().toLocaleString(),
    });
  };

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification
  };
};
