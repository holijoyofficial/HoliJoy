import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Link, redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getMyHotel } from "@/lib/hotels";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/dashboard/hotel">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HotelDashboard" });
  return { title: `${t("title")} · HoliJoy`, robots: { index: false } };
}

export default async function HotelDashboardPage({ params }: PageProps<"/[locale]/dashboard/hotel">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HotelDashboard");
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <Suspense fallback={<p className="mt-6 text-muted-foreground">{t("loading")}</p>}>
        <HotelOverview locale={locale} />
      </Suspense>
      <p className="mt-10 text-sm text-muted-foreground">{t("comingSoon")}</p>
    </main>
  );
}

async function HotelOverview({ locale }: { locale: string }) {
  const data = await getMyHotel();
  // Logged in with another role → their own dashboard; logged out → login
  if (!data) return redirect({ href: (await getCurrentUser()) ? "/dashboard" : "/login", locale });
  const t = await getTranslations("HotelDashboard");
  const tb = await getTranslations("Branches");

  if (!data.hotel) {
    return <p className="mt-6 rounded-xl border bg-card p-5">{t("noHotel")}</p>;
  }
  const { hotel, team } = data;
  const regionName = hotel.regions?.[`name_${locale as "tr" | "en" | "ru"}`] ?? hotel.regions?.name_en;

  return (
    <div className="mt-6 grid gap-6">
      <section className="rounded-2xl border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-heading text-2xl font-semibold">{hotel.name}</h2>
          <Badge variant={hotel.verification_status === "approved" ? "default" : "secondary"}>
            {t(`status.${hotel.verification_status}`)}
          </Badge>
        </div>
        <p className="mt-1 text-muted-foreground">
          {[hotel.stars ? "★".repeat(hotel.stars) : null, regionName].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-3 text-sm">{t("signedInAs", { name: data.user.displayName })}</p>
        {hotel.verification_status === "approved" ? (
          <p className="mt-1 text-sm text-muted-foreground">{t("approvedNote")}</p>
        ) : null}
      </section>

      <section>
        <h2 className="mb-3 font-heading text-xl font-semibold">{t("team")}</h2>
        {team.length ? (
          <ul className="grid gap-2">
            {team.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3">
                <Link href={`/animators/${m.slug}`} className="font-medium underline-offset-4 hover:underline">
                  {m.name}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {tb(m.role)} · {m.season} · {t(`employment.${m.status}`)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">{t("noTeam")}</p>
        )}
      </section>
    </div>
  );
}
