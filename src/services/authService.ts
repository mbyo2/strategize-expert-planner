
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface AuthSession {
  user: User | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

class AuthService {
  private listeners: Array<(session: AuthSession) => void> = [];

  async getCurrentSession(): Promise<AuthSession> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session error:', error);
        throw error;
      }

      if (session?.user) {
        // Get user profile and role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*, user_roles(role)')
          .eq('id', session.user.id)
          .single();

        return {
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.user_metadata?.name || 'User',
            role: profile?.user_roles?.role || 'viewer',
            avatar: profile?.avatar
          }
        };
      }

      return { user: null };
    } catch (error) {
      console.error('Error getting session:', error);
      return { user: null };
    }
  }

  async signIn(credentials: AuthCredentials): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUp(credentials: AuthCredentials): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      if (data.user && !data.session) {
        toast.success('Please check your email to confirm your account!');
      } else if (data.session) {
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Successfully signed out!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  private async getUserData(userId: string) {
    try {
      // In a real app, you would fetch additional user data from a profiles table
      // For now, we'll return mock data based on user ID patterns
      return {
        name: 'User',
        role: 'viewer',
        avatar: undefined
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  onSessionChange(callback: (session: AuthSession) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(session: AuthSession) {
    this.listeners.forEach(listener => listener(session));
  }
}

export const authService = new AuthService();
