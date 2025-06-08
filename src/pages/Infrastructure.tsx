
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Activity, HardDrive, Wifi, Shield } from 'lucide-react';
import DatabaseOptimizer from '@/components/infrastructure/DatabaseOptimizer';
import SystemMonitor from '@/components/infrastructure/SystemMonitor';
import CacheManager from '@/components/infrastructure/CacheManager';
import OfflineManager from '@/components/infrastructure/OfflineManager';
import SecurityMonitor from '@/components/SecurityMonitor';

const Infrastructure = () => {
  return (
    <PageLayout 
      title="Technical Infrastructure" 
      subtitle="Monitor and manage system performance, security, and optimization"
      icon={<Settings className="h-6 w-6" />}
    >
      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system">System Monitor</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="offline">Offline</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <SystemMonitor />
        </TabsContent>
        
        <TabsContent value="database">
          <DatabaseOptimizer />
        </TabsContent>
        
        <TabsContent value="cache">
          <CacheManager />
        </TabsContent>
        
        <TabsContent value="offline">
          <OfflineManager />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityMonitor />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Infrastructure;
