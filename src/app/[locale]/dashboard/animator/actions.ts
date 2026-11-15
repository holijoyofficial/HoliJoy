"use server";

import { updateTag } from "next/cache";
import { animatorSlugTag, animatorTag } from "@/lib/animators";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { toFieldErrors, type FormState } from "@/lib/validation/auth";
import { animatorProfileSchema, PROFILE_LANGUAGES } from "@/lib/validation/animator";

export async function saveAnimatorProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "animator") return { status: "error", message: "notAllowed" };

  const languages = PROFILE_LANGUAGES.flatMap((code) => {
    const level = formData.get(`lang_${code}`);
    return typeof level === "string" && level ? [{ code, level }] : [];
  });

  const parsed = animatorProfileSchema.safeParse({
    displayName: formData.get("displayName") ?? "",
    city: formData.get("city") ?? "",
    bio: formData.get("bio") ?? "",
    birthYear: formData.get("birthYear") ?? "",
    experienceYears: formData.get("experienceYears") ?? "",
    branches: formData.getAll("branches"),
    languages,
    seekingJob: formData.get("seekingJob") === "on",
    availableFrom: formData.get("availableFrom") ?? "",
    availableTo: formData.get("availableTo") ?? "",
    instagramUrl: formData.get("instagramUrl") ?? "",
    tiktokUrl: formData.get("tiktokUrl") ?? "",
    whatsappPhone: formData.get("whatsappPhone") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", message: "fixErrors", fieldErrors: toFieldErrors(parsed.error) };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const { data: animator, error: findError } = await supabase
    .from("animators")
    .select("id, slug")
    .eq("profile_id", user.id)
    .single();
  if (findError || !animator) return { status: "error", message: "generic" };

  const [profileRes, animatorRes, privateRes] = await Promise.all([
    supabase.from("profiles").update({ display_name: v.displayName }).eq("id", user.id),
    supabase
      .from("animators")
      .update({
        city: v.city,
        bio: v.bio,
        birth_year: v.birthYear,
        experience_years: v.experienceYears,
        branches: v.branches,
        languages: v.languages,
        seeking_job: v.seekingJob,
        available_from: v.availableFrom,
        available_to: v.availableTo,
        instagram_url: v.instagramUrl,
        tiktok_url: v.tiktokUrl,
      })
      .eq("id", animator.id),
    supabase.from("animator_private").update({ whatsapp_phone: v.whatsappPhone }).eq("animator_id", animator.id),
  ]);

  const failed = [profileRes.error, animatorRes.error, privateRes.error].find(Boolean);
  if (failed) {
    console.error("saveAnimatorProfile failed", failed.code, failed.message);
    return { status: "error", message: "generic" };
  }

  updateTag(animatorTag(animator.id));
  updateTag(animatorSlugTag(animator.slug));
  return { status: "success" };
}
