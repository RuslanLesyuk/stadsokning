import Link from "next/link"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

import EnrichLeadsForm from "./enrich-leads-form"

type PageProps = {
  searchParams: Promise<{
    success?: string
    error?: string
    scanned?: string
    found?: string
    saved?: string
    notFound?: string
    failed?: string
  }>
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(
      `/login?next=${encodeURIComponent(
        "/admin/leads/enrich",
      )}`,
    )
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return supabase
}

function parseCounter(value: string | undefined) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }

  return Math.floor(parsed)
}

export default async function EnrichLeadsPage({
  searchParams,
}: PageProps) {
  const supabase = await requireAdmin()
  const params = await searchParams

  const {
    count: companiesWithoutEmail,
    error: countError,
  } = await supabase
    .from("company_leads")
    .select("id", {
      count: "exact",
      head: true,
    })
    .not("website", "is", null)
    .or("email.is.null,email.eq.")

  const {
    count: companiesWithEmail,
    error: emailCountError,
  } = await supabase
    .from("company_leads")
    .select("id", {
      count: "exact",
      head: true,
    })
    .not("email", "is", null)
    .neq("email", "")

  const countLoadError =
    countError || emailCountError

  const isCompleted =
    params.success === "enrichment-completed"

  const scanned = parseCounter(params.scanned)
  const found = parseCounter(params.found)
  const saved = parseCounter(params.saved)
  const notFound = parseCounter(params.notFound)
  const failed = parseCounter(params.failed)

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Admin CRM
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Email enrichment
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Scan public company websites and save
              published contact email addresses into your
              lead database.
            </p>
          </div>

          <Link
            href="/admin/leads"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100"
          >
            Back to leads
          </Link>
        </div>

        {params.error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800">
            {params.error}
          </div>
        ) : null}

        {params.success === "no-companies" ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
            There are currently no companies with a website
            and a missing email address.
          </div>
        ) : null}

        {isCompleted ? (
          <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-base font-bold text-emerald-950">
              Enrichment completed
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <ResultMetric
                label="Scanned"
                value={scanned}
              />
              <ResultMetric
                label="Found"
                value={found}
              />
              <ResultMetric
                label="Saved"
                value={saved}
              />
              <ResultMetric
                label="Not found"
                value={notFound}
              />
              <ResultMetric
                label="Failed"
                value={failed}
              />
            </div>
          </section>
        ) : null}

        {countLoadError ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Lead statistics could not be loaded, but you can
            still start the scanner.
          </div>
        ) : null}

        <section className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Ready for enrichment
            </p>

            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              {companiesWithoutEmail ?? "—"}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Companies that have a website but no email.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Leads with email
            </p>

            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              {companiesWithEmail ?? "—"}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Companies currently available for email
              outreach.
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-950">
            Scan company websites
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            The scanner checks the homepage and public
            contact pages. It saves only email addresses
            actually found on the company website.
          </p>

          <div className="mt-6">
            <EnrichLeadsForm />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">
            Important
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Some websites hide their email behind
              JavaScript, a contact form, Cloudflare
              protection or an image. Those addresses may
              not be detected by the first scanner.
            </p>

            <p>
              A result of “not found” does not necessarily
              mean that the company has no email. It means
              that no public address was found in the HTML
              pages checked during this scan.
            </p>

            <p>
              Use the collected addresses only for relevant
              business communication and include a clear
              way for recipients to decline future
              messages.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

function ResultMetric({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-emerald-950">
        {value}
      </p>
    </div>
  )
}