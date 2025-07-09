import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type SupportTicket = Database['public']['Tables']['support_tickets']['Row'];
type SupportTicketInsert = Database['public']['Tables']['support_tickets']['Insert'];
type SupportTicketComment = Database['public']['Tables']['support_ticket_comments']['Row'];
type SupportTicketCommentInsert = Database['public']['Tables']['support_ticket_comments']['Insert'];

export interface SupportTicketWithDetails extends SupportTicket {
  user?: {
    name: string;
    email: string;
  };
  assigned_user?: {
    name: string;
    email: string;
  };
  comments_count?: number;
}

export interface SupportTicketCommentWithUser extends SupportTicketComment {
  user?: {
    name: string;
    email: string;
  };
}

export class SupportTicketService {
  static async createTicket(ticket: Omit<SupportTicketInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        ...ticket,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTickets(filters: {
    status?: string;
    category?: string;
    assigned_to?: string;
    user_id?: string;
  } = {}) {
    let query = supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    if (filters.user_id) query = query.eq('user_id', filters.user_id);

    const { data, error } = await query;
    if (error) throw error;
    
    return data as SupportTicketWithDetails[];
  }

  static async getTicketById(id: string) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as SupportTicketWithDetails;
  }

  static async updateTicket(id: string, updates: Partial<Pick<SupportTicket, 'status' | 'priority' | 'assigned_to' | 'resolution_notes' | 'resolved_at'>>) {
    const { data, error } = await supabase
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async assignTicket(ticketId: string, assignedTo: string) {
    return this.updateTicket(ticketId, { assigned_to: assignedTo });
  }

  static async resolveTicket(ticketId: string, resolutionNotes: string) {
    return this.updateTicket(ticketId, {
      status: 'resolved',
      resolution_notes: resolutionNotes,
      resolved_at: new Date().toISOString()
    });
  }

  static async addComment(ticketId: string, comment: string, isInternal: boolean = false) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('support_ticket_comments')
      .insert({
        ticket_id: ticketId,
        user_id: user.id,
        comment,
        is_internal: isInternal
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTicketComments(ticketId: string) {
    const { data, error } = await supabase
      .from('support_ticket_comments')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as SupportTicketCommentWithUser[];
  }

  static async getUserTickets(userId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const targetUserId = userId || user.id;
    
    return this.getTickets({ user_id: targetUserId });
  }

  static async getTicketStats() {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('status, priority, category');

    if (error) throw error;

    const stats = {
      total: data.length,
      open: data.filter(t => t.status === 'open').length,
      in_progress: data.filter(t => t.status === 'in_progress').length,
      resolved: data.filter(t => t.status === 'resolved').length,
      high_priority: data.filter(t => t.priority === 'high').length,
      by_category: {} as Record<string, number>
    };

    // Count by category
    data.forEach(ticket => {
      stats.by_category[ticket.category] = (stats.by_category[ticket.category] || 0) + 1;
    });

    return stats;
  }
}