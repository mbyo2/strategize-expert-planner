
import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Monitor, Mail, Save } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Settings = () => {
  return (
    <PageLayout 
      title="Settings" 
      subtitle="Manage your account and application preferences"
    >
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-5 max-w-3xl">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Monitor className="h-4 w-4 mr-2" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center">
            <SettingsIcon className="h-4 w-4 mr-2" /> Integrations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Smith" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.smith@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" defaultValue="Strategy Director" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" defaultValue="Corporate Strategy" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Corporation" />
                </div>
                
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="email-updates" className="font-medium">Strategy Updates</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about strategic plan changes</p>
                    </div>
                    <Switch id="email-updates" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="email-goals" className="font-medium">Goal Progress</Label>
                      <p className="text-sm text-muted-foreground">Notifications about goal status changes</p>
                    </div>
                    <Switch id="email-goals" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="email-reports" className="font-medium">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                    </div>
                    <Switch id="email-reports" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="email-resources" className="font-medium">New Resources</Label>
                      <p className="text-sm text-muted-foreground">Notifications about new strategic resources</p>
                    </div>
                    <Switch id="email-resources" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="app-mentions" className="font-medium">Mentions & Comments</Label>
                      <p className="text-sm text-muted-foreground">Notifications when you're mentioned or receive comments</p>
                    </div>
                    <Switch id="app-mentions" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="app-tasks" className="font-medium">Task Assignments</Label>
                      <p className="text-sm text-muted-foreground">Notifications for new task assignments</p>
                    </div>
                    <Switch id="app-tasks" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="app-deadlines" className="font-medium">Upcoming Deadlines</Label>
                      <p className="text-sm text-muted-foreground">Reminders about approaching deadlines</p>
                    </div>
                    <Switch id="app-deadlines" defaultChecked />
                  </div>
                </div>
                
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  
                  <Button className="mt-2">
                    Change Password
                  </Button>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="twoFactor" className="font-medium">Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Enhance your account security with 2FA</p>
                    </div>
                    <Switch id="twoFactor" defaultChecked />
                  </div>
                  
                  <Button variant="outline">
                    Manage 2FA Settings
                  </Button>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">Login Sessions</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">MacBook Pro - Chrome - New York, USA</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full h-fit">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">iPhone 13 Pro</p>
                          <p className="text-sm text-muted-foreground">Safari - New York, USA - Last active 2 hours ago</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-fit">Sign Out</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-2">
                    Sign Out All Other Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme Preferences</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-primary rounded-md p-4 flex flex-col items-center">
                      <div className="w-full h-24 bg-white dark:bg-gray-900 rounded-md mb-3 border"></div>
                      <span className="font-medium">Light</span>
                    </div>
                    
                    <div className="border rounded-md p-4 flex flex-col items-center">
                      <div className="w-full h-24 bg-gray-900 rounded-md mb-3 border border-gray-700"></div>
                      <span className="font-medium">Dark</span>
                    </div>
                    
                    <div className="border rounded-md p-4 flex flex-col items-center">
                      <div className="w-full h-24 bg-gradient-to-b from-white to-gray-900 rounded-md mb-3 border"></div>
                      <span className="font-medium">System</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">Dashboard Layout</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="compactView" className="font-medium">Compact View</Label>
                      <p className="text-sm text-muted-foreground">Display more information with reduced spacing</p>
                    </div>
                    <Switch id="compactView" />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="showMetrics" className="font-medium">Show Key Metrics</Label>
                      <p className="text-sm text-muted-foreground">Display performance metrics at the top of dashboard</p>
                    </div>
                    <Switch id="showMetrics" defaultChecked />
                  </div>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">Font Size</h3>
                  
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="py-1 px-2 h-auto text-sm">A-</Button>
                    <div className="flex-grow h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-1 bg-primary rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <Button variant="outline" className="py-1 px-2 h-auto text-sm">A+</Button>
                  </div>
                </div>
                
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Appearance Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card className="banking-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connected Services</h3>
                  
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Microsoft Outlook</p>
                        <p className="text-sm text-muted-foreground">Calendar synchronization enabled</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Microsoft Teams</p>
                        <p className="text-sm text-muted-foreground">Connected for notifications</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">Available Integrations</h3>
                  
                  <div className="border rounded-md p-4 flex items-center justify-between bg-muted/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
                        <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">Connect for notifications and updates</p>
                      </div>
                    </div>
                    <div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 flex items-center justify-between bg-muted/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
                        <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Google Workspace</p>
                        <p className="text-sm text-muted-foreground">Connect calendar and docs</p>
                      </div>
                    </div>
                    <div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 flex items-center justify-between bg-muted/10">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
                        <SettingsIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Jira</p>
                        <p className="text-sm text-muted-foreground">Task management integration</p>
                      </div>
                    </div>
                    <div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">API Access</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly className="flex-grow font-mono" />
                      <Button variant="outline">Copy</Button>
                      <Button variant="outline">Regenerate</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">This key provides access to the Intantiko API. Keep it secure and do not share it.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Settings;
