-- Add missing RLS policies for security (safe version)

-- Organization ERP Config policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'organization_erp_config' 
    AND policyname = 'Organization members can view their org ERP config'
  ) THEN
    CREATE POLICY "Organization members can view their org ERP config"
    ON public.organization_erp_config
    FOR SELECT
    USING (
      auth.uid() IN (
        SELECT user_id 
        FROM public.organization_members 
        WHERE organization_id = organization_erp_config.organization_id
      )
    );
  END IF;
END $$;

-- ERP Strategic Links policies
ALTER TABLE public.erp_strategic_links ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'erp_strategic_links' 
    AND policyname = 'Organization members can view ERP strategic links'
  ) THEN
    CREATE POLICY "Organization members can view ERP strategic links"
    ON public.erp_strategic_links
    FOR SELECT
    USING (
      auth.uid() IN (
        SELECT user_id 
        FROM public.organization_members 
        WHERE organization_id = erp_strategic_links.organization_id
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'erp_strategic_links' 
    AND policyname = 'Organization managers can manage ERP strategic links'
  ) THEN
    CREATE POLICY "Organization managers can manage ERP strategic links"
    ON public.erp_strategic_links
    FOR ALL
    USING (
      auth.uid() IN (
        SELECT user_id 
        FROM public.organization_members 
        WHERE organization_id = erp_strategic_links.organization_id 
        AND role IN ('admin', 'manager')
      )
    );
  END IF;
END $$;

-- Initiative Milestones policies
ALTER TABLE public.initiative_milestones ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'initiative_milestones' 
    AND policyname = 'Users can view initiative milestones'
  ) THEN
    CREATE POLICY "Users can view initiative milestones"
    ON public.initiative_milestones
    FOR SELECT
    USING (has_role_level(auth.uid(), 'analyst'::text));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'initiative_milestones' 
    AND policyname = 'Managers can manage initiative milestones'
  ) THEN
    CREATE POLICY "Managers can manage initiative milestones"
    ON public.initiative_milestones
    FOR ALL
    USING (has_role_level(auth.uid(), 'manager'::text));
  END IF;
END $$;

-- Goal Comments policies
ALTER TABLE public.goal_comments ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'goal_comments' 
    AND policyname = 'Users can view goal comments'
  ) THEN
    CREATE POLICY "Users can view goal comments"
    ON public.goal_comments
    FOR SELECT
    USING (
      auth.uid() IN (
        SELECT user_id 
        FROM public.strategic_goals 
        WHERE id = goal_comments.goal_id
      ) OR has_role_level(auth.uid(), 'analyst'::text)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'goal_comments' 
    AND policyname = 'Users can create comments on accessible goals'
  ) THEN
    CREATE POLICY "Users can create comments on accessible goals"
    ON public.goal_comments
    FOR INSERT
    WITH CHECK (
      auth.uid() = user_id AND (
        auth.uid() IN (
          SELECT user_id 
          FROM public.strategic_goals 
          WHERE id = goal_comments.goal_id
        ) OR has_role_level(auth.uid(), 'analyst'::text)
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'goal_comments' 
    AND policyname = 'Comment owners can update their comments'
  ) THEN
    CREATE POLICY "Comment owners can update their comments"
    ON public.goal_comments
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'goal_comments' 
    AND policyname = 'Comment owners and admins can delete comments'
  ) THEN
    CREATE POLICY "Comment owners and admins can delete comments"
    ON public.goal_comments
    FOR DELETE
    USING (
      auth.uid() = user_id OR has_role_level(auth.uid(), 'admin'::text)
    );
  END IF;
END $$;

-- Team Messages policies
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'team_messages' 
    AND policyname = 'Team members can view team messages'
  ) THEN
    CREATE POLICY "Team members can view team messages"
    ON public.team_messages
    FOR SELECT
    USING (
      auth.uid() IN (
        SELECT user_id 
        FROM public.team_members 
        WHERE team_id = team_messages.team_id
      ) OR has_role_level(auth.uid(), 'manager'::text)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'team_messages' 
    AND policyname = 'Team members can create messages'
  ) THEN
    CREATE POLICY "Team members can create messages"
    ON public.team_messages
    FOR INSERT
    WITH CHECK (
      auth.uid() = user_id AND auth.uid() IN (
        SELECT user_id 
        FROM public.team_members 
        WHERE team_id = team_messages.team_id
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'team_messages' 
    AND policyname = 'Message owners can update their messages'
  ) THEN
    CREATE POLICY "Message owners can update their messages"
    ON public.team_messages
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'team_messages' 
    AND policyname = 'Message owners and team admins can delete messages'
  ) THEN
    CREATE POLICY "Message owners and team admins can delete messages"
    ON public.team_messages
    FOR DELETE
    USING (
      auth.uid() = user_id OR 
      is_team_admin(team_id, auth.uid()) OR 
      has_role_level(auth.uid(), 'admin'::text)
    );
  END IF;
END $$;

-- Strategic Pillars policies
ALTER TABLE public.strategic_pillars ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'strategic_pillars' 
    AND policyname = 'Users can view their strategic pillars'
  ) THEN
    CREATE POLICY "Users can view their strategic pillars"
    ON public.strategic_pillars
    FOR SELECT
    USING (
      auth.uid() = user_id OR has_role_level(auth.uid(), 'analyst'::text)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'strategic_pillars' 
    AND policyname = 'Users can create their strategic pillars'
  ) THEN
    CREATE POLICY "Users can create their strategic pillars"
    ON public.strategic_pillars
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'strategic_pillars' 
    AND policyname = 'Users can update their strategic pillars'
  ) THEN
    CREATE POLICY "Users can update their strategic pillars"
    ON public.strategic_pillars
    FOR UPDATE
    USING (auth.uid() = user_id OR has_role_level(auth.uid(), 'manager'::text));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'strategic_pillars' 
    AND policyname = 'Users can delete their strategic pillars'
  ) THEN
    CREATE POLICY "Users can delete their strategic pillars"
    ON public.strategic_pillars
    FOR DELETE
    USING (auth.uid() = user_id OR has_role_level(auth.uid(), 'admin'::text));
  END IF;
END $$;

-- Activity Logs policy
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'activity_logs' 
    AND policyname = 'Admins can view all activity logs'
  ) THEN
    CREATE POLICY "Admins can view all activity logs"
    ON public.activity_logs
    FOR SELECT
    USING (has_role_level(auth.uid(), 'admin'::text));
  END IF;
END $$;

-- Drones policies
ALTER TABLE public.drones ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'drones' 
    AND policyname = 'Analysts can view drones'
  ) THEN
    CREATE POLICY "Analysts can view drones"
    ON public.drones
    FOR SELECT
    USING (has_role_level(auth.uid(), 'analyst'::text));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'drones' 
    AND policyname = 'Managers can manage drones'
  ) THEN
    CREATE POLICY "Managers can manage drones"
    ON public.drones
    FOR ALL
    USING (has_role_level(auth.uid(), 'manager'::text));
  END IF;
END $$;