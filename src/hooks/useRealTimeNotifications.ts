
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !mounted) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .or(`userId.eq.${user.id},userId.is.null`)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        if (mounted) {
          setNotifications(data?.map(item => ({
            ...item,
            type: item.type as 'info' | 'success' | 'warning' | 'error'
          })) || []);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();

    // Set up real-time subscription
    channel = supabase
      .channel(`notifications-${Date.now()}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications' 
        },
        async () => {
          if (mounted) {
            await fetchNotifications();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ isRead: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ isRead: true })
        .or(`userId.eq.${user.id},userId.is.null`)
        .eq('isRead', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const createNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notificationData,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return;
      }

      // Show toast notification
      toast(notificationData.message, {
        description: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
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
