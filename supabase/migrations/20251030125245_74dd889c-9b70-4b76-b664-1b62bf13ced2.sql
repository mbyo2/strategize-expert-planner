-- Add RLS policies for user_roles table to prevent privilege escalation
-- Only admins should be able to modify roles

-- Policy for INSERT: Only admins can assign roles
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role_level(auth.uid(), 'admin'));

-- Policy for UPDATE: Only admins can update roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role_level(auth.uid(), 'admin'));

-- Policy for DELETE: Only admins can delete roles
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role_level(auth.uid(), 'admin'));