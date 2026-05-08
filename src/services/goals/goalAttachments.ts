import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GoalAttachment } from './goalTypes';

const BUCKET = 'goal-attachments';

const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120);

export const goalAttachments = {
  async addGoalAttachment(goalId: string, file: File): Promise<GoalAttachment | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Path must start with auth.uid() to satisfy RLS
      const path = `${user.id}/${goalId}/${Date.now()}-${sanitize(file.name)}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('goal_attachments')
        .insert({
          goal_id: goalId,
          user_id: user.id,
          file_name: file.name,
          file_url: path, // store storage path; sign on read
          file_size: file.size,
          file_type: file.type,
        })
        .select()
        .maybeSingle();

      if (error) {
        // best-effort cleanup
        await supabase.storage.from(BUCKET).remove([path]);
        throw error;
      }

      toast.success('Attachment uploaded');
      return data as GoalAttachment;
    } catch (error) {
      console.error('Error adding goal attachment:', error);
      toast.error('Failed to upload attachment');
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
      return (data || []).map((a: any) => ({ ...a, user_name: 'User' }));
    } catch (error) {
      console.error('Error fetching goal attachments:', error);
      return [];
    }
  },

  async getSignedUrl(path: string, expiresInSec = 300): Promise<string | null> {
    if (!path) return null;
    // legacy rows may have a full URL stored
    if (/^https?:\/\//i.test(path)) return path;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresInSec);
    if (error) {
      console.error('signed url error', error);
      return null;
    }
    return data?.signedUrl ?? null;
  },

  async deleteGoalAttachment(attachmentId: string): Promise<boolean> {
    try {
      const { data: row } = await supabase
        .from('goal_attachments')
        .select('file_url')
        .eq('id', attachmentId)
        .maybeSingle();

      if (row?.file_url && !/^https?:\/\//i.test(row.file_url)) {
        await supabase.storage.from(BUCKET).remove([row.file_url]);
      }

      const { error } = await supabase
        .from('goal_attachments')
        .delete()
        .eq('id', attachmentId);
      if (error) throw error;

      toast.success('Attachment deleted');
      return true;
    } catch (error) {
      console.error('Error deleting goal attachment:', error);
      toast.error('Failed to delete attachment');
      return false;
    }
  },
};
