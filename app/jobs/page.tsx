import Link from "next/link"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  getJobStatusLabel,
  normalizeLocale,
} from "@/lib/i18n"

export const dynamic = "force-dynamic"

type JobsPageProps = {
  searchParams?: Promise<{
    q?: string
    city?: string
    status?: string
  }>
}

type JobRow = {
  id: string
  title: string | null
  description: string | null
  city: string | null
  budget: number | null
  status: string | null
  created_at: string
  created_by: string | null
  assigned_to: string | null
}

type ProfileRow = {
  id: string
  full_name: string | null
}

function formatBudget(value: number | null, fallback: string) {
  if (value == null) return fallback
  return `${value} kr`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const q = String(resolvedSearchParams?.q || "").trim()
  const city = String(resolvedSearchParams?.city || "").trim()
  const status = String(resolvedSearchParams?.status || "").trim()

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const dictionary = getDictionary(locale)

  const supabase = await createClient()

  let query = supabase
    .from("jobs")
    .select(
      "id, title, description, city, budget, status, created_at, created_by, assigned_to",
    )
    .order("created_at", { ascending: false })

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }

  if (city) {
    query = query.ilike("city", `%${city}%`)
  }

  if (status) {
    query = query.eq("status", status)
  }

  const { data: jobsData } = await query
  const jobs = (jobsData || []) as JobRow[]

  const profileIds = Array.from(
    new Set(
      jobs.flatMap((job) => [job.created_by, job.assigned_to]).filter(Boolean),
    ),
  ) as string[]

  const { data: profilesData } = profileIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", profileIds)
    : { data: [] }

  const profiles = (profilesData || []) as ProfileRow[]
  const profilesMap = new Map(profiles.map((item) => [item.id, item]))

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-black">
          {dictionary.jobs.pageTitle}
        </h1>
        <p className="mt-2 text-sm text-black/60">
          {dictionary.jobs.pageSubtitle}
        </p>
      </div>

      <div className="mb-8 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-black">
          {dictionary.jobs.filtersTitle}
        </h2>

        <form className="mt-4 grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobs.searchLabel}
            </label>
            <input
              name="q"
              defaultValue={q}
              className="h-11 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobs.cityLabel}
            </label>
            <input
              name="city"
              defaultValue={city}
              className="h-11 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobs.statusLabel}
            </label>
            <select
              name="status"
              defaultValue={status}
              className="h-11 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
            >
              <option value="">{dictionary.jobs.notSpecified}</option>
              <option value="new">{dictionary.jobs.status_new}</option>
              <option value="assigned">{dictionary.jobs.status_assigned}</option>
              <option value="in_progress">
                {dictionary.jobs.status_in_progress}
              </option>
              <option value="done">{dictionary.jobs.status_done}</option>
              <option value="cancelled">{dictionary.jobs.status_cancelled}</option>
            </select>
          </div>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-black px-5 text-sm font-medium text-white transition hover:opacity-90"
            >
              {dictionary.jobs.filtersTitle}
            </button>

            <Link
              href="/jobs"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 px-5 text-sm font-medium text-black transition hover:bg-black/[0.03]"
            >
              {dictionary.jobs.clearFilters}
            </Link>
          </div>
        </form>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/10 bg-white p-10 text-center text-sm text-black/50">
          {dictionary.jobs.noResults}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => {
            const authorName = job.created_by
              ? profilesMap.get(job.created_by)?.full_name || dictionary.jobs.unknown
              : dictionary.jobs.unknown

            const workerName = job.assigned_to
              ? profilesMap.get(job.assigned_to)?.full_name || dictionary.jobs.unknown
              : dictionary.jobs.notAssigned

            return (
              <article
                key={job.id}
                className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold text-black">
                    {job.title || dictionary.jobs.untitledJob}
                  </h2>

                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/70">
                    {getJobStatusLabel(locale, job.status)}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 min-h-[60px] whitespace-pre-wrap text-sm text-black/60">
                  {job.description || dictionary.jobs.emptyDescription}
                </p>

                <div className="mt-5 space-y-2 text-sm text-black/65">
                  <div>
                    <span className="font-medium text-black">
                      {dictionary.jobs.city}:
                    </span>{" "}
                    {job.city || dictionary.jobs.notSpecified}
                  </div>
                  <div>
                    <span className="font-medium text-black">
                      {dictionary.jobs.budget}:
                    </span>{" "}
                    {formatBudget(job.budget, dictionary.jobs.notSpecified)}
                  </div>
                  <div>
                    <span className="font-medium text-black">
                      {dictionary.jobs.author}:
                    </span>{" "}
                    {authorName}
                  </div>
                  <div>
                    <span className="font-medium text-black">
                      {dictionary.jobs.worker}:
                    </span>{" "}
                    {workerName}
                  </div>
                  <div>
                    <span className="font-medium text-black">
                      {dictionary.jobs.createdAt}:
                    </span>{" "}
                    {formatDate(job.created_at)}
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    {dictionary.jobs.details}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}