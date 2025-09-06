-- Fix security definer view issue
DROP VIEW IF EXISTS public.orders_redacted;

-- Recreate view without security definer (uses default security invoker)
CREATE VIEW public.orders_redacted AS
SELECT 
  id,
  user_id,
  amount,
  currency,
  status,
  created_at,
  updated_at
FROM public.orders;