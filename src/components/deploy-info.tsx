import { useTranslations } from "next-intl";

// Shows which commit is live, so the team can check that a push reached
// production. Vercel sets these variables automatically at build time.
export function DeployInfo() {
  const t = useTranslations("DeployInfo");
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE?.split("\n")[0];

  if (!sha) return <span>{t("local")}</span>;

  return (
    <span title={message} className="font-mono text-xs">
      {t("live", { sha })}
      {message ? ` · ${message}` : null}
    </span>
  );
}
