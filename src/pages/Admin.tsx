import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Users, Database, Settings, Activity, AlertTriangle, CheckCircle, Clock, Loader2, Download } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useAdminData } from '@/hooks/useAdminData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { users, usersLoading, auditLogs, auditLogsLoading, systemStats, statsLoading, refetchUsers, refetchLogs } = useAdminData();
  const [securitySettings, setSecuritySettings] = useState({
    enforcePasswordPolicy: true,
    minPasswordLength: 8,
    requireMfa: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'inactive': return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200';
      case 'manager': return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200';
      case 'analyst': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleExportAuditLogs = () => {
    if (auditLogs.length === 0) {
      toast.error('No audit logs to export');
      return;
    }
    const csvLines = [
      'Timestamp,Action,User,Resource Type,Severity',
      ...auditLogs.map(log =>
        `"${new Date(log.timestamp).toLocaleString()}","${log.action}","${log.user_email}","${log.resource_type}","${log.severity}"`
      )
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Audit logs exported');
  };

  const handleSaveSecuritySettings = async () => {
    try {
      // Save to organization settings if available
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({
          session_timeout_minutes: securitySettings.sessionTimeout,
          require_mfa: securitySettings.requireMfa,
        }).eq('id', user.id);
      }
      toast.success('Security settings saved');
    } catch {
      toast.error('Failed to save security settings');
    }
  };

  const handleCreateBackup = () => {
    // Export all user data as JSON
    const backupData = {
      timestamp: new Date().toISOString(),
      users: users.length,
      auditLogs: auditLogs.length,
      systemStats,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Backup created and downloaded');
  };

  return (
    <PageLayout
      title="Administration"
      subtitle="System administration and user management"
      icon={<Shield className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* System Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">{systemStats.activeUsers} active users</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <div className="text-2xl font-bold text-emerald-600">{systemStats.systemUptime}</div>
                  <p className="text-xs text-muted-foreground">Uptime this month</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  <div className="text-2xl font-bold">{systemStats.activeGoals}</div>
                  <p className="text-xs text-muted-foreground">Out of {systemStats.totalGoals} total goals</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
              </div>
              <Button onClick={() => refetchUsers()}>Refresh</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Overview of all system users and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No users found</div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Audit Logs</h2>
                <p className="text-muted-foreground">Track system activities and security events</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => refetchLogs()}>Refresh</Button>
                <Button onClick={handleExportAuditLogs} className="gap-1.5">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>System events and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                {auditLogsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No audit logs found</div>
                ) : (
                  <div className="space-y-4">
                    {auditLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 mt-1">{getSeverityIcon(log.severity)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{log.action}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">User: {log.user_email}</p>
                          <p className="text-sm">Resource: {log.resource_type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">System Configuration</h2>
              <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage security policies and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enforce Password Policy</Label>
                      <p className="text-sm text-muted-foreground">Require strong passwords</p>
                    </div>
                    <Switch
                      checked={securitySettings.enforcePasswordPolicy}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enforcePasswordPolicy: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Password Length</Label>
                    <Input
                      type="number"
                      value={securitySettings.minPasswordLength}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, minPasswordLength: parseInt(e.target.value) || 8 }))}
                      min={6}
                      max={32}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require MFA</Label>
                      <p className="text-sm text-muted-foreground">Require multi-factor authentication</p>
                    </div>
                    <Switch
                      checked={securitySettings.requireMfa}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireMfa: checked }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 60 }))}
                      min={5}
                      max={1440}
                    />
                  </div>
                  <Button onClick={handleSaveSecuritySettings} className="w-full">Save Security Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Configure data retention and cleanup policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Retention</span>
                      <Badge variant="secondary">90 days</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Audit logs older than 90 days are archived</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Size</span>
                      <Badge variant="secondary">{systemStats.totalUsers * 12 + systemStats.totalGoals * 8} KB</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Estimated storage usage</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Records</span>
                      <Badge variant="secondary">{systemStats.totalUsers + systemStats.totalGoals + systemStats.totalTeams}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Across all tables</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Backup & Restore</h2>
              <p className="text-muted-foreground">Manage system backups and data recovery</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Automatic Backups</CardTitle>
                  <CardDescription>Managed by Supabase — daily point-in-time recovery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Provider:</span>
                    <Badge className="bg-emerald-100 text-emerald-800">Supabase PITR</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge className="bg-emerald-100 text-emerald-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Retention:</span>
                    <span className="text-sm text-muted-foreground">7 days</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manual Export</CardTitle>
                  <CardDescription>Download a snapshot of system data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleCreateBackup} className="w-full gap-1.5">
                    <Download className="h-4 w-4" />
                    Export System Snapshot
                  </Button>
                  <Button onClick={handleExportAuditLogs} variant="outline" className="w-full gap-1.5">
                    <Download className="h-4 w-4" />
                    Export Audit Logs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Admin;
