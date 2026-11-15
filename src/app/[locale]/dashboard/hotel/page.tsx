import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/dashboard/hotel">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HotelDashboard" });
  return { title: `${t("title")} · HoliJoy`, robots: { index: false } };
}

// Placeholder until the hotel profile lands in W2.
export default async function HotelDashboardPage({ params }: PageProps<"/[locale]/dashboard/hotel">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HotelDashboard");
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <Suspense fallback={null}>
        <Gate locale={locale} />
      </Suspense>
      <p className="mt-4 text-muted-foreground">{t("comingSoon")}</p>
    </main>
  );
}

async function Gate({ locale }: { locale: string }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "hotel_staff") redirect({ href: "/login", locale });
  return null;
}
