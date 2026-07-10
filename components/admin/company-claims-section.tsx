import Link from "next/link"

import {
  approveCompanyClaimAction,
  rejectCompanyClaimAction,
} from "@/app/admin/company-claim-actions"
import { createAdminClient } from "@/lib/supabase-admin"

type CompanyClaimRow = {
  id: string
  company_id: string
  user_id: string
  business_email: string | null
  business_phone: string | null
  message: string | null
  status: "pending" | "approved" | "rejected"
  admin_note: string | null
  created_at: string
  reviewed_at: string | null
  companies:
    | {
        id: string
        name: string
        slug: string
        city: string | null
        website: string | null
        phone: string | null
        email: string | null
        logo_url: string | null
        owner_id: string | null
      }
    | {
        id: string
        name: string
        slug: string
        city: string | null
        website: string | null
        phone: string | null
        email: string | null
        logo_url: string | null
        owner_id: string | null
      }[]
    | null
}

type CompanyClaimsSectionProps = {
  success?: string
  error?: string
}

function getCompany(claim: CompanyClaimRow) {
  if (!claim.companies) {
    return null
  }

  return Array.isArray(claim.companies)
    ? claim.companies[0] ?? null
    : claim.companies
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function getErrorMessage(value: string) {
  if (value === "missing-claim") {
    return "Claim request ID is missing."
  }

  if (value === "rejection-note-required") {
    return "Enter a rejection reason of at least 5 characters."
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export async function CompanyClaimsSection({
  success,
  error,
}: CompanyClaimsSectionProps) {
  const adminSupabase = createAdminClient()

  const { data, error: loadError } = await adminSupabase
    .from("company_claim_requests")
    .select(`
      id,
      company_id,
      user_id,
      business_email,
      business_phone,
      message,
      status,
      admin_note,
      created_at,
      reviewed_at,
      companies (
        id,
        name,
        slug,
        city,
        website,
        phone,
        email,
        logo_url,
        owner_id
      )
    `)
    .order("created_at", { ascending: false })

  const claims = (data ?? []) as CompanyClaimRow[]

  const pendingClaims = claims.filter(
    (claim) => claim.status === "pending",
  )

  const reviewedClaims = claims.filter(
    (claim) => claim.status !== "pending",
  )

  return (
    <section className="mt-8 rounded-[28px] border border-amber-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Company claims
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review requests from users who want to manage company
            profiles.
          </p>
        </div>

        <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          {pendingClaims.length} pending
        </span>
      </div>

      {success === "approved" ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          Company claim approved successfully.
        </div>
      ) : null}

      {success === "rejected" ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          Company claim rejected successfully.
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {getErrorMessage(error)}
        </div>
      ) : null}

      {loadError ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          Company claim requests could not be loaded.
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        {pendingClaims.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <div className="text-sm font-semibold text-slate-700">
              No pending company claims
            </div>

            <p className="mt-1 text-sm text-slate-500">
              All requests have been reviewed.
            </p>
          </div>
        ) : (
          pendingClaims.map((claim) => {
            const company = getCompany(claim)

            return (
              <article
                key={claim.id}
                className="rounded-3xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row">
                  <CompanyLogo
                    name={company?.name ?? "Company"}
                    logoUrl={company?.logo_url ?? null}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">
                          {company?.name ?? "Deleted company"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {company?.city ?? "Sweden"} ·{" "}
                          {formatDate(claim.created_at)}
                        </p>
                      </div>

                      <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                        Pending
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <Detail
                        label="Submitted email"
                        value={claim.business_email || "Not provided"}
                      />

                      <Detail
                        label="Submitted phone"
                        value={claim.business_phone || "Not provided"}
                      />

                      <Detail
                        label="Company email"
                        value={company?.email || "Not provided"}
                      />

                      <Detail
                        label="Company phone"
                        value={company?.phone || "Not provided"}
                      />

                      <Detail
                        label="User ID"
                        value={claim.user_id}
                      />
                    </div>

                    {claim.message ? (
                      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Applicant message
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          {claim.message}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {company ? (
                        <Link
                          href={`/companies/${company.slug}`}
                          target="_blank"
                          prefetch={false}
                          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Open company
                        </Link>
                      ) : null}

                      {company?.website ? (
                        <a
                          href={
                            /^https?:\/\//i.test(company.website)
                              ? company.website
                              : `https://${company.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Company website
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 lg:grid-cols-2">
                  <form action={approveCompanyClaimAction}>
                    <input
                      type="hidden"
                      name="claimId"
                      value={claim.id}
                    />

                    <input
                      type="hidden"
                      name="companySlug"
                      value={company?.slug ?? ""}
                    />

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <h4 className="font-semibold text-emerald-950">
                        Approve request
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-emerald-800">
                        The company will be connected to this user.
                      </p>

                      <button
                        type="submit"
                        className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                      >
                        Approve claim
                      </button>
                    </div>
                  </form>

                  <form action={rejectCompanyClaimAction}>
                    <input
                      type="hidden"
                      name="claimId"
                      value={claim.id}
                    />

                    <input
                      type="hidden"
                      name="companySlug"
                      value={company?.slug ?? ""}
                    />

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                      <label
                        htmlFor={`claim-note-${claim.id}`}
                        className="font-semibold text-red-950"
                      >
                        Reject request
                      </label>

                      <textarea
                        id={`claim-note-${claim.id}`}
                        name="adminNote"
                        required
                        minLength={5}
                        maxLength={1000}
                        rows={3}
                        placeholder="Reason for rejection..."
                        className="mt-3 w-full resize-y rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
                      />

                      <button
                        type="submit"
                        className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
                      >
                        Reject claim
                      </button>
                    </div>
                  </form>
                </div>
              </article>
            )
          })
        )}
      </div>

      {reviewedClaims.length > 0 ? (
        <details className="mt-6 rounded-2xl border border-slate-200 bg-slate-50">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-slate-800">
            Reviewed claims ({reviewedClaims.length})
          </summary>

          <div className="space-y-3 border-t border-slate-200 p-4">
            {reviewedClaims.map((claim) => {
              const company = getCompany(claim)

              return (
                <div
                  key={claim.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">
                        {company?.name ?? "Deleted company"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {claim.business_email || claim.user_id}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                        claim.status === "approved"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border-red-200 bg-red-50 text-red-800"
                      }`}
                    >
                      {claim.status === "approved"
                        ? "Approved"
                        : "Rejected"}
                    </span>
                  </div>

                  {claim.admin_note ? (
                    <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                      {claim.admin_note}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </details>
      ) : null}
    </section>
  )
}

function Detail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  )
}

function CompanyLogo({
  name,
  logoUrl,
}: {
  name: string
  logoUrl: string | null
}) {
  if (logoUrl) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="h-full w-full object-contain p-2"
        />
      </div>
    )
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-2xl font-bold text-white">
      {name.trim().charAt(0).toUpperCase() || "C"}
    </div>
  )
}