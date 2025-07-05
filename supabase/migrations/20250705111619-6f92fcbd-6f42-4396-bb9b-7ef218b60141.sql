-- Step 1: Add superuser role to the enum (must be in separate transaction)
ALTER TYPE user_role ADD VALUE 'superuser';