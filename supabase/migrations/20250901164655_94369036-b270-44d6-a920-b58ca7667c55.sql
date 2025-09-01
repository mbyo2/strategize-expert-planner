-- Fix critical RLS policies for team_members table
DROP POLICY IF EXISTS "Authenticated users can add team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view team members" ON public.team_members;

-- Create proper RLS policies for team_members
CREATE POLICY "Team members can view their own teams" 
ON public.team_members 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR auth.uid() IN (
    SELECT tm.user_id 
    FROM team_members tm 
    WHERE tm.team_id = team_members.team_id
  )
  OR has_role_level(auth.uid(), 'manager'::text)
);

CREATE POLICY "Team admins can add members" 
ON public.team_members 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT tm.user_id 
    FROM team_members tm 
    WHERE tm.team_id = team_members.team_id 
    AND tm.role IN ('admin', 'manager')
  )
  OR has_role_level(auth.uid(), 'manager'::text)
);

CREATE POLICY "Team admins can update members" 
ON public.team_members 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT tm.user_id 
    FROM team_members tm 
    WHERE tm.team_id = team_members.team_id 
    AND tm.role IN ('admin', 'manager')
  )
  OR has_role_level(auth.uid(), 'admin'::text)
);

CREATE POLICY "Team admins can remove members" 
ON public.team_members 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT tm.user_id 
    FROM team_members tm 
    WHERE tm.team_id = team_members.team_id 
    AND tm.role IN ('admin', 'manager')
  )
  OR has_role_level(auth.uid(), 'admin'::text)
);

-- Fix user_sessions table RLS policies
CREATE POLICY "Users can create their own sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
ON public.user_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add profiles table RLS if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile" 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id);
  END IF;
END $$;

-- Restrict public data access to authenticated users only
DROP POLICY IF EXISTS "Everyone can view company strategy" ON public.company_strategy;
CREATE POLICY "Authenticated users can view company strategy" 
ON public.company_strategy 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Everyone can view ERP modules" ON public.erp_modules;
CREATE POLICY "Authenticated users can view ERP modules" 
ON public.erp_modules 
FOR SELECT 
USING (auth.uid() IS NOT NULL);