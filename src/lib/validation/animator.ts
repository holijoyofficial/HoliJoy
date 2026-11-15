import { z } from "zod";
import { Constants } from "@/lib/supabase/database.types";

export const BRANCHES = Constants.public.Enums.branch;
export const LANGUAGE_LEVELS = ["basic", "good", "fluent"] as const;
// Languages offered in the profile form (ISO 639-1); names come from Intl.DisplayNames
export const PROFILE_LANGUAGES = ["tr", "en", "ru", "de", "fr", "es", "it", "nl", "pl", "uk", "ar", "fa"] as const;

const optionalUrl = (host: RegExp) =>
  z
    .string()
    .trim()
    .max(200)
    .refine((v) => v === "" || (URL.canParse(v) && host.test(new URL(v).hostname)), "invalidUrl")
    .transform((v) => (v === "" ? null : v));

const optionalInt = (min: number, max: number) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || (/^\d+$/.test(v) && +v >= min && +v <= max), "outOfRange")
    .transform((v) => (v === "" ? null : Number(v)));

const optionalDate = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "invalidDate")
  .transform((v) => (v === "" ? null : v));

export const animatorProfileSchema = z
  .object({
    displayName: z.string().trim().min(2, "nameTooShort").max(80, "nameTooLong"),
    city: z.string().trim().max(80).transform((v) => v || null),
    bio: z.string().trim().max(1500, "bioTooLong").transform((v) => v || null),
    birthYear: optionalInt(1950, 2015),
    experienceYears: optionalInt(0, 60),
    branches: z.array(z.enum(BRANCHES)).max(10),
    languages: z
      .array(z.object({ code: z.enum(PROFILE_LANGUAGES), level: z.enum(LANGUAGE_LEVELS) }))
      .max(PROFILE_LANGUAGES.length),
    seekingJob: z.boolean(),
    availableFrom: optionalDate,
    availableTo: optionalDate,
    instagramUrl: optionalUrl(/(^|\.)instagram\.com$/),
    tiktokUrl: optionalUrl(/(^|\.)tiktok\.com$/),
    // E.164, e.g. +905551112233; spaces and dashes are stripped first
    whatsappPhone: z
      .string()
      .transform((v) => v.replace(/[\s\-()]/g, ""))
      .refine((v) => v === "" || /^\+[1-9]\d{7,14}$/.test(v), "invalidPhone")
      .transform((v) => (v === "" ? null : v)),
  })
  .refine((v) => !v.availableFrom || !v.availableTo || v.availableFrom <= v.availableTo, {
    message: "dateOrder",
    path: ["availableTo"],
  });

export type AnimatorProfileInput = z.input<typeof animatorProfileSchema>;
