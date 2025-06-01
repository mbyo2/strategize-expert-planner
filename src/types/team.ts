
export interface Team {
  id: string;
  name: string;
  description?: string;
  team_type: 'department' | 'project' | 'cross-functional';
  organization_id?: string;
  parent_team_id?: string;
  created_at: string;
  updated_at: string;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  department?: string;
  position?: string;
  joined_date: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export interface CreateTeamData {
  name: string;
  description?: string;
  team_type: 'department' | 'project' | 'cross-functional';
  organization_id?: string;
  parent_team_id?: string;
}

export interface CreateTeamMemberData {
  team_id: string;
  user_id: string;
  role: string;
  department?: string;
  position?: string;
}
