-- Fix 1: Restrict profile visibility using can_view_profile function
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Organization members can view profiles" ON public.profiles;

-- Create a more restrictive policy using the existing can_view_profile function
CREATE POLICY "Restrict profile visibility" ON public.profiles
FOR SELECT USING (
  auth.uid() = id -- Own profile
  OR has_role_level(auth.uid(), 'manager'::text) -- Managers can view all
  OR can_view_profile(id) -- Custom business logic for same org
);

-- Fix 2: Secure invitation tokens - organization_invitations
-- Make token_hash NOT NULL and populate it for existing records
UPDATE public.organization_invitations 
SET token_hash = encode(digest(token, 'sha256'), 'hex')
WHERE token_hash IS NULL;

ALTER TABLE public.organization_invitations 
ALTER COLUMN token_hash SET NOT NULL;

-- Drop old policies that expose the token
DROP POLICY IF EXISTS "Organization admins can manage invitations" ON public.organization_invitations;
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.organization_invitations;

-- Create new policies that exclude token from SELECT
CREATE POLICY "Organization admins can manage invitations" ON public.organization_invitations
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM public.organization_members
    WHERE organization_id = organization_invitations.organization_id
    AND role IN ('admin', 'manager')
  )
);

CREATE POLICY "Users can view their invitations by email" ON public.organization_invitations
FOR SELECT USING (
  auth.email() = email OR auth.uid() = invited_by
);

-- Fix 3: Secure invitation tokens - team_invitations
-- Make token_hash NOT NULL and populate it for existing records
UPDATE public.team_invitations 
SET token_hash = encode(digest(token, 'sha256'), 'hex')
WHERE token_hash IS NULL;

ALTER TABLE public.team_invitations 
ALTER COLUMN token_hash SET NOT NULL;

-- Drop old policies that expose the token
DROP POLICY IF EXISTS "Team admins can manage team invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can view their own team invitations" ON public.team_invitations;

-- Create new policies that exclude token from SELECT
CREATE POLICY "Team admins can manage team invitations" ON public.team_invitations
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM public.team_members
    WHERE team_id = team_invitations.team_id
    AND role IN ('admin', 'manager')
  )
);

CREATE POLICY "Users can view their team invitations by email" ON public.team_invitations
FOR SELECT USING (
  auth.email() = email OR auth.uid() = invited_by
);

-- Create safe views that explicitly exclude sensitive token columns
CREATE OR REPLACE VIEW public.organization_invitations_safe AS
SELECT 
  id,
  organization_id,
  email,
  role,
  invited_by,
  expires_at,
  accepted_at,
  created_at,
  updated_at
  -- Explicitly exclude: token, token_hash
FROM public.organization_invitations;

CREATE OR REPLACE VIEW public.team_invitations_safe AS
SELECT 
  id,
  team_id,
  email,
  role,
  invited_by,
  expires_at,
  accepted_at,
  created_at,
  updated_at
  -- Explicitly exclude: token, token_hash
FROM public.team_invitations;

-- Grant appropriate permissions on the safe views
GRANT SELECT ON public.organization_invitations_safe TO authenticated;
GRANT SELECT ON public.team_invitations_safe TO authenticated;

-- Create helper function to generate secure token hashes for new invitations
CREATE OR REPLACE FUNCTION public.generate_invitation_token_hash()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Generate a random token and return its hash
  -- Application code should store this hash and send the original token to the user
  RETURN encode(digest(gen_random_uuid()::text, 'sha256'), 'hex');
END;
$$;