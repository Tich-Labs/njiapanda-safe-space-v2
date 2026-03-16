import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Create a dummy client if credentials aren't available
const isConfigured = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY && !SUPABASE_URL.includes('your_');

export const supabase: SupabaseClient = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null as unknown as SupabaseClient;

// Helper to check if Supabase is available
export const isSupabaseConfigured = () => isConfigured;
