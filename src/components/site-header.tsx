import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { logOut } from "@/app/[locale]/(auth)/actions";
import { buttonVariants } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="font-heading text-2xl font-semibold tracking-tight">
          Holi<span className="text-sun">Joy</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Reads the current URL, which is runtime data on dynamic routes */}
          <Suspense fallback={<div className="h-7 w-24" aria-hidden />}>
            <LocaleSwitcher />
          </Suspense>
          {/* Reads the session cookie, so it streams in after the static shell */}
          <Suspense fallback={<GuestNav />}>
            <UserNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

async function UserNav() {
  const user = await getCurrentUser();
  if (!user) return <GuestNav />;
  const t = await getTranslations("Nav");

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className={buttonVariants({ variant: "secondary", size: "sm" })}>
        {t("dashboard")}
      </Link>
      <form action={logOut}>
        <button type="submit" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          {t("logOut")}
        </button>
      </form>
    </div>
  );
}

function GuestNav() {
  const t = useTranslations("Nav");
  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        {t("logIn")}
      </Link>
      <Link href="/signup" className={buttonVariants({ size: "sm" })}>
        {t("signUp")}
      </Link>
    </div>
  );
}
