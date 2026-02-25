
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Globe, Palette, Database, Shield, Users, Loader2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useOrganization } from '@/contexts/OrganizationContext';
import { fetchUserProfile, updateUserProfile } from '@/services/profileService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Settings = () => {
  const { session } = useSimpleAuth();
  const { organizationId } = useOrganization();
  const userId = session?.user?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [appSettings, setAppSettings] = useState({
    theme: 'system',
    language: 'english',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  });

  const [organizationSettings, setOrganizationSettings] = useState({
    companyName: '',
    industry: 'Technology',
    employeeCount: '50-100',
    fiscalYearStart: 'January',
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

  // Load settings from DB on mount
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      try {
        // Load user profile settings
        const profile = await fetchUserProfile(userId);
        if (profile) {
          setAppSettings(prev => ({
            ...prev,
            theme: profile.theme || 'system',
            language: profile.language || 'english',
            timezone: profile.timezone || 'UTC',
            dateFormat: profile.date_format || 'MM/DD/YYYY',
          }));
        }

        // Load org settings
        if (organizationId) {
          const { data: org } = await supabase
            .from('organizations')
            .select('name, industry, size, settings')
            .eq('id', organizationId)
            .single();

          if (org) {
            setOrganizationSettings(prev => ({
              ...prev,
              companyName: org.name || '',
              industry: org.industry || 'Technology',
              employeeCount: org.size || '50-100',
            }));
            const s = (typeof org.settings === 'object' && org.settings) ? org.settings as any : {};
            setIntegrationSettings({
              emailIntegration: s.emailIntegration ?? true,
              calendarSync: s.calendarSync ?? false,
              slackNotifications: s.slackNotifications ?? true,
              apiAccess: s.apiAccess ?? false,
            });
            setDataSettings({
              dataRetention: s.data_retention_days ?? 90,
              autoBackup: s.autoBackup ?? true,
              exportFormat: s.exportFormat ?? 'CSV',
              anonymizeData: s.anonymizeData ?? false,
            });
            if (s.fiscalYearStart) {
              setOrganizationSettings(prev => ({ ...prev, fiscalYearStart: s.fiscalYearStart }));
            }
          }
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, organizationId]);

  const handleSaveAll = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      // Save user profile settings
      await updateUserProfile(userId, {
        theme: appSettings.theme,
        language: appSettings.language,
        timezone: appSettings.timezone,
        date_format: appSettings.dateFormat,
      });

      // Save org settings
      if (organizationId) {
        const settingsPayload = {
          emailIntegration: integrationSettings.emailIntegration,
          calendarSync: integrationSettings.calendarSync,
          slackNotifications: integrationSettings.slackNotifications,
          apiAccess: integrationSettings.apiAccess,
          data_retention_days: dataSettings.dataRetention,
          autoBackup: dataSettings.autoBackup,
          exportFormat: dataSettings.exportFormat,
          anonymizeData: dataSettings.anonymizeData,
          fiscalYearStart: organizationSettings.fiscalYearStart,
          currency: appSettings.currency,
        };

        const { error } = await supabase
          .from('organizations')
          .update({
            name: organizationSettings.companyName,
            industry: organizationSettings.industry,
            size: organizationSettings.employeeCount,
            settings: settingsPayload,
            updated_at: new Date().toISOString(),
          })
          .eq('id', organizationId);

        if (error) throw error;
      }

      toast.success('Settings saved successfully');
    } catch (e) {
      console.error('Failed to save settings:', e);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <PageLayout title="Settings" icon={<SettingsIcon className="h-6 w-6" />}>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

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
                <CardDescription>Customize the look and feel of your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={appSettings.theme} onValueChange={(v) => handleAppSettingChange('theme', v)}>
                    <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
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
                <CardDescription>Configure language, timezone, and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={appSettings.language} onValueChange={(v) => handleAppSettingChange('language', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={appSettings.timezone} onValueChange={(v) => handleAppSettingChange('timezone', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Label>Date Format</Label>
                    <Select value={appSettings.dateFormat} onValueChange={(v) => handleAppSettingChange('dateFormat', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={appSettings.currency} onValueChange={(v) => handleAppSettingChange('currency', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                <CardDescription>Basic information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={organizationSettings.companyName} onChange={(e) => handleOrgSettingChange('companyName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select value={organizationSettings.industry} onValueChange={(v) => handleOrgSettingChange('industry', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Label>Employee Count</Label>
                    <Select value={organizationSettings.employeeCount} onValueChange={(v) => handleOrgSettingChange('employeeCount', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Label>Fiscal Year Start</Label>
                    <Select value={organizationSettings.fiscalYearStart} onValueChange={(v) => handleOrgSettingChange('fiscalYearStart', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                <CardDescription>Connect with external services and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'emailIntegration', label: 'Email Integration', desc: 'Send notifications and reports via email' },
                    { key: 'calendarSync', label: 'Calendar Sync', desc: 'Sync strategy reviews with your calendar' },
                    { key: 'slackNotifications', label: 'Slack Notifications', desc: 'Send updates to Slack channels' },
                    { key: 'apiAccess', label: 'API Access', desc: 'Allow third-party API access to your data' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{label}</Label>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                      <Switch
                        checked={(integrationSettings as any)[key]}
                        onCheckedChange={(checked) => handleIntegrationChange(key, checked)}
                      />
                    </div>
                  ))}
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
                <CardDescription>Configure data retention, backup, and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Retention (days)</Label>
                    <Input type="number" value={dataSettings.dataRetention} onChange={(e) => handleDataSettingChange('dataRetention', parseInt(e.target.value))} min="30" max="365" />
                    <p className="text-sm text-muted-foreground">How long to keep historical data before automatic cleanup</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Backup</Label>
                      <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
                    </div>
                    <Switch checked={dataSettings.autoBackup} onCheckedChange={(checked) => handleDataSettingChange('autoBackup', checked)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Export Format</Label>
                    <Select value={dataSettings.exportFormat} onValueChange={(v) => handleDataSettingChange('exportFormat', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
                      <p className="text-sm text-muted-foreground">Remove personal identifiers from exported data</p>
                    </div>
                    <Switch checked={dataSettings.anonymizeData} onCheckedChange={(checked) => handleDataSettingChange('anonymizeData', checked)} />
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
                <CardDescription>Advanced configuration options for power users</CardDescription>
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
                    <Label className="text-destructive">Danger Zone</Label>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full text-destructive border-destructive">Export All Data</Button>
                      <Button variant="outline" className="w-full text-destructive border-destructive">Delete Organization</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSaveAll} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
