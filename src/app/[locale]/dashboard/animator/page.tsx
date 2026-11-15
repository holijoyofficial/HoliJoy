import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link, redirect } from "@/i18n/navigation";
import { getMyAnimator } from "@/lib/animators";
import { ProfileForm } from "./profile-form";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/dashboard/animator">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AnimatorDashboard" });
  return { title: `${t("title")} · HoliJoy`, robots: { index: false } };
}

export default async function AnimatorDashboardPage({ params }: PageProps<"/[locale]/dashboard/animator">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AnimatorDashboard");

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <Suspense fallback={<p className="mt-8 text-muted-foreground">{t("loading")}</p>}>
        <AnimatorProfileEditor locale={locale} />
      </Suspense>
    </main>
  );
}

async function AnimatorProfileEditor({ locale }: { locale: string }) {
  const animator = await getMyAnimator();
  if (!animator) redirect({ href: "/login", locale });
  const a = animator!;
  const t = await getTranslations("AnimatorDashboard");

  return (
    <>
      <div className="mt-2 mb-8 flex flex-wrap items-center gap-3 text-muted-foreground">
        <span>{t("subtitle")}</span>
        <Link
          href={`/animators/${a.slug}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          {t("viewPublic")}
        </Link>
      </div>
      <ProfileForm
        values={{
          displayName: a.displayName,
          city: a.city ?? "",
          bio: a.bio ?? "",
          birthYear: a.birth_year?.toString() ?? "",
          experienceYears: a.experience_years?.toString() ?? "",
          branches: a.branches,
          languages: Object.fromEntries(a.languages.map((l) => [l.code, l.level])),
          seekingJob: a.seeking_job,
          availableFrom: a.available_from ?? "",
          availableTo: a.available_to ?? "",
          instagramUrl: a.instagram_url ?? "",
          tiktokUrl: a.tiktok_url ?? "",
          whatsappPhone: a.whatsappPhone ?? "",
        }}
      />
    </>
  );
}
