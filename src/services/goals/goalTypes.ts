
export interface EnhancedStrategicGoal {
  id: string;
  name: string;
  description?: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
  progress: number;
  target_value?: number;
  current_value?: number;
  start_date?: string;
  due_date?: string;
  user_id: string;
  owner_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  milestones: GoalMilestone[];
  dependencies: string[];
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  goal_comments?: GoalComment[];
  goal_attachments?: GoalAttachment[];
}

export interface GoalMilestone {
  id: string;
  title: string;
  description?: string;
  target_date?: string;
  completed: boolean;
  completion_date?: string;
}

export interface GoalComment {
  id: string;
  goal_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export interface GoalAttachment {
  id: string;
  goal_id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  user_name?: string;
}
