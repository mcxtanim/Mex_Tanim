import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mbchiojrtufgmchyuxpp.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iY2hpb2pydHVmZ21jaHl1eHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTM2MTAsImV4cCI6MjEwNDc4OTYxMH0.i0RGz8eDzV9LylQ65_yMoG1OhoAmUuUZwZ4_kvAyZqs';

let supabaseInstance: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.warn('Supabase initialization error:', error);
}

export const supabase = supabaseInstance;
