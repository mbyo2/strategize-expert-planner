export interface ERPModule {
  id: string;
  module_key: string;
  name: string;
  description?: string;
  industry_category: string;
  is_core_module: boolean;
  dependencies: string[];
  version: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationERPConfig {
  id: string;
  organization_id: string;
  active_modules: string[];
  module_settings: any;
  integration_settings: any;
  created_at: string;
  updated_at: string;
}

export interface ERPEntity {
  id: string;
  organization_id: string;
  module_key: string;
  entity_type: string;
  entity_data: any;
  metadata: any;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ERPStrategicLink {
  id: string;
  organization_id: string;
  strategic_goal_id?: string;
  planning_initiative_id?: string;
  erp_entity_id: string;
  link_type: 'supports' | 'measures' | 'depends_on' | 'impacts';
  impact_weight: number;
  metadata: any;
  created_at: string;
}

export type IndustryCategory = 
  | 'core'
  | 'manufacturing'
  | 'retail'
  | 'services'
  | 'healthcare'
  | 'financial_services'
  | 'education';

export const INDUSTRY_CATEGORIES: Record<IndustryCategory, string> = {
  core: 'Core Modules',
  manufacturing: 'Manufacturing',
  retail: 'Retail & E-commerce',
  services: 'Professional Services',
  healthcare: 'Healthcare',
  financial_services: 'Financial Services',
  education: 'Education'
};

// ERP entity types for different modules
export const ERP_ENTITY_TYPES = {
  // Financial Management
  financial_management: [
    'account',
    'transaction',
    'budget',
    'invoice',
    'payment',
    'financial_report'
  ],
  
  // Human Resources
  human_resources: [
    'employee',
    'payroll',
    'timesheet',
    'leave_request',
    'performance_review',
    'training_record'
  ],
  
  // CRM
  crm: [
    'customer',
    'lead',
    'opportunity',
    'sales_order',
    'marketing_campaign',
    'support_ticket'
  ],
  
  // Manufacturing
  production_planning: [
    'production_order',
    'work_order',
    'bill_of_materials',
    'routing',
    'capacity_plan'
  ],
  
  inventory_management: [
    'product',
    'stock_item',
    'warehouse',
    'stock_movement',
    'reorder_point'
  ],
  
  // Retail
  pos_integration: [
    'pos_transaction',
    'cash_register',
    'shift_report',
    'discount',
    'promotion'
  ],
  
  // Healthcare
  patient_management: [
    'patient',
    'appointment',
    'medical_record',
    'prescription',
    'treatment_plan'
  ]
} as const;