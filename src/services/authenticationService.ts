
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logAuditEvent } from "./auditService";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface MfaVerification {
  token: string;
  factorId: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }

    // Log successful login
    await logAuditEvent({
      action: 'login',
      resource: 'user',
      description: 'User successfully logged in',
      userId: data.user?.id,
      severity: 'low'
    });

    toast.success('Login successful');
    return data;
  } catch (error) {
    console.error('Login error:', error);
    
    // Log failed login attempt
    await logAuditEvent({
      action: 'login',
      resource: 'user',
      description: `Failed login attempt for email: ${credentials.email}`,
      severity: 'medium',
      metadata: { email: credentials.email }
    });

    toast.error('Login failed. Please check your credentials.');
    throw error;
  }
};

export const signup = async (credentials: SignupCredentials) => {
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
      throw error;
    }

    // Log successful signup
    await logAuditEvent({
      action: 'signup',
      resource: 'user',
      description: 'New user account created',
      userId: data.user?.id,
      severity: 'low'
    });

    toast.success('Account created successfully. Please check your email for verification.');
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    toast.error('Signup failed. Please try again.');
    throw error;
  }
};

export const logout = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    // Log logout
    await logAuditEvent({
      action: 'logout',
      resource: 'user',
      description: 'User logged out',
      userId: user?.id,
      severity: 'low'
    });

    toast.success('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Logout failed');
    throw error;
  }
};

export const resetPassword = async (request: ResetPasswordRequest) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(request.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    toast.success('Password reset email sent. Please check your inbox.');
  } catch (error) {
    console.error('Password reset error:', error);
    toast.error('Failed to send password reset email');
    throw error;
  }
};

export const verifyMfa = async (verification: MfaVerification) => {
  try {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId: verification.factorId,
      challengeId: verification.token,
      code: verification.token
    });

    if (error) {
      throw error;
    }

    toast.success('MFA verification successful');
    return data;
  } catch (error) {
    console.error('MFA verification error:', error);
    toast.error('MFA verification failed');
    throw error;
  }
};
