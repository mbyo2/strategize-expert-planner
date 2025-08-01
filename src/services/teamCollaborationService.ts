import { supabase } from '@/integrations/supabase/client';

export interface Team {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  organization_id?: string;
  parent_team_id?: string;
  team_type: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  department?: string;
  position?: string;
  status: string;
  joined_date: string;
  invited_by?: string;
  profile?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface TeamMessage {
  id: string;
  team_id: string;
  user_id: string;
  content: string;
  message_type: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  edited_at?: string;
  reactions?: any;
  author?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface TeamTask {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  created_by: string;
  status: string;
  priority: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  attachments?: any;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export class TeamCollaborationService {
  // Teams Management
  static async getUserTeams(): Promise<Team[]> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user teams:', error);
      return [];
    }
  }

  static async createTeam(name: string, description?: string): Promise<Team | null> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          name,
          description,
          team_type: 'general'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  // Team Members Management
  static async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);

      if (error) throw error;
      
      // Get profiles separately to avoid join issues
      if (data && data.length > 0) {
        const userIds = data.map(member => member.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, email, avatar')
          .in('id', userIds);

        return data.map(member => ({
          ...member,
          profile: profiles?.find(p => p.id === member.user_id)
        }));
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }

  static async addTeamMember(teamId: string, userId: string, role: string = 'member'): Promise<TeamMember | null> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          user_id: userId,
          role,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  // Team Messages Management
  static async getTeamMessages(teamId: string, limit: number = 50): Promise<TeamMessage[]> {
    try {
      const { data, error } = await supabase
        .from('team_messages')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(msg => msg.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, email, avatar')
          .in('id', userIds);

        return data.map(message => ({
          ...message,
          reactions: Array.isArray(message.reactions) ? message.reactions : [],
          author: profiles?.find(p => p.id === message.user_id) ? {
            id: message.user_id,
            name: profiles.find(p => p.id === message.user_id)?.name || 'Unknown',
            email: profiles.find(p => p.id === message.user_id)?.email || '',
            avatar: profiles.find(p => p.id === message.user_id)?.avatar
          } : undefined
        })).reverse();
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching team messages:', error);
      return [];
    }
  }

  static async sendMessage(teamId: string, content: string, messageType: string = 'text'): Promise<TeamMessage | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('team_messages')
        .insert([{
          team_id: teamId,
          user_id: user.id,
          content,
          message_type: messageType
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, name, email, avatar')
        .eq('id', user.id)
        .single();
      
      return {
        ...data,
        reactions: [],
        author: profile ? {
          id: user.id,
          name: profile.name || 'Unknown',
          email: profile.email || '',
          avatar: profile.avatar
        } : undefined
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Team Tasks Management
  static async getTeamTasks(teamId: string): Promise<TeamTask[]> {
    try {
      const { data, error } = await supabase
        .from('team_tasks')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        const userIds = [...new Set([
          ...data.map(task => task.assigned_to).filter(Boolean),
          ...data.map(task => task.created_by)
        ])];
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, email, avatar')
          .in('id', userIds);

        return data.map(task => ({
          ...task,
          assignee: task.assigned_to && profiles?.find(p => p.id === task.assigned_to) ? {
            id: task.assigned_to,
            name: profiles.find(p => p.id === task.assigned_to)?.name || 'Unknown',
            email: profiles.find(p => p.id === task.assigned_to)?.email || '',
            avatar: profiles.find(p => p.id === task.assigned_to)?.avatar
          } : undefined,
          creator: profiles?.find(p => p.id === task.created_by) ? {
            id: task.created_by,
            name: profiles.find(p => p.id === task.created_by)?.name || 'Unknown',
            email: profiles.find(p => p.id === task.created_by)?.email || ''
          } : undefined
        }));
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching team tasks:', error);
      return [];
    }
  }

  static async createTask(teamId: string, title: string, description?: string, assignedTo?: string, priority: string = 'medium'): Promise<TeamTask | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('team_tasks')
        .insert([{
          team_id: teamId,
          title,
          description,
          assigned_to: assignedTo,
          created_by: user.id,
          priority,
          status: 'todo'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async updateTaskStatus(taskId: string, status: string): Promise<TeamTask | null> {
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('team_tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  }

  // Real-time subscriptions
  static subscribeToTeamMessages(teamId: string, onMessage: (message: TeamMessage) => void) {
    return supabase
      .channel(`team_messages:${teamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_messages',
          filter: `team_id=eq.${teamId}`
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, name, email, avatar')
            .eq('id', payload.new.user_id)
            .single();

          onMessage({
            ...payload.new,
            reactions: [],
            author: profile ? {
              id: payload.new.user_id,
              name: profile.name || 'Unknown',
              email: profile.email || '',
              avatar: profile.avatar
            } : undefined
          } as TeamMessage);
        }
      )
      .subscribe();
  }

  static subscribeToTeamTasks(teamId: string, onTaskUpdate: (task: TeamTask, event: string) => void) {
    return supabase
      .channel(`team_tasks:${teamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_tasks',
          filter: `team_id=eq.${teamId}`
        },
        async (payload) => {
          const taskData = payload.new || payload.old;
          if (taskData) {
            onTaskUpdate(taskData as TeamTask, payload.eventType);
          }
        }
      )
      .subscribe();
  }

  // User Permissions
  static async getUserRole(teamId: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .single();

      if (error) return null;
      return data?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  static async canManageTeam(teamId: string): Promise<boolean> {
    const role = await this.getUserRole(teamId);
    return role === 'admin' || role === 'manager';
  }

  static async canCreateTasks(teamId: string): Promise<boolean> {
    const role = await this.getUserRole(teamId);
    return role !== null; // Any team member can create tasks
  }
}