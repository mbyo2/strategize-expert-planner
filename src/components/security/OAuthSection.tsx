
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { oauthService, type OAuthConnection } from '@/services/oauthService';

interface OAuthSectionProps {
  oauthConnections: OAuthConnection[];
  onRefresh: () => void;
}

const OAuthSection: React.FC<OAuthSectionProps> = ({ oauthConnections, onRefresh }) => {
  const handleConnectOAuth = async (provider: 'google' | 'github' | 'linkedin_oidc') => {
    await oauthService.connectProvider(provider);
  };

  const handleDisconnectOAuth = async (connectionId: string) => {
    const success = await oauthService.disconnectProvider(connectionId);
    if (success) {
      onRefresh();
    }
  };

  return (
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
  );
};

export default OAuthSection;
