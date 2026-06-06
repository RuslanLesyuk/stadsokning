import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Saved Jobs | Clean Jobs",
  description: "View your saved cleaning jobs.",
}

type SavedJobRow = {
  id: string
  created_at: string
  jobs:
    | {
        id: string
        title: string
        description: string | null
        city: string | null
        budget: number | null
        status: string | null
        created_at: string
      }
    | null
}

export default async function SavedJobsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: savedJobs } = await supabase
    .from("saved_jobs")
    .select(
      `
      id,
      created_at,
      jobs (
        id,
        title,
        description,
        city,
        budget,
        status,
        created_at
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const rows = (savedJobs || []).map((row) => ({
    id: row.id,
    created_at: row.created_at,
    jobs: Array.isArray(row.jobs) ? row.jobs[0] : row.jobs,
  })) as SavedJobRow[]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
              Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Saved Jobs
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Your saved cleaning jobs are stored here so you can return to them later.
            </p>
          </div>

          <Link
            href="/jobs"
            prefetch={false}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]"
          >
            Browse jobs
          </Link>
        </div>

        {rows.length === 0 ? (
          <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              No saved jobs yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Save interesting cleaning jobs and come back to them whenever you want.
            </p>

            <Link
              href="/jobs"
              prefetch={false}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]"
            >
              Find jobs
            </Link>
          </section>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {rows.map((row) => {
              const job = row.jobs

              if (!job) return null

              return (
                <Link
                  key={row.id}
                  href={`/jobs/${job.id}`}
                  prefetch={false}
                  className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-slate-950 transition group-hover:text-rose-700">
                        {job.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        {job.city || "No city"}
                      </p>
                    </div>

                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      Saved
                    </span>
                  </div>

                  {job.description ? (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                      {job.description}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {job.budget ? `${job.budget} kr` : "No budget"}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {job.status || "new"}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
