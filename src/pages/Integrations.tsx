
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Users, Mail, Calendar } from 'lucide-react';
import IntegrationsHub from '@/components/integrations/IntegrationsHub';
import RealTimeCollaboration from '@/components/realtime/RealTimeCollaboration';
import ActivityFeed from '@/components/realtime/ActivityFeed';
import EmailNotificationService from '@/components/notifications/EmailNotificationService';

const Integrations = () => {
  return (
    <PageLayout 
      title="Integrations & Collaboration" 
      subtitle="Connect tools and collaborate in real-time"
      icon={<Zap className="h-6 w-6" />}
    >
      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="collaboration">Real-time</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations">
          <IntegrationsHub />
        </TabsContent>
        
        <TabsContent value="collaboration">
          <RealTimeCollaboration />
        </TabsContent>
        
        <TabsContent value="activity">
          <ActivityFeed />
        </TabsContent>
        
        <TabsContent value="notifications">
          <EmailNotificationService />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Integrations;
