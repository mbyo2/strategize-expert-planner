
CREATE TABLE public.competitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  market_share NUMERIC DEFAULT 0,
  change_percentage NUMERIC DEFAULT 0,
  strengths TEXT[] DEFAULT '{}',
  threats TEXT[] DEFAULT '{}',
  website TEXT,
  industry TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Analysts can view competitors" ON public.competitors FOR SELECT USING (has_role_level(auth.uid(), 'analyst'::text));
CREATE POLICY "Managers can create competitors" ON public.competitors FOR INSERT WITH CHECK (has_role_level(auth.uid(), 'manager'::text));
CREATE POLICY "Managers can update competitors" ON public.competitors FOR UPDATE USING (has_role_level(auth.uid(), 'manager'::text));
CREATE POLICY "Admins can delete competitors" ON public.competitors FOR DELETE USING (has_role_level(auth.uid(), 'admin'::text));
