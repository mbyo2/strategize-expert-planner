import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Team, TeamMember } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizations } from '@/hooks/useOrganizations';
import { supabase } from '@/integrations/supabase/client';

interface TeamsContextType {
  teams: Team[];
  isLoading: boolean;
  addTeam: (team: Omit<Team, 'id'>) => Promise<void>;
  updateTeam: (id: string, updates: Partial<Omit<Team, 'id' | 'created_at'>>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addMember: (teamId: string, member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateMember: (teamId: string, memberId: string, updates: Partial<Omit<TeamMember, 'id'>>) => Promise<void>;
  removeMember: (teamId: string, memberId: string) => Promise<void>;
  getTeam: (id: string) => Team | undefined;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentOrganization } = useOrganizations();

  useEffect(() => {
    if (user && currentOrganization) {
      fetchTeams();
    } else {
      setTeams([]);
      setIsLoading(false);
    }
  }, [user, currentOrganization]);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*');
      
      if (teamsError) throw teamsError;
      
      const { data: membersData, error: membersError } = await supabase
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
      
      const userIds = membersData.map(member => member.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar')
        .in('id', userIds);
        
      if (profilesError) throw profilesError;
      
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      const processedTeams: Team[] = teamsData.map(team => {
        const teamMembers = membersData
          .filter(member => member.team_id === team.id)
          .map(member => {
            const profile = profilesMap.get(member.user_id);
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
        
        const typedTeamType = (team.team_type || 'department') as 'department' | 'project' | 'workgroup' | 'other';
        
        return {
          id: team.id,
          name: team.name,
          description: team.description || '',
          created_at: new Date(team.created_at).toISOString().split('T')[0],
          organization_id: team.organization_id,
          team_type: typedTeamType,
          parent_team_id: team.parent_team_id,
          updated_at: team.updated_at,
          members: teamMembers
        };
      });
      
      setTeams(processedTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        variant: "destructive",
        title: "Failed to load teams",
        description: "There was an error loading the teams data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTeam = async (team: Omit<Team, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: team.name,
          description: team.description,
          organization_id: team.organization_id,
          team_type: team.team_type
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (team.members && team.members.length > 0 && data) {
        const memberPromises = team.members.map(member => 
          addMember(data.id, member)
        );
        await Promise.all(memberPromises);
      }
      
      await fetchTeams();
      
      toast({
        title: "Team created",
        description: `${team.name} has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        variant: "destructive",
        title: "Failed to create team",
        description: "There was an error creating the team.",
      });
      throw error;
    }
  };

  const updateTeam = async (id: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: updates.name,
          description: updates.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setTeams(prevTeams => prevTeams.map(team => 
        team.id === id ? { ...team, ...updates } : team
      ));
      
      toast({
        title: "Team updated",
        description: `Team has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        variant: "destructive",
        title: "Failed to update team",
        description: "There was an error updating the team.",
      });
      throw error;
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const teamToDelete = teams.find(team => team.id === id);
      
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTeams(prevTeams => prevTeams.filter(team => team.id !== id));
      
      toast({
        title: "Team deleted",
        description: `${teamToDelete?.name} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete team",
        description: "There was an error deleting the team.",
      });
      throw error;
    }
  };

  const addMember = async (teamId: string, member: Omit<TeamMember, 'id'>) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', member.email)
        .single();
      
      if (userError) {
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: member.email,
          password: Math.random().toString(36).slice(-8),
          email_confirm: true,
          user_metadata: {
            name: member.name
          }
        });
        
        if (authError) throw authError;
      }
      
      const userId = userData?.id;
      
      if (!userId) {
        throw new Error('User not found and could not be created');
      }
      
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId,
          role: member.role,
          department: member.department,
          position: member.position,
          joined_date: new Date().toISOString()
        });
      
      if (error) throw error;
      
      await fetchTeams();
      
      toast({
        title: "Member added",
        description: `${member.name} has been added to the team.`,
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        variant: "destructive",
        title: "Failed to add member",
        description: "There was an error adding the team member.",
      });
      throw error;
    }
  };

  const updateMember = async (teamId: string, memberId: string, updates: Partial<Omit<TeamMember, 'id'>>) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          role: updates.role,
          department: updates.department,
          position: updates.position
        })
        .eq('id', memberId)
        .eq('team_id', teamId);
      
      if (error) throw error;
      
      await fetchTeams();
      
      toast({
        title: "Member updated",
        description: `Team member has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        variant: "destructive",
        title: "Failed to update member",
        description: "There was an error updating the team member.",
      });
      throw error;
    }
  };

  const removeMember = async (teamId: string, memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)
        .eq('team_id', teamId);
      
      if (error) throw error;
      
      await fetchTeams();
      
      toast({
        title: "Member removed",
        description: `Team member has been removed.`,
      });
    } catch (error) {
      console.error('Error removing team member:', error);
      toast({
        variant: "destructive",
        title: "Failed to remove member",
        description: "There was an error removing the team member.",
      });
      throw error;
    }
  };

  const getTeam = (id: string) => {
    return teams.find(team => team.id === id);
  };

  const value = {
    teams,
    isLoading,
    addTeam,
    updateTeam,
    deleteTeam,
    addMember,
    updateMember,
    removeMember,
    getTeam
  };

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
};

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
};
