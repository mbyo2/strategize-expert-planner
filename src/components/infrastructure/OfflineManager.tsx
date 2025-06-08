
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, Upload, RefreshCw, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface OfflineData {
  id: string;
  type: 'strategic_goals' | 'analytics' | 'team_data' | 'market_data';
  size: number;
  lastSynced: string;
  pendingChanges: number;
  status: 'synced' | 'pending' | 'conflict' | 'error';
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: string;
  pendingUploads: number;
  queuedDownloads: number;
  syncProgress: number;
  storageUsed: number;
  storageLimit: number;
}

const OfflineManager: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: new Date(Date.now() - 300000).toISOString(),
    pendingUploads: 3,
    queuedDownloads: 0,
    syncProgress: 0,
    storageUsed: 15.6,
    storageLimit: 100
  });

  const [offlineData, setOfflineData] = useState<OfflineData[]>([
    {
      id: '1',
      type: 'strategic_goals',
      size: 2.4,
      lastSynced: new Date(Date.now() - 180000).toISOString(),
      pendingChanges: 2,
      status: 'pending'
    },
    {
      id: '2',
      type: 'analytics',
      size: 8.7,
      lastSynced: new Date(Date.now() - 600000).toISOString(),
      pendingChanges: 0,
      status: 'synced'
    },
    {
      id: '3',
      type: 'team_data',
      size: 3.2,
      lastSynced: new Date(Date.now() - 300000).toISOString(),
      pendingChanges: 1,
      status: 'conflict'
    },
    {
      id: '4',
      type: 'market_data',
      size: 1.3,
      lastSynced: new Date(Date.now() - 900000).toISOString(),
      pendingChanges: 0,
      status: 'error'
    }
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      toast.success('Connection restored', {
        description: 'Starting automatic sync...'
      });
      handleAutoSync();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      toast.warning('Connection lost', {
        description: 'Working in offline mode'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAutoSync = async () => {
    if (!syncStatus.isOnline || isSyncing) return;
    
    setIsSyncing(true);
    setSyncStatus(prev => ({ ...prev, syncProgress: 0 }));

    try {
      // Simulate sync process
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setSyncStatus(prev => ({ ...prev, syncProgress: progress }));
      }

      // Update data status
      setOfflineData(prev => prev.map(item => ({
        ...item,
        status: item.status === 'error' ? 'error' : 'synced',
        lastSynced: new Date().toISOString(),
        pendingChanges: item.status === 'error' ? item.pendingChanges : 0
      })));

      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        pendingUploads: 0,
        queuedDownloads: 0,
        syncProgress: 0
      }));

      toast.success('Sync completed successfully');
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const forceSyncItem = async (id: string) => {
    setIsSyncing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOfflineData(prev => prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status: 'synced', 
              lastSynced: new Date().toISOString(),
              pendingChanges: 0 
            }
          : item
      ));

      toast.success('Item synced successfully');
    } catch (error) {
      toast.error('Sync failed for this item');
    } finally {
      setIsSyncing(false);
    }
  };

  const clearOfflineData = async (type?: string) => {
    try {
      if (type) {
        setOfflineData(prev => prev.filter(item => item.type !== type));
        toast.success(`${type} offline data cleared`);
      } else {
        setOfflineData([]);
        setSyncStatus(prev => ({ ...prev, storageUsed: 0 }));
        toast.success('All offline data cleared');
      }
    } catch (error) {
      toast.error('Failed to clear offline data');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'conflict': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimeAgo = (isoString: string) => {
    const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="h-6 w-6 text-green-500" />
            ) : (
              <WifiOff className="h-6 w-6 text-red-500" />
            )}
            Offline Manager
          </h2>
          <p className="text-muted-foreground">
            Manage offline data synchronization and storage
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleAutoSync}
            disabled={!syncStatus.isOnline || isSyncing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Now
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="flex items-center gap-2">
                <Badge className={syncStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}>
                  {syncStatus.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Sync</div>
              <div className="font-medium">{formatTimeAgo(syncStatus.lastSync)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Pending Uploads</div>
              <div className="font-medium">{syncStatus.pendingUploads}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Storage Used</div>
              <div className="font-medium">
                {syncStatus.storageUsed.toFixed(1)} / {syncStatus.storageLimit} MB
              </div>
            </div>
          </div>

          {isSyncing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Syncing...</span>
                <span className="text-sm">{syncStatus.syncProgress}%</span>
              </div>
              <Progress value={syncStatus.syncProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Offline Storage
          </CardTitle>
          <CardDescription>
            Local storage usage and management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Storage Usage</span>
                <span className="text-sm">
                  {syncStatus.storageUsed.toFixed(1)} MB / {syncStatus.storageLimit} MB
                </span>
              </div>
              <Progress 
                value={(syncStatus.storageUsed / syncStatus.storageLimit) * 100} 
                className="h-2" 
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => clearOfflineData()}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Data Items */}
      <Card>
        <CardHeader>
          <CardTitle>Offline Data</CardTitle>
          <CardDescription>
            Manage locally cached data and sync status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {offlineData.map(item => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{getTypeLabel(item.type)}</h4>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      {item.pendingChanges > 0 && (
                        <Badge variant="outline">
                          {item.pendingChanges} pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Size: {item.size} MB</span>
                      <span>Last synced: {formatTimeAgo(item.lastSynced)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.status !== 'synced' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => forceSyncItem(item.id)}
                        disabled={!syncStatus.isOnline || isSyncing}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => clearOfflineData(item.type)}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {offlineData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No offline data cached
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineManager;
