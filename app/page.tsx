import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { getUiDictionary } from "@/lib/ui-i18n"

export const metadata: Metadata = {
  title: "Cleaning jobs & cleaners | Clean Jobs",
  description:
    "Find cleaning jobs or hire professional cleaners. Fast, simple and trusted cleaning marketplace.",
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const locale = cookieStore.get("clean_jobs_locale")?.value
  const dict = getUiDictionary(locale)
  const landing = dict.landing

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          {landing.hero_title}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          {landing.hero_description}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/jobs"
            className="rounded-xl bg-black px-6 py-3 text-white hover:opacity-90"
          >
            {landing.find_jobs}
          </Link>

          <Link
            href="/jobs/create"
            className="rounded-xl border px-6 py-3 hover:bg-gray-100"
          >
            {landing.post_job}
          </Link>
        </div>
      </section>

      <section className="grid gap-6 py-12 md:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <h3 className="text-lg font-semibold">{landing.trust_fast_title}</h3>
          <p className="mt-2 text-gray-600">{landing.trust_fast_desc}</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="text-lg font-semibold">{landing.trust_safe_title}</h3>
          <p className="mt-2 text-gray-600">{landing.trust_safe_desc}</p>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="text-lg font-semibold">{landing.trust_simple_title}</h3>
          <p className="mt-2 text-gray-600">{landing.trust_simple_desc}</p>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-center text-2xl font-semibold">
          {landing.how_title}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <h4 className="font-medium">{landing.step1_title}</h4>
            <p className="mt-2 text-gray-600">{landing.step1_desc}</p>
          </div>

          <div className="rounded-2xl border p-6">
            <h4 className="font-medium">{landing.step2_title}</h4>
            <p className="mt-2 text-gray-600">{landing.step2_desc}</p>
          </div>

          <div className="rounded-2xl border p-6">
            <h4 className="font-medium">{landing.step3_title}</h4>
            <p className="mt-2 text-gray-600">{landing.step3_desc}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl py-16 text-center">
        <h2 className="text-2xl font-semibold">{landing.seo_title}</h2>
        <p className="mt-4 text-gray-600">{landing.seo_description}</p>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold">{landing.cta_title}</h2>

        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-xl bg-black px-6 py-3 text-white"
          >
            {landing.create_account}
          </Link>

          <Link href="/jobs" className="rounded-xl border px-6 py-3">
            {landing.browse_jobs}
          </Link>
        </div>
      </section>
    </div>
  )
}