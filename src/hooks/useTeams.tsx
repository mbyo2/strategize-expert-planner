
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, TeamMember, CreateTeamData, CreateTeamMemberData } from '@/types/team';
import { DatabaseService } from '@/services/databaseService';
import { toast } from 'sonner';

interface TeamsContextType {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  createTeam: (teamData: CreateTeamData) => Promise<Team | null>;
  updateTeam: (id: string, updates: Partial<Team>) => Promise<Team | null>;
  deleteTeam: (id: string) => Promise<boolean>;
  addTeamMember: (memberData: CreateTeamMemberData) => Promise<TeamMember | null>;
  removeTeamMember: (teamId: string, userId: string) => Promise<boolean>;
  refreshTeams: () => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await DatabaseService.fetchData<Team>('teams');
      if (result.success && result.data) {
        // Fetch members for each team
        const teamsWithMembers = await Promise.all(
          result.data.map(async (team) => {
            const membersResult = await DatabaseService.fetchData<TeamMember>(
              'team_members',
              undefined,
              { team_id: team.id }
            );
            return {
              ...team,
              members: membersResult.data || []
            };
          })
        );
        setTeams(teamsWithMembers);
      } else {
        setError(result.error || 'Failed to fetch teams');
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (teamData: CreateTeamData): Promise<Team | null> => {
    try {
      const result = await DatabaseService.createRecord<Team>('teams', teamData);
      if (result.success && result.data) {
        const newTeam = { ...result.data, members: [] };
        setTeams(prev => [...prev, newTeam]);
        toast.success('Team created successfully');
        return newTeam;
      } else {
        toast.error(result.error || 'Failed to create team');
        return null;
      }
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  const updateTeam = async (id: string, updates: Partial<Team>): Promise<Team | null> => {
    try {
      const result = await DatabaseService.updateRecord<Team>('teams', id, updates);
      if (result.success && result.data) {
        setTeams(prev => prev.map(team => 
          team.id === id ? { ...team, ...result.data } : team
        ));
        toast.success('Team updated successfully');
        return result.data;
      } else {
        toast.error(result.error || 'Failed to update team');
        return null;
      }
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  const deleteTeam = async (id: string): Promise<boolean> => {
    try {
      const result = await DatabaseService.deleteRecord('teams', id);
      if (result.success) {
        setTeams(prev => prev.filter(team => team.id !== id));
        toast.success('Team deleted successfully');
        return true;
      } else {
        toast.error(result.error || 'Failed to delete team');
        return false;
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const addTeamMember = async (memberData: CreateTeamMemberData): Promise<TeamMember | null> => {
    try {
      const result = await DatabaseService.createRecord<TeamMember>('team_members', memberData);
      if (result.success && result.data) {
        setTeams(prev => prev.map(team => 
          team.id === memberData.team_id 
            ? { ...team, members: [...(team.members || []), result.data!] }
            : team
        ));
        toast.success('Team member added successfully');
        return result.data;
      } else {
        toast.error(result.error || 'Failed to add team member');
        return null;
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  };

  const removeTeamMember = async (teamId: string, userId: string): Promise<boolean> => {
    try {
      // Find the member record to delete
      const team = teams.find(t => t.id === teamId);
      const member = team?.members?.find(m => m.user_id === userId);
      
      if (!member) {
        toast.error('Team member not found');
        return false;
      }

      const result = await DatabaseService.deleteRecord('team_members', member.id);
      if (result.success) {
        setTeams(prev => prev.map(team => 
          team.id === teamId 
            ? { ...team, members: team.members?.filter(m => m.user_id !== userId) || [] }
            : team
        ));
        toast.success('Team member removed successfully');
        return true;
      } else {
        toast.error(result.error || 'Failed to remove team member');
        return false;
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const refreshTeams = async () => {
    await fetchTeams();
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const value: TeamsContextType = {
    teams,
    isLoading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    refreshTeams
  };

  return (
    <TeamsContext.Provider value={value}>
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
};
