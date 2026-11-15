import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { refreshSupabaseSession } from "@/lib/supabase/proxy";

const intlProxy = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Locale detection / redirect (/ -> /tr)
  const response = intlProxy(request);
  // 2. Keep the Supabase auth cookie fresh (no-op until env vars are set)
  return refreshSupabaseSession(request, response);
}

export const config = {
  // Skip API routes, Next.js internals, Vercel internals and static files.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
