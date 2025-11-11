import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Organization, OrganizationSettings, Team, TeamMember, UserRole } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface OrganizationsContextType {
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  createOrganization: (organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateOrganization: (id: string, updates: Partial<Organization>) => Promise<void>;
  deleteOrganization: (id: string) => Promise<void>;
  switchOrganization: (id: string) => Promise<void>;
  updateOrganizationSettings: (id: string, settings: Partial<OrganizationSettings>) => Promise<void>;
  getOrganizationMembers: (id: string) => Promise<TeamMember[]>;
  inviteUserToOrganization: (organizationId: string, email: string, role: UserRole) => Promise<void>;
  getOrganizationTeamHierarchy: (id: string) => Promise<Team[]>;
}

const defaultOrganizationSettings: OrganizationSettings = {
  sso_enabled: false,
  default_user_role: 'viewer',
  enforce_mfa: false,
  session_duration_minutes: 60,
  ip_restrictions_enabled: false,
  compliance_mode: 'standard',
  data_retention_days: 90,
  api_rate_limit_per_minute: 100
};

const OrganizationsContext = createContext<OrganizationsContextType | undefined>(undefined);

export const OrganizationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { session } = useSimpleAuth();
  const user = session?.user || null;

  useEffect(() => {
    if (user) {
      fetchOrganizations();
    } else {
      setOrganizations([]);
      setCurrentOrganization(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      
      const { data: teamMemberships, error: teamError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user?.id);
      
      if (teamError) throw teamError;
      
      if (teamMemberships && teamMemberships.length > 0) {
        const teamIds = teamMemberships.map(tm => tm.team_id);
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select('organization_id')
          .in('id', teamIds);
        
        if (teamsError) throw teamsError;
        
        if (teams && teams.length > 0) {
          const orgIds = [...new Set(teams.map(t => t.organization_id))];
          const { data: orgs, error: orgsError } = await supabase
            .from('organizations')
            .select('*')
            .in('id', orgIds);
          
          if (orgsError) throw orgsError;
          
          const processedOrgs: Organization[] = (orgs || []).map(org => ({
            ...org,
            settings: processSettings(org.settings)
          }));
          
          setOrganizations(processedOrgs);
          
          if (processedOrgs.length > 0) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('organization_id')
              .eq('id', user?.id)
              .single();
            
            if (profile && profile.organization_id) {
              const primaryOrg = processedOrgs.find(org => org.id === profile.organization_id);
              if (primaryOrg) {
                setCurrentOrganization(primaryOrg);
              } else {
                setCurrentOrganization(processedOrgs[0]);
              }
            } else {
              setCurrentOrganization(processedOrgs[0]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        variant: "destructive",
        title: "Failed to load organizations",
        description: "There was an error loading your organizations.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processSettings = (settings: Json): OrganizationSettings => {
    if (!settings) return defaultOrganizationSettings;
    
    const settingsObj = typeof settings === 'string' 
      ? JSON.parse(settings) 
      : settings;
      
    return {
      sso_enabled: settingsObj.sso_enabled ?? defaultOrganizationSettings.sso_enabled,
      sso_provider: settingsObj.sso_provider ?? defaultOrganizationSettings.sso_provider,
      sso_domain: settingsObj.sso_domain ?? defaultOrganizationSettings.sso_domain,
      sso_config: settingsObj.sso_config ?? defaultOrganizationSettings.sso_config,
      default_user_role: settingsObj.default_user_role ?? defaultOrganizationSettings.default_user_role,
      allowed_email_domains: settingsObj.allowed_email_domains ?? defaultOrganizationSettings.allowed_email_domains,
      enforce_mfa: settingsObj.enforce_mfa ?? defaultOrganizationSettings.enforce_mfa,
      session_duration_minutes: settingsObj.session_duration_minutes ?? defaultOrganizationSettings.session_duration_minutes,
      ip_restrictions_enabled: settingsObj.ip_restrictions_enabled ?? defaultOrganizationSettings.ip_restrictions_enabled,
      allowed_ip_ranges: settingsObj.allowed_ip_ranges ?? defaultOrganizationSettings.allowed_ip_ranges,
      compliance_mode: settingsObj.compliance_mode ?? defaultOrganizationSettings.compliance_mode,
      data_retention_days: settingsObj.data_retention_days ?? defaultOrganizationSettings.data_retention_days,
      api_rate_limit_per_minute: settingsObj.api_rate_limit_per_minute ?? defaultOrganizationSettings.api_rate_limit_per_minute,
      webhook_urls: settingsObj.webhook_urls ?? defaultOrganizationSettings.webhook_urls,
      default_timezone: settingsObj.default_timezone ?? defaultOrganizationSettings.default_timezone,
      default_language: settingsObj.default_language ?? defaultOrganizationSettings.default_language
    };
  };

  const createOrganization = async (organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const settings = organization.settings || defaultOrganizationSettings;
      
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organization.name,
          description: organization.description,
          logo_url: organization.logo_url,
          website: organization.website,
          industry: organization.industry,
          size: organization.size,
          settings: settings as any
        })
        .select()
        .single();
      
      if (orgError) throw orgError;
      
      if (orgData) {
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .insert({
            name: 'Default Team',
            description: 'Default team for organization',
            organization_id: orgData.id,
            team_type: 'department'
          })
          .select()
          .single();
        
        if (teamError) throw teamError;
        
        if (teamData) {
          await supabase
            .from('team_members')
            .insert({
              team_id: teamData.id,
              user_id: user?.id,
              role: 'admin',
              department: 'Management'
            });
          
          await supabase
            .from('profiles')
            .update({
              organization_id: orgData.id,
              primary_team_id: teamData.id
            })
            .eq('id', user?.id);
        }
        
        await fetchOrganizations();
        
        toast({
          title: "Organization created",
          description: `${organization.name} has been created successfully.`,
        });
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        variant: "destructive",
        title: "Failed to create organization",
        description: "There was an error creating the organization.",
      });
      throw error;
    }
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          ...(updates as Record<string, any>),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => org.id === id ? { ...org, ...updates, updated_at: new Date().toISOString() } : org)
      );
      
      if (currentOrganization && currentOrganization.id === id) {
        setCurrentOrganization(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : prev);
      }
      
      toast({
        title: "Organization updated",
        description: "Organization has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        variant: "destructive",
        title: "Failed to update organization",
        description: "There was an error updating the organization.",
      });
      throw error;
    }
  };

  const deleteOrganization = async (id: string) => {
    try {
      const isAdmin = user?.role === 'admin';
      
      if (!isAdmin) {
        throw new Error('You do not have permission to delete this organization');
      }
      
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setOrganizations(prevOrgs => prevOrgs.filter(org => org.id !== id));
      
      if (currentOrganization && currentOrganization.id === id) {
        const nextOrg = organizations.find(org => org.id !== id);
        setCurrentOrganization(nextOrg || null);
        
        if (nextOrg) {
          await supabase
            .from('profiles')
            .update({
              organization_id: nextOrg.id
            })
            .eq('id', user?.id);
        } else {
          await supabase
            .from('profiles')
            .update({
              organization_id: null,
              primary_team_id: null
            })
            .eq('id', user?.id);
        }
      }
      
      toast({
        title: "Organization deleted",
        description: "Organization has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete organization",
        description: error instanceof Error ? error.message : "There was an error deleting the organization.",
      });
      throw error;
    }
  };

  const switchOrganization = async (id: string) => {
    try {
      const orgToSwitch = organizations.find(org => org.id === id);
      
      if (!orgToSwitch) {
        throw new Error('Organization not found');
      }
      
      await supabase
        .from('profiles')
        .update({
          organization_id: id
        })
        .eq('id', user?.id);
      
      setCurrentOrganization(orgToSwitch);
      
      toast({
        title: "Organization switched",
        description: `Switched to ${orgToSwitch.name}`,
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Error switching organization:', error);
      toast({
        variant: "destructive",
        title: "Failed to switch organization",
        description: "There was an error switching to the selected organization.",
      });
      throw error;
    }
  };

  const updateOrganizationSettings = async (id: string, settings: Partial<OrganizationSettings>) => {
    try {
      const { data: currentOrg, error: fetchError } = await supabase
        .from('organizations')
        .select('settings')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const currentSettings = processSettings(currentOrg.settings);
      
      const updatedSettings = {
        ...currentSettings,
        ...settings
      };
      
      const { error } = await supabase
        .from('organizations')
        .update({
          settings: updatedSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => org.id === id ? { 
          ...org, 
          settings: updatedSettings,
          updated_at: new Date().toISOString() 
        } : org)
      );
      
      if (currentOrganization && currentOrganization.id === id) {
        setCurrentOrganization(prev => prev ? { 
          ...prev, 
          settings: updatedSettings,
          updated_at: new Date().toISOString() 
        } : prev);
      }
      
      toast({
        title: "Settings updated",
        description: "Organization settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating organization settings:', error);
      toast({
        variant: "destructive",
        title: "Failed to update settings",
        description: "There was an error updating the organization settings.",
      });
      throw error;
    }
  };

  const getOrganizationMembers = async (id: string): Promise<TeamMember[]> => {
    try {
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id')
        .eq('organization_id', id);
      
      if (teamsError) throw teamsError;
      
      if (!teams || teams.length === 0) {
        return [];
      }
      
      const teamIds = teams.map(team => team.id);
      
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          team_id,
          user_id,
          role,
          department,
          position,
          joined_date
        `)
        .in('team_id', teamIds);
      
      if (membersError) throw membersError;
      
      if (!teamMembers || teamMembers.length === 0) {
        return [];
      }
      
      const userIds = [...new Set(teamMembers.map(member => member.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      if (!profiles) {
        return [];
      }
      
      const profileMap = new Map();
      profiles.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
      
      const members: TeamMember[] = teamMembers.map(member => {
        const profile = profileMap.get(member.user_id);
        return {
          id: member.id,
          name: profile?.name || '',
          email: profile?.email || '',
          role: member.role,
          avatar: profile?.avatar,
          department: member.department,
          position: member.position,
          joinedDate: new Date(member.joined_date).toISOString().split('T')[0]
        };
      });
      
      const uniqueMembers = Array.from(
        new Map(members.map(member => [member.email, member])).values()
      );
      
      return uniqueMembers;
    } catch (error) {
      console.error('Error getting organization members:', error);
      throw error;
    }
  };

  const inviteUserToOrganization = async (organizationId: string, email: string, role: UserRole) => {
    try {
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }
      
      let userId = existingUser?.id;
      
      if (!userId) {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: email,
          password: Math.random().toString(36).substring(2, 10),
          email_confirm: true
        });
        
        if (createError) throw createError;
        
        userId = newUser?.user?.id;
      }
      
      if (!userId) {
        throw new Error('Could not create or find user');
      }
      
      const { data: defaultTeam, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('name', 'Default Team')
        .single();
      
      if (teamError) throw teamError;
      
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: defaultTeam.id,
          user_id: userId,
          role: role,
          joined_date: new Date().toISOString()
        });
      
      if (memberError) throw memberError;
      
      toast({
        title: "User invited",
        description: `${email} has been invited to the organization.`,
      });
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        variant: "destructive",
        title: "Failed to invite user",
        description: "There was an error inviting the user to the organization.",
      });
      throw error;
    }
  };

  const getOrganizationTeamHierarchy = async (id: string): Promise<Team[]> => {
    try {
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('organization_id', id);
      
      if (teamsError) throw teamsError;
      
      if (!teams || teams.length === 0) {
        return [];
      }
      
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          team_id,
          user_id,
          role,
          department,
          position,
          joined_date
        `);
      
      if (membersError) throw membersError;
      
      const userIds = teamMembers ? teamMembers.map(member => member.user_id) : [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      const profileMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }
      
      const teamsWithMembers = teams.map(team => {
        const members = teamMembers
          ? teamMembers
              .filter(member => member.team_id === team.id)
              .map(member => {
                const profile = profileMap.get(member.user_id);
                return {
                  id: member.id,
                  name: profile?.name || '',
                  email: profile?.email || '',
                  role: member.role,
                  avatar: profile?.avatar,
                  department: member.department,
                  position: member.position,
                  joinedDate: new Date(member.joined_date).toISOString().split('T')[0]
                };
              })
          : [];
          
        const typedTeamType = (team.team_type || 'department') as 'department' | 'project' | 'workgroup' | 'other';
        
        return {
          ...team,
          team_type: typedTeamType,
          members,
          subteams: []
        };
      });
      
      const teamMap = new Map();
      teamsWithMembers.forEach(team => {
        teamMap.set(team.id, team);
      });
      
      const rootTeams: Team[] = [];
      
      teamsWithMembers.forEach(team => {
        if (team.parent_team_id) {
          const parentTeam = teamMap.get(team.parent_team_id);
          if (parentTeam) {
            if (!parentTeam.subteams) {
              parentTeam.subteams = [];
            }
            parentTeam.subteams.push(team);
          } else {
            rootTeams.push(team);
          }
        } else {
          rootTeams.push(team);
        }
      });
      
      return rootTeams as Team[];
    } catch (error) {
      console.error('Error getting team hierarchy:', error);
      throw error;
    }
  };

  const value = {
    organizations,
    currentOrganization,
    isLoading,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    switchOrganization,
    updateOrganizationSettings,
    getOrganizationMembers,
    inviteUserToOrganization,
    getOrganizationTeamHierarchy
  };

  return <OrganizationsContext.Provider value={value}>{children}</OrganizationsContext.Provider>;
};

export const useOrganizations = () => {
  const context = useContext(OrganizationsContext);
  if (context === undefined) {
    throw new Error('useOrganizations must be used within an OrganizationsProvider');
  }
  return context;
};
