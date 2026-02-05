import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Shield, Camera, Loader2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const Profile = () => {
  const { session } = useSimpleAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  const [localProfile, setLocalProfile] = useState({
    name: '',
    email: '',
    job_title: '',
    department: '',
    company: '',
    bio: '',
    avatar: '',
  });

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    app_notifications: true,
    weekly_digest: false,
  });

  const [security, setSecurity] = useState({
    mfa_enabled: false,
    session_timeout_minutes: 30,
  });

  // Sync local state with database profile
  useEffect(() => {
    if (profile) {
      setLocalProfile({
        name: profile.name || '',
        email: profile.email || '',
        job_title: profile.job_title || '',
        department: profile.department || '',
        company: profile.company || '',
        bio: profile.bio || '',
        avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`,
      });
      setNotifications({
        email_notifications: profile.email_notifications ?? true,
        app_notifications: profile.app_notifications ?? true,
        weekly_digest: profile.weekly_digest ?? false,
      });
      setSecurity({
        mfa_enabled: profile.mfa_enabled ?? false,
        session_timeout_minutes: profile.session_timeout_minutes ?? 30,
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: localProfile.name,
        job_title: localProfile.job_title,
        department: localProfile.department,
        company: localProfile.company,
        bio: localProfile.bio,
      });
      setIsEditing(false);
      toast.success('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateProfile({
        email_notifications: notifications.email_notifications,
        app_notifications: notifications.app_notifications,
        weekly_digest: notifications.weekly_digest,
      });
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      await updateProfile({
        mfa_enabled: security.mfa_enabled,
        session_timeout_minutes: security.session_timeout_minutes,
      });
      toast.success('Security settings saved');
    } catch (error) {
      console.error('Error saving security settings:', error);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: string, value: boolean | number) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <PageLayout 
        title="User Profile"
        subtitle="Manage your account settings and preferences"
        icon={<User className="h-6 w-6" />}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="User Profile"
      subtitle="Manage your account settings and preferences"
      icon={<User className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={localProfile.avatar} alt={localProfile.name} />
                      <AvatarFallback>{localProfile.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                    </Avatar>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{localProfile.name || 'User'}</h2>
                    <p className="text-muted-foreground">{localProfile.job_title || 'No job title set'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{localProfile.department || 'No department'}</Badge>
                      <Badge variant="outline">{session.user?.role || 'User'}</Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    disabled={isUpdating}
                  >
                    {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={localProfile.name}
                      onChange={(e) => setLocalProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={localProfile.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Your work-related details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={localProfile.job_title}
                      onChange={(e) => setLocalProfile(prev => ({ ...prev, job_title: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={localProfile.department}
                      onChange={(e) => setLocalProfile(prev => ({ ...prev, department: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={localProfile.company}
                      onChange={(e) => setLocalProfile(prev => ({ ...prev, company: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={localProfile.bio}
                      onChange={(e) => setLocalProfile(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isUpdating}>
                  {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email_notifications}
                      onCheckedChange={(checked) => handleNotificationChange('email_notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>App Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.app_notifications}
                      onCheckedChange={(checked) => handleNotificationChange('app_notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Get a weekly summary of activities
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weekly_digest}
                      onCheckedChange={(checked) => handleNotificationChange('weekly_digest', checked)}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveNotifications} disabled={isUpdating}>
                    {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Multi-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={security.mfa_enabled}
                      onCheckedChange={(checked) => handleSecurityChange('mfa_enabled', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={security.session_timeout_minutes}
                      onChange={(e) => handleSecurityChange('session_timeout_minutes', parseInt(e.target.value))}
                      min="5"
                      max="480"
                    />
                    <p className="text-sm text-muted-foreground">
                      Automatically log out after this period of inactivity
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <Button onClick={handleSaveSecurity} disabled={isUpdating}>
                    {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Security Settings
                  </Button>
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Activity log will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Profile;
