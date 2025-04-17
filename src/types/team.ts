
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
  description: string;
  created_at: string;  // Changed from createdAt to match database.ts
  updated_at?: string;
  organization_id: string;
  parent_team_id?: string;
  team_type: 'department' | 'project' | 'workgroup' | 'other';
  members: TeamMember[];
}
