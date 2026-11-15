import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { DeployInfo } from "@/components/deploy-info";

const audiences = ["animators", "hotels", "guests"] as const;

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Home");

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="font-heading text-2xl font-semibold tracking-tight">
          Holi<span className="text-sun">Joy</span>
        </span>
        <LocaleSwitcher />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
        <section className="py-16 sm:py-24">
          <p className="mb-4 inline-flex rounded-full bg-sun/15 px-3 py-1 text-sm font-medium text-foreground">
            {t("badge")}
          </p>
          <h1 className="max-w-3xl font-heading text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
            {t("subtitle")}
          </p>
        </section>

        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          {audiences.map((key) => (
            <article
              key={key}
              className="rounded-2xl border bg-card p-6 transition-colors hover:border-sea/40"
            >
              <h2 className="font-heading text-xl font-semibold text-sea">
                {t(`audiences.${key}.title`)}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`audiences.${key}.body`)}
              </p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>{t("footer", { year: 2026 })}</span>
          <DeployInfo />
        </div>
      </footer>
    </div>
  );
}
