
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, TeamMember, CreateTeamData, CreateTeamMemberData, UpdateTeamMemberData } from '@/types/team';
import { toast } from 'sonner';

interface TeamsContextType {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  addTeam: (teamData: CreateTeamData) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addMember: (teamId: string, memberData: CreateTeamMemberData) => Promise<void>;
  updateMember: (teamId: string, memberId: string, updates: UpdateTeamMemberData) => void;
  removeMember: (teamId: string, memberId: string) => void;
  refreshTeams: () => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Engineering Team',
      description: 'Core development team responsible for product engineering',
      team_type: 'department',
      organization_id: 'org-1',
      created_at: '2024-01-15T09:00:00Z',
      updated_at: '2024-01-15T09:00:00Z',
      members: [
        {
          id: 'm1',
          team_id: '1',
          user_id: 'u1',
          role: 'Team Lead',
          department: 'Engineering',
          position: 'Senior Engineer',
          joined_date: '2024-01-15',
          name: 'John Doe',
          email: 'john.doe@company.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
        },
        {
          id: 'm2',
          team_id: '1',
          user_id: 'u2',
          role: 'Member',
          department: 'Engineering',
          position: 'Frontend Developer',
          joined_date: '2024-01-20',
          name: 'Jane Smith',
          email: 'jane.smith@company.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
        }
      ]
    },
    {
      id: '2',
      name: 'Marketing Team',
      description: 'Strategic marketing and brand management',
      team_type: 'department',
      organization_id: 'org-1',
      created_at: '2024-01-16T10:00:00Z',
      updated_at: '2024-01-16T10:00:00Z',
      members: [
        {
          id: 'm3',
          team_id: '2',
          user_id: 'u3',
          role: 'Team Lead',
          department: 'Marketing',
          position: 'Marketing Manager',
          joined_date: '2024-01-16',
          name: 'Mike Johnson',
          email: 'mike.johnson@company.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
        }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTeam = (teamData: CreateTeamData) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setTeams(prev => [...prev, newTeam]);
    toast.success('Team created successfully');
  };

  const updateTeam = (id: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team => 
      team.id === id ? { ...team, ...updates, updated_at: new Date().toISOString() } : team
    ));
    toast.success('Team updated successfully');
  };

  const deleteTeam = (id: string) => {
    setTeams(prev => prev.filter(team => team.id !== id));
    toast.success('Team deleted successfully');
  };

  const addMember = async (teamId: string, memberData: CreateTeamMemberData) => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      team_id: teamId,
      user_id: `user-${Date.now()}`,
      role: memberData.role,
      department: memberData.department,
      position: memberData.position,
      joined_date: memberData.joinedDate,
      name: memberData.name,
      email: memberData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${memberData.email}`
    };

    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, members: [...team.members, newMember] }
        : team
    ));
    toast.success('Team member added successfully');
  };

  const updateMember = (teamId: string, memberId: string, updates: UpdateTeamMemberData) => {
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
    toast.success('Team member updated successfully');
  };

  const removeMember = (teamId: string, memberId: string) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, members: team.members.filter(member => member.id !== memberId) }
        : team
    ));
    toast.success('Team member removed successfully');
  };

  const refreshTeams = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  useEffect(() => {
    refreshTeams();
  }, []);

  const value: TeamsContextType = {
    teams,
    isLoading,
    error,
    addTeam,
    updateTeam,
    deleteTeam,
    addMember,
    updateMember,
    removeMember,
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
