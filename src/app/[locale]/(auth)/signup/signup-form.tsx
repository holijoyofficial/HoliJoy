"use client";

import { useTranslations } from "next-intl";
import { signUp } from "../actions";
import { FormField, FormMessage } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import type { FormState } from "@/lib/validation/auth";
import { useFormAction } from "@/lib/use-form-action";
import { cn } from "@/lib/utils";

const initial: FormState = { status: "idle" };
const roles = ["animator", "hotel_staff"] as const;

export function SignUpForm() {
  const t = useTranslations("SignUp");
  const [state, onSubmit, pending] = useFormAction(signUp, initial);
  const err = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border bg-card p-6" role="status">
        <h2 className="font-heading text-xl font-semibold">{t("checkEmailTitle")}</h2>
        <p className="mt-2 text-muted-foreground">
          {t("checkEmailBody", { email: state.values?.email ?? "" })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">{t("roleLabel")}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map((role) => (
            <label
              key={role}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors",
                "has-checked:border-sea has-checked:bg-sea/5 hover:border-sea/50",
              )}
            >
              <span className="flex items-center gap-2 font-medium">
                <input
                  type="radio"
                  name="role"
                  value={role}
                  defaultChecked={(state.values?.role ?? "animator") === role}
                  className="accent-[var(--sea)]"
                />
                {t(`roles.${role}.title`)}
              </span>
              <span className="text-sm text-muted-foreground">{t(`roles.${role}.body`)}</span>
            </label>
          ))}
        </div>
        {err.role ? <FormMessage error={err.role} /> : null}
        <p className="text-xs text-muted-foreground">{t("guestNote")}</p>
      </fieldset>

      <FormField id="displayName" label={t("displayName")} error={err.displayName}>
        <Input
          id="displayName"
          name="displayName"
          autoComplete="name"
          defaultValue={state.values?.displayName}
          aria-invalid={Boolean(err.displayName)}
          required
        />
      </FormField>

      <FormField id="email" label={t("email")} error={err.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          aria-invalid={Boolean(err.email)}
          required
        />
      </FormField>

      <FormField id="password" label={t("password")} error={err.password} hint={t("passwordHint")}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(err.password)}
          required
        />
      </FormField>

      <div className="grid gap-1.5">
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="acceptTerms" className="mt-0.5 accent-[var(--sea)]" />
          <span>{t("acceptTerms")}</span>
        </label>
        {err.acceptTerms ? <FormMessage error={err.acceptTerms} /> : null}
      </div>

      <FormMessage error={state.message} />

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          {t("logInLink")}
        </Link>
      </p>
    </form>
  );
}
