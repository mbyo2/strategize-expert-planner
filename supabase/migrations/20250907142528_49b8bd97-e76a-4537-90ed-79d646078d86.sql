-- Remove problematic security definer setting from orders_redacted view
DROP VIEW IF EXISTS public.orders_redacted;

-- Recreate without security barrier/definer
CREATE VIEW public.orders_redacted AS
SELECT 
  id,
  user_id,
  amount,
  currency,
  status,
  created_at,
  updated_at
FROM public.orders
WHERE user_id = auth.uid(); -- Add direct RLS in the view