import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { DEMO_ANIMATOR_SLUG, isDemoMode } from "@/lib/demo";
import { demoGuest, demoLogIn } from "./actions";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const roles = ["animator", "hotel", "guest"] as const;

export default async function DemoPage({ params }: PageProps<"/[locale]/demo">) {
  if (!isDemoMode()) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Demo");

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
      <p className="mb-3 inline-flex rounded-full bg-sun/15 px-3 py-1 text-sm font-medium">{t("badge")}</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <section key={role} className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
            <div>
              <h2 className="font-heading text-xl font-semibold text-sea">{t(`${role}.title`)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t(`${role}.account`)}</p>
            </div>
            <ul className="grid flex-1 list-disc gap-1.5 pl-5 text-sm">
              {(t.raw(`${role}.checks`) as string[]).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {role === "guest" ? (
              <form action={demoGuest}>
                <button type="submit" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                  {t("guest.button")}
                </button>
              </form>
            ) : (
              <form action={demoLogIn}>
                <input type="hidden" name="role" value={role} />
                <button type="submit" className={buttonVariants({ className: "w-full" })}>
                  {t(`${role}.button`)}
                </button>
              </form>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>{t("profileLink")}</span>
        <Link href={`/animators/${DEMO_ANIMATOR_SLUG}`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
          /animators/{DEMO_ANIMATOR_SLUG}
        </Link>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">{t("warning")}</p>
    </main>
  );
}
