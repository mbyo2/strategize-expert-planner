-- Create user management and workflow tables

-- Create organization invitations table
CREATE TABLE IF NOT EXISTS public.organization_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity logs table for user activities
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update profiles table to link to organizations and teams properly
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create organization members table for better organization management
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(organization_id, user_id)
);

-- Update team members table
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- RLS policies for organization invitations
CREATE POLICY "Organization admins can manage invitations" ON public.organization_invitations
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members 
      WHERE organization_id = organization_invitations.organization_id 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can view their own invitations" ON public.organization_invitations
  FOR SELECT USING (
    auth.email() = email OR 
    auth.uid() = invited_by
  );

-- RLS policies for team invitations
CREATE POLICY "Team admins can manage team invitations" ON public.team_invitations
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.team_members 
      WHERE team_id = team_invitations.team_id 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can view their own team invitations" ON public.team_invitations
  FOR SELECT USING (
    auth.email() = email OR 
    auth.uid() = invited_by
  );

-- RLS policies for activity logs
CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Organization members can view organization activity" ON public.activity_logs
  FOR SELECT USING (
    organization_id IS NOT NULL AND
    auth.uid() IN (
      SELECT user_id FROM public.organization_members 
      WHERE organization_id = activity_logs.organization_id
    )
  );

-- RLS policies for organization members
CREATE POLICY "Organization members can view organization members" ON public.organization_members
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om2
      WHERE om2.organization_id = organization_members.organization_id
    )
  );

CREATE POLICY "Organization admins can manage members" ON public.organization_members
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.organization_members om2
      WHERE om2.organization_id = organization_members.organization_id 
      AND om2.role IN ('admin', 'manager')
    )
  );

-- Update teams RLS policies to work with organization members
DROP POLICY IF EXISTS "Anyone can view teams" ON public.teams;
CREATE POLICY "Organization members can view teams" ON public.teams
  FOR SELECT USING (
    organization_id IS NULL OR
    auth.uid() IN (
      SELECT user_id FROM public.organization_members 
      WHERE organization_id = teams.organization_id
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
CREATE POLICY "Organization members can create teams" ON public.teams
  FOR INSERT WITH CHECK (
    organization_id IS NULL OR
    auth.uid() IN (
      SELECT user_id FROM public.organization_members 
      WHERE organization_id = teams.organization_id 
      AND role IN ('admin', 'manager')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organization_invitations_email ON public.organization_invitations(email);
CREATE INDEX IF NOT EXISTS idx_organization_invitations_token ON public.organization_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON public.team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_organization_id ON public.activity_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_user ON public.organization_members(organization_id, user_id);

-- Create function to automatically create organization member when user joins organization
CREATE OR REPLACE FUNCTION public.handle_organization_member_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When a user's profile is updated with an organization_id, add them as a member
  IF NEW.organization_id IS NOT NULL AND (OLD.organization_id IS NULL OR OLD.organization_id != NEW.organization_id) THEN
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (NEW.organization_id, NEW.id, COALESCE(NEW.role, 'viewer'))
    ON CONFLICT (organization_id, user_id) DO UPDATE SET
      role = EXCLUDED.role;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for organization member creation
DROP TRIGGER IF EXISTS on_profile_organization_change ON public.profiles;
CREATE TRIGGER on_profile_organization_change
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_organization_member_creation();