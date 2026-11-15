"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { isDemoMode } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";

const accounts = {
  animator: () => [process.env.DEMO_ANIMATOR_EMAIL, process.env.DEMO_ANIMATOR_PASSWORD],
  hotel: () => [process.env.DEMO_HOTEL_EMAIL, process.env.DEMO_HOTEL_PASSWORD],
} as const;

// One-click login as a demo account. Credentials stay on the server.
export async function demoLogIn(formData: FormData) {
  const locale = await getLocale();
  const role = formData.get("role");
  if (!isDemoMode() || (role !== "animator" && role !== "hotel")) {
    return redirect({ href: "/", locale });
  }

  const [email, password] = accounts[role]();
  if (!email || !password) return redirect({ href: "/demo?error=1", locale });

  const supabase = await createClient();
  await supabase.auth.signOut();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return redirect({ href: "/demo?error=1", locale });

  return redirect({ href: "/dashboard", locale });
}

// Log out to see the site the way a guest does.
export async function demoGuest() {
  const locale = await getLocale();
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect({ href: `/animators/deniz-demo`, locale });
}
