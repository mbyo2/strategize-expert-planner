
import React, { useEffect, useState } from 'react';
import { Database, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { logAuditEvent } from '@/services/auditService';

interface DatabaseMetrics {
  queryPerformance: number;
  connectionPool: number;
  cacheHitRate: number;
  indexEfficiency: number;
  slowQueries: number;
}

interface OptimizationTask {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

const DatabaseOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<DatabaseMetrics>({
    queryPerformance: 85,
    connectionPool: 70,
    cacheHitRate: 92,
    indexEfficiency: 78,
    slowQueries: 3
  });

  const [optimizationTasks, setOptimizationTasks] = useState<OptimizationTask[]>([
    {
      id: '1',
      name: 'Query Index Optimization',
      status: 'pending',
      progress: 0,
      description: 'Optimize database indexes for strategic goals queries',
      impact: 'high'
    },
    {
      id: '2',
      name: 'Connection Pool Tuning',
      status: 'pending',
      progress: 0,
      description: 'Optimize database connection pool settings',
      impact: 'medium'
    },
    {
      id: '3',
      name: 'Query Plan Analysis',
      status: 'pending',
      progress: 0,
      description: 'Analyze and optimize slow query execution plans',
      impact: 'high'
    }
  ]);

  const [isOptimizing, setIsOptimizing] = useState(false);

  const getMetricStatus = (value: number) => {
    if (value >= 90) return { color: 'bg-green-500', status: 'excellent' };
    if (value >= 75) return { color: 'bg-yellow-500', status: 'good' };
    return { color: 'bg-red-500', status: 'needs attention' };
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const runOptimization = async (taskId: string) => {
    setIsOptimizing(true);
    
    try {
      setOptimizationTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'running', progress: 0 }
          : task
      ));

      // Simulate optimization process
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setOptimizationTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, progress }
            : task
        ));
      }

      setOptimizationTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed', progress: 100 }
          : task
      ));

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        queryPerformance: Math.min(100, prev.queryPerformance + 5),
        indexEfficiency: Math.min(100, prev.indexEfficiency + 8),
        connectionPool: Math.min(100, prev.connectionPool + 10)
      }));

      await logAuditEvent({
        action: 'update',
        resource: 'admin',
        description: `Database optimization task completed: ${optimizationTasks.find(t => t.id === taskId)?.name}`,
        severity: 'medium'
      });

      toast.success('Optimization completed successfully');
    } catch (error) {
      setOptimizationTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'failed' }
          : task
      ));
      toast.error('Optimization failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  const runAllOptimizations = async () => {
    const pendingTasks = optimizationTasks.filter(task => task.status === 'pending');
    
    for (const task of pendingTasks) {
      await runOptimization(task.id);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" />
            Database Optimizer
          </h2>
          <p className="text-muted-foreground">Monitor and optimize database performance</p>
        </div>
        <Button 
          onClick={runAllOptimizations}
          disabled={isOptimizing}
          className="gap-2"
        >
          <Activity className="h-4 w-4" />
          Run All Optimizations
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Query Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{metrics.queryPerformance}%</div>
              <Progress value={metrics.queryPerformance} className="h-2" />
              <Badge className={getMetricStatus(metrics.queryPerformance).color}>
                {getMetricStatus(metrics.queryPerformance).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Connection Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{metrics.connectionPool}%</div>
              <Progress value={metrics.connectionPool} className="h-2" />
              <Badge className={getMetricStatus(metrics.connectionPool).color}>
                {getMetricStatus(metrics.connectionPool).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cache Hit Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{metrics.cacheHitRate}%</div>
              <Progress value={metrics.cacheHitRate} className="h-2" />
              <Badge className={getMetricStatus(metrics.cacheHitRate).color}>
                {getMetricStatus(metrics.cacheHitRate).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Index Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{metrics.indexEfficiency}%</div>
              <Progress value={metrics.indexEfficiency} className="h-2" />
              <Badge className={getMetricStatus(metrics.indexEfficiency).color}>
                {getMetricStatus(metrics.indexEfficiency).status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Slow Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-500">{metrics.slowQueries}</div>
              <div className="text-xs text-muted-foreground">Active slow queries</div>
              {metrics.slowQueries > 0 && (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Needs attention
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Tasks</CardTitle>
          <CardDescription>
            Automated database optimization and performance tuning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationTasks.map(task => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{task.name}</h4>
                    <Badge className={getImpactColor(task.impact)}>
                      {task.impact} impact
                    </Badge>
                    {task.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => runOptimization(task.id)}
                    disabled={isOptimizing || task.status === 'running' || task.status === 'completed'}
                  >
                    {task.status === 'running' ? 'Running...' : 
                     task.status === 'completed' ? 'Completed' : 'Run'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                {task.status === 'running' && (
                  <Progress value={task.progress} className="h-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseOptimizer;
