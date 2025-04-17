
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { withAuth } from '@/hooks/useAuth';
import { useOrganizations } from '@/hooks/useOrganizations';
import { Organization, OrganizationSettings, TeamMember } from '@/types/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Users,
  Settings,
  Shield,
  GanttChart,
  Plus,
  Trash2,
  Edit,
  Mail,
  Globe,
  FileText,
  Briefcase,
  AlertTriangle,
  Clock,
  Server,
  Activity
} from 'lucide-react';

const OrganizationManagement = () => {
  const {
    currentOrganization,
    updateOrganization,
    updateOrganizationSettings,
    getOrganizationMembers,
    inviteUserToOrganization
  } = useOrganizations();
  const [activeTab, setActiveTab] = useState('general');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [generalInfo, setGeneralInfo] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    size: ''
  });
  const [settings, setSettings] = useState<Partial<OrganizationSettings>>({});

  useEffect(() => {
    if (currentOrganization) {
      setGeneralInfo({
        name: currentOrganization.name || '',
        description: currentOrganization.description || '',
        website: currentOrganization.website || '',
        industry: currentOrganization.industry || '',
        size: currentOrganization.size || ''
      });
      setSettings(currentOrganization.settings);
      
      fetchMembers();
    }
  }, [currentOrganization]);

  const fetchMembers = async () => {
    if (!currentOrganization) return;
    
    setLoading(true);
    try {
      const orgMembers = await getOrganizationMembers(currentOrganization.id);
      setMembers(orgMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneralInfoChange = (field: string, value: string) => {
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const saveGeneralInfo = async () => {
    if (!currentOrganization) return;
    
    await updateOrganization(currentOrganization.id, generalInfo);
  };

  const saveSettings = async () => {
    if (!currentOrganization) return;
    
    await updateOrganizationSettings(currentOrganization.id, settings);
  };

  const handleInviteUser = async () => {
    if (!currentOrganization || !inviteEmail) return;
    
    await inviteUserToOrganization(currentOrganization.id, inviteEmail, inviteRole as any);
    setInviteEmail('');
    setInviteRole('viewer');
    setInviteDialogOpen(false);
    fetchMembers();
  };

  if (!currentOrganization) {
    return (
      <PageLayout title="Organization Management">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-4">No Organization Found</h2>
          <p className="text-muted-foreground mb-6">You need to create or join an organization to manage it.</p>
          <Button>Create Organization</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`Organization: ${currentOrganization.name}`}>
      <div className="container mx-auto py-6 space-y-8">
        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Members</span>
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <GanttChart className="h-4 w-4" />
                <span className="hidden sm:inline">Teams</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Update your organization's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      value={generalInfo.name}
                      onChange={(e) => handleGeneralInfoChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="org-description">Description</Label>
                    <Textarea
                      id="org-description"
                      rows={4}
                      value={generalInfo.description}
                      onChange={(e) => handleGeneralInfoChange('description', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="org-website">Website</Label>
                    <div className="flex">
                      <Globe className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                      <Input
                        id="org-website"
                        value={generalInfo.website}
                        onChange={(e) => handleGeneralInfoChange('website', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="org-industry">Industry</Label>
                      <div className="flex">
                        <Briefcase className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                        <Select
                          value={generalInfo.industry}
                          onValueChange={(value) => handleGeneralInfoChange('industry', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="org-size">Company Size</Label>
                      <div className="flex">
                        <Users className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                        <Select
                          value={generalInfo.size}
                          onValueChange={(value) => handleGeneralInfoChange('size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                            <SelectItem value="1000+">1000+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={saveGeneralInfo}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Organization Members</CardTitle>
                  <CardDescription>
                    Manage members of your organization
                  </CardDescription>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Invite Member</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex">
                          <Mail className="h-4 w-4 mr-2 mt-3 text-muted-foreground" />
                          <Input
                            id="email"
                            placeholder="colleague@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={inviteRole}
                          onValueChange={setInviteRole}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleInviteUser}>Invite</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-6">
                    <div className="loader">Loading...</div>
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">No members found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 py-2 px-4 font-medium text-sm text-muted-foreground">
                      <div className="col-span-5">User</div>
                      <div className="col-span-3">Role</div>
                      <div className="col-span-3">Department</div>
                      <div className="col-span-1">Actions</div>
                    </div>
                    
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="grid grid-cols-12 py-3 px-4 items-center border rounded-md"
                      >
                        <div className="col-span-5 flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {member.email}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <Badge variant={member.role === 'admin' ? 'destructive' : 
                                         member.role === 'manager' ? 'default' : 
                                         'secondary'}>
                            {member.role}
                          </Badge>
                        </div>
                        <div className="col-span-3 text-sm">
                          {member.department || 'Not specified'}
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Structure</CardTitle>
                  <CardDescription>
                    Manage your organization's team hierarchy
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Team</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      <GanttChart className="h-4 w-4 mr-2" />
                      Team Hierarchy View
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create and manage teams to organize your company structure
                    </p>
                    {/* Team hierarchy would go here */}
                    <div className="py-4 flex justify-center">
                      <div className="text-center p-6 border rounded-md w-full max-w-lg">
                        <GanttChart className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="text-lg font-medium mt-4">Team Structure</h3>
                        <p className="text-sm text-muted-foreground mt-2 mb-4">
                          Create nested teams to reflect your organization's structure
                        </p>
                        <Button>Create Your First Team</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance</CardTitle>
                <CardDescription>
                  Enterprise-level security settings for your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      Authentication & Access
                    </h3>
                    
                    <div className="space-y-6 pl-7">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Single Sign-On (SSO)</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow users to sign in with your identity provider
                          </p>
                        </div>
                        <Switch
                          checked={settings.sso_enabled}
                          onCheckedChange={(checked) => 
                            handleSettingsChange('sso_enabled', checked)
                          }
                        />
                      </div>
                      
                      {settings.sso_enabled && (
                        <div className="space-y-4 border-l-2 pl-4">
                          <div className="grid gap-2">
                            <Label htmlFor="sso-provider">SSO Provider</Label>
                            <Select
                              value={settings.sso_provider}
                              onValueChange={(value) => 
                                handleSettingsChange('sso_provider', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="saml">SAML</SelectItem>
                                <SelectItem value="oidc">OpenID Connect</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="sso-domain">Domain Restriction</Label>
                            <Input
                              id="sso-domain"
                              placeholder="company.com"
                              value={settings.sso_domain || ''}
                              onChange={(e) => 
                                handleSettingsChange('sso_domain', e.target.value)
                              }
                            />
                            <p className="text-xs text-muted-foreground">
                              Only users with email addresses from this domain can sign in
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Enforce Multi-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Require all users to set up MFA for their accounts
                          </p>
                        </div>
                        <Switch
                          checked={settings.enforce_mfa}
                          onCheckedChange={(checked) => 
                            handleSettingsChange('enforce_mfa', checked)
                          }
                        />
                      </div>
                      
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">IP Restrictions</Label>
                          <p className="text-sm text-muted-foreground">
                            Restrict access to specific IP addresses or ranges
                          </p>
                        </div>
                        <Switch
                          checked={settings.ip_restrictions_enabled}
                          onCheckedChange={(checked) => 
                            handleSettingsChange('ip_restrictions_enabled', checked)
                          }
                        />
                      </div>
                      
                      {settings.ip_restrictions_enabled && (
                        <div className="grid gap-2 border-l-2 pl-4">
                          <Label htmlFor="ip-ranges">Allowed IP Ranges</Label>
                          <Textarea
                            id="ip-ranges"
                            placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                            value={(settings.allowed_ip_ranges || []).join('\n')}
                            onChange={(e) => 
                              handleSettingsChange('allowed_ip_ranges', 
                                e.target.value.split('\n').filter(Boolean)
                              )
                            }
                            rows={3}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter one IP address or CIDR range per line
                          </p>
                        </div>
                      )}
                      
                      <div className="grid gap-2">
                        <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                        <Input
                          id="session-timeout"
                          type="number"
                          min={5}
                          max={1440}
                          value={settings.session_duration_minutes || 60}
                          onChange={(e) => 
                            handleSettingsChange('session_duration_minutes', 
                              parseInt(e.target.value) || 60
                            )
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          How long until inactive users are automatically logged out
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Compliance
                    </h3>
                    
                    <div className="space-y-6 pl-7">
                      <div className="grid gap-2">
                        <Label htmlFor="compliance-mode">Compliance Mode</Label>
                        <Select
                          value={settings.compliance_mode}
                          onValueChange={(value) => 
                            handleSettingsChange('compliance_mode', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select compliance mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="hipaa">HIPAA</SelectItem>
                            <SelectItem value="gdpr">GDPR</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Enables specific compliance features for regulatory requirements
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                        <Input
                          id="data-retention"
                          type="number"
                          min={1}
                          value={settings.data_retention_days || 90}
                          onChange={(e) => 
                            handleSettingsChange('data_retention_days', 
                              parseInt(e.target.value) || 90
                            )
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          How long to retain audit logs and other compliance data
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Server className="h-5 w-5 text-green-500" />
                      API & Integrations
                    </h3>
                    
                    <div className="space-y-6 pl-7">
                      <div className="grid gap-2">
                        <Label htmlFor="rate-limit">API Rate Limit (requests per minute)</Label>
                        <Input
                          id="rate-limit"
                          type="number"
                          min={10}
                          max={10000}
                          value={settings.api_rate_limit_per_minute || 100}
                          onChange={(e) => 
                            handleSettingsChange('api_rate_limit_per_minute', 
                              parseInt(e.target.value) || 100
                            )
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum number of API requests allowed per minute
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="webhooks">Webhook URLs</Label>
                        <Textarea
                          id="webhooks"
                          placeholder="https://example.com/webhook&#10;https://api.company.com/events"
                          value={(settings.webhook_urls || []).join('\n')}
                          onChange={(e) => 
                            handleSettingsChange('webhook_urls', 
                              e.target.value.split('\n').filter(Boolean)
                            )
                          }
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter one webhook URL per line for event notifications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-8">
                  <Button onClick={saveSettings}>
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default withAuth(['admin', 'manager'])(OrganizationManagement);
