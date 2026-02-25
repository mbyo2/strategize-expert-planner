import { supabase } from '@/integrations/supabase/client';

export interface Invitation {
  id: string;
  email: string;
  role: string;
  organization_id: string;
  token: string;
  token_hash: string;
  expires_at: string;
  accepted_at: string | null;
  invited_by: string | null;
  created_at: string | null;
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const InvitationService = {
  async createInvitation(organizationId: string, email: string, role: string = 'viewer'): Promise<Invitation> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check for existing pending invitation
    const { data: existing } = await supabase
      .from('organization_invitations')
      .select('id, expires_at, accepted_at')
      .eq('organization_id', organizationId)
      .eq('email', email.toLowerCase())
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (existing) {
      throw new Error('An active invitation already exists for this email');
    }

    // Check if user is already a member
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, organization_id')
      .eq('email', email.toLowerCase())
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (existingProfile) {
      throw new Error('This user is already a member of the organization');
    }

    const token = generateToken();
    const tokenHash = await hashToken(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const { data, error } = await supabase
      .from('organization_invitations')
      .insert({
        organization_id: organizationId,
        email: email.toLowerCase(),
        role,
        token,
        token_hash: tokenHash,
        expires_at: expiresAt,
        invited_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Invitation;
  },

  async getPendingInvitations(organizationId: string): Promise<Invitation[]> {
    const { data, error } = await supabase
      .from('organization_invitations')
      .select('*')
      .eq('organization_id', organizationId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Invitation[];
  },

  async revokeInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase
      .from('organization_invitations')
      .delete()
      .eq('id', invitationId);

    if (error) throw error;
  },

  async resendInvitation(invitationId: string): Promise<Invitation> {
    const token = generateToken();
    const tokenHash = await hashToken(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('organization_invitations')
      .update({
        token,
        token_hash: tokenHash,
        expires_at: expiresAt,
      })
      .eq('id', invitationId)
      .select()
      .single();

    if (error) throw error;
    return data as Invitation;
  },
};
