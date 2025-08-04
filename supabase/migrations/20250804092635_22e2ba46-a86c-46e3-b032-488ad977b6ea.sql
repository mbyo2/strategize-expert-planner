-- Create ERP modules configuration table
CREATE TABLE public.erp_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  industry_category TEXT,
  is_core_module BOOLEAN NOT NULL DEFAULT false,
  dependencies TEXT[] DEFAULT '{}',
  version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organization ERP configuration table
CREATE TABLE public.organization_erp_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  active_modules TEXT[] NOT NULL DEFAULT '{}',
  module_settings JSONB NOT NULL DEFAULT '{}',
  integration_settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ERP data entities table (flexible schema for different modules)
CREATE TABLE public.erp_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  module_key TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_data JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ERP strategic integration table (links ERP data to strategic planning)
CREATE TABLE public.erp_strategic_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  strategic_goal_id UUID,
  planning_initiative_id UUID,
  erp_entity_id UUID NOT NULL,
  link_type TEXT NOT NULL, -- 'supports', 'measures', 'depends_on', 'impacts'
  impact_weight NUMERIC DEFAULT 1.0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT fk_erp_strategic_goal FOREIGN KEY (strategic_goal_id) REFERENCES strategic_goals(id) ON DELETE CASCADE,
  CONSTRAINT fk_erp_planning_initiative FOREIGN KEY (planning_initiative_id) REFERENCES planning_initiatives(id) ON DELETE CASCADE,
  CONSTRAINT fk_erp_entity FOREIGN KEY (erp_entity_id) REFERENCES erp_entities(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE public.erp_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_erp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erp_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erp_strategic_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ERP modules (public read, admin manage)
CREATE POLICY "Everyone can view ERP modules" 
ON public.erp_modules 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage ERP modules" 
ON public.erp_modules 
FOR ALL 
USING (has_role_level(auth.uid(), 'admin'::text));

-- RLS Policies for organization ERP config
CREATE POLICY "Organization members can view ERP config" 
ON public.organization_erp_config 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = organization_erp_config.organization_id
  )
);

CREATE POLICY "Organization admins can manage ERP config" 
ON public.organization_erp_config 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = organization_erp_config.organization_id 
    AND role IN ('admin', 'manager')
  )
);

-- RLS Policies for ERP entities (organization-based)
CREATE POLICY "Organization members can view ERP entities" 
ON public.erp_entities 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = erp_entities.organization_id
  )
);

CREATE POLICY "Organization members can create ERP entities" 
ON public.erp_entities 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = erp_entities.organization_id
  ) AND auth.uid() = created_by
);

CREATE POLICY "ERP entity creators and managers can update" 
ON public.erp_entities 
FOR UPDATE 
USING (
  (auth.uid() = created_by) OR 
  (auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = erp_entities.organization_id 
    AND role IN ('admin', 'manager')
  ))
);

CREATE POLICY "ERP entity creators and admins can delete" 
ON public.erp_entities 
FOR DELETE 
USING (
  (auth.uid() = created_by) OR 
  has_role_level(auth.uid(), 'admin'::text)
);

-- RLS Policies for strategic links
CREATE POLICY "Organization members can view strategic links" 
ON public.erp_strategic_links 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = erp_strategic_links.organization_id
  )
);

CREATE POLICY "Managers can create strategic links" 
ON public.erp_strategic_links 
FOR INSERT 
WITH CHECK (
  has_role_level(auth.uid(), 'manager'::text)
);

CREATE POLICY "Managers can update strategic links" 
ON public.erp_strategic_links 
FOR UPDATE 
USING (
  has_role_level(auth.uid(), 'manager'::text)
);

CREATE POLICY "Admins can delete strategic links" 
ON public.erp_strategic_links 
FOR DELETE 
USING (
  has_role_level(auth.uid(), 'admin'::text)
);

-- Insert core ERP modules
INSERT INTO public.erp_modules (module_key, name, description, industry_category, is_core_module) VALUES
-- Core modules (available to all)
('financial_management', 'Financial Management', 'Core accounting, budgeting, and financial reporting', 'core', true),
('human_resources', 'Human Resources', 'Employee management, payroll, and HR processes', 'core', true),
('crm', 'Customer Relationship Management', 'Customer interactions, sales, and marketing', 'core', true),
('project_management', 'Project Management', 'Project planning, tracking, and resource allocation', 'core', true),

-- Manufacturing modules
('production_planning', 'Production Planning', 'Manufacturing planning and control systems', 'manufacturing', false),
('quality_management', 'Quality Management', 'Quality control and compliance management', 'manufacturing', false),
('inventory_management', 'Inventory Management', 'Stock tracking and warehouse management', 'manufacturing', false),
('supply_chain', 'Supply Chain Management', 'End-to-end supply chain optimization', 'manufacturing', false),

-- Retail modules
('pos_integration', 'Point of Sale', 'Retail sales and transaction management', 'retail', false),
('merchandising', 'Merchandising', 'Product categorization and pricing', 'retail', false),
('demand_forecasting', 'Demand Forecasting', 'Sales prediction and inventory optimization', 'retail', false),

-- Services modules
('service_management', 'Service Management', 'Service delivery and field operations', 'services', false),
('billing_invoicing', 'Billing & Invoicing', 'Automated billing and invoice generation', 'services', false),
('contract_management', 'Contract Management', 'Service contracts and SLA management', 'services', false),

-- Healthcare modules
('patient_management', 'Patient Management', 'Patient records and appointment scheduling', 'healthcare', false),
('pharmacy_management', 'Pharmacy Management', 'Medication inventory and dispensing', 'healthcare', false),
('compliance_hipaa', 'HIPAA Compliance', 'Healthcare compliance and data security', 'healthcare', false),

-- Financial Services modules
('risk_management', 'Risk Management', 'Financial risk assessment and compliance', 'financial_services', false),
('asset_liability', 'Asset & Liability Management', 'Financial portfolio management', 'financial_services', false),
('regulatory_reporting', 'Regulatory Reporting', 'Financial compliance reporting', 'financial_services', false),

-- Education modules
('student_information', 'Student Information System', 'Student records and academic management', 'education', false),
('course_management', 'Course Management', 'Curriculum and class scheduling', 'education', false),
('fee_management', 'Fee Management', 'Tuition and payment processing', 'education', false);

-- Create indexes for performance
CREATE INDEX idx_erp_entities_org_module_v2 ON public.erp_entities(organization_id, module_key);
CREATE INDEX idx_erp_entities_type_v2 ON public.erp_entities(entity_type);
CREATE INDEX idx_erp_strategic_links_goal_v2 ON public.erp_strategic_links(strategic_goal_id);
CREATE INDEX idx_erp_strategic_links_initiative_v2 ON public.erp_strategic_links(planning_initiative_id);
CREATE INDEX idx_erp_strategic_links_entity_v2 ON public.erp_strategic_links(erp_entity_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_erp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for timestamp updates
CREATE TRIGGER update_organization_erp_config_updated_at
  BEFORE UPDATE ON public.organization_erp_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_erp_updated_at();

CREATE TRIGGER update_erp_entities_updated_at
  BEFORE UPDATE ON public.erp_entities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_erp_updated_at();