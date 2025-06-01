
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, TeamMember } from '@/types/team';
import { DatabaseService } from '@/services/databaseService';
import { useToast } from '@/hooks/use-toast';

interface TeamsContextType {
  teams: Team[];
  loading: boolean;
  error: string | null;
  addTeam: (team: Omit<Team, 'id' | 'members'>) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addMember: (teamId: string, member: Omit<TeamMember, 'id'>) => Promise<void>;
  updateMember: (teamId: string, memberId: string, updates: Partial<TeamMember>) => void;
  removeMember: (teamId: string, memberId: string) => void;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const result = await DatabaseService.fetchData<Team>('teams');
      
      // Fetch team members for each team
      const teamsWithMembers = await Promise.all(
        (result.data || []).map(async (team) => {
          const membersResult = await DatabaseService.fetchData<TeamMember>(
            'team_members',
            {},
            { team_id: team.id }
          );
          return {
            ...team,
            members: membersResult.data || []
          };
        })
      );
      
      setTeams(teamsWithMembers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch teams');
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async (teamData: Omit<Team, 'id' | 'members'>) => {
    try {
      const result = await DatabaseService.createRecord<Team>('teams', teamData);
      if (result.data) {
        setTeams(prev => [...prev, { ...result.data, members: [] }]);
        toast({
          title: "Team created",
          description: `${teamData.name} has been created successfully.`
        });
      }
    } catch (err) {
      console.error('Error creating team:', err);
      toast({
        title: "Error",
        description: "Failed to create team.",
        variant: "destructive"
      });
    }
  };

  const updateTeam = async (id: string, updates: Partial<Team>) => {
    try {
      const result = await DatabaseService.updateRecord<Team>('teams', id, updates);
      if (result.data) {
        setTeams(prev => prev.map(team => 
          team.id === id ? { ...team, ...updates } : team
        ));
        toast({
          title: "Team updated",
          description: "Team information has been updated successfully."
        });
      }
    } catch (err) {
      console.error('Error updating team:', err);
      toast({
        title: "Error",
        description: "Failed to update team.",
        variant: "destructive"
      });
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const result = await DatabaseService.deleteRecord('teams', id);
      if (result.success) {
        setTeams(prev => prev.filter(team => team.id !== id));
        toast({
          title: "Team deleted",
          description: "Team has been deleted successfully."
        });
      }
    } catch (err) {
      console.error('Error deleting team:', err);
      toast({
        title: "Error",
        description: "Failed to delete team.",
        variant: "destructive"
      });
    }
  };

  const addMember = async (teamId: string, memberData: Omit<TeamMember, 'id'>) => {
    try {
      const result = await DatabaseService.createRecord<TeamMember>('team_members', {
        ...memberData,
        team_id: teamId
      });
      
      if (result.data) {
        const newMember: TeamMember = {
          id: result.data.id,
          name: memberData.name,
          email: memberData.email,
          role: memberData.role,
          department: memberData.department,
          position: memberData.position,
          joinedDate: memberData.joinedDate
        };
        
        setTeams(prev => prev.map(team => 
          team.id === teamId 
            ? { ...team, members: [...team.members, newMember] }
            : team
        ));
        
        toast({
          title: "Member added",
          description: `${memberData.name} has been added to the team.`
        });
      }
    } catch (err) {
      console.error('Error adding team member:', err);
      toast({
        title: "Error",
        description: "Failed to add team member.",
        variant: "destructive"
      });
    }
  };

  const updateMember = async (teamId: string, memberId: string, updates: Partial<TeamMember>) => {
    try {
      const result = await DatabaseService.updateRecord<TeamMember>('team_members', memberId, updates);
      if (result.data) {
        setTeams(prev => prev.map(team => 
          team.id === teamId 
            ? {
                ...team,
                members: team.members.map(member => 
                  member.id === memberId ? { ...member, ...updates } : member
                )
              }
            : team
        ));
        toast({
          title: "Member updated",
          description: "Team member information has been updated."
        });
      }
    } catch (err) {
      console.error('Error updating team member:', err);
      toast({
        title: "Error",
        description: "Failed to update team member.",
        variant: "destructive"
      });
    }
  };

  const removeMember = async (teamId: string, memberId: string) => {
    try {
      const result = await DatabaseService.deleteRecord('team_members', memberId);
      if (result.success) {
        setTeams(prev => prev.map(team => 
          team.id === teamId 
            ? { ...team, members: team.members.filter(member => member.id !== memberId) }
            : team
        ));
        toast({
          title: "Member removed",
          description: "Team member has been removed from the team."
        });
      }
    } catch (err) {
      console.error('Error removing team member:', err);
      toast({
        title: "Error",
        description: "Failed to remove team member.",
        variant: "destructive"
      });
    }
  };

  return (
    <TeamsContext.Provider value={{
      teams,
      loading,
      error,
      addTeam,
      updateTeam,
      deleteTeam,
      addMember,
      updateMember,
      removeMember
    }}>
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
