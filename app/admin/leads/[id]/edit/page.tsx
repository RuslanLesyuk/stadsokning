import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import {
  deleteCompanyLeadAction,
  updateCompanyLeadAction,
} from "@/app/admin/leads/actions"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Edit Company Lead | Clean Jobs Admin",
  description: "Edit a cleaning company outreach lead.",
}

type LeadStatus =
  | "new"
  | "invited"
  | "opened"
  | "registered"
  | "ignored"

type CompanyLeadRow = {
  id: string
  company_name: string
  city: string | null
  website: string | null
  email: string | null
  phone: string | null
  source: string | null
  notes: string | null
  status: LeadStatus
}

type EditLeadPageProps = {
  params: Promise<{
    id: string
  }>
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

export default async function EditCompanyLeadPage({
  params,
  searchParams,
}: EditLeadPageProps) {
  const { id } = await params
  const { error } = await searchParams

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(`/login?next=/admin/leads/${id}/edit`)
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  const admin = createAdminClient()

  const { data, error: leadError } = await admin
    .from("company_leads")
    .select(
      `
        id,
        company_name,
        city,
        website,
        email,
        phone,
        source,
        notes,
        status
      `,
    )
    .eq("id", id)
    .maybeSingle()

  if (leadError) {
    console.error("Edit company lead query error:", leadError.message)
  }

  if (!data) {
    notFound()
  }

  const lead = data as CompanyLeadRow

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Admin outreach
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Edit company
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Update contact details and outreach status.
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
          action={updateCompanyLeadAction}
          className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-8"
        >
          <input type="hidden" name="leadId" value={lead.id} />

          <div className="grid gap-6 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-800">
                Company name *
              </span>

              <input
                type="text"
                name="companyName"
                required
                defaultValue={lead.company_name}
                autoComplete="organization"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                City
              </span>

              <input
                type="text"
                name="city"
                defaultValue={lead.city || ""}
                autoComplete="address-level2"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Status
              </span>

              <select
                name="status"
                defaultValue={lead.status}
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              >
                <option value="new">New</option>
                <option value="invited">Invited</option>
                <option value="opened">Opened</option>
                <option value="registered">Registered</option>
                <option value="ignored">Ignored</option>
              </select>
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Email
              </span>

              <input
                type="email"
                name="email"
                defaultValue={lead.email || ""}
                autoComplete="email"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Phone
              </span>

              <input
                type="tel"
                name="phone"
                defaultValue={lead.phone || ""}
                autoComplete="tel"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-800">
                Website
              </span>

              <input
                type="text"
                name="website"
                defaultValue={lead.website || ""}
                inputMode="url"
                autoComplete="url"
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-800">
                Source
              </span>

              <select
                name="source"
                defaultValue={lead.source || "manual"}
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              >
                <option value="manual">Manual</option>
                <option value="google">Google</option>
                <option value="website">Company website</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="recommendation">Recommendation</option>
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
                defaultValue={lead.notes || ""}
                className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>
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
              Save changes
            </button>
          </div>
        </form>

        <section className="mt-6 rounded-[28px] border border-red-200 bg-red-50 p-5 md:p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Delete company
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-700">
            This permanently removes the company from the outreach
            database.
          </p>

          <form action={deleteCompanyLeadAction} className="mt-4">
            <input type="hidden" name="leadId" value={lead.id} />

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-red-300 bg-white px-5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Delete company permanently
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}