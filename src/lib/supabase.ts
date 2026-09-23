import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BetaUser {
  id?: string;
  email: string;
  full_name?: string | null;
  date_of_birth?: string | null;
  country?: string | null;
  created_at?: string;
}
