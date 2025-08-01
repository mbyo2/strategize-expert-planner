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

-- Enable RLS on new tables
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_tasks ENABLE ROW LEVEL SECURITY;

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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_team_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
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