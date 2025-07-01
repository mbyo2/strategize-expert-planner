
-- Create MFA methods table
CREATE TABLE IF NOT EXISTS public.user_mfa_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('totp', 'sms', 'email')),
  secret TEXT, -- For TOTP
  phone_number TEXT, -- For SMS
  is_verified BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user sessions table for enhanced session management
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OAuth providers table
CREATE TABLE IF NOT EXISTS public.oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'github', 'microsoft', 'linkedin_oidc')),
  provider_user_id TEXT NOT NULL,
  provider_email TEXT,
  provider_data JSONB DEFAULT '{}',
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);

-- Enhance strategic goals table with better tracking
ALTER TABLE public.strategic_goals ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE public.strategic_goals ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE public.strategic_goals ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';
ALTER TABLE public.strategic_goals ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]';
ALTER TABLE public.strategic_goals ADD COLUMN IF NOT EXISTS dependencies JSONB DEFAULT '[]';
ALTER TABLE public.strategic_goals ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'low';

-- Add check constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'strategic_goals_priority_check') THEN
    ALTER TABLE public.strategic_goals ADD CONSTRAINT strategic_goals_priority_check CHECK (priority IN ('low', 'medium', 'high', 'critical'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'strategic_goals_risk_level_check') THEN
    ALTER TABLE public.strategic_goals ADD CONSTRAINT strategic_goals_risk_level_check CHECK (risk_level IN ('low', 'medium', 'high'));
  END IF;
END $$;

-- Create goal comments table for collaboration
CREATE TABLE IF NOT EXISTS public.goal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES public.strategic_goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goal attachments table
CREATE TABLE IF NOT EXISTS public.goal_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES public.strategic_goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhance planning initiatives with better structure
ALTER TABLE public.planning_initiatives ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE public.planning_initiatives ADD COLUMN IF NOT EXISTS budget DECIMAL(12,2);
ALTER TABLE public.planning_initiatives ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE public.planning_initiatives ADD COLUMN IF NOT EXISTS resources_required JSONB DEFAULT '[]';
ALTER TABLE public.planning_initiatives ADD COLUMN IF NOT EXISTS stakeholders JSONB DEFAULT '[]';
ALTER TABLE public.planning_initiatives ADD COLUMN IF NOT EXISTS risks JSONB DEFAULT '[]';
ALTER TABLE public.planning_initiatives ADD COLUMN IF NOT EXISTS success_metrics JSONB DEFAULT '[]';

-- Add check constraint for planning initiatives priority
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'planning_initiatives_priority_check') THEN
    ALTER TABLE public.planning_initiatives ADD CONSTRAINT planning_initiatives_priority_check CHECK (priority IN ('low', 'medium', 'high', 'critical'));
  END IF;
END $$;

-- Create initiative milestones table
CREATE TABLE IF NOT EXISTS public.initiative_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID REFERENCES public.planning_initiatives(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'blocked')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.user_mfa_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiative_milestones ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT COALESCE(
    (SELECT role::TEXT FROM public.user_roles WHERE user_id = user_uuid LIMIT 1),
    'viewer'
  );
$$;

-- Create function to check if user has minimum role level
CREATE OR REPLACE FUNCTION public.has_role_level(user_uuid UUID, required_role TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT;
  role_hierarchy TEXT[] := ARRAY['viewer', 'analyst', 'manager', 'admin'];
  user_level INTEGER;
  required_level INTEGER;
BEGIN
  user_role := public.get_user_role(user_uuid);
  
  -- Find user's role level
  SELECT array_position(role_hierarchy, user_role) INTO user_level;
  SELECT array_position(role_hierarchy, required_role) INTO required_level;
  
  -- If role not found, default to lowest level
  IF user_level IS NULL THEN user_level := 1; END IF;
  IF required_level IS NULL THEN required_level := 1; END IF;
  
  RETURN user_level >= required_level;
END;
$$;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Users can manage their own MFA methods" ON public.user_mfa_methods;
CREATE POLICY "Users can manage their own MFA methods" ON public.user_mfa_methods
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;
CREATE POLICY "Admins can view all sessions" ON public.user_sessions
  FOR SELECT USING (public.has_role_level(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can manage their own OAuth connections" ON public.oauth_connections;
CREATE POLICY "Users can manage their own OAuth connections" ON public.oauth_connections
  FOR ALL USING (auth.uid() = user_id);

-- Enhanced RLS policies for strategic goals
DROP POLICY IF EXISTS "Users can view strategic goals" ON public.strategic_goals;
CREATE POLICY "Users can view strategic goals" ON public.strategic_goals
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = owner_id OR 
    public.has_role_level(auth.uid(), 'analyst')
  );

DROP POLICY IF EXISTS "Users can create strategic goals" ON public.strategic_goals;
CREATE POLICY "Users can create strategic goals" ON public.strategic_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Goal owners and managers can update goals" ON public.strategic_goals;
CREATE POLICY "Goal owners and managers can update goals" ON public.strategic_goals
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.uid() = owner_id OR 
    public.has_role_level(auth.uid(), 'manager')
  );

DROP POLICY IF EXISTS "Goal owners and admins can delete goals" ON public.strategic_goals;
CREATE POLICY "Goal owners and admins can delete goals" ON public.strategic_goals
  FOR DELETE USING (
    auth.uid() = user_id OR 
    auth.uid() = owner_id OR 
    public.has_role_level(auth.uid(), 'admin')
  );

-- RLS policies for goal comments
CREATE POLICY "Users can view goal comments" ON public.goal_comments
  FOR SELECT USING (public.has_role_level(auth.uid(), 'viewer'));

CREATE POLICY "Users can create goal comments" ON public.goal_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comment authors can update their comments" ON public.goal_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Comment authors and admins can delete comments" ON public.goal_comments
  FOR DELETE USING (
    auth.uid() = user_id OR 
    public.has_role_level(auth.uid(), 'admin')
  );

-- RLS policies for goal attachments
CREATE POLICY "Users can view goal attachments" ON public.goal_attachments
  FOR SELECT USING (public.has_role_level(auth.uid(), 'viewer'));

CREATE POLICY "Users can create goal attachments" ON public.goal_attachments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Attachment owners and admins can delete attachments" ON public.goal_attachments
  FOR DELETE USING (
    auth.uid() = user_id OR 
    public.has_role_level(auth.uid(), 'admin')
  );

-- Enhanced RLS policies for planning initiatives
DROP POLICY IF EXISTS "Users can view planning initiatives" ON public.planning_initiatives;
CREATE POLICY "Users can view planning initiatives" ON public.planning_initiatives
  FOR SELECT USING (public.has_role_level(auth.uid(), 'analyst'));

DROP POLICY IF EXISTS "Managers can create planning initiatives" ON public.planning_initiatives;
CREATE POLICY "Managers can create planning initiatives" ON public.planning_initiatives
  FOR INSERT WITH CHECK (public.has_role_level(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Initiative owners and managers can update initiatives" ON public.planning_initiatives;
CREATE POLICY "Initiative owners and managers can update initiatives" ON public.planning_initiatives
  FOR UPDATE USING (
    auth.uid() = owner_id OR 
    public.has_role_level(auth.uid(), 'manager')
  );

DROP POLICY IF EXISTS "Admins can delete planning initiatives" ON public.planning_initiatives;
CREATE POLICY "Admins can delete planning initiatives" ON public.planning_initiatives
  FOR DELETE USING (public.has_role_level(auth.uid(), 'admin'));

-- RLS policies for initiative milestones
CREATE POLICY "Users can view initiative milestones" ON public.initiative_milestones
  FOR SELECT USING (public.has_role_level(auth.uid(), 'analyst'));

CREATE POLICY "Managers can manage initiative milestones" ON public.initiative_milestones
  FOR ALL USING (public.has_role_level(auth.uid(), 'manager'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_mfa_methods_user_id ON public.user_mfa_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_oauth_connections_user_id ON public.oauth_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_comments_goal_id ON public.goal_comments(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_attachments_goal_id ON public.goal_attachments(goal_id);
CREATE INDEX IF NOT EXISTS idx_initiative_milestones_initiative_id ON public.initiative_milestones(initiative_id);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_owner_id ON public.strategic_goals(owner_id);
CREATE INDEX IF NOT EXISTS idx_strategic_goals_status ON public.strategic_goals(status);
CREATE INDEX IF NOT EXISTS idx_planning_initiatives_owner_id ON public.planning_initiatives(owner_id);
CREATE INDEX IF NOT EXISTS idx_planning_initiatives_status ON public.planning_initiatives(status);
