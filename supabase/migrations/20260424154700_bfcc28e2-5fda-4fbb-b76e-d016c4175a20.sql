-- Helper: updated_at trigger function (reuse pattern from existing tables)
CREATE OR REPLACE FUNCTION public.update_site_builder_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- sites
-- =========================================================
CREATE TABLE public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sites_organization_id ON public.sites(organization_id);
CREATE INDEX idx_sites_slug ON public.sites(slug);
CREATE INDEX idx_sites_is_published ON public.sites(is_published);

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view their sites"
  ON public.sites FOR SELECT
  USING (public.is_organization_member(organization_id, auth.uid()));

CREATE POLICY "Anyone can view published sites"
  ON public.sites FOR SELECT
  USING (is_published = true);

CREATE POLICY "Org admins can create sites"
  ON public.sites FOR INSERT
  WITH CHECK (
    public.is_organization_admin(organization_id, auth.uid())
    AND created_by = auth.uid()
  );

CREATE POLICY "Org admins can update sites"
  ON public.sites FOR UPDATE
  USING (public.is_organization_admin(organization_id, auth.uid()));

CREATE POLICY "Org admins can delete sites"
  ON public.sites FOR DELETE
  USING (public.is_organization_admin(organization_id, auth.uid()));

CREATE TRIGGER trg_sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.update_site_builder_updated_at();

-- =========================================================
-- site_pages
-- =========================================================
CREATE TABLE public.site_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_home boolean NOT NULL DEFAULT false,
  seo jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (site_id, slug)
);

CREATE INDEX idx_site_pages_site_id ON public.site_pages(site_id);

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- Security definer helpers to avoid recursive policy lookups and centralize site-scoped checks
CREATE OR REPLACE FUNCTION public.can_view_site(_site_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sites s
    WHERE s.id = _site_id
      AND (
        s.is_published = true
        OR public.is_organization_member(s.organization_id, auth.uid())
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_site(_site_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sites s
    WHERE s.id = _site_id
      AND public.is_organization_admin(s.organization_id, auth.uid())
  );
$$;

CREATE POLICY "Anyone can view pages of accessible sites"
  ON public.site_pages FOR SELECT
  USING (public.can_view_site(site_id));

CREATE POLICY "Org admins can insert pages"
  ON public.site_pages FOR INSERT
  WITH CHECK (public.can_manage_site(site_id));

CREATE POLICY "Org admins can update pages"
  ON public.site_pages FOR UPDATE
  USING (public.can_manage_site(site_id));

CREATE POLICY "Org admins can delete pages"
  ON public.site_pages FOR DELETE
  USING (public.can_manage_site(site_id));

CREATE TRIGGER trg_site_pages_updated_at
  BEFORE UPDATE ON public.site_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_site_builder_updated_at();

-- =========================================================
-- site_blocks
-- =========================================================
CREATE TABLE public.site_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.site_pages(id) ON DELETE CASCADE,
  parent_block_id uuid REFERENCES public.site_blocks(id) ON DELETE CASCADE,
  block_type text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  props jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_blocks_page_id ON public.site_blocks(page_id);
CREATE INDEX idx_site_blocks_parent ON public.site_blocks(parent_block_id);

ALTER TABLE public.site_blocks ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_view_page(_page_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.site_pages p
    WHERE p.id = _page_id
      AND public.can_view_site(p.site_id)
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_page(_page_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.site_pages p
    WHERE p.id = _page_id
      AND public.can_manage_site(p.site_id)
  );
$$;

CREATE POLICY "Anyone can view blocks of accessible pages"
  ON public.site_blocks FOR SELECT
  USING (public.can_view_page(page_id));

CREATE POLICY "Org admins can insert blocks"
  ON public.site_blocks FOR INSERT
  WITH CHECK (public.can_manage_page(page_id));

CREATE POLICY "Org admins can update blocks"
  ON public.site_blocks FOR UPDATE
  USING (public.can_manage_page(page_id));

CREATE POLICY "Org admins can delete blocks"
  ON public.site_blocks FOR DELETE
  USING (public.can_manage_page(page_id));

CREATE TRIGGER trg_site_blocks_updated_at
  BEFORE UPDATE ON public.site_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_site_builder_updated_at();

-- =========================================================
-- site_ai_conversations
-- =========================================================
CREATE TABLE public.site_ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_ai_conversations_site_id ON public.site_ai_conversations(site_id);
CREATE INDEX idx_site_ai_conversations_user_id ON public.site_ai_conversations(user_id);

ALTER TABLE public.site_ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own conversations on accessible sites"
  ON public.site_ai_conversations FOR SELECT
  USING (auth.uid() = user_id AND public.can_view_site(site_id));

CREATE POLICY "Users create their own conversations on managed sites"
  ON public.site_ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.can_manage_site(site_id));

CREATE POLICY "Users update their own conversations"
  ON public.site_ai_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete their own conversations"
  ON public.site_ai_conversations FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_site_ai_conversations_updated_at
  BEFORE UPDATE ON public.site_ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_site_builder_updated_at();