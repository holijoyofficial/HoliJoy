import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import type { Database } from "./database.types";
import { supabaseKey, supabaseUrl } from "./env";

// Supabase client for Server Components, Server Actions and route handlers.
// Create a new one per request; never share it between requests.
export async function createClient() {
  const cookieStore = await cookies();
  // Supabase checks token expiry with the current time. Wait for the real
  // request so runtime prefetching never runs this part ahead of time.
  await connection();

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore: the proxy refreshes the session cookie.
        }
      },
    },
  });
}
