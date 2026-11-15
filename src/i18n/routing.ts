import { defineRouting } from "next-intl/routing";

// Turkish is the main language of the site; English is the second.
// Route segments are always English (e.g. /tr/animators, /en/animators).
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
});

export type Locale = (typeof routing.locales)[number];
