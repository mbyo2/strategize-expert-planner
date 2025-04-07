
import { customSupabase } from "@/integrations/supabase/customClient";
import { Notification } from "@/hooks/useRealTimeNotifications";

export type CreateNotificationParams = Omit<Notification, 'id' | 'timestamp' | 'isRead'> & {
  userId?: string;
};

// Create a new notification
export const createNotification = async (notification: CreateNotificationParams): Promise<Notification | null> => {
  try {
    const newNotification = {
      ...notification,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const { data, error } = await customSupabase
      .from('notifications')
      .insert(newNotification)
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    return data as Notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
};

// Create notifications for all users or specific roles
export const createGlobalNotification = async (
  message: string, 
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  options?: {
    roles?: string[];
    relatedEntityId?: string;
    relatedEntityType?: string;
  }
): Promise<boolean> => {
  try {
    // Get users based on roles if specified
    let userIds: string[] = [];
    
    if (options?.roles && options.roles.length > 0) {
      const { data: users, error: usersError } = await customSupabase
        .from('user_roles')
        .select('user_id')
        .in('role', options.roles);
      
      if (usersError) {
        throw usersError;
      }
      
      userIds = users.map(user => user.user_id);
    } else {
      // Get all users if no roles specified
      const { data: users, error: usersError } = await customSupabase
        .from('profiles')
        .select('id');
      
      if (usersError) {
        throw usersError;
      }
      
      userIds = users.map(user => user.id);
    }
    
    // Create notifications for each user
    const notifications = userIds.map(userId => ({
      userId,
      message,
      type,
      timestamp: new Date().toISOString(),
      isRead: false,
      relatedEntityId: options?.relatedEntityId,
      relatedEntityType: options?.relatedEntityType
    }));
    
    if (notifications.length > 0) {
      const { error } = await customSupabase
        .from('notifications')
        .insert(notifications);
      
      if (error) {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to create global notification:', error);
    return false;
  }
};

// Get notification by ID
export const getNotification = async (id: string): Promise<Notification | null> => {
  try {
    const { data, error } = await customSupabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Notification;
  } catch (error) {
    console.error('Failed to get notification:', error);
    return null;
  }
};

// Helper function to create notifications for specific events
export const notifyEvent = async (
  eventType: 'strategy_review_created' | 'strategy_review_updated' | 'goal_achieved' | 'initiative_completed' | 'market_change_detected',
  entityId: string,
  entityType: string,
  affectedRoles?: string[]
): Promise<boolean> => {
  let message = '';
  let type: 'info' | 'success' | 'warning' | 'error' = 'info';
  
  switch (eventType) {
    case 'strategy_review_created':
      message = 'A new strategy review has been scheduled';
      break;
    case 'strategy_review_updated':
      message = 'A strategy review has been updated';
      break;
    case 'goal_achieved':
      message = 'Strategic goal has been achieved!';
      type = 'success';
      break;
    case 'initiative_completed':
      message = 'A planning initiative has been completed';
      type = 'success';
      break;
    case 'market_change_detected':
      message = 'Important market change has been detected';
      type = 'warning';
      break;
    default:
      message = 'New notification';
  }
  
  return createGlobalNotification(message, type, {
    roles: affectedRoles,
    relatedEntityId: entityId,
    relatedEntityType: entityType
  });
};
