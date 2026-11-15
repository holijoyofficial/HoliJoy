import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export type CurrentUser = {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
};

// Data Access Layer: the one place that reads the session.
// Reads cookies, so callers must render inside a <Suspense> boundary.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name, banned_at")
    .eq("id", claims.sub)
    .maybeSingle();
  if (!profile || profile.banned_at) return null;

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    role: profile.role,
    displayName: profile.display_name,
  };
});
