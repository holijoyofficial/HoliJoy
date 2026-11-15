import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getAnimatorContact, getPublicAnimator, type PublicAnimator } from "@/lib/animators";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/animators/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const animator = await getPublicAnimator(slug);
  if (!animator) return {};
  const t = await getTranslations({ locale, namespace: "AnimatorPage" });
  return {
    title: `${animator.displayName} · HoliJoy`,
    description: animator.bio?.slice(0, 160) ?? t("metaDescription", { name: animator.displayName }),
  };
}

export default async function AnimatorPage({ params }: PageProps<"/[locale]/animators/[slug]">) {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      {/* The slug is only known at request time */}
      <Suspense fallback={<ProfileSkeleton />}>
        <AnimatorProfile params={params} />
      </Suspense>
    </main>
  );
}

async function AnimatorProfile({ params }: { params: PageProps<"/[locale]/animators/[slug]">["params"] }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const animator = await getPublicAnimator(slug);
  if (!animator) notFound();

  const t = await getTranslations("AnimatorPage");
  const tb = await getTranslations("Branches");
  const tl = await getTranslations("LanguageLevels");
  const format = await getFormatter();
  const languageName = new Intl.DisplayNames([locale], { type: "language" });

  return (
    <article className="grid gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div
          aria-hidden
          className="flex size-24 shrink-0 items-center justify-center rounded-full bg-sea/10 font-heading text-3xl font-semibold text-sea"
        >
          {initials(animator.displayName)}
        </div>
        <div className="grid gap-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{animator.displayName}</h1>
          <p className="text-muted-foreground">
            {[animator.city, animator.experienceYears != null ? t("experience", { years: animator.experienceYears }) : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Rating animator={animator} />
            {animator.seekingJob ? <Badge>{t("seekingJob")}</Badge> : null}
          </div>
        </div>
      </header>

      <Suspense fallback={null}>
        <ContactButtons animator={animator} />
      </Suspense>

      {animator.bio ? (
        <section>
          <h2 className="mb-2 font-heading text-xl font-semibold">{t("about")}</h2>
          <p className="whitespace-pre-line text-pretty">{animator.bio}</p>
        </section>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        {animator.branches.length ? (
          <section>
            <h2 className="mb-2 font-heading text-xl font-semibold">{t("branches")}</h2>
            <ul className="flex flex-wrap gap-2">
              {animator.branches.map((b) => (
                <li key={b}>
                  <Badge variant="secondary">{tb(b)}</Badge>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {animator.languages.length ? (
          <section>
            <h2 className="mb-2 font-heading text-xl font-semibold">{t("languages")}</h2>
            <ul className="grid gap-1 text-sm">
              {animator.languages.map((l) => (
                <li key={l.code} className="flex justify-between gap-4">
                  <span className="capitalize">{languageName.of(l.code)}</span>
                  <span className="text-muted-foreground">{tl(l.level)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {animator.availableFrom || animator.availableTo ? (
        <section>
          <h2 className="mb-2 font-heading text-xl font-semibold">{t("availability")}</h2>
          <p>
            {[animator.availableFrom, animator.availableTo]
              .map((d) => (d ? format.dateTime(new Date(d), { dateStyle: "medium" }) : "…"))
              .join(" – ")}
          </p>
        </section>
      ) : null}

      {animator.instagramUrl || animator.tiktokUrl ? (
        <section className="flex flex-wrap gap-2">
          {animator.instagramUrl ? (
            <a href={animator.instagramUrl} target="_blank" rel="noopener noreferrer nofollow" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Instagram
            </a>
          ) : null}
          {animator.tiktokUrl ? (
            <a href={animator.tiktokUrl} target="_blank" rel="noopener noreferrer nofollow" className={buttonVariants({ variant: "outline", size: "sm" })}>
              TikTok
            </a>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-2xl border bg-card p-6">
        <h2 className="font-heading text-xl font-semibold">{t("reviews")}</h2>
        <p className="mt-2 text-muted-foreground">{t("reviewsComingSoon")}</p>
      </section>
    </article>
  );
}

// Guest score and hotel score are shown separately (docs/03)
async function Rating({ animator }: { animator: PublicAnimator }) {
  const t = await getTranslations("AnimatorPage");
  if (!animator.ratingCount && !animator.hotelRatingCount) {
    return <span className="text-sm text-muted-foreground">{t("noReviews")}</span>;
  }
  return (
    <>
      <RatingText label={t("guestScore")} avg={animator.ratingAvg} count={animator.ratingCount} />
      <RatingText label={t("hotelScore")} avg={animator.hotelRatingAvg} count={animator.hotelRatingCount} />
    </>
  );
}

async function RatingText({ label, avg, count }: { label: string; avg: number | null; count: number }) {
  const t = await getTranslations("AnimatorPage");
  const format = await getFormatter();
  if (!count || avg == null) return null;
  return (
    <span className="rounded-full border px-2.5 py-0.5 text-sm font-medium">
      {label} ★ {format.number(Number(avg), { maximumFractionDigits: 1, minimumFractionDigits: 1 })}
      <span className="text-muted-foreground"> · {t("reviewCount", { count })}</span>
    </span>
  );
}

// WhatsApp / Call: RLS only returns the number to approved hotels (and the owner)
async function ContactButtons({ animator }: { animator: PublicAnimator }) {
  const phone = await getAnimatorContact(animator.id);
  if (!phone) return null;
  const t = await getTranslations("AnimatorPage");
  const text = encodeURIComponent(t("whatsappMessage", { name: animator.displayName }));
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`https://wa.me/${phone.replace("+", "")}?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ size: "lg" })}
      >
        WhatsApp
      </a>
      <a href={`tel:${phone}`} className={buttonVariants({ variant: "outline", size: "lg" })}>
        {t("call")}
      </a>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-6" aria-hidden>
      <div className="size-24 rounded-full bg-muted" />
      <div className="grid gap-3">
        <div className="h-8 w-56 rounded bg-muted" />
        <div className="h-4 w-40 rounded bg-muted" />
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toLocaleUpperCase())
    .join("");
}
