
-- Create "orders" table to securely track user purchases/payments with international compliance
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER,             -- Amount charged (in smallest currency unit, e.g. cents)
  currency TEXT DEFAULT 'usd',
  status TEXT,                -- e.g., 'pending', 'paid', 'failed'
  metadata JSONB,             -- Additional payment/session details, if needed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: users can select only their own orders
CREATE POLICY "select_own_orders" ON public.orders
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: users can insert their own orders
CREATE POLICY "insert_own_orders" ON public.orders
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: users can update their own orders (for order status/metadata updates)
CREATE POLICY "update_own_orders" ON public.orders
  FOR UPDATE
  USING (user_id = auth.uid());

-- (Admins can be given additional access via future policies if you ever add a user_roles table)
