-- Fix Security Definer Views - recreate with SECURITY INVOKER

-- Drop and recreate orders_redacted view
DROP VIEW IF EXISTS public.orders_redacted;
CREATE VIEW public.orders_redacted 
WITH (security_invoker = true)
AS 
SELECT 
    id,
    user_id,
    amount,
    currency,
    status,
    created_at,
    updated_at,
    stripe_session_id
FROM orders;

-- Drop and recreate organization_invitations_safe view
DROP VIEW IF EXISTS public.organization_invitations_safe;
CREATE VIEW public.organization_invitations_safe 
WITH (security_invoker = true)
AS 
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
FROM organization_invitations;

-- Drop and recreate team_invitations_safe view
DROP VIEW IF EXISTS public.team_invitations_safe;
CREATE VIEW public.team_invitations_safe 
WITH (security_invoker = true)
AS 
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
FROM team_invitations;

-- Drop and recreate user_sessions_safe view
DROP VIEW IF EXISTS public.user_sessions_safe;
CREATE VIEW public.user_sessions_safe 
WITH (security_invoker = true)
AS 
SELECT 
    id,
    user_id,
    session_hash,
    ip_address,
    user_agent,
    created_at,
    last_activity,
    expires_at,
    is_active
FROM user_sessions;