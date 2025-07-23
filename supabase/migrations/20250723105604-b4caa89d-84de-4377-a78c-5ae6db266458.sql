-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  organization_id UUID,
  status TEXT NOT NULL DEFAULT 'active',
  team_type TEXT DEFAULT 'general',
  settings JSONB DEFAULT '{"visibility": "private", "allow_external_members": false}'::jsonb
);

-- Create team chat messages table
CREATE TABLE public.team_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  edited_at TIMESTAMP WITH TIME ZONE,
  reactions JSONB DEFAULT '[]'::jsonb
);

-- Create team tasks table
CREATE TABLE public.team_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID,
  created_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  attachments JSONB DEFAULT '[]'::jsonb
);

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_tasks ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view teams they are members of" 
ON public.teams 
FOR SELECT 
USING (
  auth.uid() = created_by OR 
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm WHERE tm.team_id = teams.id
  ) OR
  has_role_level(auth.uid(), 'manager')
);

CREATE POLICY "Managers and admins can create teams" 
ON public.teams 
FOR INSERT 
WITH CHECK (
  has_role_level(auth.uid(), 'manager') AND 
  auth.uid() = created_by
);

CREATE POLICY "Team creators and admins can update teams" 
ON public.teams 
FOR UPDATE 
USING (
  auth.uid() = created_by OR 
  has_role_level(auth.uid(), 'admin') OR
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm 
    WHERE tm.team_id = teams.id AND tm.role IN ('admin', 'manager')
  )
);

CREATE POLICY "Admins can delete teams" 
ON public.teams 
FOR DELETE 
USING (
  has_role_level(auth.uid(), 'admin') OR
  auth.uid() = created_by
);

-- Team messages policies
CREATE POLICY "Team members can view messages" 
ON public.team_messages 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm WHERE tm.team_id = team_messages.team_id
  ) OR
  has_role_level(auth.uid(), 'manager')
);

CREATE POLICY "Team members can create messages" 
ON public.team_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm WHERE tm.team_id = team_messages.team_id
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.team_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Message authors and team admins can delete messages" 
ON public.team_messages 
FOR DELETE 
USING (
  auth.uid() = user_id OR
  has_role_level(auth.uid(), 'admin') OR
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm 
    WHERE tm.team_id = team_messages.team_id AND tm.role IN ('admin', 'manager')
  )
);

-- Team tasks policies
CREATE POLICY "Team members can view tasks" 
ON public.team_tasks 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm WHERE tm.team_id = team_tasks.team_id
  ) OR
  has_role_level(auth.uid(), 'manager')
);

CREATE POLICY "Team members can create tasks" 
ON public.team_tasks 
FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm WHERE tm.team_id = team_tasks.team_id
  )
);

CREATE POLICY "Task assignees and creators can update tasks" 
ON public.team_tasks 
FOR UPDATE 
USING (
  auth.uid() = assigned_to OR 
  auth.uid() = created_by OR
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm 
    WHERE tm.team_id = team_tasks.team_id AND tm.role IN ('admin', 'manager')
  )
);

CREATE POLICY "Task creators and team admins can delete tasks" 
ON public.team_tasks 
FOR DELETE 
USING (
  auth.uid() = created_by OR
  has_role_level(auth.uid(), 'admin') OR
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm 
    WHERE tm.team_id = team_tasks.team_id AND tm.role IN ('admin', 'manager')
  )
);

-- Update team_members table policies to be more comprehensive
DROP POLICY IF EXISTS "Users can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Authenticated users can add team members" ON public.team_members;

CREATE POLICY "Team members can view team members" 
ON public.team_members 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm WHERE tm.team_id = team_members.team_id
  ) OR
  has_role_level(auth.uid(), 'manager')
);

CREATE POLICY "Team admins can manage team members" 
ON public.team_members 
FOR ALL 
USING (
  has_role_level(auth.uid(), 'admin') OR
  auth.uid() IN (
    SELECT tm.user_id FROM team_members tm 
    WHERE tm.team_id = team_members.team_id AND tm.role IN ('admin', 'manager')
  ) OR
  auth.uid() IN (
    SELECT t.created_by FROM teams t WHERE t.id = team_members.team_id
  )
);

-- Create function to update team timestamps
CREATE OR REPLACE FUNCTION public.update_team_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_updated_at();

CREATE TRIGGER update_team_messages_updated_at
  BEFORE UPDATE ON public.team_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_updated_at();

CREATE TRIGGER update_team_tasks_updated_at
  BEFORE UPDATE ON public.team_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_team_messages_team_id ON public.team_messages(team_id);
CREATE INDEX idx_team_messages_created_at ON public.team_messages(created_at DESC);
CREATE INDEX idx_team_tasks_team_id ON public.team_tasks(team_id);
CREATE INDEX idx_team_tasks_assigned_to ON public.team_tasks(assigned_to);
CREATE INDEX idx_team_tasks_status ON public.team_tasks(status);
CREATE INDEX idx_teams_created_by ON public.teams(created_by);
CREATE INDEX idx_teams_organization_id ON public.teams(organization_id);