
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Globe, Palette, Database, Shield, Users } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const Settings = () => {
  const [appSettings, setAppSettings] = useState({
    theme: 'system',
    language: 'english',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  });

  const [organizationSettings, setOrganizationSettings] = useState({
    companyName: 'Tech Corp',
    industry: 'Technology',
    employeeCount: '50-100',
    fiscalYearStart: 'January',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    emailIntegration: true,
    calendarSync: false,
    slackNotifications: true,
    apiAccess: false
  });

  const [dataSettings, setDataSettings] = useState({
    dataRetention: 90,
    autoBackup: true,
    exportFormat: 'CSV',
    anonymizeData: false
  });

  const handleAppSettingChange = (key: string, value: string) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleOrgSettingChange = (key: string, value: string) => {
    setOrganizationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleIntegrationChange = (key: string, value: boolean) => {
    setIntegrationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDataSettingChange = (key: string, value: any) => {
    setDataSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <PageLayout 
      title="Settings"
      subtitle="Configure application and organization settings"
      icon={<SettingsIcon className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="data">Data & Privacy</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={appSettings.theme} onValueChange={(value) => handleAppSettingChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Localization
                </CardTitle>
                <CardDescription>
                  Configure language, timezone, and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={appSettings.language} onValueChange={(value) => handleAppSettingChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={appSettings.timezone} onValueChange={(value) => handleAppSettingChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={appSettings.dateFormat} onValueChange={(value) => handleAppSettingChange('dateFormat', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={appSettings.currency} onValueChange={(value) => handleAppSettingChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Organization Details
                </CardTitle>
                <CardDescription>
                  Basic information about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={organizationSettings.companyName}
                      onChange={(e) => handleOrgSettingChange('companyName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={organizationSettings.industry} onValueChange={(value) => handleOrgSettingChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Employee Count</Label>
                    <Select value={organizationSettings.employeeCount} onValueChange={(value) => handleOrgSettingChange('employeeCount', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-100">51-100</SelectItem>
                        <SelectItem value="101-500">101-500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
                    <Select value={organizationSettings.fiscalYearStart} onValueChange={(value) => handleOrgSettingChange('fiscalYearStart', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="April">April</SelectItem>
                        <SelectItem value="July">July</SelectItem>
                        <SelectItem value="October">October</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>
                  Connect with external services and tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications and reports via email
                      </p>
                    </div>
                    <Switch
                      checked={integrationSettings.emailIntegration}
                      onCheckedChange={(checked) => handleIntegrationChange('emailIntegration', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Calendar Sync</Label>
                      <p className="text-sm text-muted-foreground">
                        Sync strategy reviews with your calendar
                      </p>
                    </div>
                    <Switch
                      checked={integrationSettings.calendarSync}
                      onCheckedChange={(checked) => handleIntegrationChange('calendarSync', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Slack Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send updates to Slack channels
                      </p>
                    </div>
                    <Switch
                      checked={integrationSettings.slackNotifications}
                      onCheckedChange={(checked) => handleIntegrationChange('slackNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow third-party API access to your data
                      </p>
                    </div>
                    <Switch
                      checked={integrationSettings.apiAccess}
                      onCheckedChange={(checked) => handleIntegrationChange('apiAccess', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Configure data retention, backup, and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Input
                      id="dataRetention"
                      type="number"
                      value={dataSettings.dataRetention}
                      onChange={(e) => handleDataSettingChange('dataRetention', parseInt(e.target.value))}
                      min="30"
                      max="365"
                    />
                    <p className="text-sm text-muted-foreground">
                      How long to keep historical data before automatic cleanup
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Backup</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically backup your data daily
                      </p>
                    </div>
                    <Switch
                      checked={dataSettings.autoBackup}
                      onCheckedChange={(checked) => handleDataSettingChange('autoBackup', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exportFormat">Default Export Format</Label>
                    <Select value={dataSettings.exportFormat} onValueChange={(value) => handleDataSettingChange('exportFormat', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSV">CSV</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anonymize Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Remove personal identifiers from exported data
                      </p>
                    </div>
                    <Switch
                      checked={dataSettings.anonymizeData}
                      onCheckedChange={(checked) => handleDataSettingChange('anonymizeData', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Advanced configuration options for power users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">API Keys</div>
                      <div className="text-sm text-muted-foreground">Manage API access keys</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Audit Logs</div>
                      <div className="text-sm text-muted-foreground">View system audit logs</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Import/Export</div>
                      <div className="text-sm text-muted-foreground">Bulk data operations</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">System Health</div>
                      <div className="text-sm text-muted-foreground">Monitor system status</div>
                    </div>
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-red-600">Danger Zone</Label>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full text-red-600 border-red-600">
                        Export All Data
                      </Button>
                      <Button variant="outline" className="w-full text-red-600 border-red-600">
                        Delete Organization
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save All Changes</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
