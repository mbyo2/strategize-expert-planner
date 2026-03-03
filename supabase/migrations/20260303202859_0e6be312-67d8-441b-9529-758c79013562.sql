-- Fix audit_org_member_changes to cast arguments properly
CREATE OR REPLACE FUNCTION public.audit_org_member_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.create_audit_log(
      'member_removed'::text,
      'organization_member'::text,
      OLD.id::text,
      row_to_json(OLD)::jsonb,
      NULL::jsonb
    );
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM public.create_audit_log(
      'member_added'::text,
      'organization_member'::text,
      NEW.id::text,
      NULL::jsonb,
      row_to_json(NEW)::jsonb
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.create_audit_log(
      'member_updated'::text,
      'organization_member'::text,
      NEW.id::text,
      row_to_json(OLD)::jsonb,
      row_to_json(NEW)::jsonb
    );
    RETURN NEW;
  END IF;
END;
$function$;

-- Now insert missing organization members
INSERT INTO public.organization_members (organization_id, user_id, role)
SELECT p.organization_id, p.id, COALESCE(ur.role::text, 'viewer')
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
WHERE p.organization_id IS NOT NULL
ON CONFLICT (organization_id, user_id) DO UPDATE SET role = EXCLUDED.role;