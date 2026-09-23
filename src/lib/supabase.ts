import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://csbrbxvhmvpinpzsdwgo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wvNdDYJQPG247j55nuXCgg_D4p6eLDk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BetaUser {
  id?: string;
  email: string;
  full_name?: string | null;
  date_of_birth?: string | null;
  country?: string | null;
  created_at?: string;
}
