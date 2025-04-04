
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Team, TeamMember } from '@/types/team';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TeamsContextType {
  teams: Team[];
  isLoading: boolean;
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => Promise<void>;
  updateTeam: (id: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>) => Promise<void>;
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

  useEffect(() => {
    if (user) {
      fetchTeams();
    } else {
      setTeams([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      
      // Get all teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*');
      
      if (teamsError) throw teamsError;
      
      // Get team members for all teams
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          team_id,
          user_id,
          role,
          department,
          position,
          joined_date,
          profiles:user_id (
            name,
            email,
            avatar
          )
        `);
      
      if (membersError) throw membersError;
      
      // Process and combine the data
      const processedTeams: Team[] = teamsData.map(team => {
        const teamMembers = membersData
          .filter(member => member.team_id === team.id)
          .map(member => ({
            id: member.id,
            name: member.profiles.name,
            email: member.profiles.email,
            role: member.role,
            avatar: member.profiles.avatar,
            department: member.department,
            position: member.position,
            joinedDate: new Date(member.joined_date).toISOString().split('T')[0]
          }));
        
        return {
          id: team.id,
          name: team.name,
          description: team.description,
          createdAt: new Date(team.created_at).toISOString().split('T')[0],
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

  const addTeam = async (team: Omit<Team, 'id' | 'createdAt'>) => {
    try {
      // Insert the new team
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: team.name,
          description: team.description
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add initial members if provided
      if (team.members && team.members.length > 0) {
        const memberPromises = team.members.map(member => 
          addMember(data.id, member)
        );
        await Promise.all(memberPromises);
      }
      
      // Refresh teams data
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
      
      // Update local state
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
      
      // Update local state
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
      // Get user profile from email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', member.email)
        .single();
      
      if (userError) {
        // If user doesn't exist, create a placeholder profile
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
      
      // Add the member to the team
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
      
      // Refresh teams data
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
      
      // Refresh teams data
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
      
      // Refresh teams data
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
