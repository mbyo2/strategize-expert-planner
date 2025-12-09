
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Team as TeamType, TeamMember as TeamMemberType, CreateTeamData as OldCreateTeamData, CreateTeamMemberData as OldMemberData, UpdateTeamMemberData } from '@/types/team';

export interface Team {
  id: string;
  name: string;
  description: string | null;
  team_type: 'department' | 'project' | 'cross-functional';
  organization_id: string | null;
  parent_team_id: string | null;
  created_at: string;
  updated_at: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  department: string | null;
  position: string | null;
  joined_date: string;
  status: string | null;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
  team_type?: 'department' | 'project' | 'cross-functional';
  organization_id?: string;
}

export interface CreateTeamMemberData {
  team_id: string;
  user_id: string;
  role: string;
  department?: string;
  position?: string;
}

// Fetch all teams with members
async function fetchTeams(): Promise<Team[]> {
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch members for each team
  const teamsWithMembers = await Promise.all(
    (teams || []).map(async (team) => {
      const { data: members } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles(name, email, avatar)
        `)
        .eq('team_id', team.id);

      return {
        ...team,
        team_type: team.team_type as 'department' | 'project' | 'cross-functional',
        members: (members || []).map(m => {
          const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
          return {
            id: m.id,
            team_id: m.team_id,
            user_id: m.user_id,
            role: m.role,
            department: m.department,
            position: m.position,
            joined_date: m.joined_date,
            status: m.status,
            name: profile?.name || 'Unknown',
            email: profile?.email || '',
            avatar: profile?.avatar,
          };
        })
      };
    })
  );

  return teamsWithMembers;
}

// Create a new team
async function createTeam(data: CreateTeamData | OldCreateTeamData): Promise<Team> {
  const { data: team, error } = await supabase
    .from('teams')
    .insert({
      name: data.name,
      description: data.description || null,
      team_type: data.team_type || 'department',
      organization_id: data.organization_id || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { 
    ...team, 
    team_type: team.team_type as 'department' | 'project' | 'cross-functional',
    members: [] 
  };
}

// Update a team
async function updateTeamById(id: string, updates: Partial<CreateTeamData>): Promise<Team> {
  const { data: team, error } = await supabase
    .from('teams')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return {
    ...team,
    team_type: team.team_type as 'department' | 'project' | 'cross-functional',
    members: []
  };
}

// Delete a team
async function deleteTeamById(id: string): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Add a member to a team (legacy signature support)
interface LegacyMemberData {
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  joinedDate?: string;
}

async function addTeamMemberLegacy(teamId: string, data: LegacyMemberData): Promise<TeamMember> {
  // For legacy support, we need to find or create a user
  // For now, we'll create a placeholder - in production you'd look up the user by email
  const { data: member, error } = await supabase
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: crypto.randomUUID(), // This should be a real user ID in production
      role: data.role,
      department: data.department || null,
      position: data.position || null,
      joined_date: data.joinedDate || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...member,
    name: data.name,
    email: data.email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
  };
}

// Remove a member from a team
async function removeTeamMemberById(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId);

  if (error) throw error;
}

// Update team member (legacy signature support - teamId, memberId, updates)
async function updateTeamMemberLegacy(teamId: string, memberId: string, updates: UpdateTeamMemberData): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .update({
      role: updates.role,
      department: updates.department,
      position: updates.position,
    })
    .eq('id', memberId);

  if (error) throw error;
}

export const useTeams = () => {
  const queryClient = useQueryClient();

  const {
    data: teams = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });

  const createTeamMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created successfully');
    },
    onError: (error) => {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateTeamData> }) =>
      updateTeamById(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team updated successfully');
    },
    onError: (error) => {
      console.error('Error updating team:', error);
      toast.error('Failed to update team');
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: deleteTeamById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting team:', error);
      toast.error('Failed to delete team');
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: LegacyMemberData }) =>
      addTeamMemberLegacy(teamId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team member added successfully');
    },
    onError: (error) => {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: removeTeamMemberById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team member removed successfully');
    },
    onError: (error) => {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member');
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ teamId, memberId, updates }: { teamId: string; memberId: string; updates: UpdateTeamMemberData }) =>
      updateTeamMemberLegacy(teamId, memberId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team member updated successfully');
    },
    onError: (error) => {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
    },
  });

  // Legacy-compatible API
  const addMember = async (teamId: string, data: LegacyMemberData) => {
    return addMemberMutation.mutateAsync({ teamId, data });
  };

  const updateMember = (teamId: string, memberId: string, updates: UpdateTeamMemberData) => {
    updateMemberMutation.mutate({ teamId, memberId, updates });
  };

  const removeMember = (teamId: string, memberId: string) => {
    removeMemberMutation.mutate(memberId);
  };

  // Support both old and new updateTeam signatures
  const updateTeam = (idOrData: string | { id: string; updates: Partial<CreateTeamData> }, updates?: Partial<CreateTeamData>) => {
    if (typeof idOrData === 'string' && updates) {
      updateTeamMutation.mutate({ id: idOrData, updates });
    } else if (typeof idOrData === 'object') {
      updateTeamMutation.mutate(idOrData);
    }
  };

  return {
    teams,
    isLoading,
    error,
    refreshTeams: refetch,
    addTeam: createTeamMutation.mutate,
    updateTeam,
    deleteTeam: deleteTeamMutation.mutate,
    addMember,
    removeMember,
    updateMember,
    isCreating: createTeamMutation.isPending,
    isUpdating: updateTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
  };
};
