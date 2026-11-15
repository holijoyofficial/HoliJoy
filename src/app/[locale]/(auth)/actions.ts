"use server";

import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  logInSchema,
  signUpSchema,
  toFieldErrors,
  type FormState,
} from "@/lib/validation/auth";

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { role: raw.role ?? "", displayName: raw.displayName ?? "", email: raw.email ?? "" };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error), values };
  }

  const locale = await getLocale();
  const origin = await siteOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/${locale}/auth/confirm?next=/${locale}/dashboard`,
      // Read by the database trigger that creates the profile
      data: { role: parsed.data.role, display_name: parsed.data.displayName, locale },
    },
  });

  if (error) {
    if (error.code === "weak_password") {
      return { status: "error", fieldErrors: { password: "passwordWeak" }, values };
    }
    if (error.code === "over_email_send_rate_limit" || error.status === 429) {
      return { status: "error", message: "tooManyEmails", values };
    }
    console.error("signUp failed", error.code, error.message);
    return { status: "error", message: "generic", values };
  }

  // Same answer whether or not the email already exists (no account enumeration)
  return { status: "success", values: { email: parsed.data.email } };
}

export async function logIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { email: raw.email ?? "" };

  const parsed = logInSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error), values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "email_not_confirmed") {
      return { status: "error", message: "emailNotConfirmed", values };
    }
    if (error.code === "invalid_credentials") {
      return { status: "error", message: "invalidCredentials", values };
    }
    console.error("logIn failed", error.code, error.message);
    return { status: "error", message: "generic", values };
  }

  const locale = await getLocale();
  redirect({ href: "/dashboard", locale });
  return { status: "success" };
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  redirect({ href: "/", locale });
}
