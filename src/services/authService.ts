
import { customSupabase } from "@/integrations/supabase/customClient";
import { toast } from "sonner";
import { logAuditEvent } from "./auditService";

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  mfaEnabled?: boolean;
}

export interface AuthSession {
  user: AuthUser | null;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export class AuthService {
  private static instance: AuthService;
  private currentSession: AuthSession = { user: null };
  private sessionListeners: Array<(session: AuthSession) => void> = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Subscribe to session changes
  onSessionChange(callback: (session: AuthSession) => void): () => void {
    this.sessionListeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.sessionListeners = this.sessionListeners.filter(cb => cb !== callback);
    };
  }

  private notifySessionChange() {
    this.sessionListeners.forEach(callback => callback(this.currentSession));
  }

  async signUp(credentials: AuthCredentials): Promise<AuthSession> {
    try {
      const { data, error } = await customSupabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: { name: credentials.name }
        }
      });

      if (error) throw error;

      await logAuditEvent({
        action: 'signup',
        resource: 'user',
        description: 'New user account created',
        userId: data.user?.id,
        severity: 'low'
      });

      toast.success('Account created successfully');
      
      const session = await this.createSession(data.user, data.session);
      this.currentSession = session;
      this.notifySessionChange();
      
      return session;
    } catch (error: any) {
      toast.error('Signup failed', { description: error.message });
      throw error;
    }
  }

  async signIn(credentials: AuthCredentials): Promise<AuthSession> {
    try {
      const { data, error } = await customSupabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      await logAuditEvent({
        action: 'login',
        resource: 'user',
        description: 'User successfully logged in',
        userId: data.user?.id,
        severity: 'low'
      });

      toast.success('Login successful');
      
      const session = await this.createSession(data.user, data.session);
      this.currentSession = session;
      this.notifySessionChange();
      
      return session;
    } catch (error: any) {
      await logAuditEvent({
        action: 'login',
        resource: 'user',
        description: `Failed login attempt for email: ${credentials.email}`,
        severity: 'medium',
        metadata: { email: credentials.email }
      });

      toast.error('Login failed', { description: error.message });
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const userId = this.currentSession.user?.id;
      
      const { error } = await customSupabase.auth.signOut();
      if (error) throw error;

      if (userId) {
        await logAuditEvent({
          action: 'logout',
          resource: 'user',
          description: 'User logged out',
          userId,
          severity: 'low'
        });
      }

      this.currentSession = { user: null };
      this.notifySessionChange();
      
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed', { description: error.message });
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await customSupabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success('Password reset email sent');
    } catch (error: any) {
      toast.error('Password reset failed', { description: error.message });
      throw error;
    }
  }

  async getCurrentSession(): Promise<AuthSession> {
    try {
      const { data: { session }, error } = await customSupabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        const authSession = await this.createSession(session.user, session);
        this.currentSession = authSession;
        return authSession;
      }
      
      return { user: null };
    } catch (error) {
      console.error('Error getting current session:', error);
      return { user: null };
    }
  }

  private async createSession(user: any, session: any): Promise<AuthSession> {
    // Fetch user role from database
    let userRole = 'viewer'; // default role
    
    try {
      const { data: roleData } = await customSupabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (roleData?.role) {
        userRole = roleData.role;
      }
    } catch (error) {
      console.log('Could not fetch user role, using default:', error);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        role: userRole,
        mfaEnabled: false
      },
      accessToken: session?.access_token,
      refreshToken: session?.refresh_token,
      expiresAt: session?.expires_at
    };
  }

  getSession(): AuthSession {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return !!this.currentSession.user;
  }

  hasRole(requiredRole: string): boolean {
    const userRole = this.currentSession.user?.role;
    if (!userRole) return false;
    
    // Simple role hierarchy
    const roleHierarchy = ['viewer', 'analyst', 'manager', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
    
    return userRoleIndex >= requiredRoleIndex;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
