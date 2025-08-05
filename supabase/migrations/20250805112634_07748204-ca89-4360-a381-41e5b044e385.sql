-- Fix remaining RLS security issues

-- Enable RLS on tables that have policies but RLS disabled
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Add basic RLS policies for organizations table since it has none
CREATE POLICY "Organization members can view their organization" 
ON public.organizations 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = organizations.id
  )
);

CREATE POLICY "Organization admins can update their organization" 
ON public.organizations 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = organizations.id 
    AND role IN ('admin', 'manager')
  )
);

CREATE POLICY "Authenticated users can create organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Organization admins can delete their organization" 
ON public.organizations 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT user_id FROM organization_members 
    WHERE organization_id = organizations.id 
    AND role = 'admin'
  )
);