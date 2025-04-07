
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Search, Shield, User, Users, Settings, Database, LineChart, Bell } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/hooks/useAuth';

// Mock user data for admin dashboard
const mockUsers = [
  { id: '1', name: 'Alex Johnson', email: 'alex@example.com', role: 'admin', status: 'active', lastLogin: '2023-04-06 09:32:12' },
  { id: '2', name: 'Sarah Williams', email: 'sarah@example.com', role: 'manager', status: 'active', lastLogin: '2023-04-05 14:22:45' },
  { id: '3', name: 'Michael Brown', email: 'michael@example.com', role: 'analyst', status: 'inactive', lastLogin: '2023-03-28 11:15:33' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'viewer', status: 'pending', lastLogin: 'Never' },
  { id: '5', name: 'Robert Wilson', email: 'robert@example.com', role: 'manager', status: 'active', lastLogin: '2023-04-06 08:45:19' },
  { id: '6', name: 'Jennifer Lee', email: 'jennifer@example.com', role: 'analyst', status: 'active', lastLogin: '2023-04-04 16:12:03' },
];

// Mock system stats for admin dashboard
const systemStats = {
  totalUsers: 324,
  activeUsers: 218,
  totalTeams: 42,
  systemUptime: '99.98%',
  avgResponseTime: '0.25s',
  storageUsed: '42%',
  lastBackup: '2023-04-06 01:00:00',
  activeIntegrations: 8
};

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // In a real app, this would update the user's role in the database
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}`,
    });
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    // In a real app, this would update the user's status in the database
    toast({
      title: "Status updated",
      description: `User status has been changed to ${newStatus}`,
    });
  };

  return (
    <PageLayout 
      title="Admin Dashboard" 
      subtitle="Manage users, monitor system performance, and configure advanced settings"
      icon={<Shield className="h-6 w-6 mr-2" />}
    >
      <Tabs defaultValue="users" onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="activity">
            <LineChart className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search users..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <User className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and access permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              user.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              user.role === 'analyst' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }
                          `}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`
                            ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              user.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }
                          `}
                        >
                          {user.status === 'active' && <Check className="h-3 w-3 mr-1" />}
                          {user.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Users</CardTitle>
                <CardDescription>Total registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{systemStats.totalUsers}</div>
                <p className="text-sm text-muted-foreground mt-1">{systemStats.activeUsers} active</p>
                <Progress 
                  value={(systemStats.activeUsers / systemStats.totalUsers) * 100} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Teams</CardTitle>
                <CardDescription>Active teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{systemStats.totalTeams}</div>
                <p className="text-sm text-muted-foreground mt-1">Across departments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Uptime</CardTitle>
                <CardDescription>System availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{systemStats.systemUptime}</div>
                <p className="text-sm text-muted-foreground mt-1">Response: {systemStats.avgResponseTime}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Storage</CardTitle>
                <CardDescription>System storage usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{systemStats.storageUsed}</div>
                <p className="text-sm text-muted-foreground mt-1">Last backup: {systemStats.lastBackup.split(' ')[0]}</p>
                <Progress 
                  value={parseInt(systemStats.storageUsed)} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Monitor system performance and critical metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Database Connections</h3>
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Healthy
                    </span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">65% of maximum connections</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">API Response Time</h3>
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Optimal
                    </span>
                  </div>
                  <Progress value={25} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">250ms average response time</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Memory Usage</h3>
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Normal
                    </span>
                  </div>
                  <Progress value={42} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">42% of allocated memory</p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Active Integrations</h3>
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> All Connected
                    </span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">CRM</Badge>
                    <Badge variant="outline">Analytics</Badge>
                    <Badge variant="outline">Email</Badge>
                    <Badge variant="outline">Storage</Badge>
                    <Badge variant="outline">+{systemStats.activeIntegrations - 4}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>System Activity Log</CardTitle>
              <CardDescription>
                Review recent system events and user activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">System Update</h3>
                    <span className="text-sm text-muted-foreground">Today, 09:42 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    System updated to version 2.4.0. New features: Enhanced reporting, improved dashboard widgets.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">User Role Changed</h3>
                    <span className="text-sm text-muted-foreground">Today, 08:30 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Admin changed Sarah Williams' role from Analyst to Manager
                  </p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">New User Registration</h3>
                    <span className="text-sm text-muted-foreground">Yesterday, 15:22 PM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    New user Emily Davis registered with email emily@example.com
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Backup Completed</h3>
                    <span className="text-sm text-muted-foreground">Yesterday, 01:00 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automated system backup completed successfully
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Integration Connected</h3>
                    <span className="text-sm text-muted-foreground">Apr 5, 10:15 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    New integration with CRM system connected and operational
                  </p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Failed Login Attempts</h3>
                    <span className="text-sm text-muted-foreground">Apr 4, 08:22 AM</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Multiple failed login attempts detected for user account robert@example.com
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-6">
                View Complete Activity Log
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Configure advanced system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Backup Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Backup Frequency</label>
                        <select className="w-full mt-1 px-3 py-2 border rounded-md">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Retention Period</label>
                        <select className="w-full mt-1 px-3 py-2 border rounded-md">
                          <option>30 Days</option>
                          <option>60 Days</option>
                          <option>90 Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Security Settings</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enforce 2FA for All Users</span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" className="toggle sr-only" id="toggle-2fa" />
                        <label htmlFor="toggle-2fa" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Password Rotation (90 Days)</span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" className="toggle sr-only" id="toggle-pwd" />
                        <label htmlFor="toggle-pwd" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Email Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">SMTP Server</label>
                        <input className="w-full mt-1 px-3 py-2 border rounded-md" value="smtp.example.com" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">SMTP Port</label>
                        <input className="w-full mt-1 px-3 py-2 border rounded-md" value="587" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button variant="outline" className="mr-2">Reset</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure system-wide notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Admin Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">New User Registrations</span>
                        <p className="text-xs text-muted-foreground">Get notified when new users register</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" checked className="toggle sr-only" id="toggle-new-users" />
                        <label htmlFor="toggle-new-users" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">System Errors</span>
                        <p className="text-xs text-muted-foreground">Get alerted about system errors</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" checked className="toggle sr-only" id="toggle-errors" />
                        <label htmlFor="toggle-errors" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Security Alerts</span>
                        <p className="text-xs text-muted-foreground">Notifications about security events</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" checked className="toggle sr-only" id="toggle-security" />
                        <label htmlFor="toggle-security" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Notification Channels</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input type="checkbox" checked id="channel-email" className="mr-2" />
                        <label htmlFor="channel-email">Email</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" checked id="channel-sms" className="mr-2" />
                        <label htmlFor="channel-sms">SMS</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="channel-slack" className="mr-2" />
                        <label htmlFor="channel-slack">Slack</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" checked id="channel-app" className="mr-2" />
                        <label htmlFor="channel-app">In-App</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button variant="outline" className="mr-2">Reset</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Admin;
