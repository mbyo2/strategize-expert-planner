import { useState, useEffect } from 'react';
import { customSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";
import { Notification } from '@/types/database';

export type { Notification };

export const useRealTimeNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Create typed query
        let query = customSupabase
          .from('notifications')
          .select('*')
          .order('timestamp', { ascending: false });
        
        // Filter by userId if provided
        if (userId) {
          query = query.eq('userId', userId);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) {
          throw fetchError;
        }
        
        const typedNotifications = (data || []) as Notification[];
        
        setNotifications(typedNotifications);
        const unread = typedNotifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time subscription
    const channel = customSupabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public', 
          table: 'notifications' 
        },
        async (payload) => {
          console.log('Notifications change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification;
            
            if (!userId || newNotification.userId === userId) {
              setNotifications(prev => [newNotification, ...prev]);
              setUnreadCount(prev => prev + 1);
              
              // Use correct sonner toast API
              toast(newNotification.message, {
                description: `${newNotification.type} notification`,
                ...(newNotification.type === 'error' && { style: { backgroundColor: 'red' } })
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            // Update the notification in the list
            setNotifications(prev => 
              prev.map(n => n.id === payload.new.id ? (payload.new as Notification) : n)
            );
            
            // Recalculate unread count
            setNotifications(current => {
              const unread = current.filter(n => !n.isRead).length;
              setUnreadCount(unread);
              return current;
            });
          } else if (payload.eventType === 'DELETE') {
            // Remove the notification from the list
            setNotifications(prev => {
              const filtered = prev.filter(n => n.id !== payload.old.id);
              const unread = filtered.filter(n => !n.isRead).length;
              setUnreadCount(unread);
              return filtered;
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      customSupabase.removeChannel(channel);
    };
  }, [userId]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await customSupabase
        .from('notifications')
        .update({ isRead: true } as any)
        .eq('id', notificationId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      let query = customSupabase
        .from('notifications')
        .update({ isRead: true } as any)
        .eq('isRead', false);
      
      // Add user filter if provided
      if (userId) {
        query = query.eq('userId', userId);
      }
      
      const { error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await customSupabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId);
        const filtered = prev.filter(n => n.id !== notificationId);
        
        // Update unread count if the deleted notification was unread
        if (notification && !notification.isRead) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        
        return filtered;
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting notification:', err);
      return false;
    }
  };

  return { 
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
