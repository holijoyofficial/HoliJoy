"use client";

import { useTranslations } from "next-intl";
import { logIn } from "../actions";
import { FormField, FormMessage } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import type { FormState } from "@/lib/validation/auth";
import { useFormAction } from "@/lib/use-form-action";

const initial: FormState = { status: "idle" };

export function LogInForm({ notice }: { notice?: "confirmed" | "linkError" }) {
  const t = useTranslations("LogIn");
  const [state, onSubmit, pending] = useFormAction(logIn, initial);
  const err = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      {notice === "confirmed" ? (
        <p role="status" className="rounded-lg bg-sea/10 px-3 py-2 text-sm">
          {t("confirmedNotice")}
        </p>
      ) : null}
      {notice === "linkError" ? <FormMessage error="linkError" /> : null}

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

      <FormField id="password" label={t("password")} error={err.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(err.password)}
          required
        />
      </FormField>

      <FormMessage error={state.message} />

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? t("submitting") : t("submit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
          {t("signUpLink")}
        </Link>
      </p>
    </form>
  );
}
