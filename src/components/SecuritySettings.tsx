
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { mfaService, type MFAMethod } from '@/services/mfaService';
import { oauthService, type OAuthConnection } from '@/services/oauthService';
import { enhancedSessionService } from '@/services/enhancedSessionService';
import type { SessionInfo as UserSession } from '@/services/enhancedSessionService';
import MFASection from '@/components/security/MFASection';
import OAuthSection from '@/components/security/OAuthSection';
import SessionsSection from '@/components/security/SessionsSection';
import AdvancedSecuritySection from '@/components/security/AdvancedSecuritySection';

const SecuritySettings = () => {
  const [mfaMethods, setMfaMethods] = useState<MFAMethod[]>([]);
  const [oauthConnections, setOauthConnections] = useState<OAuthConnection[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const [mfaData, oauthData, sessionData] = await Promise.all([
        mfaService.getMFAMethods(),
        oauthService.getOAuthConnections(),
        enhancedSessionService.getUserSessions()
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

  useEffect(() => {
    loadSecurityData();
  }, []);

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
          <MFASection mfaMethods={mfaMethods} onRefresh={loadSecurityData} />
        </TabsContent>

        <TabsContent value="oauth" className="space-y-4">
          <OAuthSection oauthConnections={oauthConnections} onRefresh={loadSecurityData} />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <SessionsSection sessions={sessions} onRefresh={loadSecurityData} />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedSecuritySection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecuritySettings;
