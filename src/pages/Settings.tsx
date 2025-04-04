import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Monitor, Mail, Save, Plus, Minus, Moon, Sun, Monitor as Display, Palette, Check, RotateCcw, Loader2 } from 'lucide-react';
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
import { useTheme } from '@/hooks/useTheme';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type ServiceStatus = 'connected' | 'disconnected' | 'connecting' | 'disconnecting';

interface IntegrationService {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: ServiceStatus;
  connectionDate?: string;
}

// Preset color schemes
const colorSchemes = [
  { 
    id: 'default', 
    name: 'Default Blue',
    primaryColor: 'hsl(214, 80%, 51%)',
    accentColor: 'hsl(216, 79%, 67%)',
    colors: {
      primary: 'hsl(214, 80%, 51%)',
      accent: 'hsl(216, 79%, 67%)'
    }
  },
  { 
    id: 'emerald', 
    name: 'Emerald Green',
    primaryColor: 'hsl(160, 84%, 39%)',
    accentColor: 'hsl(160, 84%, 60%)',
    colors: {
      primary: 'hsl(160, 84%, 39%)',
      accent: 'hsl(160, 84%, 60%)'
    }
  },
  { 
    id: 'ruby', 
    name: 'Ruby Red',
    primaryColor: 'hsl(0, 84%, 60%)',
    accentColor: 'hsl(0, 84%, 75%)',
    colors: {
      primary: 'hsl(0, 84%, 60%)',
      accent: 'hsl(0, 84%, 75%)'
    }
  },
  { 
    id: 'amber', 
    name: 'Amber Gold',
    primaryColor: 'hsl(43, 96%, 56%)',
    accentColor: 'hsl(43, 96%, 66%)',
    colors: {
      primary: 'hsl(43, 96%, 56%)',
      accent: 'hsl(43, 96%, 66%)'
    }
  },
  { 
    id: 'violet', 
    name: 'Violet Purple',
    primaryColor: 'hsl(270, 76%, 60%)',
    accentColor: 'hsl(270, 76%, 75%)',
    colors: {
      primary: 'hsl(270, 76%, 60%)',
      accent: 'hsl(270, 76%, 75%)'
    }
  },
  { 
    id: 'slate', 
    name: 'Slate Gray',
    primaryColor: 'hsl(215, 16%, 47%)',
    accentColor: 'hsl(215, 16%, 65%)',
    colors: {
      primary: 'hsl(215, 16%, 47%)',
      accent: 'hsl(215, 16%, 65%)'
    }
  }
];

// Font families
const fontFamilies = [
  { id: 'default', name: 'Default', value: 'system-ui, sans-serif' },
  { id: 'serif', name: 'Serif', value: 'Georgia, serif' },
  { id: 'mono', name: 'Monospace', value: 'monospace' },
  { id: 'rounded', name: 'Rounded', value: '"Nunito", system-ui, sans-serif' }
];

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme, colorScheme, setColorScheme, fontFamily, setFontFamily, borderRadius, setBorderRadius } = useTheme();

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
    theme: theme,
    compactView: false,
    showMetrics: true,
    fontSize: 2,
  });

  const [customColors, setCustomColors] = useState({
    primary: '',
    accent: ''
  });

  const [isCustomColorScheme, setIsCustomColorScheme] = useState(false);
  const [customizing, setCustomizing] = useState(false);

  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [connectedServices, setConnectedServices] = useState<IntegrationService[]>([
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      description: 'Calendar synchronization enabled',
      status: 'connected',
      connectionDate: '2023-09-15T14:30:00Z'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      description: 'Connected for notifications',
      status: 'connected',
      connectionDate: '2023-10-20T09:15:00Z'
    }
  ]);

  const [availableServices, setAvailableServices] = useState<IntegrationService[]>([
    {
      id: 'slack',
      name: 'Slack',
      icon: <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />,
      description: 'Connect for notifications and updates',
      status: 'disconnected'
    },
    {
      id: 'google',
      name: 'Google Workspace',
      icon: <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      description: 'Connect calendar and docs',
      status: 'disconnected'
    },
    {
      id: 'jira',
      name: 'Jira',
      icon: <SettingsIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      description: 'Task management integration',
      status: 'disconnected'
    }
  ]);

  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey, setApiKey] = useState('a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6');

  useEffect(() => {
    setAppearanceSettings(prev => ({
      ...prev,
      theme: theme
    }));
  }, [theme]);

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

  useEffect(() => {
    // Apply font family to body
    if (fontFamily) {
      document.body.style.fontFamily = fontFamilies.find(f => f.id === fontFamily)?.value || 'system-ui, sans-serif';
    }
  }, [fontFamily]);

  useEffect(() => {
    // Update custom colors when color scheme changes
    const scheme = colorSchemes.find(s => s.id === colorScheme);
    if (scheme && !isCustomColorScheme) {
      setCustomColors({
        primary: scheme.primaryColor,
        accent: scheme.accentColor
      });
    }
  }, [colorScheme, isCustomColorScheme]);

  // Update root CSS variables when colors change
  useEffect(() => {
    function hexToRgb(hex: string) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    function hslToRgb(hsl: string) {
      // Extract HSL values
      const hslMatch = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (!hslMatch) return null;

      const h = parseInt(hslMatch[1]) / 360;
      const s = parseInt(hslMatch[2]) / 100;
      const l = parseInt(hslMatch[3]) / 100;

      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }

      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    }

    function extractColorComponents(color: string) {
      // Check if it's a hex color
      if (color.startsWith('#')) {
        return hexToRgb(color);
      }
      // Check if it's an HSL color
      else if (color.startsWith('hsl')) {
        return hslToRgb(color);
      }
      return null;
    }

    // Update color scheme variables
    const root = document.documentElement;
    
    // Apply the current color scheme
    let primaryColor = customColors.primary;
    let accentColor = customColors.accent;
    
    if (!isCustomColorScheme) {
      const scheme = colorSchemes.find(s => s.id === colorScheme);
      if (scheme) {
        primaryColor = scheme.colors.primary;
        accentColor = scheme.colors.accent;
      }
    }
    
    if (primaryColor) {
      const primaryRgb = extractColorComponents(primaryColor);
      if (primaryRgb) {
        root.style.setProperty('--primary', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`);
      }
    }
    
    if (accentColor) {
      const accentRgb = extractColorComponents(accentColor);
      if (accentRgb) {
        root.style.setProperty('--accent', `${accentRgb.r} ${accentRgb.g} ${accentRgb.b}`);
      }
    }
    
    // Apply border radius
    if (borderRadius !== undefined) {
      root.style.setProperty('--radius', `${borderRadius * 0.25}rem`);
    }
    
  }, [customColors, isCustomColorScheme, colorScheme, borderRadius]);
  
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
      setTheme(value);
      description = `Theme switched to ${value} mode.`;
    } else if (key === 'compactView') {
      description = `Compact view ${value ? 'enabled' : 'disabled'}.`;
    } else if (key === 'showMetrics') {
      description = `Metrics display ${value ? 'enabled' : 'disabled'}.`;
    }

    toast({ title, description });
  };

  const handleColorSchemeChange = (schemeId: string) => {
    setColorScheme(schemeId);
    setIsCustomColorScheme(false);
    
    const scheme = colorSchemes.find(s => s.id === schemeId);
    toast({
      title: "Color scheme updated",
      description: `Applied the ${scheme?.name || 'new'} color scheme.`,
    });
  };

  const handleFontFamilyChange = (fontId: string) => {
    setFontFamily(fontId);
    
    const font = fontFamilies.find(f => f.id === fontId);
    toast({
      title: "Font updated",
      description: `Applied the ${font?.name || 'new'} font.`,
    });
  };

  const handleBorderRadiusChange = (value: number[]) => {
    setBorderRadius(value[0]);
  };

  const applyCustomColors = () => {
    setIsCustomColorScheme(true);
    setCustomizing(false);
    
    toast({
      title: "Custom colors applied",
      description: "Your custom color scheme has been applied.",
    });
  };

  const resetToDefaults = () => {
    setTheme('light');
    setColorScheme('default');
    setFontFamily('default');
    setBorderRadius(0.5);
    setIsCustomColorScheme(false);
    
    toast({
      title: "Default theme restored",
      description: "All appearance settings have been reset to defaults.",
    });
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

  const handleDisconnectService = (serviceId: string) => {
    const serviceToDisconnect = connectedServices.find(service => service.id === serviceId);
    if (!serviceToDisconnect) return;
    
    setConnectedServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, status: 'disconnecting' as ServiceStatus } 
          : service
      )
    );
    
    setTimeout(() => {
      setConnectedServices(prev => prev.filter(service => service.id !== serviceId));
      
      setAvailableServices(prev => [
        ...prev,
        { ...serviceToDisconnect, status: 'disconnected' as ServiceStatus }
      ]);
      
      toast({
        title: "Integration removed",
        description: `${serviceToDisconnect.name} has been disconnected.`,
      });
    }, 1500);
  };

  const handleConnectService = (serviceId: string) => {
    const serviceToConnect = availableServices.find(service => service.id === serviceId);
    if (!serviceToConnect) return;
    
    setAvailableServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, status: 'connecting' as ServiceStatus } 
          : service
      )
    );
    
    setTimeout(() => {
      setAvailableServices(prev => prev.filter(service => service.id !== serviceId));
      
      setConnectedServices(prev => [
        ...prev,
        { 
          ...serviceToConnect, 
          status: 'connected' as ServiceStatus,
          connectionDate: new Date().toISOString()
        }
      ]);
      
      toast({
        title: "Integration added",
        description: `${serviceToConnect.name} has been connected successfully.`,
      });
    }, 1500);
  };

  const regenerateApiKey = () => {
    const newKey = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setApiKey(newKey);
    setApiKeyVisible(false);
    
    toast({
      title: "API key regenerated",
      description: "A new API key has been generated. The old key is no longer valid.",
    });
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
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
            <Palette className="h-4 w-4 mr-2" /> Appearance
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
