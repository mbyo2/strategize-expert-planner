
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { sessionService, type UserSession } from '@/services/sessionService';

interface SessionsSectionProps {
  sessions: UserSession[];
  onRefresh: () => void;
}

const SessionsSection: React.FC<SessionsSectionProps> = ({ sessions, onRefresh }) => {
  const handleTerminateSession = async (sessionId: string) => {
    const success = await sessionService.terminateSession(sessionId);
    if (success) {
      onRefresh();
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    const success = await sessionService.terminateAllOtherSessions();
    if (success) {
      onRefresh();
    }
  };

  return (
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
  );
};

export default SessionsSection;
