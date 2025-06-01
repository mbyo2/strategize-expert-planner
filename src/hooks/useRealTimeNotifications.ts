
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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

export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('userId', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `userId=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev]);
            
            // Show toast for new notifications
            const newNotification = payload.new as Notification;
            if (newNotification.type === 'error') {
              toast.error(newNotification.message);
            } else if (newNotification.type === 'success') {
              toast.success(newNotification.message);
            } else if (newNotification.type === 'warning') {
              toast.warning(newNotification.message);
            } else {
              toast.info(newNotification.message);
            }
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => 
              prev.map(n => 
                n.id === payload.new.id ? payload.new as Notification : n
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => 
              prev.filter(n => n.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ isRead: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const unreadIds = notifications
        .filter(n => !n.isRead)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ isRead: true })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );

      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead' | 'userId'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          userId: user.id,
          isRead: false,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    createNotification
  };
};
