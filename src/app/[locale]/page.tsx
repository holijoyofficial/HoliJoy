import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const audiences = ["animators", "hotels", "guests"] as const;

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Home");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
      <section className="py-16 sm:py-24">
        <p className="mb-4 inline-flex rounded-full bg-sun/15 px-3 py-1 text-sm font-medium text-foreground">
          {t("badge")}
        </p>
        <h1 className="max-w-3xl font-heading text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className={buttonVariants({ size: "lg" })}>
            {t("ctaSignUp")}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 pb-16 sm:grid-cols-3">
        {audiences.map((key) => (
          <article key={key} className="rounded-2xl border bg-card p-6 transition-colors hover:border-sea/40">
            <h2 className="font-heading text-xl font-semibold text-sea">{t(`audiences.${key}.title`)}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t(`audiences.${key}.body`)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
