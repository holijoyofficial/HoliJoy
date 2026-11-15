import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Target of the sign-up confirmation link.
// - Default Supabase template: Supabase verifies the email first, then sends
//   the user here with ?code=… (PKCE). Exchanging it logs the user in, but only
//   in the browser that signed up. In another browser the exchange fails; the
//   email is still confirmed, so we send the user to the login page.
// - Custom template (after our SMTP is set up): ?token_hash=…&type=email.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const url = request.nextUrl;
  const next = safeNext(url.searchParams.get("next"), locale);
  const loginUrl = (flag: string) => new URL(`/${locale}/login?${flag}`, url.origin);

  if (url.searchParams.get("error")) {
    return NextResponse.redirect(loginUrl("linkError=1"));
  }

  const supabase = await createClient();

  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(error ? loginUrl("confirmed=1") : new URL(next, url.origin));
  }

  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    return NextResponse.redirect(error ? loginUrl("linkError=1") : new URL(next, url.origin));
  }

  return NextResponse.redirect(loginUrl("linkError=1"));
}

// Only allow same-site relative paths to avoid open redirects
function safeNext(value: string | null, locale: string) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return `/${locale}/dashboard`;
}
