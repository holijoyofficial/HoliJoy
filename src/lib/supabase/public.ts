import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabaseKey, supabaseUrl } from "./env";

// Cookie-less client for public data (no user session). Safe to use inside
// `'use cache'` functions because it does not read the request.
export function createPublicClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
