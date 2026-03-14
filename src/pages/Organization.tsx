import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Users, BarChart3, Settings, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useTeams } from '@/hooks/useTeams';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const OrgSettingsTab = ({ organization }: { organization: any }) => {
  const { refreshOrganization } = useOrganization();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: organization?.name || '',
    industry: (organization?.settings as any)?.industry || organization?.industry || '',
    size: organization?.size || '',
    website: organization?.website || '',
    description: organization?.description || '',
  });

  const handleSave = async () => {
    if (!organization?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: form.name,
          industry: form.industry,
          size: form.size,
          website: form.website,
          description: form.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', organization.id);
      if (error) throw error;
      await refreshOrganization();
      toast.success('Organization settings saved');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!organization) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No organization linked to your account</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
        <CardDescription>Configure your organization preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={form.industry} onValueChange={(v) => setForm(p => ({ ...p, industry: v }))}>
              <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent>
                {['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Services', 'Construction', 'Energy'].map(i => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Company Size</Label>
            <Select value={form.size || ''} onValueChange={(v) => setForm(p => ({ ...p, size: v }))}>
              <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
              <SelectContent>
                {['1-10', '11-50', '51-100', '101-500', '500+'].map(s => (
                  <SelectItem key={s} value={s}>{s} employees</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input value={form.website} onChange={(e) => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of your organization" />
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Organization = () => {
  const { organization, isLoading: orgsLoading } = useOrganization();
  const { teams, isLoading: teamsLoading } = useTeams();

  const isLoading = orgsLoading || teamsLoading;

  // Calculate total members across all teams
  const totalMembers = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0);
  const uniqueMembers = new Set(teams.flatMap(team => team.members?.map(m => m.user_id) || [])).size;

  if (isLoading) {
    return (
      <PageLayout 
        title="Organization Management" 
        subtitle="Manage your organization structure, departments, and hierarchy"
        icon={<Building className="h-6 w-6" />}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Organization Management" 
      subtitle="Manage your organization structure, departments, and hierarchy"
      icon={<Building className="h-6 w-6" />}
    >
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueMembers || totalMembers}</div>
                <p className="text-xs text-muted-foreground">
                  Across {teams.length} team{teams.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teams.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active teams
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organization</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">{organization?.name || 'Not Set'}</div>
                <p className="text-xs text-muted-foreground">
                  {organization?.settings ? (organization.settings as any)?.industry || 'No industry set' : 'No industry set'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Organization Changes</CardTitle>
              <CardDescription>Latest updates to your organization structure</CardDescription>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No organization data yet</p>
                  <p className="text-sm">Create teams to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teams.slice(0, 3).map((team) => (
                    <div key={team.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {team.members?.length || 0} members
                        </p>
                      </div>
                      <Badge variant="outline">{team.team_type}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Organization Structure</CardTitle>
              <CardDescription>Visual representation of your team hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Create teams to see the organization structure</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Organization root */}
                  <div className="flex flex-col items-center">
                    <div className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                      {organization?.name || 'Organization'}
                    </div>
                    <div className="w-0.5 h-6 bg-border" />
                  </div>

                  {/* Teams grid */}
                  <div className="relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-border" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-6">
                      {teams.map((team) => (
                        <div key={team.id} className="relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-border -mt-4" />
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                {team.name}
                                <Badge variant="outline" className="text-xs">{team.team_type}</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>{team.members?.length || 0} members</span>
                              </div>
                              {team.members && team.members.length > 0 && (
                                <div className="flex -space-x-2 mt-2">
                                  {team.members.slice(0, 5).map((m) => (
                                    <div key={m.id} className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium" title={m.name}>
                                      {(m.name || 'U').charAt(0)}
                                    </div>
                                  ))}
                                  {team.members.length > 5 && (
                                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px]">
                                      +{team.members.length - 5}
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Departments</h3>
                <p className="text-sm text-muted-foreground">Manage your organization's departments</p>
              </div>
              <Button>Add Department</Button>
            </div>
            
            {teams.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Teams Yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first team to get started</p>
                  <Button>Create Team</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{team.name}</CardTitle>
                      <CardDescription>
                        {team.members?.length || 0} members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{team.team_type}</Badge>
                        <Button variant="ghost" size="sm">Manage</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <OrgSettingsTab organization={organization} />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Organization;
