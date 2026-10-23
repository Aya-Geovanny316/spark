import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

function requireUrl() {
  if (!url) throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_URL");
  return url;
}

export function getSupabaseAuthClient(): SupabaseClient {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!key) throw new Error("Falta NEXT_PUBLIC_SUPABASE_ANON_KEY o SUPABASE_ANON_KEY");
  return createClient(requireUrl(), key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

export function getSupabaseAdminClient(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
  return createClient(requireUrl(), key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}
