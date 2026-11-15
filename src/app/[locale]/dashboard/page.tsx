import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";

// /dashboard sends each role to its own dashboard.
export default async function DashboardPage({ params }: PageProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Dashboard");
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Suspense fallback={<p className="text-muted-foreground">{t("loading")}</p>}>
        <RoleRedirect locale={locale} />
      </Suspense>
    </main>
  );
}

async function RoleRedirect({ locale }: { locale: string }) {
  const user = await getCurrentUser();
  if (!user) return redirect({ href: "/login", locale });
  if (user.role === "hotel_staff") return redirect({ href: "/dashboard/hotel", locale });
  if (user.role === "animator") return redirect({ href: "/dashboard/animator", locale });
  // Admin panel comes in W4
  return redirect({ href: "/", locale });
}
