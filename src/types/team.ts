
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
  createdAt: string;
  members: TeamMember[];
}
