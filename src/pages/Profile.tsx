import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User, Settings, Camera, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().max(500, "Bio should be less than 500 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // Parse name into first and last
  const nameArray = user?.name?.split(' ') || ['', ''];
  const defaultFirstName = nameArray[0] || '';
  const defaultLastName = nameArray.slice(1).join(' ') || '';

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
      email: user?.email || '',
      jobTitle: 'Strategy Director',
      department: 'Corporate Strategy',
      company: 'Acme Corporation',
      bio: 'Experienced strategy professional with 10+ years in corporate planning and execution.',
    },
  });

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
    // In a real app, you would upload this to a server
    if (avatarPreview && updateProfile) {
      updateProfile({ avatar: avatarPreview });
      setAvatarDialogOpen(false);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been changed successfully.",
      });
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    if (updateProfile) {
      // Combine first name and last name
      const name = `${data.firstName} ${data.lastName}`.trim();
      
      updateProfile({
        name,
        email: data.email,
        jobTitle: data.jobTitle,
        department: data.department,
        company: data.company,
        bio: data.bio,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <PageLayout 
      title="Profile" 
      subtitle="Manage your personal information and preferences"
    >
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid grid-cols-2 max-w-md">
          <TabsTrigger value="personal" className="flex items-center">
            <User className="h-4 w-4 mr-2" /> Personal Information
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" /> Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  
                  <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAvatarDialogOpen(true)}
                    >
                      Change Avatar
                    </Button>
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
                              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
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
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                className="min-h-[120px]"
                                placeholder="Tell us about yourself"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                User Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserPreferences />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

// Separate component for preferences to keep the main component cleaner
const UserPreferences = () => {
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    appNotifications: true,
    weeklyDigest: false,
    language: 'english',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));

    toast({
      title: "Preference updated",
      description: `Your ${key} preference has been updated.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications" className="flex-grow">Email Notifications</Label>
            <div className="flex items-center h-5">
              <input
                id="emailNotifications"
                aria-describedby="emailNotifications-description"
                name="emailNotifications"
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="appNotifications" className="flex-grow">App Notifications</Label>
            <div className="flex items-center h-5">
              <input
                id="appNotifications"
                aria-describedby="appNotifications-description"
                name="appNotifications"
                type="checkbox"
                checked={preferences.appNotifications}
                onChange={(e) => handlePreferenceChange('appNotifications', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="weeklyDigest" className="flex-grow">Weekly Digest</Label>
            <div className="flex items-center h-5">
              <input
                id="weeklyDigest"
                aria-describedby="weeklyDigest-description"
                name="weeklyDigest"
                type="checkbox"
                checked={preferences.weeklyDigest}
                onChange={(e) => handlePreferenceChange('weeklyDigest', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Regional Settings</h3>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              name="language"
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="chinese">Chinese</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              name="timezone"
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Standard Time (EST)</option>
              <option value="CST">Central Standard Time (CST)</option>
              <option value="MST">Mountain Standard Time (MST)</option>
              <option value="PST">Pacific Standard Time (PST)</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="dateFormat">Date Format</Label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={preferences.dateFormat}
              onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      <Button 
        type="button"
        onClick={() => {
          toast({
            title: "Preferences saved",
            description: "Your preferences have been updated successfully.",
          });
        }}
      >
        <Save className="h-4 w-4 mr-2" />
        Save Preferences
      </Button>
    </div>
  );
};

export default Profile;
