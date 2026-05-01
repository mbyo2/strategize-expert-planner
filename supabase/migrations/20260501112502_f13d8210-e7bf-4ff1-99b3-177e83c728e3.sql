-- Disable role-guard triggers during cleanup
ALTER TABLE public.user_roles DISABLE TRIGGER USER;
ALTER TABLE public.profiles DISABLE TRIGGER USER;
ALTER TABLE public.organization_members DISABLE TRIGGER USER;

DO $$
DECLARE
  test_ids uuid[] := ARRAY(
    SELECT id FROM auth.users
    WHERE email IN ('admin@techcorp.com','analyst@techcorp.com','manager@techcorp.com','viewer@techcorp.com')
  );
BEGIN
  IF array_length(test_ids, 1) IS NULL THEN
    RETURN;
  END IF;

  -- Public tables referencing auth.users
  DELETE FROM public.activity_logs              WHERE user_id      = ANY(test_ids);
  DELETE FROM public.analytics_events           WHERE user_id      = ANY(test_ids);
  DELETE FROM public.audit_logs                 WHERE user_id      = ANY(test_ids);
  UPDATE public.company_strategy SET updated_by = NULL WHERE updated_by = ANY(test_ids);
  DELETE FROM public.competitors                WHERE created_by   = ANY(test_ids);
  DELETE FROM public.data_imports               WHERE user_id      = ANY(test_ids);
  DELETE FROM public.goal_attachments           WHERE user_id      = ANY(test_ids);
  DELETE FROM public.goal_comments              WHERE user_id      = ANY(test_ids);
  UPDATE public.initiative_milestones SET assigned_to = NULL WHERE assigned_to = ANY(test_ids);
  DELETE FROM public.notifications              WHERE "userId"      = ANY(test_ids);
  DELETE FROM public.oauth_connections          WHERE user_id      = ANY(test_ids);
  DELETE FROM public.orders                     WHERE user_id      = ANY(test_ids);
  UPDATE public.organization_invitations SET invited_by = NULL WHERE invited_by = ANY(test_ids);
  DELETE FROM public.organization_members       WHERE user_id      = ANY(test_ids);
  UPDATE public.organization_members SET invited_by = NULL WHERE invited_by = ANY(test_ids);
  UPDATE public.planning_initiatives SET owner_id = NULL WHERE owner_id = ANY(test_ids);
  DELETE FROM public.strategic_goals            WHERE user_id      = ANY(test_ids) OR owner_id = ANY(test_ids);
  DELETE FROM public.support_ticket_comments    WHERE user_id      = ANY(test_ids);
  UPDATE public.support_tickets SET assigned_to = NULL WHERE assigned_to = ANY(test_ids);
  DELETE FROM public.support_tickets            WHERE user_id      = ANY(test_ids);
  UPDATE public.team_invitations SET invited_by = NULL WHERE invited_by = ANY(test_ids);
  UPDATE public.team_members SET invited_by = NULL WHERE invited_by = ANY(test_ids);
  DELETE FROM public.team_members               WHERE user_id      = ANY(test_ids);
  DELETE FROM public.user_mfa_methods           WHERE user_id      = ANY(test_ids);
  DELETE FROM public.user_roles                 WHERE user_id      = ANY(test_ids);
  DELETE FROM public.user_sessions              WHERE user_id      = ANY(test_ids);
  DELETE FROM public.profiles                   WHERE id           = ANY(test_ids);

  -- Finally delete the auth users (auth.* FKs cascade)
  DELETE FROM auth.users WHERE id = ANY(test_ids);
END
$$;

ALTER TABLE public.user_roles ENABLE TRIGGER USER;
ALTER TABLE public.profiles ENABLE TRIGGER USER;
ALTER TABLE public.organization_members ENABLE TRIGGER USER;