-- 1. Privilege escalation fix on user_roles
DROP POLICY IF EXISTS "Users cannot modify their own roles" ON public.user_roles;

-- 2. Drones over-permissive policies
DROP POLICY IF EXISTS "Military personnel can update drones" ON public.drones;
DROP POLICY IF EXISTS "Military personnel can view drones" ON public.drones;

-- 3. Drop plain-text invitation token (token_hash remains)
ALTER TABLE public.organization_invitations DROP COLUMN IF EXISTS token;