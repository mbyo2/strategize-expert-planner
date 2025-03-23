import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Monitor, Mail, Save, Plus, Minus, Moon, Sun, Monitor as Display } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Slider } from '@/components/ui/slider';

const Settings = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    jobTitle: 'Strategy Director',
    department: 'Corporate Strategy',
    company: 'Acme Corporation',
    bio: 'Experienced strategy professional with 10+ years in corporate planning and execution.',
    avatarUrl: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    emailGoals: true,
    emailReports: true,
    emailResources: false,
    appMentions: true,
    appTasks: true,
    appDeadlines: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    compactView: false,
    showMetrics: true,
    fontSize: 2, // 1-3 scale
  });

  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (appearanceSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (appearanceSettings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (appearanceSettings.theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [appearanceSettings.theme]);

  useEffect(() => {
    const fontSizeClasses = ['text-sm', 'text-base', 'text-lg'];
    document.body.classList.remove(...fontSizeClasses);
    
    const fontSizeMap = {
      1: 'text-sm',
      2: 'text-base',
      3: 'text-lg'
    };
    
    document.body.classList.add(fontSizeMap[appearanceSettings.fontSize as keyof typeof fontSizeMap]);
  }, [appearanceSettings.fontSize]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));

    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleAppearanceChange = (key: string, value: any) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [key]: value
    }));

    let title = "Appearance settings updated";
    let description = "Your visual preferences have been saved.";
    
    if (key === 'theme') {
      description = `Theme switched to ${value} mode.`;
    } else if (key === 'compactView') {
      description = `Compact view ${value ? 'enabled' : 'disabled'}.`;
    } else if (key === 'showMetrics') {
      description = `Metrics display ${value ? 'enabled' : 'disabled'}.`;
    }

    toast({ title, description });
  };

  const adjustFontSize = (direction: 'increase' | 'decrease') => {
    setAppearanceSettings(prev => {
      const newSize = direction === 'increase' 
        ? Math.min(prev.fontSize + 1, 3)
        : Math.max(prev.fontSize - 1, 1);
      
      toast({
        title: "Font size updated",
        description: `Font size ${direction === 'increase' ? 'increased' : 'decreased'}.`,
      });
      
      return {
        ...prev,
        fontSize: newSize
      };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAvatar = () => {
    setProfileData(prev => ({
      ...prev,
      avatarUrl: avatarPreview
    }));
    setAvatarDialogOpen(false);
    toast({
      title: "Avatar updated",
      description: "Your profile picture has been changed successfully.",
    });
  };

  const handle2FAToggle = (enabled: boolean) => {
    if (enabled && !twoFactorEnabled) {
      setTwoFactorDialogOpen(true);
    } else if (!enabled && twoFactorEnabled) {
      setTwoFactorEnabled(false);
      toast({
        title: "Two-factor authentication disabled",
        description: "Your account is now secured with single-factor authentication only.",
      });
    }
  };

  const confirm2FAActivation = () => {
    setTwoFactorEnabled(true);
    setTwoFactorDialogOpen(false);
    toast({
      title: "Two-factor authentication enabled",
      description: "Your account is now secured with 2FA.",
    });
  };

  const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
        "Password must include uppercase, lowercase, number and special character"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    console.log("Password change values:", values);
    setSecurityDialogOpen(false);
    passwordForm.reset();
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };

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
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatarUrl} alt={`${profileData.firstName} ${profileData.lastName}`} />
                    <AvatarFallback className="text-lg">{profileData.firstName[0]}{profileData.lastName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Change Avatar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Profile Picture</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          {avatarPreview ? (
                            <div className="relative h-32 w-32 rounded-full overflow-hidden">
                              <img 
                                src={avatarPreview} 
                                alt="Avatar Preview" 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <Avatar className="h-32 w-32">
                              <AvatarFallback className="text-2xl">{profileData.firstName[0]}{profileData.lastName[0]}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="avatar-upload">Upload Image</Label>
                          <Input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                          />
                          <p className="text-xs text-muted-foreground">
                            Recommended: Square JPG, PNG. Max 5MB.
                          </p>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAvatarDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveAvatar} disabled={!avatarPreview}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="min-h-[120px]"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle" 
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                  />
                </div>
                
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </form>
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
                    <Switch 
                      id="email-updates" 
                      checked={notificationSettings.emailUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('emailUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="email-goals" className="font-medium">Goal Progress</Label>
                      <p className="text-sm text-muted-foreground">Notifications about goal status changes</p>
                    </div>
                    <Switch 
                      id="email-goals" 
                      checked={notificationSettings.emailGoals}
                      onCheckedChange={(checked) => handleNotificationChange('emailGoals', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="email-reports" className="font-medium">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                    </div>
                    <Switch 
                      id="email-reports" 
                      checked={notificationSettings.emailReports}
                      onCheckedChange={(checked) => handleNotificationChange('emailReports', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="email-resources" className="font-medium">New Resources</Label>
                      <p className="text-sm text-muted-foreground">Notifications about new strategic resources</p>
                    </div>
                    <Switch 
                      id="email-resources" 
                      checked={notificationSettings.emailResources}
                      onCheckedChange={(checked) => handleNotificationChange('emailResources', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="app-mentions" className="font-medium">Mentions & Comments</Label>
                      <p className="text-sm text-muted-foreground">Notifications when you're mentioned or receive comments</p>
                    </div>
                    <Switch 
                      id="app-mentions" 
                      checked={notificationSettings.appMentions}
                      onCheckedChange={(checked) => handleNotificationChange('appMentions', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="app-tasks" className="font-medium">Task Assignments</Label>
                      <p className="text-sm text-muted-foreground">Notifications for new task assignments</p>
                    </div>
                    <Switch 
                      id="app-tasks" 
                      checked={notificationSettings.appTasks}
                      onCheckedChange={(checked) => handleNotificationChange('appTasks', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="app-deadlines" className="font-medium">Upcoming Deadlines</Label>
                      <p className="text-sm text-muted-foreground">Reminders about approaching deadlines</p>
                    </div>
                    <Switch 
                      id="app-deadlines" 
                      checked={notificationSettings.appDeadlines}
                      onCheckedChange={(checked) => handleNotificationChange('appDeadlines', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Delivery</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <Label className="font-medium">Delivery Frequency</Label>
                    </div>
                    
                    <RadioGroup defaultValue="instant" className="pt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="instant" id="instant" />
                        <Label htmlFor="instant">Instant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily-digest" id="daily-digest" />
                        <Label htmlFor="daily-digest">Daily Digest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly-digest" id="weekly-digest" />
                        <Label htmlFor="weekly-digest">Weekly Digest</Label>
                      </div>
                    </RadioGroup>
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
                  
                  <Dialog open={securityDialogOpen} onOpenChange={setSecurityDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Change Password</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                      </DialogHeader>
                      
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="twoFactor" className="font-medium">Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Enhance your account security with 2FA</p>
                    </div>
                    <Switch id="twoFactor" 
                      checked={twoFactorEnabled}
                      onCheckedChange={handle2FAToggle}
                    />
                  </div>
                  
                  <Dialog open={twoFactorDialogOpen} onOpenChange={setTwoFactorDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-2">
                        <div className="flex justify-center py-4">
                          <div className="border p-3 rounded-md bg-gray-50 dark:bg-gray-900">
                            {/* Placeholder for QR code - in a real app this would be a dynamic QR code */}
                            <div className="w-48 h-48 grid grid-cols-8 grid-rows-8 gap-0.5">
                              {Array.from({ length: 64 }).map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`${Math.random() > 0.5 ? 'bg-black dark:bg-white' : 'bg-white dark:bg-black'}`}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="verification-code">Verification Code</Label>
                          <Input 
                            id="verification-code" 
                            placeholder="Enter 6-digit code"
                            className="font-mono"
                          />
                          <p className="text-sm text-muted-foreground">
                            Scan the QR code with your authenticator app, then enter the verification code.
                          </p>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setTwoFactorDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={confirm2FAActivation}>
                          Verify and Enable
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline"
                    disabled={!twoFactorEnabled}
                    onClick={() => {
                      toast({
                        title: "2FA Settings",
                        description: "Manage your two-factor authentication methods and settings.",
                      });
                    }}
                  >
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-fit"
                          onClick={() => {
                            toast({
                              title: "Session terminated",
                              description: "You've been signed out from iPhone 13 Pro",
                            });
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      toast({
                        title: "All sessions terminated",
                        description: "You've been signed out from all other devices",
                      });
                    }}
                  >
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
                    <div 
                      className={`border ${appearanceSettings.theme === 'light' ? 'border-primary' : 'border-muted'} rounded-md p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-accent/10`}
                      onClick={() => handleAppearanceChange('theme', 'light')}
                    >
                      <div className="w-full h-24 bg-white dark:bg-gray-200 rounded-md mb-3 border border-gray-200 flex items-center justify-center">
                        <Sun className="h-8 w-8 text-orange-400" />
                      </div>
                      <span className="font-medium">Light</span>
                    </div>
                    
                    <div 
                      className={`border ${appearanceSettings.theme === 'dark' ? 'border-primary' : 'border-muted'} rounded-md p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-accent/10`}
                      onClick={() => handleAppearanceChange('theme', 'dark')}
                    >
                      <div className="w-full h-24 bg-gray-900 rounded-md mb-3 border border-gray-700 flex items-center justify-center">
                        <Moon className="h-8 w-8 text-indigo-300" />
                      </div>
                      <span className="font-medium">Dark</span>
                    </div>
                    
                    <div 
                      className={`border ${appearanceSettings.theme === 'system' ? 'border-primary' : 'border-muted'} rounded-md p-4 flex flex-col items-center cursor-pointer transition-all hover:bg-accent/10`}
                      onClick={() => handleAppearanceChange('theme', 'system')}
                    >
                      <div className="w-full h-24 bg-gradient-to-b from-white to-gray-900 rounded-md mb-3 border border-gray-300 flex items-center justify-center">
                        <Display className="h-8 w-8 text-blue-500" />
                      </div>
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
                    <Switch 
                      id="compactView" 
                      checked={appearanceSettings.compactView}
                      onCheckedChange={(checked) => handleAppearanceChange('compactView', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="showMetrics" className="font-medium">Show Key Metrics</Label>
                      <p className="text-sm text-muted-foreground">Display performance metrics at the top of dashboard</p>
                    </div>
                    <Switch 
                      id="showMetrics" 
                      checked={appearanceSettings.showMetrics}
                      onCheckedChange={(checked) => handleAppearanceChange('showMetrics', checked)}
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">Font Size</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="outline" 
                        className="py-1 px-2 h-auto text-sm"
                        onClick={() => adjustFontSize('decrease')}
                        disabled={appearanceSettings.fontSize <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="flex-grow">
                        <Slider 
                          value={[appearanceSettings.fontSize]} 
                          min={1} 
                          max={3} 
                          step={1}
                          onValueChange={(value) => handleAppearanceChange('fontSize', value[0])}
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        className="py-1 px-2 h-auto text-sm"
                        onClick={() => adjustFontSize('increase')}
                        disabled={appearanceSettings.fontSize >= 3}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="font-medium text-center">
                      {appearanceSettings.fontSize === 1 && "Small"}
                      {appearanceSettings.fontSize === 2 && "Medium"}
                      {appearanceSettings.fontSize === 3 && "Large"}
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <p className={`
                        ${appearanceSettings.fontSize === 1 ? 'text-sm' : ''}
                        ${appearanceSettings.fontSize === 2 ? 'text-base' : ''}
                        ${appearanceSettings.fontSize === 3 ? 'text-lg' : ''}
                      `}>
                        This is a preview of your selected font size. Adjust until comfortable.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">Dashboard Widgets</h3>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Select which widgets to display on your dashboard</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="widget-goals" defaultChecked />
                        <Label htmlFor="widget-goals">Goals Progress</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="widget-analytics" defaultChecked />
                        <Label htmlFor="widget-analytics">Analytics</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="widget-calendar" defaultChecked />
                        <Label htmlFor="widget-calendar">Calendar</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="widget-notifications" defaultChecked />
                        <Label htmlFor="widget-notifications">Recent Notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="widget-tasks" defaultChecked />
                        <Label htmlFor="widget-tasks">Active Tasks</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="widget-resources" defaultChecked />
                        <Label htmlFor="widget-resources">Resource Allocation</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    toast({
                      title: "Appearance settings saved",
                      description: "Your visual preferences have been updated.",
                    });
                  }}
                >
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Integration removed",
                            description: "Microsoft Outlook has been disconnected.",
                          });
                        }}
                      >
                        Disconnect
                      </Button>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Integration removed",
                            description: "Microsoft Teams has been disconnected.",
                          });
                        }}
                      >
                        Disconnect
                      </Button>
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
                      <Button 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Integration added",
                            description: "Slack has been connected successfully.",
                          });
                        }}
                      >
                        Connect
                      </Button>
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
                      <Button 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Integration added",
                            description: "Google Workspace has been connected successfully.",
                          });
                        }}
                      >
                        Connect
                      </Button>
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
                      <Button 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Integration added",
                            description: "Jira has been connected successfully.",
                          });
                        }}
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t space-y-4">
                  <h3 className="text-lg font-medium">API Access</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly className="flex-grow font-mono" />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "API key copied",
                            description: "The API key has been copied to your clipboard.",
                          });
                        }}
                      >
                        Copy
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "API key regenerated",
                            description: "A new API key has been generated. The old key is no longer valid.",
                          });
                        }}
                      >
                        Regenerate
                      </Button>
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
