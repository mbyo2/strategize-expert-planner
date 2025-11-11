
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { Users, Activity } from 'lucide-react';

interface ActiveUser {
  id: string;
  name: string;
  avatar?: string;
  lastSeen: string;
  currentPage?: string;
}

interface RecentActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityName: string;
  timestamp: string;
}

const RealTimeCollaboration = () => {
  const { session } = useSimpleAuth();
  const user = session?.user || null;
  const { isConnected } = useRealTimeUpdates();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      userId: 'user-1',
      userName: 'Sarah Johnson',
      action: 'updated',
      entityType: 'strategic_goal',
      entityName: 'Increase Market Share',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: '2',
      userId: 'user-2', 
      userName: 'Mike Chen',
      action: 'created',
      entityType: 'planning_initiative',
      entityName: 'Q2 Product Launch',
      timestamp: new Date(Date.now() - 600000).toISOString()
    }
  ]);

  useEffect(() => {
    // Simulate active users
    setActiveUsers([
      {
        id: user?.id || 'current-user',
        name: user?.name || 'You',
        avatar: user?.avatar,
        lastSeen: new Date().toISOString(),
        currentPage: 'Strategic Goals'
      },
      {
        id: 'user-2',
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        lastSeen: new Date(Date.now() - 120000).toISOString(),
        currentPage: 'Analytics'
      },
      {
        id: 'user-3',
        name: 'Mike Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        lastSeen: new Date(Date.now() - 300000).toISOString(),
        currentPage: 'Planning'
      }
    ]);
  }, [user]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-muted-foreground">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Users ({activeUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeUsers.map((activeUser) => (
              <div key={activeUser.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activeUser.avatar} />
                    <AvatarFallback>
                      {activeUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {activeUser.name}
                      {activeUser.id === user?.id && ' (You)'}
                    </p>
                    {activeUser.currentPage && (
                      <p className="text-xs text-muted-foreground">
                        Working on: {activeUser.currentPage}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {formatTimeAgo(activeUser.lastSeen)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.userName}</span>
                    <span className="text-muted-foreground"> {activity.action} </span>
                    <span className="font-medium">{activity.entityName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {activity.entityType.replace('_', ' ')}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeCollaboration;
