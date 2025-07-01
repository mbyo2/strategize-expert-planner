
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OAuthConnection {
  id: string;
  user_id: string;
  provider: 'google' | 'github' | 'microsoft' | 'linkedin_oidc';
  provider_user_id: string;
  provider_email?: string;
  provider_data: Record<string, any>;
  connected_at: string;
}

export const oauthService = {
  // Get user's OAuth connections
  async getOAuthConnections(): Promise<OAuthConnection[]> {
    try {
      const { data, error } = await supabase
        .from('oauth_connections')
        .select('*')
        .order('connected_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching OAuth connections:', error);
      return [];
    }
  },

  // Connect OAuth provider
  async connectProvider(provider: 'google' | 'github' | 'microsoft' | 'linkedin_oidc'): Promise<boolean> {
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
      toast.error(`Failed to connect ${provider}`);
      return false;
    }
  },

  // Disconnect OAuth provider
  async disconnectProvider(connectionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;
      
      toast.success('Provider disconnected successfully');
      return true;
    } catch (error) {
      console.error('Error disconnecting provider:', error);
      toast.error('Failed to disconnect provider');
      return false;
    }
  },

  // Handle OAuth callback
  async handleOAuthCallback(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!session?.user) return false;

      // Extract provider info from session
      const provider = session.user.app_metadata?.provider;
      const providerUserId = session.user.user_metadata?.provider_id || session.user.id;
      const providerEmail = session.user.email;
      const providerData = session.user.user_metadata || {};

      if (provider && ['google', 'github', 'microsoft', 'linkedin_oidc'].includes(provider)) {
        // Store OAuth connection
        const { error: insertError } = await supabase
          .from('oauth_connections')
          .upsert({
            user_id: session.user.id,
            provider: provider,
            provider_user_id: providerUserId,
            provider_email: providerEmail,
            provider_data: providerData,
            connected_at: new Date().toISOString()
          }, {
            onConflict: 'provider,provider_user_id'
          });

        if (insertError) throw insertError;
      }

      return true;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      return false;
    }
  }
};
