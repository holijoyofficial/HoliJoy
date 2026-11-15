"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";

// Label + control + translated error message, wired up for screen readers.
export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const t = useTranslations("Errors");
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {t.has(error) ? t(error) : t("generic")}
        </p>
      ) : null}
    </div>
  );
}

export function FormMessage({ error }: { error?: string }) {
  const t = useTranslations("Errors");
  if (!error) return null;
  return (
    <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {t.has(error) ? t(error) : t("generic")}
    </p>
  );
}
