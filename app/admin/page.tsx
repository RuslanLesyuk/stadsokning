import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import {
  cancelJobAction,
  removePremiumUserAction,
  setPremiumUserAction,
  unverifyUserAction,
  verifyUserAction,
} from "@/app/admin/actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin | Clean Jobs",
  description: "Clean Jobs admin moderation panel.",
}

type JobRow = {
  id: string
  title: string | null
  city: string | null
  status: string | null
  created_at: string
}

type ProfileRow = {
  id: string
  full_name: string | null
  city: string | null
  company_name: string | null
  is_premium: boolean | null
  verified: boolean | null
  created_at: string | null
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function formatDate(value: string | null) {
  if (!value) return "—"

  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return value
  }
}

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin")
  }

  const isAdmin = getAdminEmails().includes(user.email.toLowerCase())

  if (!isAdmin) {
    redirect("/dashboard")
  }

  const [{ data: jobsRaw }, { data: profilesRaw }] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, title, city, status, created_at")
      .order("created_at", { ascending: false })
      .limit(20),

    supabase
      .from("profiles")
      .select("id, full_name, city, company_name, is_premium, verified, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ])

  const jobs = (jobsRaw ?? []) as JobRow[]
  const profiles = (profilesRaw ?? []) as ProfileRow[]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Admin
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Moderation panel
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              Review recent jobs and users before public launch.
            </p>
          </div>

          <Link
            href="/dashboard"
            prefetch={false}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
          >
            Back to dashboard
          </Link>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Admin email</div>
            <div className="mt-2 break-words text-lg font-semibold text-slate-950">
              {user.email}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Recent jobs</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">
              {jobs.length}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Recent users</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">
              {profiles.length}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Latest jobs
            </h2>

            <div className="mt-5 space-y-3">
              {jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No jobs found.
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/jobs/${job.id}`}
                          prefetch={false}
                          className="block truncate text-sm font-semibold text-slate-950 hover:text-rose-700"
                        >
                          {job.title || "Untitled job"}
                        </Link>

                        <div className="mt-1 text-xs text-slate-500">
                          {job.city || "No city"} · {formatDate(job.created_at)}
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {job.status || "—"}
                      </span>
                    </div>

                    {job.status !== "cancelled" ? (
                      <form action={cancelJobAction} className="mt-4">
                        <input type="hidden" name="jobId" value={job.id} />

                        <button
                          type="submit"
                          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                        >
                          Cancel job
                        </button>
                      </form>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Latest users
            </h2>

            <div className="mt-5 space-y-3">
              {profiles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No users found.
                </div>
              ) : (
                profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-950">
                          {profile.full_name || "Unnamed user"}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {profile.company_name || "No company"} ·{" "}
                          {profile.city || "No city"}
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          {formatDate(profile.created_at)}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {profile.is_premium ? (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            Premium
                          </span>
                        ) : null}

                        {profile.verified ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Verified
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.verified ? (
                        <form action={unverifyUserAction}>
                          <input type="hidden" name="userId" value={profile.id} />
                          <button
                            type="submit"
                            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            Remove verification
                          </button>
                        </form>
                      ) : (
                        <form action={verifyUserAction}>
                          <input type="hidden" name="userId" value={profile.id} />
                          <button
                            type="submit"
                            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                          >
                            Verify user
                          </button>
                        </form>
                      )}

                      {profile.is_premium ? (
                        <form action={removePremiumUserAction}>
                          <input type="hidden" name="userId" value={profile.id} />
                          <button
                            type="submit"
                            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                          >
                            Remove premium
                          </button>
                        </form>
                      ) : (
                        <form action={setPremiumUserAction}>
                          <input type="hidden" name="userId" value={profile.id} />
                          <button
                            type="submit"
                            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                          >
                            Set premium
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}