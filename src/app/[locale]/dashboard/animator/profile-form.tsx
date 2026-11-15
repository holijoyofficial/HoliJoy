"use client";

import { useLocale, useTranslations } from "next-intl";
import { saveAnimatorProfile } from "./actions";
import { FormField, FormMessage } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/validation/auth";
import { useFormAction } from "@/lib/use-form-action";
import { BRANCHES, LANGUAGE_LEVELS, PROFILE_LANGUAGES } from "@/lib/validation/animator";

export type ProfileFormValues = {
  displayName: string;
  city: string;
  bio: string;
  birthYear: string;
  experienceYears: string;
  branches: string[];
  languages: Record<string, string>;
  seekingJob: boolean;
  availableFrom: string;
  availableTo: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappPhone: string;
};

const initial: FormState = { status: "idle" };

export function ProfileForm({ values }: { values: ProfileFormValues }) {
  const t = useTranslations("AnimatorProfileForm");
  const tb = useTranslations("Branches");
  const tl = useTranslations("LanguageLevels");
  const locale = useLocale();
  const languageName = new Intl.DisplayNames([locale], { type: "language" });
  const [state, onSubmit, pending] = useFormAction(saveAnimatorProfile, initial);
  const err = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate>
      <Section title={t("sections.basics")}>
        <FormField id="displayName" label={t("displayName")} error={err.displayName}>
          <Input id="displayName" name="displayName" defaultValue={values.displayName} required />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField id="city" label={t("city")} error={err.city}>
            <Input id="city" name="city" defaultValue={values.city} autoComplete="address-level2" />
          </FormField>
          <FormField id="birthYear" label={t("birthYear")} error={err.birthYear}>
            <Input id="birthYear" name="birthYear" inputMode="numeric" defaultValue={values.birthYear} />
          </FormField>
          <FormField id="experienceYears" label={t("experienceYears")} error={err.experienceYears}>
            <Input
              id="experienceYears"
              name="experienceYears"
              inputMode="numeric"
              defaultValue={values.experienceYears}
            />
          </FormField>
        </div>
        <FormField id="bio" label={t("bio")} error={err.bio} hint={t("bioHint")}>
          <Textarea id="bio" name="bio" rows={5} maxLength={1500} defaultValue={values.bio} />
        </FormField>
      </Section>

      <Section title={t("sections.branches")}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BRANCHES.map((b) => (
            <label key={b} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm has-checked:border-sea has-checked:bg-sea/5">
              <input
                type="checkbox"
                name="branches"
                value={b}
                defaultChecked={values.branches.includes(b)}
                className="accent-[var(--sea)]"
              />
              {tb(b)}
            </label>
          ))}
        </div>
      </Section>

      <Section title={t("sections.languages")}>
        <div className="grid gap-2 sm:grid-cols-2">
          {PROFILE_LANGUAGES.map((code) => (
            <label key={code} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
              <span className="capitalize">{languageName.of(code)}</span>
              <select
                name={`lang_${code}`}
                aria-label={languageName.of(code)}
                defaultValue={values.languages[code] ?? ""}
                className="rounded-md border bg-background px-2 py-1 text-sm"
              >
                <option value="">—</option>
                {LANGUAGE_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {tl(lvl)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </Section>

      <Section title={t("sections.availability")}>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="seekingJob" defaultChecked={values.seekingJob} className="accent-[var(--sea)]" />
          {t("seekingJob")}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="availableFrom" label={t("availableFrom")} error={err.availableFrom}>
            <Input id="availableFrom" name="availableFrom" type="date" defaultValue={values.availableFrom} />
          </FormField>
          <FormField id="availableTo" label={t("availableTo")} error={err.availableTo}>
            <Input id="availableTo" name="availableTo" type="date" defaultValue={values.availableTo} />
          </FormField>
        </div>
      </Section>

      <Section title={t("sections.contact")}>
        <FormField id="whatsappPhone" label={t("whatsappPhone")} error={err.whatsappPhone} hint={t("whatsappHint")}>
          <Input
            id="whatsappPhone"
            name="whatsappPhone"
            type="tel"
            placeholder="+90 555 111 22 33"
            defaultValue={values.whatsappPhone}
            autoComplete="tel"
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="instagramUrl" label="Instagram" error={err.instagramUrl}>
            <Input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              placeholder="https://instagram.com/…"
              defaultValue={values.instagramUrl}
            />
          </FormField>
          <FormField id="tiktokUrl" label="TikTok" error={err.tiktokUrl}>
            <Input
              id="tiktokUrl"
              name="tiktokUrl"
              type="url"
              placeholder="https://tiktok.com/@…"
              defaultValue={values.tiktokUrl}
            />
          </FormField>
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
        {state.status === "success" ? (
          <p role="status" className="text-sm text-sea">
            {t("saved")}
          </p>
        ) : (
          <FormMessage error={state.message} />
        )}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4">
      <legend className="mb-1 font-heading text-lg font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}
