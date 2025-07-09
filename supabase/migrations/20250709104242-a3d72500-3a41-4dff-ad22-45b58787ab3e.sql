-- Step 2: Create support tickets system and superuser functionality

-- Create support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create support ticket comments table
CREATE TABLE IF NOT EXISTS public.support_ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on support tables
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for support tickets
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT user_id FROM public.user_roles 
      WHERE role IN ('superuser'::user_role, 'admin'::user_role)
    )
  );

CREATE POLICY "Users can create their own tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON public.support_tickets
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT user_id FROM public.user_roles 
      WHERE role IN ('superuser'::user_role, 'admin'::user_role)
    )
  );

CREATE POLICY "Superusers and admins can manage all tickets" ON public.support_tickets
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles 
      WHERE role IN ('superuser'::user_role, 'admin'::user_role)
    )
  );

-- RLS policies for support ticket comments
CREATE POLICY "Users can view comments on their tickets" ON public.support_ticket_comments
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT st.user_id FROM public.support_tickets st 
      WHERE st.id = support_ticket_comments.ticket_id
    ) OR
    auth.uid() IN (
      SELECT user_id FROM public.user_roles 
      WHERE role IN ('superuser'::user_role, 'admin'::user_role)
    )
  );

CREATE POLICY "Users can create comments on accessible tickets" ON public.support_ticket_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND (
      auth.uid() IN (
        SELECT st.user_id FROM public.support_tickets st 
        WHERE st.id = support_ticket_comments.ticket_id
      ) OR
      auth.uid() IN (
        SELECT user_id FROM public.user_roles 
        WHERE role IN ('superuser'::user_role, 'admin'::user_role)
      )
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON public.support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_ticket_comments_ticket_id ON public.support_ticket_comments(ticket_id);

-- Create function to update support ticket timestamps
CREATE OR REPLACE FUNCTION public.update_support_ticket_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for support tickets
DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_support_ticket_updated_at();

DROP TRIGGER IF EXISTS update_support_ticket_comments_updated_at ON public.support_ticket_comments;
CREATE TRIGGER update_support_ticket_comments_updated_at
  BEFORE UPDATE ON public.support_ticket_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_support_ticket_updated_at();

-- Create the first superuser with the test admin user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'superuser'::user_role
FROM auth.users 
WHERE email = 'admin@techcorp.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'superuser'::user_role;