import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { cookies } from "next/headers"
import { getUiDictionary } from "@/lib/ui-i18n"

export const metadata: Metadata = {
  title: "Cleaning jobs & cleaners | Clean Jobs",
  description:
    "Find cleaning jobs or hire professional cleaners. Fast, simple and trusted cleaning marketplace.",
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-7">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 md:text-[15px]">
        {description}
      </p>
    </div>
  )
}

function StepCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-7">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 md:text-[15px]">
        {description}
      </p>
    </div>
  )
}

function GuideCard({
  href,
  title,
  description,
  label,
}: {
  href: string
  title: string
  description: string
  label: string
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
    >
      <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
        {label}
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-rose-700 md:text-xl">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="mt-5 text-sm font-semibold text-rose-700">
        Read guide →
      </div>
    </Link>
  )
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const locale = cookieStore.get("clean_jobs_locale")?.value
  const dict = getUiDictionary(locale)
  const landing = dict.landing

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-rose-50/40 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
                {landing.hero_title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                {landing.hero_description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/jobs"
                  prefetch={false}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
                >
                  {landing.find_jobs}
                </Link>

                <Link
                  href="/jobs/create"
                  prefetch={false}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-100"
                >
                  {landing.post_job}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-rose-100/60 blur-2xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
                <Image
                  src="/hero-cleaner.png"
                  alt="Professional cleaner in a bright modern home"
                  width={1536}
                  height={1024}
                  priority
                  className="h-[280px] w-full object-cover object-center sm:h-[360px] lg:h-[500px]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              title={landing.trust_fast_title}
              description={landing.trust_fast_desc}
            />
            <FeatureCard
              title={landing.trust_safe_title}
              description={landing.trust_safe_desc}
            />
            <FeatureCard
              title={landing.trust_simple_title}
              description={landing.trust_simple_desc}
            />
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {landing.how_title}
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <StepCard title={landing.step1_title} description={landing.step1_desc} />
            <StepCard title={landing.step2_title} description={landing.step2_desc} />
            <StepCard title={landing.step3_title} description={landing.step3_desc} />
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {landing.seo_title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                {landing.seo_description}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                SEO guides
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                Popular guides about jobs and cleaning work in Sweden
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                Learn how to find work in Sweden, how cleaning jobs work, and how
                clients can hire trusted cleaners in Stockholm and across Sweden.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <GuideCard
              href="/work-in-sweden"
              label="English"
              title="Work in Sweden"
              description="Complete guide to jobs in Sweden, cleaning work, part-time jobs and opportunities for foreigners."
            />

            <GuideCard
              href="/jobb-i-sverige"
              label="Svenska"
              title="Jobb i Sverige"
              description="Guide till arbete i Sverige, städjobb, extrajobb och möjligheter för arbetare och företag."
            />

            <GuideCard
              href="/cleaning-jobs-stockholm"
              label="Stockholm"
              title="Cleaning Jobs Stockholm"
              description="Find cleaning jobs, cleaner work and cleaning companies in Stockholm and nearby areas."
            />

            <GuideCard
              href="/stadjobb-stockholm"
              label="Svenska"
              title="Städjobb Stockholm"
              description="Hitta städjobb, hemstädning, kontorsstädning och flyttstädning i Stockholm."
            />
            <GuideCard
              href="/cleaning-jobs-gothenburg"
              label="Gothenburg"
              title="Cleaning Jobs Gothenburg"
              description="Find cleaning jobs, cleaner work and cleaning companies in Gothenburg."
            />

            <GuideCard
              href="/stadjobb-goteborg"
              label="Svenska"
              title="Städjobb Göteborg"
              description="Hitta städjobb, hemstädning, kontorsstädning och flyttstädning i Göteborg."
            />
            <GuideCard
              href="/jobs-for-foreigners-in-sweden"
              label="Sweden"
              title="Jobs for Foreigners in Sweden"
              description="Guide for immigrants, expats and newcomers looking for jobs in Sweden."
            />

            <GuideCard
              href="/jobb-utan-svenska"
              label="Svenska"
              title="Jobb utan svenska"
              description="Hitta jobb i Sverige även om du inte talar flytande svenska."
            />
            <GuideCard
              href="/how-to-find-a-job-in-sweden"
              label="Guide"
              title="How to Find a Job in Sweden"
              description="Learn where to search, how to apply and how to get hired faster."
            />
            <GuideCard
              href="/hur-man-far-jobb-i-sverige"
              label="Guide"
              title="Hur man får jobb i Sverige"
              description="Praktisk guide för att hitta arbete och få fler intervjuer."
            />
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {landing.cta_title}
            </h2>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
              >
                {landing.create_account}
              </Link>

              <Link
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-100"
              >
                {landing.browse_jobs}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}