
export interface EnhancedPlanningInitiative {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  progress: number;
  start_date?: string;
  end_date?: string;
  owner_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  budget?: number;
  currency: string;
  resources_required: ResourceRequirement[];
  stakeholders: Stakeholder[];
  risks: Risk[];
  success_metrics: SuccessMetric[];
  created_at: string;
  updated_at: string;
}

export interface ResourceRequirement {
  id: string;
  type: 'human' | 'financial' | 'equipment' | 'technology';
  description: string;
  quantity?: number;
  cost?: number;
  allocated: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: 'low' | 'medium' | 'high';
  interest: 'low' | 'medium' | 'high';
  contact?: string;
}

export interface Risk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation_plan?: string;
  status: 'identified' | 'monitoring' | 'mitigated' | 'occurred';
}

export interface SuccessMetric {
  id: string;
  name: string;
  description?: string;
  target_value: number;
  current_value?: number;
  unit: string;
  measurement_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

export interface InitiativeMilestone {
  id: string;
  initiative_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  completion_percentage: number;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}
