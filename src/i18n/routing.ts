import { defineRouting } from "next-intl/routing";

// Turkish is the main language of the site; English and Russian are secondary.
// More languages will be added later (new language = new messages/<code>.json).
// Route segments are always English (e.g. /tr/animators, /en/animators, /ru/animators).
export const routing = defineRouting({
  locales: ["tr", "en", "ru"],
  defaultLocale: "tr",
});

export type Locale = (typeof routing.locales)[number];
