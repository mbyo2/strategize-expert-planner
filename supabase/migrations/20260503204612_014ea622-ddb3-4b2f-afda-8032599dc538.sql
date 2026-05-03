WITH agg AS (
  SELECT c.organization_id,
         array_agg(DISTINCT m) AS modules
  FROM public.organization_erp_config c
  LEFT JOIN LATERAL unnest(c.active_modules) m ON TRUE
  GROUP BY c.organization_id
),
keepers AS (
  SELECT DISTINCT ON (organization_id) id, organization_id
  FROM public.organization_erp_config
  ORDER BY organization_id, updated_at DESC NULLS LAST, created_at DESC NULLS LAST
)
UPDATE public.organization_erp_config c
SET active_modules = COALESCE(agg.modules, ARRAY[]::text[])
FROM keepers k, agg
WHERE c.id = k.id AND k.organization_id = agg.organization_id;

DELETE FROM public.organization_erp_config c
WHERE c.id NOT IN (
  SELECT DISTINCT ON (organization_id) id
  FROM public.organization_erp_config
  ORDER BY organization_id, updated_at DESC NULLS LAST, created_at DESC NULLS LAST
);

ALTER TABLE public.organization_erp_config
  ADD CONSTRAINT organization_erp_config_organization_id_key UNIQUE (organization_id);