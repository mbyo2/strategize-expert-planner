
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, Mail, Key } from 'lucide-react';
import { mfaService, type MFAMethod } from '@/services/mfaService';

interface MFASectionProps {
  mfaMethods: MFAMethod[];
  onRefresh: () => void;
}

const MFASection: React.FC<MFASectionProps> = ({ mfaMethods, onRefresh }) => {
  const [setupTOTP, setSetupTOTP] = useState(false);
  const [totpSecret, setTotpSecret] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [factorId, setFactorId] = useState<string>('');

  const handleSetupTOTP = async () => {
    const response = await mfaService.setupTOTP();
    if (response) {
      setTotpSecret(response.secret);
      setQrCodeUrl(response.qr_code_url);
      setSetupTOTP(true);
      // Store the factor ID for verification (in real implementation, get from response)
      setFactorId('temp-factor-id');
    }
  };

  const handleVerifyTOTP = async () => {
    if (!factorId) return;
    
    // Create challenge first, then verify
    const challengeId = await mfaService.createChallenge(factorId);
    if (!challengeId) return;
    
    const success = await mfaService.verifyTOTP(verificationCode, factorId, challengeId);
    if (success) {
      setSetupTOTP(false);
      setVerificationCode('');
      onRefresh();
    }
  };

  const handleSetupSMS = async () => {
    if (phoneNumber) {
      // SMS MFA is not supported in this implementation
      // Would need additional Supabase configuration and third-party SMS provider
      console.log('SMS MFA setup not implemented in this version');
      // For now, just clear the phone number
      setPhoneNumber('');
    }
  };

  const handleRemoveMFA = async (methodId: string) => {
    const success = await mfaService.removeMFAMethod(methodId);
    if (success) {
      onRefresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Multi-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* TOTP Setup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Authenticator App (TOTP)</h3>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app like Google Authenticator or Authy
              </p>
            </div>
            {!mfaMethods.some(m => m.method_type === 'totp' && m.is_verified) && (
              <Button onClick={handleSetupTOTP} disabled={setupTOTP}>
                <Smartphone className="h-4 w-4 mr-2" />
                Setup TOTP
              </Button>
            )}
          </div>

          {setupTOTP && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="text-center">
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Scan this QR code with your authenticator app
                </p>
                <code className="text-xs bg-muted p-2 rounded">{totpSecret}</code>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                <Button onClick={handleVerifyTOTP} className="w-full">
                  Verify & Enable
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* SMS Setup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Receive verification codes via text message
              </p>
            </div>
          </div>
          
          {!mfaMethods.some(m => m.method_type === 'sms' && m.is_verified) && (
            <div className="flex gap-2">
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <Button onClick={handleSetupSMS}>
                <Mail className="h-4 w-4 mr-2" />
                Add SMS
              </Button>
            </div>
          )}
        </div>

        {/* Active MFA Methods */}
        {mfaMethods.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Active MFA Methods</h3>
            {mfaMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {method.method_type === 'totp' && <Smartphone className="h-4 w-4" />}
                  {method.method_type === 'sms' && <Mail className="h-4 w-4" />}
                  <div>
                    <p className="font-medium capitalize">{method.method_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.method_type === 'sms' && method.phone_number}
                      {method.is_verified ? 'Verified' : 'Pending verification'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveMFA(method.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MFASection;
