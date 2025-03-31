
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Team, TeamMember } from '@/types/team';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

// Mock data for initial teams
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Executive Team',
    description: 'Company leadership and strategic decision makers',
    createdAt: '2023-01-15',
    members: [
      {
        id: '101',
        name: 'John Mitchell',
        email: 'john@intantiko.com',
        role: 'Team Lead',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        department: 'Management',
        position: 'CEO',
        joinedDate: '2023-01-15',
      },
      {
        id: '102',
        name: 'Sarah Johnson',
        email: 'sarah@intantiko.com',
        role: 'Member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        department: 'Finance',
        position: 'CFO',
        joinedDate: '2023-01-20',
      }
    ],
  },
  {
    id: '2',
    name: 'Marketing Team',
    description: 'Responsible for brand strategy and customer acquisition',
    createdAt: '2023-02-10',
    members: [
      {
        id: '201',
        name: 'Emily Chen',
        email: 'emily@intantiko.com',
        role: 'Team Lead',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
        department: 'Marketing',
        position: 'Marketing Director',
        joinedDate: '2023-02-10',
      }
    ],
  },
  {
    id: '3',
    name: 'Product Development',
    description: 'Building and improving our product offerings',
    createdAt: '2023-03-05',
    members: [
      {
        id: '301',
        name: 'Michael Rodriguez',
        email: 'michael@intantiko.com',
        role: 'Team Lead',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
        department: 'Engineering',
        position: 'CTO',
        joinedDate: '2023-03-05',
      },
      {
        id: '302',
        name: 'David Kim',
        email: 'david@intantiko.com',
        role: 'Member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        department: 'Engineering',
        position: 'Senior Developer',
        joinedDate: '2023-03-10',
      }
    ],
  }
];

interface TeamsContextType {
  teams: Team[];
  isLoading: boolean;
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  updateTeam: (id: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>) => void;
  deleteTeam: (id: string) => void;
  addMember: (teamId: string, member: Omit<TeamMember, 'id'>) => void;
  updateMember: (teamId: string, memberId: string, updates: Partial<Omit<TeamMember, 'id'>>) => void;
  removeMember: (teamId: string, memberId: string) => void;
  getTeam: (id: string) => Team | undefined;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadTeams = () => {
      // In a real app, this would be an API call
      const storedTeams = localStorage.getItem('teams');
      if (storedTeams) {
        setTeams(JSON.parse(storedTeams));
      } else {
        // Use mock data for initial state
        setTeams(mockTeams);
        localStorage.setItem('teams', JSON.stringify(mockTeams));
      }
      setIsLoading(false);
    };

    loadTeams();
  }, []);

  const saveTeams = (updatedTeams: Team[]) => {
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
  };

  const addTeam = (team: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...team,
      id: uuidv4(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    const updatedTeams = [...teams, newTeam];
    saveTeams(updatedTeams);
    
    toast({
      title: "Team created",
      description: `${newTeam.name} has been created successfully.`,
    });
  };

  const updateTeam = (id: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>) => {
    const updatedTeams = teams.map(team => 
      team.id === id ? { ...team, ...updates } : team
    );
    saveTeams(updatedTeams);
    
    toast({
      title: "Team updated",
      description: `Team has been updated successfully.`,
    });
  };

  const deleteTeam = (id: string) => {
    const teamToDelete = teams.find(team => team.id === id);
    const updatedTeams = teams.filter(team => team.id !== id);
    saveTeams(updatedTeams);
    
    toast({
      title: "Team deleted",
      description: `${teamToDelete?.name} has been deleted.`,
    });
  };

  const addMember = (teamId: string, member: Omit<TeamMember, 'id'>) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: [
            ...team.members,
            {
              ...member,
              id: uuidv4()
            }
          ]
        };
      }
      return team;
    });
    saveTeams(updatedTeams);
    
    toast({
      title: "Member added",
      description: `${member.name} has been added to the team.`,
    });
  };

  const updateMember = (teamId: string, memberId: string, updates: Partial<Omit<TeamMember, 'id'>>) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.map(member => 
            member.id === memberId ? { ...member, ...updates } : member
          )
        };
      }
      return team;
    });
    saveTeams(updatedTeams);
    
    toast({
      title: "Member updated",
      description: `Team member has been updated successfully.`,
    });
  };

  const removeMember = (teamId: string, memberId: string) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        const memberToRemove = team.members.find(m => m.id === memberId);
        return {
          ...team,
          members: team.members.filter(member => member.id !== memberId)
        };
      }
      return team;
    });
    saveTeams(updatedTeams);
    
    toast({
      title: "Member removed",
      description: `Team member has been removed.`,
    });
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
