ALTER TABLE public.user_roles DISABLE TRIGGER USER;
ALTER TABLE public.profiles DISABLE TRIGGER USER;

INSERT INTO public.user_roles (user_id, role)
VALUES ('da5f6568-a9d5-461b-81c3-3b0d2532870c', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

UPDATE public.profiles
SET role = 'admin',
    organization_id = '550e8400-e29b-41d4-a716-446655440001',
    name = COALESCE(NULLIF(name, ''), 'Super Admin')
WHERE id = 'da5f6568-a9d5-461b-81c3-3b0d2532870c';

INSERT INTO public.organization_members (organization_id, user_id, role)
VALUES ('550e8400-e29b-41d4-a716-446655440001', 'da5f6568-a9d5-461b-81c3-3b0d2532870c', 'admin')
ON CONFLICT (organization_id, user_id) DO UPDATE SET role = 'admin';

ALTER TABLE public.user_roles ENABLE TRIGGER USER;
ALTER TABLE public.profiles ENABLE TRIGGER USER;