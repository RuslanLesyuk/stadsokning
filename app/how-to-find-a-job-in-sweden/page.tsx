import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "How to Find a Job in Sweden in 2026",
  description:
    "Complete guide on how to find a job in Sweden. Learn where to search, how foreigners get hired and what industries are hiring.",
  alternates: {
    canonical: "/how-to-find-a-job-in-sweden",
  },
  keywords: [
    "how to find a job in Sweden",
    "jobs in Sweden",
    "work in Sweden",
    "get a job in Sweden",
    "jobs for foreigners in Sweden",
    "English speaking jobs Sweden",
    "jobs in Stockholm",
    "jobs in Gothenburg",
    "jobs in Malmö",
    "cleaning jobs Sweden",
  ],
}

export default function HowToFindJobInSwedenPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900 md:text-6xl">
            How to Find a Job in Sweden
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Sweden remains one of the most attractive countries in Europe for
            international workers. Every year thousands of people search for
            jobs in Stockholm, Gothenburg, Malmö and other cities.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            1. Prepare a Swedish-style CV
          </h2>

          <p className="mt-4 text-slate-600 leading-7">
            A clear CV is essential. Include work experience, education,
            language skills and contact information.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            2. Use specialized job platforms
          </h2>

          <p className="mt-4 text-slate-600 leading-7">
            Many workers search only on large job websites. However,
            specialized platforms often provide better opportunities because
            competition is lower.
          </p>

          <p className="mt-4 text-slate-600 leading-7">
            For cleaning jobs and cleaning companies, Clean Jobs focuses
            specifically on connecting workers and clients.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            3. Apply consistently
          </h2>

          <p className="mt-4 text-slate-600 leading-7">
            The biggest mistake is applying to only a few jobs. Successful
            candidates usually send many applications and follow up when
            employers respond.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            4. Learn basic Swedish
          </h2>

          <p className="mt-4 text-slate-600 leading-7">
            While some jobs are available in English, basic Swedish improves
            your chances significantly and helps build trust with employers.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            Industries Hiring in Sweden
          </h2>

          <ul className="mt-4 list-disc pl-6 text-slate-600 space-y-2">
            <li>Cleaning and facility services</li>
            <li>Construction</li>
            <li>Healthcare</li>
            <li>Restaurants and hotels</li>
            <li>Warehouses and logistics</li>
            <li>IT and software development</li>
          </ul>

          <h2 className="mt-10 text-3xl font-semibold">
            Cleaning Jobs in Sweden
          </h2>

          <p className="mt-4 text-slate-600 leading-7">
            Cleaning remains one of the most accessible industries for
            newcomers. Home cleaning, office cleaning and move-out cleaning
            services are in demand across Sweden.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/jobs"
              className="rounded-2xl bg-rose-600 px-6 py-3 font-medium text-white"
            >
              Browse Jobs
            </Link>

            <Link
              href="/signup"
              className="rounded-2xl border border-slate-300 px-6 py-3 font-medium"
            >
              Create Account
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}