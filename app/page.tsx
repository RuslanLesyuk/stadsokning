import type { Metadata } from "next"
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
      <p className="mt-2 text-sm leading-6 text-slate-600 md:text-[15px]">{description}</p>
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
      <p className="mt-2 text-sm leading-6 text-slate-600 md:text-[15px]">{description}</p>
    </div>
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
        <section className="rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-rose-50/40 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div className="min-w-0">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                {landing.hero_title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
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

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {landing.trust_fast_title}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 md:text-[15px]">
                  {landing.trust_fast_desc}
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-slate-950 p-5 text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)] md:p-6">
                <div className="text-[11px] font-medium uppercase tracking-wide text-slate-300">
                  {landing.trust_safe_title}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300 md:text-[15px]">
                  {landing.trust_safe_desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {landing.seo_title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
              {landing.seo_description}
            </p>
          </div>

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
          <div className="max-w-2xl">
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