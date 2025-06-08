
import React, { useState, useEffect } from 'react';
import { HardDrive, RefreshCw, Trash2, Database, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { logAuditEvent } from '@/services/auditService';

interface CacheEntry {
  key: string;
  size: number;
  hitCount: number;
  lastAccessed: string;
  ttl: number;
  type: 'strategic_goals' | 'analytics' | 'team_data' | 'market_data';
}

interface CacheStats {
  totalSize: number;
  totalEntries: number;
  hitRate: number;
  missRate: number;
  evictions: number;
  memoryUsage: number;
}

const CacheManager: React.FC = () => {
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalSize: 1024 * 1024 * 15, // 15MB
    totalEntries: 234,
    hitRate: 87.5,
    missRate: 12.5,
    evictions: 5,
    memoryUsage: 65
  });

  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([
    {
      key: 'strategic_goals_user_123',
      size: 1024 * 45,
      hitCount: 156,
      lastAccessed: new Date(Date.now() - 300000).toISOString(),
      ttl: 3600,
      type: 'strategic_goals'
    },
    {
      key: 'analytics_dashboard_data',
      size: 1024 * 128,
      hitCount: 89,
      lastAccessed: new Date(Date.now() - 600000).toISOString(),
      ttl: 1800,
      type: 'analytics'
    },
    {
      key: 'team_members_org_456',
      size: 1024 * 32,
      hitCount: 234,
      lastAccessed: new Date(Date.now() - 120000).toISOString(),
      ttl: 7200,
      type: 'team_data'
    },
    {
      key: 'market_changes_latest',
      size: 1024 * 76,
      hitCount: 67,
      lastAccessed: new Date(Date.now() - 900000).toISOString(),
      ttl: 1200,
      type: 'market_data'
    }
  ]);

  const [isClearing, setIsClearing] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (isoString: string) => {
    const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strategic_goals': return 'bg-blue-500';
      case 'analytics': return 'bg-green-500';
      case 'team_data': return 'bg-purple-500';
      case 'market_data': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const clearCache = async (type?: string) => {
    setIsClearing(true);
    
    try {
      // Simulate cache clearing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (type && type !== 'all') {
        setCacheEntries(prev => prev.filter(entry => entry.type !== type));
        toast.success(`${type} cache cleared successfully`);
      } else {
        setCacheEntries([]);
        toast.success('All cache cleared successfully');
      }

      // Update stats
      setCacheStats(prev => ({
        ...prev,
        totalEntries: type && type !== 'all' 
          ? prev.totalEntries - cacheEntries.filter(e => e.type === type).length
          : 0,
        totalSize: type && type !== 'all'
          ? prev.totalSize - cacheEntries.filter(e => e.type === type).reduce((sum, e) => sum + e.size, 0)
          : 0,
        memoryUsage: type && type !== 'all' ? prev.memoryUsage * 0.7 : 0
      }));

      await logAuditEvent({
        action: 'delete',
        resource: 'admin',
        description: `Cache cleared: ${type || 'all'}`,
        severity: 'medium'
      });

    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setIsClearing(false);
    }
  };

  const invalidateEntry = async (key: string) => {
    try {
      setCacheEntries(prev => prev.filter(entry => entry.key !== key));
      
      const entry = cacheEntries.find(e => e.key === key);
      if (entry) {
        setCacheStats(prev => ({
          ...prev,
          totalEntries: prev.totalEntries - 1,
          totalSize: prev.totalSize - entry.size,
          memoryUsage: Math.max(0, prev.memoryUsage - (entry.size / (1024 * 1024 * 100)) * 100)
        }));
      }

      toast.success('Cache entry invalidated');
    } catch (error) {
      toast.error('Failed to invalidate cache entry');
    }
  };

  const optimizeCache = async () => {
    try {
      // Simulate cache optimization
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove entries with low hit counts or old access times
      setCacheEntries(prev => prev.filter(entry => 
        entry.hitCount > 10 && 
        Date.now() - new Date(entry.lastAccessed).getTime() < 24 * 60 * 60 * 1000
      ));

      setCacheStats(prev => ({
        ...prev,
        hitRate: Math.min(95, prev.hitRate + 5),
        memoryUsage: Math.max(30, prev.memoryUsage - 15),
        evictions: prev.evictions + 3
      }));

      toast.success('Cache optimized successfully');
      
      await logAuditEvent({
        action: 'update',
        resource: 'admin',
        description: 'Cache optimization completed',
        severity: 'low'
      });

    } catch (error) {
      toast.error('Cache optimization failed');
    }
  };

  const filteredEntries = selectedType === 'all' 
    ? cacheEntries 
    : cacheEntries.filter(entry => entry.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <HardDrive className="h-6 w-6" />
            Cache Manager
          </h2>
          <p className="text-muted-foreground">Monitor and manage application cache performance</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={optimizeCache}
            disabled={isClearing}
            variant="outline"
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Optimize
          </Button>
          <Button 
            onClick={() => clearCache('all')}
            disabled={isClearing}
            variant="destructive"
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Cache Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(cacheStats.totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              {cacheStats.totalEntries} entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hit Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{cacheStats.hitRate}%</div>
            <Progress value={cacheStats.hitRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheStats.memoryUsage}%</div>
            <Progress value={cacheStats.memoryUsage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evictions</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheStats.evictions}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Cache Management */}
      <Card>
        <CardHeader>
          <CardTitle>Cache Entries</CardTitle>
          <CardDescription>
            Manage individual cache entries and monitor their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                All Types
              </Button>
              <Button
                variant={selectedType === 'strategic_goals' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('strategic_goals')}
              >
                Strategic Goals
              </Button>
              <Button
                variant={selectedType === 'analytics' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('analytics')}
              >
                Analytics
              </Button>
              <Button
                variant={selectedType === 'team_data' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('team_data')}
              >
                Team Data
              </Button>
              <Button
                variant={selectedType === 'market_data' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('market_data')}
              >
                Market Data
              </Button>
            </div>

            {/* Cache Entries List */}
            <div className="space-y-2">
              {filteredEntries.map(entry => (
                <div key={entry.key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{entry.key}</h4>
                        <Badge className={getTypeColor(entry.type)}>
                          {entry.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Size: {formatBytes(entry.size)}</span>
                        <span>Hits: {entry.hitCount}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(entry.lastAccessed)}
                        </span>
                        <span>TTL: {Math.floor(entry.ttl / 60)}m</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => invalidateEntry(entry.key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No cache entries found for the selected type
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheManager;
