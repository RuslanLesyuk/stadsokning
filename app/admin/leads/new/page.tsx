import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"
import { createCompanyLeadAction } from "@/app/admin/leads/actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Add Company Lead | Clean Jobs Admin",
  description: "Add a cleaning company to the outreach list.",
}

type NewLeadPageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export default async function NewCompanyLeadPage({
  searchParams,
}: NewLeadPageProps) {
  const { error } = await searchParams

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin/leads/new")
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Admin outreach
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Add company
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Add a cleaning company to the Clean Jobs outreach
              database.
            </p>
          </div>

          <Link
            href="/admin/leads"
            prefetch={false}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
          >
            Back to leads
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : null}

        <form
          action={createCompanyLeadAction}
          className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-800">
                Company name *
              </span>

              <input
                type="text"
                name="companyName"
                required
                autoComplete="organization"
                placeholder="Example Städ AB"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                City
              </span>

              <input
                type="text"
                name="city"
                defaultValue="Stockholm"
                autoComplete="address-level2"
                placeholder="Stockholm"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Email
              </span>

              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="info@example.se"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Website
              </span>

              <input
                type="text"
                name="website"
                inputMode="url"
                autoComplete="url"
                placeholder="example.se"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Phone
              </span>

              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+46 70 123 45 67"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Source
              </span>

              <select
                name="source"
                defaultValue="manual"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              >
                <option value="manual">Manual</option>
                <option value="google">Google</option>
                <option value="website">Company website</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="recommendation">
                  Recommendation
                </option>
                <option value="csv">CSV import</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-800">
                Notes
              </span>

              <textarea
                name="notes"
                rows={5}
                placeholder="Contact person, services, additional information..."
                className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>
          </div>

          <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-800">
            You must provide at least one contact method: email,
            phone number or website.
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/leads"
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]"
            >
              Add company
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}