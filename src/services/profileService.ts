
import { customSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  job_title?: string;
  department?: string;
  company?: string;
  bio?: string;
  language?: string;
  timezone?: string;
  theme?: string;
  date_format?: string;
  email_notifications?: boolean;
  app_notifications?: boolean;
  weekly_digest?: boolean;
  mfa_enabled?: boolean;
  session_timeout_minutes?: number;
  require_mfa_for_admin?: boolean;
  organization_id?: string;
  primary_team_id?: string;
  ip_restrictions?: string[];
  created_at?: string;
  updated_at?: string;
}

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await customSupabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    toast.error('Failed to load profile data');
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await customSupabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    toast.success('Profile updated successfully');
    return data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    toast.error('Failed to update profile');
    throw error;
  }
};

export const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await customSupabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = customSupabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await updateUserProfile(userId, { avatar: data.publicUrl });

    toast.success('Avatar updated successfully');
    return data.publicUrl;
  } catch (error) {
    console.error('Failed to upload avatar:', error);
    toast.error('Failed to upload avatar');
    return null;
  }
};

export const deleteUserProfile = async (userId: string) => {
  try {
    const { error } = await customSupabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw error;
    }

    toast.success('Profile deleted successfully');
  } catch (error) {
    console.error('Failed to delete user profile:', error);
    toast.error('Failed to delete profile');
    throw error;
  }
};
