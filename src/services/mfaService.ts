import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MFAMethod {
  id: string;
  user_id: string;
  method_type: 'totp' | 'sms' | 'email';
  secret?: string;
  phone_number?: string;
  is_verified: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface MFASetupResponse {
  secret: string;
  qr_code_url: string;
  backup_codes: string[];
}

export const mfaService = {
  // Get user's MFA factors from Supabase Auth
  async getMFAMethods(): Promise<MFAMethod[]> {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;

      return data.totp.map(factor => ({
        id: factor.id,
        user_id: factor.id, // Use factor ID as identifier
        method_type: 'totp' as const,
        is_verified: factor.status === 'verified',
        is_primary: false,
        created_at: factor.created_at,
        updated_at: factor.updated_at || factor.created_at
      }));
    } catch (error) {
      console.error('Error fetching MFA methods:', error);
      return [];
    }
  },

  // Setup TOTP MFA using Supabase Auth
  async setupTOTP(): Promise<MFASetupResponse | null> {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });

      if (error) throw error;

      return {
        secret: data.totp.secret,
        qr_code_url: data.totp.qr_code,
        backup_codes: [] // Supabase handles backup codes differently
      };
    } catch (error) {
      console.error('Error setting up TOTP:', error);
      toast.error('Failed to setup MFA');
      return null;
    }
  },

  // Verify TOTP code using Supabase Auth
  async verifyTOTP(code: string, factorId: string, challengeId: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
      });

      if (error) {
        console.error('MFA verification error:', error);
        toast.error('Invalid verification code');
        return false;
      }

      toast.success('MFA verified successfully');
      return true;
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      toast.error('Verification failed');
      return false;
    }
  },

  // Remove MFA method using Supabase Auth
  async removeMFAMethod(factorId: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });

      if (error) throw error;
      
      toast.success('MFA method removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing MFA method:', error);
      toast.error('Failed to remove MFA method');
      return false;
    }
  },

  // Create MFA challenge
  async createChallenge(factorId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId });
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating MFA challenge:', error);
      return null;
    }
  },

  // Verify MFA challenge
  async verifyChallenge(factorId: string, challengeId: string, code: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error verifying MFA challenge:', error);
      return false;
    }
  },

  // Helper functions
  generateTOTPSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  },

  generateQRCodeURL(email: string, secret: string): string {
    const issuer = 'Your App Name';
    const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
  },

  generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }
};
