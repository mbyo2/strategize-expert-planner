-- Fix function search path warning
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;