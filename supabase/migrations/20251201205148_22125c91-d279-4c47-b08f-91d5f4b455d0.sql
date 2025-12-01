-- Fix mask_phone_number function to set search_path
CREATE OR REPLACE FUNCTION public.mask_phone_number(phone text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $function$
  SELECT CASE 
    WHEN phone IS NULL THEN NULL
    WHEN length(phone) <= 4 THEN '****'
    ELSE '***-***-' || right(phone, 4)
  END;
$function$;