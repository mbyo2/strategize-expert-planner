-- Fix: Add RLS policies for user_roles table
-- Currently only SELECT policy exists, blocking all role management operations

-- Allow admins to manage all user roles (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role_level(auth.uid(), 'admin'::text));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role_level(auth.uid(), 'admin'::text))
WITH CHECK (has_role_level(auth.uid(), 'admin'::text));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role_level(auth.uid(), 'admin'::text));

-- Security constraint: Prevent users from modifying their own roles
-- This prevents privilege escalation attacks
CREATE POLICY "Users cannot modify their own roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (auth.uid() != user_id);