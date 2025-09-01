
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { logAuditEvent } from '@/services/auditService';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  bio?: string;
  mfaEnabled?: boolean;
  mfaVerified?: boolean; // Track if MFA was verified for this session
  lastActive?: string;
  ipRestrictions?: string[];
}

// Profile update interface
export interface ProfileUpdate {
  name?: string;
  email?: string;
  avatar?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  bio?: string;
  mfaEnabled?: boolean;
}

// Security settings interface
export interface SecuritySettings {
  mfaEnabled: boolean;
  ipRestrictions: string[];
  sessionTimeoutMinutes: number;
  requireMfaForAdmin: boolean;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  updateProfile: (profileData: ProfileUpdate) => void;
  getSecuritySettings: () => SecuritySettings;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
  verifyMfa: (code: string) => Promise<boolean>;
  setupMfa: () => Promise<string>; // Returns MFA setup code or URL
}

// Role hierarchy (higher index = more permissions)
const roleHierarchy: UserRole[] = ['viewer', 'analyst', 'manager', 'admin'];

// Default security settings
const defaultSecuritySettings: SecuritySettings = {
  mfaEnabled: false,
  ipRestrictions: [],
  sessionTimeoutMinutes: 30,
  requireMfaForAdmin: true
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(defaultSecuritySettings);
  const { toast } = useToast();

  // Check if user is logged in on initial load
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Defer loading user profile
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Get user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleError && roleError.code !== 'PGRST116') throw roleError;
      
      const role = roleData?.role as UserRole || 'viewer';
      
      // Update user's last active timestamp
      const now = new Date().toISOString();
      await supabase
        .from('profiles')
        .update({ updated_at: now })
        .eq('id', userId);
        
      // Update user activity for audit
      logAuditEvent({
        action: 'login',
        resource: 'user',
        resourceId: userId,
        description: 'User session refreshed',
        userId: userId,
        severity: 'low',
      });
      
      // Get the security settings from profile or use defaults
      // Fix: Safely extract security settings with optional chaining and null coalescing
      const userSecuritySettings = {
        mfaEnabled: profile?.mfa_enabled ?? false,
        ipRestrictions: profile?.ip_restrictions ?? [],
        sessionTimeoutMinutes: profile?.session_timeout_minutes ?? 30,
        requireMfaForAdmin: profile?.require_mfa_for_admin ?? true
      };
      
      setSecuritySettings(userSecuritySettings);
      
      // Combine profile and role data
      const userData: User = {
        id: userId,
        name: profile?.name || 'Unnamed User',
        email: profile?.email || '',
        role: role,
        avatar: profile?.avatar,
        jobTitle: profile?.job_title,
        department: profile?.department,
        company: profile?.company,
        bio: profile?.bio,
        mfaEnabled: userSecuritySettings.mfaEnabled,
        mfaVerified: false, // Always false on initial load, requires verification
        lastActive: now,
        ipRestrictions: userSecuritySettings.ipRestrictions
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // If profile doesn't exist yet, create a default one
      if (session?.user) {
        const defaultUser: User = {
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'New User',
          email: session.user.email || '',
          role: 'viewer',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
          mfaEnabled: false,
          mfaVerified: false
        };
        setUser(defaultUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Log successful login
      logAuditEvent({
        action: 'login',
        resource: 'user',
        description: `User logged in: ${email}`,
        severity: 'medium',
      });
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      // Log failed login
      logAuditEvent({
        action: 'login',
        resource: 'user',
        description: `Failed login attempt: ${email}`,
        severity: 'high',
        metadata: { error: error.message }
      });
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) throw error;
      
      // Log successful signup
      logAuditEvent({
        action: 'create',
        resource: 'user',
        description: `New user signed up: ${email}`,
        severity: 'medium',
      });
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      // Log failed signup
      logAuditEvent({
        action: 'create',
        resource: 'user',
        description: `Failed signup attempt: ${email}`,
        severity: 'medium',
        metadata: { error: error.message }
      });
      
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "Failed to create account. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const userId = user?.id;
      
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      
      // Log logout for audit
      if (userId) {
        logAuditEvent({
          action: 'logout',
          resource: 'user',
          resourceId: userId,
          description: 'User logged out',
          userId: userId,
          severity: 'low',
        });
      }
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Update user profile
  const updateProfile = async (profileData: ProfileUpdate) => {
    if (!user || !session) return;
    
    try {
      // Format the data for the database
      const dbData: any = {
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
        job_title: profileData.jobTitle,
        department: profileData.department,
        company: profileData.company,
        bio: profileData.bio,
        updated_at: new Date().toISOString()
      };
      
      // Remove undefined values
      Object.keys(dbData).forEach(key => {
        if (dbData[key] === undefined) {
          delete dbData[key];
        }
      });
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // If MFA setting is being changed
      if (profileData.mfaEnabled !== undefined && profileData.mfaEnabled !== user.mfaEnabled) {
        // In a real app, we would update the user_security table
        // For this example, we'll just update the local state
        
        // Log MFA setting change
        logAuditEvent({
          action: 'settings_change',
          resource: 'security_setting',
          resourceId: user.id,
          description: `User ${profileData.mfaEnabled ? 'enabled' : 'disabled'} MFA`,
          userId: user.id,
          severity: 'high',
          metadata: { setting: 'mfa_enabled', value: profileData.mfaEnabled }
        });
        
        setSecuritySettings({
          ...securitySettings,
          mfaEnabled: profileData.mfaEnabled
        });
      }
      
      // Update local state
      setUser({ 
        ...user, 
        ...profileData,
        mfaEnabled: profileData.mfaEnabled !== undefined ? profileData.mfaEnabled : user.mfaEnabled 
      });
      
      // Log profile update
      logAuditEvent({
        action: 'update',
        resource: 'user',
        resourceId: user.id,
        description: 'User profile updated',
        userId: user.id,
        severity: 'medium',
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  // Check user role and permissions based on role hierarchy
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const minRequiredRoleIndex = Math.min(...requiredRoles.map(role => roleHierarchy.indexOf(role)));
    
    return userRoleIndex >= minRequiredRoleIndex;
  };

  // Get user security settings
  const getSecuritySettings = () => {
    return securitySettings;
  };

  // Update security settings
  const updateSecuritySettings = async (settings: Partial<SecuritySettings>) => {
    try {
      const updatedSettings = { ...securitySettings, ...settings };
      setSecuritySettings(updatedSettings);
      
      // Save to user profile
      if (user) {
        await supabase
          .from('profiles')
          .update({
            mfa_enabled: updatedSettings.mfaEnabled,
            ip_restrictions: updatedSettings.ipRestrictions,
            session_timeout_minutes: updatedSettings.sessionTimeoutMinutes,
            require_mfa_for_admin: updatedSettings.requireMfaForAdmin
          })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error updating security settings:', error);
    }
  };

  // Verify MFA code
  const verifyMfa = async (code: string): Promise<boolean> => {
    try {
      // In production, this would use proper MFA verification
      if (code.length === 6 && /^\d+$/.test(code) && code !== '123456') {
        if (user) {
          setUser({ ...user, mfaVerified: true });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying MFA:', error);
      return false;
    }
  };

  // Setup MFA for user
  const setupMfa = async (): Promise<string> => {
    try {
      // In production, this would setup proper MFA
      return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=demo';
    } catch (error) {
      console.error('Error setting up MFA:', error);
      return '';
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    hasPermission,
    updateProfile,
    getSecuritySettings,
    updateSecuritySettings,
    verifyMfa,
    setupMfa
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based protection HOC
export const withAuth = (requiredRoles: UserRole[] = []) => <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated, hasPermission } = useAuth();
    
    if (!isAuthenticated) {
      // Redirect to login or show unauthorized UI
      return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <h1 className="text-2xl font-semibold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to access this page.</p>
          <a href="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Go to Login
          </a>
        </div>
      );
    }
    
    if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
      // Show unauthorized UI
      return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have the required permissions to access this page.
          </p>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
  
  return WithAuth;
};

// REMOVED: These functions have been moved inside the AuthProvider component

export default useAuth;
