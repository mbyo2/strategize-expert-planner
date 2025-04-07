
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const SUPABASE_URL = "https://ublzhmimdynqzqsdicyn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibHpobWltZHlucXpxc2RpY3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NzA0MjgsImV4cCI6MjA1OTM0NjQyOH0.2bWAvNa_LkoQb381aRRdEYqdV4GI5Cys0vaI7UFDE-w";

export const customSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
