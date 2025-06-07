
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://ublzhmimdynqzqsdicyn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibHpobWltZHlucXpxc2RpY3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NzA0MjgsImV4cCI6MjA1OTM0NjQyOH0.2bWAvNa_LkoQb381aRRdEYqdV4GI5Cys0vaI7UFDE-w"

// Create a single instance with proper configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
