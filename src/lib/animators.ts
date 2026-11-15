import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Branch = Database["public"]["Enums"]["branch"];
export type LanguageSkill = { code: string; level: "basic" | "good" | "fluent" };

export const animatorTag = (id: string) => `animator:${id}`;
export const animatorSlugTag = (slug: string) => `animator-slug:${slug}`;

// The logged-in animator's own profile, including private contact fields.
export async function getMyAnimator() {
  const user = await getCurrentUser();
  if (!user || user.role !== "animator") return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("animators")
    .select("*, animator_private(whatsapp_phone)")
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!data) return null;

  const { animator_private, ...animator } = data;
  return {
    ...animator,
    displayName: user.displayName,
    languages: (animator.languages ?? []) as LanguageSkill[],
    whatsappPhone: animator_private?.whatsapp_phone ?? null,
  };
}

export type PublicAnimator = {
  id: string;
  slug: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  birthYear: number | null;
  branches: Branch[];
  languages: LanguageSkill[];
  experienceYears: number | null;
  seekingJob: boolean;
  availableFrom: string | null;
  availableTo: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  ratingAvg: number | null;
  ratingCount: number;
};

// Public profile by slug. Cached on the server; invalidated by the
// animator:<id> tag when the profile is saved.
export async function getPublicAnimator(slug: string): Promise<PublicAnimator | null> {
  "use cache";
  cacheTag(animatorSlugTag(slug));
  cacheLife("hours");

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("animators")
    .select("*, profiles(display_name, avatar_url, banned_at), animator_scores(rating_avg, rating_count)")
    .eq("slug", slug)
    .maybeSingle();
  if (!data || !data.profiles || data.profiles.banned_at) return null;

  cacheTag(animatorTag(data.id));
  return {
    id: data.id,
    slug: data.slug,
    displayName: data.profiles.display_name,
    avatarUrl: data.profiles.avatar_url,
    bio: data.bio,
    city: data.city,
    birthYear: data.birth_year,
    branches: data.branches,
    languages: (data.languages ?? []) as LanguageSkill[],
    experienceYears: data.experience_years,
    seekingJob: data.seeking_job,
    availableFrom: data.available_from,
    availableTo: data.available_to,
    instagramUrl: data.instagram_url,
    tiktokUrl: data.tiktok_url,
    ratingAvg: data.animator_scores?.rating_avg ?? null,
    ratingCount: data.animator_scores?.rating_count ?? 0,
  };
}

// WhatsApp number of an animator. RLS returns it only to the owner,
// members of approved hotels and admins; everyone else gets null.
export async function getAnimatorContact(animatorId: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("animator_private")
    .select("whatsapp_phone")
    .eq("animator_id", animatorId)
    .maybeSingle();
  return data?.whatsapp_phone ?? null;
}
