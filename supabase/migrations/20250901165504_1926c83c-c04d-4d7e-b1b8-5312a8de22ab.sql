-- Enable leaked password protection
UPDATE auth.config 
SET value = 'true' 
WHERE parameter = 'password_min_length';

-- Ensure password strength requirements
UPDATE auth.config 
SET value = '8' 
WHERE parameter = 'password_min_length';

-- Enable password complexity checks if available
INSERT INTO auth.config (parameter, value) 
VALUES ('password_complexity_enabled', 'true')
ON CONFLICT (parameter) DO UPDATE SET value = 'true';