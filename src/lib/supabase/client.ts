import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";

// Supabase client for Client Components (runs in the browser).
// Reads only; all writes go through Server Actions / route handlers.
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
