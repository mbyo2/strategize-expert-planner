
export interface Team {
  id: string;
  name: string;
  description?: string;
  team_type: 'department' | 'project' | 'cross-functional';
  organization_id?: string;
  parent_team_id?: string;
  created_at: string;
  updated_at: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  department?: string;
  position?: string;
  joined_date: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
  team_type: 'department' | 'project' | 'cross-functional';
  organization_id?: string;
  parent_team_id?: string;
  members: TeamMember[];
  created_at: string;
  updated_at: string;
}

export interface CreateTeamMemberData {
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  joinedDate: string;
}

export interface UpdateTeamMemberData {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  position?: string;
}
