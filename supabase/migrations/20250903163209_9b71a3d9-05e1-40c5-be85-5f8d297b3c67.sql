-- Fix critical RLS policy issues

-- Drop and recreate recommendations table with proper RLS
DROP TABLE IF EXISTS public.recommendations CASCADE;

CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium'::text,
  category TEXT NOT NULL DEFAULT 'general'::text,
  status TEXT NOT NULL DEFAULT 'pending'::text,
  confidence_score NUMERIC,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create secure policies for recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.recommendations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations" 
ON public.recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" 
ON public.recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations" 
ON public.recommendations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Drop and recreate strategic_pillars table with proper RLS
DROP TABLE IF EXISTS public.strategic_pillars CASCADE;

CREATE TABLE public.strategic_pillars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.strategic_pillars ENABLE ROW LEVEL SECURITY;

-- Create secure policies for strategic_pillars
CREATE POLICY "Users can view their own strategic pillars" 
ON public.strategic_pillars 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own strategic pillars" 
ON public.strategic_pillars 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strategic pillars" 
ON public.strategic_pillars 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own strategic pillars" 
ON public.strategic_pillars 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create secure session hash function
CREATE OR REPLACE FUNCTION public.create_secure_session_hash(user_id_param UUID)
RETURNS TEXT AS $$
BEGIN
  -- Create a secure hash that doesn't expose the actual access token
  RETURN encode(
    digest(
      user_id_param::text || extract(epoch from now())::text || gen_random_uuid()::text,
      'sha256'
    ),
    'hex'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;