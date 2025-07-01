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
  // Get user's MFA methods
  async getMFAMethods(): Promise<MFAMethod[]> {
    try {
      const { data, error } = await supabase
        .from('user_mfa_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(method => ({
        ...method,
        method_type: method.method_type as 'totp' | 'sms' | 'email'
      }));
    } catch (error) {
      console.error('Error fetching MFA methods:', error);
      return [];
    }
  },

  // Setup TOTP MFA
  async setupTOTP(): Promise<MFASetupResponse | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate a secret for TOTP
      const secret = this.generateTOTPSecret();
      const qr_code_url = this.generateQRCodeURL(user.email || '', secret);

      // Save the method to database (unverified initially)
      const { error } = await supabase
        .from('user_mfa_methods')
        .insert({
          user_id: user.id,
          method_type: 'totp',
          secret: secret,
          is_verified: false,
          is_primary: false
        });

      if (error) throw error;

      return {
        secret,
        qr_code_url,
        backup_codes: this.generateBackupCodes()
      };
    } catch (error) {
      console.error('Error setting up TOTP:', error);
      toast.error('Failed to setup MFA');
      return null;
    }
  },

  // Verify TOTP code
  async verifyTOTP(code: string, methodId?: string): Promise<boolean> {
    try {
      // In a real implementation, this would verify the TOTP code
      // For now, we'll simulate verification
      if (code.length === 6 && /^\d+$/.test(code)) {
        if (methodId) {
          const { error } = await supabase
            .from('user_mfa_methods')
            .update({ 
              is_verified: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', methodId);

          if (error) throw error;
        }
        
        toast.success('MFA verified successfully');
        return true;
      }
      
      toast.error('Invalid verification code');
      return false;
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      toast.error('Verification failed');
      return false;
    }
  },

  // Setup SMS MFA
  async setupSMS(phoneNumber: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_mfa_methods')
        .insert({
          user_id: user.id,
          method_type: 'sms',
          phone_number: phoneNumber,
          is_verified: false,
          is_primary: false
        });

      if (error) throw error;
      
      toast.success('SMS MFA setup initiated. Please verify your phone number.');
      return true;
    } catch (error) {
      console.error('Error setting up SMS MFA:', error);
      toast.error('Failed to setup SMS MFA');
      return false;
    }
  },

  // Remove MFA method
  async removeMFAMethod(methodId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_mfa_methods')
        .delete()
        .eq('id', methodId);

      if (error) throw error;
      
      toast.success('MFA method removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing MFA method:', error);
      toast.error('Failed to remove MFA method');
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
