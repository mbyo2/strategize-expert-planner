
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
  position?: string;
  joinedDate: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;  // Made optional to match database.ts
  created_at: string;    // Using created_at to match database.ts
  updated_at?: string;
  organization_id: string;
  parent_team_id?: string;
  team_type: 'department' | 'project' | 'workgroup' | 'other';
  members: TeamMember[];
}
