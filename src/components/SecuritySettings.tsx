
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Smartphone, Mail, Key, Users, Globe, Activity } from 'lucide-react';
import { mfaService, type MFAMethod } from '@/services/mfaService';
import { oauthService, type OAuthConnection } from '@/services/oauthService';
import { sessionService, type UserSession } from '@/services/sessionService';
import { toast } from 'sonner';

const SecuritySettings = () => {
  const [mfaMethods, setMfaMethods] = useState<MFAMethod[]>([]);
  const [oauthConnections, setOauthConnections] = useState<OAuthConnection[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupTOTP, setSetupTOTP] = useState(false);
  const [totpSecret, setTotpSecret] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const [mfaData, oauthData, sessionData] = await Promise.all([
        mfaService.getMFAMethods(),
        oauthService.getOAuthConnections(),
        sessionService.getUserSessions()
      ]);
      
      setMfaMethods(mfaData);
      setOauthConnections(oauthData);
      setSessions(sessionData);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupTOTP = async () => {
    const response = await mfaService.setupTOTP();
    if (response) {
      setTotpSecret(response.secret);
      setQrCodeUrl(response.qr_code_url);
      setSetupTOTP(true);
    }
  };

  const handleVerifyTOTP = async () => {
    const success = await mfaService.verifyTOTP(verificationCode);
    if (success) {
      setSetupTOTP(false);
      setVerificationCode('');
      loadSecurityData();
    }
  };

  const handleSetupSMS = async () => {
    if (phoneNumber) {
      const success = await mfaService.setupSMS(phoneNumber);
      if (success) {
        setPhoneNumber('');
        loadSecurityData();
      }
    }
  };

  const handleRemoveMFA = async (methodId: string) => {
    const success = await mfaService.removeMFAMethod(methodId);
    if (success) {
      loadSecurityData();
    }
  };

  const handleConnectOAuth = async (provider: 'google' | 'github' | 'microsoft' | 'linkedin_oidc') => {
    await oauthService.connectProvider(provider);
  };

  const handleDisconnectOAuth = async (connectionId: string) => {
    const success = await oauthService.disconnectProvider(connectionId);
    if (success) {
      loadSecurityData();
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    const success = await sessionService.terminateSession(sessionId);
    if (success) {
      loadSecurityData();
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    const success = await sessionService.terminateAllOtherSessions();
    if (success) {
      loadSecurityData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Security Settings</h1>
      </div>

      <Tabs defaultValue="mfa" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mfa">MFA</TabsTrigger>
          <TabsTrigger value="oauth">OAuth</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="mfa" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="oauth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                OAuth Providers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleConnectOAuth('google')}
                  disabled={oauthConnections.some(c => c.provider === 'google')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {oauthConnections.some(c => c.provider === 'google') ? 'Connected' : 'Connect Google'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleConnectOAuth('github')}
                  disabled={oauthConnections.some(c => c.provider === 'github')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {oauthConnections.some(c => c.provider === 'github') ? 'Connected' : 'Connect GitHub'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleConnectOAuth('microsoft')}
                  disabled={oauthConnections.some(c => c.provider === 'microsoft')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {oauthConnections.some(c => c.provider === 'microsoft') ? 'Connected' : 'Connect Microsoft'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleConnectOAuth('linkedin_oidc')}
                  disabled={oauthConnections.some(c => c.provider === 'linkedin_oidc')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {oauthConnections.some(c => c.provider === 'linkedin_oidc') ? 'Connected' : 'Connect LinkedIn'}
                </Button>
              </div>

              {oauthConnections.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Connected Accounts</h3>
                  {oauthConnections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4" />
                        <div>
                          <p className="font-medium capitalize">{connection.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            {connection.provider_email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnectOAuth(connection.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Manage your active sessions across devices
                </p>
                <Button
                  variant="outline"
                  onClick={handleTerminateAllOtherSessions}
                >
                  Terminate All Others
                </Button>
              </div>

              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {session.user_agent?.includes('Chrome') ? 'Chrome' : 
                         session.user_agent?.includes('Firefox') ? 'Firefox' : 
                         session.user_agent?.includes('Safari') ? 'Safari' : 'Unknown Browser'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.ip_address} • Last active: {new Date(session.last_activity).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                    >
                      Terminate
                    </Button>
                  </div>
                ))}
                
                {sessions.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No active sessions found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">IP Restrictions</h3>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to specific IP addresses
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Session Timeout</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically sign out inactive sessions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Login Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Email notifications for new sign-ins
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Download your account data
                    </p>
                  </div>
                  <Button variant="outline">
                    Export Data
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Account Deletion</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account
                    </p>
                  </div>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecuritySettings;
