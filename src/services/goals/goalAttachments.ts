
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GoalAttachment } from './goalTypes';

export const goalAttachments = {
  async addGoalAttachment(goalId: string, file: File): Promise<GoalAttachment | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileUrl = `https://example.com/files/${file.name}`;

      const { data, error } = await supabase
        .from('goal_attachments')
        .insert({
          goal_id: goalId,
          user_id: user.id,
          file_name: file.name,
          file_url: fileUrl,
          file_size: file.size,
          file_type: file.type
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Attachment added successfully');
      return data;
    } catch (error) {
      console.error('Error adding goal attachment:', error);
      toast.error('Failed to add attachment');
      return null;
    }
  },

  async getGoalAttachments(goalId: string): Promise<GoalAttachment[]> {
    try {
      const { data, error } = await supabase
        .from('goal_attachments')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data?.map(attachment => ({
        ...attachment,
        user_name: 'User'
      })) || [];
    } catch (error) {
      console.error('Error fetching goal attachments:', error);
      return [];
    }
  },

  async deleteGoalAttachment(attachmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('goal_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) throw error;
      
      toast.success('Attachment deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting goal attachment:', error);
      toast.error('Failed to delete attachment');
      return false;
    }
  }
};
