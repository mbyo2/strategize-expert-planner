
import React, { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive, Wifi, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
  responseTime: number;
  errorRate: number;
  throughput: number;
}

interface PerformanceData {
  time: string;
  cpu: number;
  memory: number;
  responseTime: number;
}

const SystemMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 67,
    disk: 34,
    network: 23,
    uptime: '12d 5h 23m',
    responseTime: 125,
    errorRate: 0.02,
    throughput: 1250
  });

  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    { time: '10:00', cpu: 40, memory: 60, responseTime: 120 },
    { time: '10:05', cpu: 45, memory: 65, responseTime: 125 },
    { time: '10:10', cpu: 42, memory: 63, responseTime: 118 },
    { time: '10:15', cpu: 48, memory: 68, responseTime: 130 },
    { time: '10:20', cpu: 45, memory: 67, responseTime: 125 }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: '1',
      severity: 'warning' as const,
      message: 'Memory usage approaching 70% threshold',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: '2',
      severity: 'info' as const,
      message: 'Database query optimization completed',
      timestamp: new Date(Date.now() - 600000).toISOString()
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(85, prev.memory + (Math.random() - 0.5) * 8)),
        disk: Math.max(20, Math.min(80, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(10, Math.min(100, prev.network + (Math.random() - 0.5) * 20)),
        responseTime: Math.max(80, Math.min(200, prev.responseTime + (Math.random() - 0.5) * 20)),
        errorRate: Math.max(0, Math.min(0.1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
        throughput: Math.max(800, Math.min(2000, prev.throughput + (Math.random() - 0.5) * 200))
      }));

      // Update performance data
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      setPerformanceData(prev => {
        const newData = [...prev.slice(-9), {
          time: timeStr,
          cpu: metrics.cpu,
          memory: metrics.memory,
          responseTime: metrics.responseTime
        }];
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [metrics]);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'bg-red-500';
    if (value >= thresholds.warning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6" />
          System Monitor
        </h2>
        <p className="text-muted-foreground">Real-time system performance and health monitoring</p>
      </div>

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
              <Progress value={metrics.cpu} className="h-2" />
              <Badge className={getStatusColor(metrics.cpu, { warning: 70, critical: 85 })}>
                {metrics.cpu >= 85 ? 'Critical' : metrics.cpu >= 70 ? 'Warning' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{metrics.memory.toFixed(1)}%</div>
              <Progress value={metrics.memory} className="h-2" />
              <Badge className={getStatusColor(metrics.memory, { warning: 75, critical: 90 })}>
                {metrics.memory >= 90 ? 'Critical' : metrics.memory >= 75 ? 'Warning' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{metrics.disk.toFixed(1)}%</div>
              <Progress value={metrics.disk} className="h-2" />
              <Badge className={getStatusColor(metrics.disk, { warning: 80, critical: 95 })}>
                {metrics.disk >= 95 ? 'Critical' : metrics.disk >= 80 ? 'Warning' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{metrics.network.toFixed(1)}%</div>
              <Progress value={metrics.network} className="h-2" />
              <Badge className={getStatusColor(metrics.network, { warning: 80, critical: 95 })}>
                {metrics.network >= 95 ? 'Critical' : metrics.network >= 80 ? 'Warning' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{(metrics.errorRate * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Error percentage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.throughput}</div>
            <p className="text-xs text-muted-foreground">Requests per minute</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Real-time system performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory %" />
                <Line type="monotone" dataKey="responseTime" stroke="#ffc658" name="Response Time (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            System Alerts
          </CardTitle>
          <CardDescription>Recent system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Badge className={getAlertColor(alert.severity)}>
                  {alert.severity}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uptime and Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">System Uptime</h4>
              <div className="text-2xl font-bold text-green-500">{metrics.uptime}</div>
              <p className="text-sm text-muted-foreground">Continuous operation</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Health Score</h4>
              <div className="text-2xl font-bold text-green-500">96%</div>
              <p className="text-sm text-muted-foreground">Overall system health</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitor;
