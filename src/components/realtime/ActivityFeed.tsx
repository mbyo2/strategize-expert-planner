
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Activity, RefreshCw, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  entityType: string;
  entityName: string;
  entityId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setIsLoading(true);
    // Mock data - in real implementation, this would come from your audit service
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        userId: 'user-1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        action: 'updated',
        entityType: 'strategic_goal',
        entityName: 'Increase Market Share',
        entityId: 'goal-1',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        metadata: { oldProgress: 75, newProgress: 80 }
      },
      {
        id: '2',
        userId: 'user-2',
        userName: 'Mike Chen',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        action: 'created',
        entityType: 'planning_initiative',
        entityName: 'Q2 Product Launch',
        entityId: 'initiative-1',
        timestamp: new Date(Date.now() - 600000).toISOString()
      },
      {
        id: '3',
        userId: 'user-3',
        userName: 'Alex Rivera',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        action: 'completed',
        entityType: 'strategic_goal',
        entityName: 'Digital Transformation',
        entityId: 'goal-2',
        timestamp: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: '4',
        userId: 'user-1',
        userName: 'Sarah Johnson',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        action: 'commented',
        entityType: 'strategy_review',
        entityName: 'Q1 2024 Review',
        entityId: 'review-1',
        timestamp: new Date(Date.now() - 1200000).toISOString()
      }
    ];
    
    setActivities(mockActivities);
    setIsLoading(false);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return 'bg-green-100 text-green-800';
      case 'updated': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'deleted': return 'bg-red-100 text-red-800';
      case 'commented': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityTypeDisplay = (entityType: string) => {
    return entityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.entityType === filter
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter(filter === 'all' ? 'strategic_goal' : 'all')}
            >
              <Filter className="h-4 w-4 mr-1" />
              {filter === 'all' ? 'All' : 'Goals'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadActivities}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.userAvatar} />
                  <AvatarFallback>
                    {activity.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.userName}</span>
                    <Badge className={`text-xs ${getActionColor(activity.action)}`}>
                      {activity.action}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getEntityTypeDisplay(activity.entityType)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {activity.entityName}
                  </p>
                  
                  {activity.metadata && activity.action === 'updated' && activity.metadata.oldProgress && (
                    <p className="text-xs text-muted-foreground">
                      Progress: {activity.metadata.oldProgress}% → {activity.metadata.newProgress}%
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
