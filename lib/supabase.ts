import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';



// Debug log to verify key version
console.log('Supabase Key loaded:', supabaseAnonKey.substring(0, 10) + '...' + supabaseAnonKey.substring(supabaseAnonKey.length - 5));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
