import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LogInForm } from "./login-form";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LogIn" });
  return { title: `${t("title")} · HoliJoy` };
}

export default async function LogInPage({ params, searchParams }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("LogIn");

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-12 sm:py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 mb-8 text-muted-foreground">{t("subtitle")}</p>
      <Suspense fallback={<LogInForm />}>
        <LogInWithNotice searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function LogInWithNotice({
  searchParams,
}: {
  searchParams: PageProps<"/[locale]/login">["searchParams"];
}) {
  const sp = await searchParams;
  const notice = sp.confirmed ? "confirmed" : sp.linkError ? "linkError" : undefined;
  return <LogInForm notice={notice} />;
}
