
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Organization, OrganizationSettings, Team, UserRole } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OrganizationsContextType {
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  createOrganization: (organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateOrganization: (id: string, updates: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
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
  const { user } = useAuth();

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
      
      // Get organizations the user belongs to (via team membership)
      const { data: teamMemberships, error: teamError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user?.id);
      
      if (teamError) throw teamError;
      
      if (teamMemberships && teamMemberships.length > 0) {
        // Get teams to find organization IDs
        const teamIds = teamMemberships.map(tm => tm.team_id);
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select('organization_id')
          .in('id', teamIds);
        
        if (teamsError) throw teamsError;
        
        if (teams && teams.length > 0) {
          // Get organizations
          const orgIds = [...new Set(teams.map(t => t.organization_id))]; // Remove duplicates
          const { data: orgs, error: orgsError } = await supabase
            .from('organizations')
            .select('*')
            .in('id', orgIds);
          
          if (orgsError) throw orgsError;
          
          setOrganizations(orgs || []);
          
          // Set current organization
          if (orgs && orgs.length > 0) {
            // Check if user has a primary organization set in their profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('organization_id')
              .eq('id', user?.id)
              .single();
            
            if (profile && profile.organization_id) {
              const primaryOrg = orgs.find(org => org.id === profile.organization_id);
              if (primaryOrg) {
                setCurrentOrganization(primaryOrg);
              } else {
                setCurrentOrganization(orgs[0]);
              }
            } else {
              setCurrentOrganization(orgs[0]);
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

  const createOrganization = async (organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organization.name,
          description: organization.description,
          logo_url: organization.logo_url,
          website: organization.website,
          industry: organization.industry,
          size: organization.size,
          settings: organization.settings || defaultOrganizationSettings
        })
        .select()
        .single();
      
      if (orgError) throw orgError;
      
      if (orgData) {
        // Create default team for organization
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
          // Add current user to the team
          await supabase
            .from('team_members')
            .insert({
              team_id: teamData.id,
              user_id: user?.id,
              role: 'admin',
              department: 'Management'
            });
          
          // Update user's profile with new organization
          await supabase
            .from('profiles')
            .update({
              organization_id: orgData.id,
              primary_team_id: teamData.id
            })
            .eq('id', user?.id);
        }
        
        // Refresh organizations
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

  const updateOrganization = async (id: string, updates: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: updates.name,
          description: updates.description,
          logo_url: updates.logo_url,
          website: updates.website,
          industry: updates.industry,
          size: updates.size,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => org.id === id ? { ...org, ...updates, updated_at: new Date().toISOString() } : org)
      );
      
      // Update current organization if it's the one being updated
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
      // Check if user is admin of this organization
      const isAdmin = user?.role === 'admin'; // This should be replaced with proper permission check
      
      if (!isAdmin) {
        throw new Error('You do not have permission to delete this organization');
      }
      
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setOrganizations(prevOrgs => prevOrgs.filter(org => org.id !== id));
      
      // If current organization is deleted, set to another one or null
      if (currentOrganization && currentOrganization.id === id) {
        const nextOrg = organizations.find(org => org.id !== id);
        setCurrentOrganization(nextOrg || null);
        
        // Update user's profile to remove the deleted organization
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
      
      // Update user's profile with new current organization
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
      
      // Force reload to update all content
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
      // First get current settings
      const { data: currentOrg, error: fetchError } = await supabase
        .from('organizations')
        .select('settings')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const updatedSettings = {
        ...currentOrg.settings,
        ...settings
      };
      
      // Update settings
      const { error } = await supabase
        .from('organizations')
        .update({
          settings: updatedSettings,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setOrganizations(prevOrgs => 
        prevOrgs.map(org => org.id === id ? { 
          ...org, 
          settings: updatedSettings,
          updated_at: new Date().toISOString() 
        } : org)
      );
      
      // Update current organization if it's the one being updated
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
      // Get all teams in the organization
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id')
        .eq('organization_id', id);
      
      if (teamsError) throw teamsError;
      
      if (!teams || teams.length === 0) {
        return [];
      }
      
      const teamIds = teams.map(team => team.id);
      
      // Get all team members
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
      
      // Get profiles for all users
      const userIds = [...new Set(teamMembers.map(member => member.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      if (!profiles) {
        return [];
      }
      
      // Map profiles to team members
      const profileMap = new Map();
      profiles.forEach(profile => {
        profileMap.set(profile.id, profile);
      });
      
      // Create TeamMember objects
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
      
      // Remove duplicates (same user in multiple teams)
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
      // In a real-world implementation, this would send an email invitation.
      // For this example, we'll just create a team membership if the user exists.
      
      // First, check if user already exists
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
        // In a real implementation, we would send an invitation email
        // For this demo, we'll simulate creating a new user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: email,
          password: Math.random().toString(36).substring(2, 10), // Generate random password
          email_confirm: true
        });
        
        if (createError) throw createError;
        
        userId = newUser?.user?.id;
      }
      
      if (!userId) {
        throw new Error('Could not create or find user');
      }
      
      // Get the default team for the organization
      const { data: defaultTeam, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('name', 'Default Team')
        .single();
      
      if (teamError) throw teamError;
      
      // Add user to the default team
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
      // Get all teams in the organization
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('organization_id', id);
      
      if (teamsError) throw teamsError;
      
      if (!teams || teams.length === 0) {
        return [];
      }
      
      // Get all team members
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
      
      // Get profiles for all users
      const userIds = teamMembers ? teamMembers.map(member => member.user_id) : [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar')
        .in('id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Create a map for profile lookups
      const profileMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }
      
      // Create a map of teams with their members
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
        
        return {
          ...team,
          members,
          subteams: []
        };
      });
      
      // Create a map for team lookups
      const teamMap = new Map();
      teamsWithMembers.forEach(team => {
        teamMap.set(team.id, team);
      });
      
      // Build the team hierarchy
      const rootTeams: Team[] = [];
      
      teamsWithMembers.forEach(team => {
        if (team.parent_team_id) {
          const parentTeam = teamMap.get(team.parent_team_id);
          if (parentTeam) {
            parentTeam.subteams = [...(parentTeam.subteams || []), team];
          } else {
            rootTeams.push(team);
          }
        } else {
          rootTeams.push(team);
        }
      });
      
      return rootTeams;
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
