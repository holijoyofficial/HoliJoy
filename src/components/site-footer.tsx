import { useTranslations } from "next-intl";
import { DeployInfo } from "@/components/deploy-info";
import { Link } from "@/i18n/navigation";
import { isDemoMode } from "@/lib/demo";

export function SiteFooter() {
  const t = useTranslations("Footer");
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="flex items-center gap-4">
          {t("copyright", { year: 2026 })}
          {isDemoMode() ? (
            <Link href="/demo" className="underline underline-offset-4 hover:text-foreground">
              {t("demo")}
            </Link>
          ) : null}
        </span>
        <DeployInfo />
      </div>
    </footer>
  );
}
