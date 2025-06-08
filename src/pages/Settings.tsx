
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Settings as SettingsIcon, User, Building, Shield, Bell, Palette, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import PageLayout from '@/components/PageLayout';
import Header from '@/components/Header';

const userSettingsSchema = z.object({
  email_notifications: z.boolean(),
  app_notifications: z.boolean(),
  weekly_digest: z.boolean(),
  language: z.string(),
  timezone: z.string(),
  theme: z.string(),
  date_format: z.string(),
});

const organizationSettingsSchema = z.object({
  organization_name: z.string().min(1, "Organization name is required"),
  domain: z.string().optional(),
  sso_enabled: z.boolean(),
  enforce_mfa: z.boolean(),
  session_timeout: z.number().min(5).max(480),
  allowed_domains: z.string().optional(),
  ip_restrictions: z.string().optional(),
});

const securitySettingsSchema = z.object({
  mfa_enabled: z.boolean(),
  require_mfa_for_admin: z.boolean(),
  password_policy: z.string(),
  session_timeout_minutes: z.number().min(5).max(480),
  login_attempts: z.number().min(3).max(10),
});

type UserSettingsFormValues = z.infer<typeof userSettingsSchema>;
type OrganizationSettingsFormValues = z.infer<typeof organizationSettingsSchema>;
type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>;

const Settings = () => {
  const { session, hasRole } = useSimpleAuth();
  const [activeTab, setActiveTab] = useState('user');

  const userForm = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      email_notifications: true,
      app_notifications: true,
      weekly_digest: false,
      language: 'english',
      timezone: 'UTC',
      theme: 'light',
      date_format: 'MM/DD/YYYY',
    },
  });

  const organizationForm = useForm<OrganizationSettingsFormValues>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: {
      organization_name: 'Intantiko Corporation',
      domain: 'intantiko.com',
      sso_enabled: false,
      enforce_mfa: false,
      session_timeout: 60,
      allowed_domains: '',
      ip_restrictions: '',
    },
  });

  const securityForm = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      mfa_enabled: false,
      require_mfa_for_admin: true,
      password_policy: 'medium',
      session_timeout_minutes: 30,
      login_attempts: 5,
    },
  });

  const onUserSettingsSubmit = async (data: UserSettingsFormValues) => {
    try {
      // Here you would typically save to your backend
      console.log('User settings:', data);
      toast.success("User settings updated successfully");
    } catch (error) {
      toast.error("Failed to update user settings");
      console.error('Error updating user settings:', error);
    }
  };

  const onOrganizationSettingsSubmit = async (data: OrganizationSettingsFormValues) => {
    try {
      // Here you would typically save to your backend
      console.log('Organization settings:', data);
      toast.success("Organization settings updated successfully");
    } catch (error) {
      toast.error("Failed to update organization settings");
      console.error('Error updating organization settings:', error);
    }
  };

  const onSecuritySettingsSubmit = async (data: SecuritySettingsFormValues) => {
    try {
      // Here you would typically save to your backend
      console.log('Security settings:', data);
      toast.success("Security settings updated successfully");
    } catch (error) {
      toast.error("Failed to update security settings");
      console.error('Error updating security settings:', error);
    }
  };

  const isAdmin = hasRole('admin');
  const isManager = hasRole('manager');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageLayout 
        title="Settings" 
        subtitle="Manage your account preferences and organization settings"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="user" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              User
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            {(isManager || isAdmin) && (
              <TabsTrigger value="organization" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Organization
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  User Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...userForm}>
                  <form onSubmit={userForm.handleSubmit(onUserSettingsSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={userForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                                <SelectItem value="german">German</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="UTC">UTC</SelectItem>
                                <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                                <SelectItem value="CST">Central Time (CST)</SelectItem>
                                <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                                <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={userForm.control}
                        name="date_format"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Format</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select date format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full md:w-auto">
                      Save User Preferences
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...userForm}>
                  <form onSubmit={userForm.handleSubmit(onUserSettingsSubmit)} className="space-y-6">
                    <FormField
                      control={userForm.control}
                      name="email_notifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive email notifications for important updates
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={userForm.control}
                      name="app_notifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>App Notifications</FormLabel>
                            <FormDescription>
                              Show notifications within the application
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={userForm.control}
                      name="weekly_digest"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Weekly Digest</FormLabel>
                            <FormDescription>
                              Receive a weekly summary of your strategic activities
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full md:w-auto">
                      Save Notification Settings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {(isManager || isAdmin) && (
            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Organization Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...organizationForm}>
                    <form onSubmit={organizationForm.handleSubmit(onOrganizationSettingsSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={organizationForm.control}
                          name="organization_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organization Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={organizationForm.control}
                          name="domain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Domain</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="company.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <FormField
                          control={organizationForm.control}
                          name="sso_enabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Single Sign-On (SSO)</FormLabel>
                                <FormDescription>
                                  Enable SSO authentication for your organization
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={organizationForm.control}
                          name="enforce_mfa"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Enforce Multi-Factor Authentication</FormLabel>
                                <FormDescription>
                                  Require MFA for all organization members
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full md:w-auto">
                        Save Organization Settings
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...securityForm}>
                    <form onSubmit={securityForm.handleSubmit(onSecuritySettingsSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={securityForm.control}
                          name="mfa_enabled"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Multi-Factor Authentication</FormLabel>
                                <FormDescription>
                                  Enable MFA for your account
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={securityForm.control}
                          name="require_mfa_for_admin"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Require MFA for Admin Actions</FormLabel>
                                <FormDescription>
                                  Require MFA verification for administrative actions
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={securityForm.control}
                          name="password_policy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password Policy</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select policy" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                                  <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                                  <SelectItem value="strong">Strong (12+ chars, symbols)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={securityForm.control}
                          name="session_timeout_minutes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Session Timeout (minutes)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={5} 
                                  max={480} 
                                  {...field} 
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full md:w-auto">
                        Save Security Settings
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </PageLayout>
    </div>
  );
};

export default Settings;
