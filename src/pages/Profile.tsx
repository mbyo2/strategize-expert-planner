
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User, Settings, Camera, Save, Mail, MapPin, Calendar, Briefcase, Phone } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio should be less than 500 characters").optional(),
  linkedIn: z.string().optional(),
  twitter: z.string().optional(),
});

const preferencesSchema = z.object({
  emailNotifications: z.boolean(),
  appNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  marketingEmails: z.boolean(),
  language: z.string(),
  timezone: z.string(),
  dateFormat: z.string(),
  defaultView: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const Profile = () => {
  const { session } = useSimpleAuth();
  const navigate = useNavigate();
  
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const user = session.user;
  
  // Parse name into first and last
  const nameArray = user?.name?.split(' ') || ['', ''];
  const defaultFirstName = nameArray[0] || '';
  const defaultLastName = nameArray.slice(1).join(' ') || '';

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
      email: user?.email || '',
      phone: '+1 (555) 123-4567',
      jobTitle: 'Strategy Director',
      department: 'Corporate Strategy',
      company: 'Intantiko Corporation',
      location: 'San Francisco, CA',
      bio: 'Experienced strategy professional with 10+ years in corporate planning and execution. Passionate about data-driven decision making and organizational transformation.',
      linkedIn: 'linkedin.com/in/johndoe',
      twitter: '@johndoe',
    },
  });

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      emailNotifications: true,
      appNotifications: true,
      weeklyDigest: false,
      marketingEmails: false,
      language: 'english',
      timezone: 'PST',
      dateFormat: 'MM/DD/YYYY',
      defaultView: 'dashboard',
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
    if (avatarPreview) {
      setAvatarDialogOpen(false);
      toast.success("Avatar updated successfully");
    }
  };

  const onProfileSubmit = (data: ProfileFormValues) => {
    console.log('Profile data:', data);
    toast.success("Profile information updated successfully");
  };

  const onPreferencesSubmit = (data: PreferencesFormValues) => {
    console.log('Preferences data:', data);
    toast.success("Preferences updated successfully");
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

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageLayout 
        title="Profile" 
        subtitle="Manage your personal information and preferences"
      >
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="personal" className="flex items-center">
              <User className="h-4 w-4 mr-2" /> Personal
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" /> Contact
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
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={avatarPreview || avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-2xl">{getInitials(user.name || user.email)}</AvatarFallback>
                    </Avatar>
                    
                    <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setAvatarDialogOpen(true)}
                        className="w-full"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
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
                                <AvatarImage src={avatarUrl} alt={user.name} />
                                <AvatarFallback className="text-2xl">{getInitials(user.name || user.email)}</AvatarFallback>
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

                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{user.name || 'User'}</h3>
                      <p className="text-muted-foreground">{user.role?.charAt(0).toUpperCase() + (user.role?.slice(1) || '')}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
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
                            control={profileForm.control}
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
                          control={profileForm.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-2" />
                                Job Title
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
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
                            control={profileForm.control}
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
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                Location
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="City, State/Country" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
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
                          Save Personal Information
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <Label>Social Media</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="linkedIn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="linkedin.com/in/username" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Twitter</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="@username" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Contact Information
                    </Button>
                  </form>
                </Form>
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
                <Form {...preferencesForm}>
                  <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-md font-medium">Notifications</h4>
                      
                      <FormField
                        control={preferencesForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>Email Notifications</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Receive email notifications for updates
                              </p>
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
                        control={preferencesForm.control}
                        name="appNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>App Notifications</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Show notifications within the app
                              </p>
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
                        control={preferencesForm.control}
                        name="weeklyDigest"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>Weekly Digest</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Receive weekly summary emails
                              </p>
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

                    <div className="space-y-4">
                      <h4 className="text-md font-medium">Regional Settings</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={preferencesForm.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Language</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
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
                          control={preferencesForm.control}
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
                                  <SelectItem value="EST">Eastern (EST)</SelectItem>
                                  <SelectItem value="CST">Central (CST)</SelectItem>
                                  <SelectItem value="MST">Mountain (MST)</SelectItem>
                                  <SelectItem value="PST">Pacific (PST)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={preferencesForm.control}
                          name="dateFormat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date Format</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
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

                        <FormField
                          control={preferencesForm.control}
                          name="defaultView"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Default View</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select view" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="dashboard">Dashboard</SelectItem>
                                  <SelectItem value="goals">Goals</SelectItem>
                                  <SelectItem value="planning">Planning</SelectItem>
                                  <SelectItem value="analytics">Analytics</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </div>
  );
};

export default Profile;
