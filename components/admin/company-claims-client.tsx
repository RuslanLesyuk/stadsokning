"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import {
  approveCompanyClaimAction,
  rejectCompanyClaimAction,
  requestMoreInfoCompanyClaimAction,
} from "@/app/admin/company-claim-actions"

export type ClaimStatus = "pending" | "needs_info" | "approved" | "rejected" | "cancelled"

export type AdminCompanyClaim = {
  id: string
  company_id: string
  user_id: string
  business_email: string | null
  business_phone: string | null
  message: string | null
  status: ClaimStatus
  admin_note: string | null
  created_at: string
  updated_at: string
  reviewed_at: string | null
  requested_info_at: string | null
  cancelled_at: string | null
  business_email_domain: string | null
  company_domain: string | null
  email_domain_match: boolean
  evidence: Array<{ path: string; url: string; name: string }>
  company: {
    id: string
    name: string
    slug: string
    city: string | null
    website: string | null
    phone: string | null
    email: string | null
    logo_url: string | null
    owner_id: string | null
  } | null
}

type Props = {
  claims: AdminCompanyClaim[]
  success: string | null
  error: string | null
  loadError: string | null
}

const statusOptions: Array<{ value: "all" | ClaimStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "needs_info", label: "Needs info" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
]

function formatDate(value: string | null) {
  if (!value) return "—"
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

function statusStyles(status: ClaimStatus) {
  const map: Record<ClaimStatus, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    needs_info: "border-orange-200 bg-orange-50 text-orange-800",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rejected: "border-red-200 bg-red-50 text-red-800",
    cancelled: "border-slate-200 bg-slate-100 text-slate-700",
  }
  return map[status]
}

export function CompanyClaimsClient({ claims, success, error, loadError }: Props) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"all" | ClaimStatus>("all")

  const counts = useMemo(() => {
    const result: Record<ClaimStatus, number> = {
      pending: 0,
      needs_info: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
    }
    for (const claim of claims) result[claim.status] += 1
    return result
  }, [claims])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return claims.filter((claim) => {
      if (status !== "all" && claim.status !== status) return false
      if (!normalized) return true

      const values = [
        claim.company?.name,
        claim.company?.city,
        claim.company?.email,
        claim.company?.phone,
        claim.business_email,
        claim.business_phone,
        claim.user_id,
        claim.company_id,
      ]

      return values.some((value) => value?.toLowerCase().includes(normalized))
    })
  }, [claims, query, status])

  return (
    <section className="mt-8 rounded-[28px] border border-amber-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Company claims 2.0</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review ownership requests, compare company-domain signals and inspect verification evidence.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">{counts.pending} pending</span>
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-orange-800">{counts.needs_info} needs info</span>
        </div>
      </div>

      {success ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {success === "approved"
            ? "Company claim approved successfully."
            : success === "rejected"
              ? "Company claim rejected successfully."
              : success === "needs-info"
                ? "Additional information requested successfully."
                : "Company claim updated successfully."}
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>
      ) : null}

      {loadError ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{loadError}</div>
      ) : null}

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search company, email, phone or user ID..."
          className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as "all" | ClaimStatus)}
          className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-500">Showing {filtered.length} of {claims.length} claims</p>

      <div className="mt-6 space-y-5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-600">
            No matching company claims.
          </div>
        ) : (
          filtered.map((claim) => <ClaimCard key={claim.id} claim={claim} />)
        )}
      </div>
    </section>
  )
}

function ClaimCard({ claim }: { claim: AdminCompanyClaim }) {
  const company = claim.company
  const active = claim.status === "pending" || claim.status === "needs_info"

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-5 lg:flex-row">
        <CompanyLogo name={company?.name ?? "Company"} logoUrl={company?.logo_url ?? null} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">{company?.name ?? "Deleted company"}</h3>
              <p className="mt-1 text-sm text-slate-500">{company?.city ?? "Sweden"} · {formatDate(claim.created_at)}</p>
            </div>
            <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles(claim.status)}`}>
              {claim.status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Detail label="Submitted email" value={claim.business_email || "Not provided"} />
            <Detail label="Submitted phone" value={claim.business_phone || "Not provided"} />
            <Detail label="Company email" value={company?.email || "Not provided"} />
            <Detail label="Company phone" value={company?.phone || "Not provided"} />
            <Detail label="User ID" value={claim.user_id} />
            <Detail label="Company ID" value={claim.company_id} />
          </div>

          <div className={`mt-5 rounded-2xl border p-4 ${claim.email_domain_match ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
            <p className={`text-sm font-black ${claim.email_domain_match ? "text-emerald-800" : "text-amber-800"}`}>
              {claim.email_domain_match ? "✓ Email domain matches company signal" : "! Email domain needs manual verification"}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Submitted: {claim.business_email_domain || "—"} · Company: {claim.company_domain || "—"}
            </p>
          </div>

          {claim.message ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applicant message</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{claim.message}</p>
            </div>
          ) : null}

          {claim.evidence.length > 0 ? (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verification evidence</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {claim.evidence.map((file, index) => (
                  <a
                    key={file.path}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Evidence {index + 1}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-5 text-xs font-semibold text-slate-400">No evidence files attached.</p>
          )}

          {claim.admin_note ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current review note</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{claim.admin_note}</p>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {company ? (
              <Link href={`/companies/${company.slug}`} target="_blank" prefetch={false} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Open company
              </Link>
            ) : null}
            {company?.website ? (
              <a
                href={/^https?:\/\//i.test(company.website) ? company.website : `https://${company.website}`}
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

      {active ? (
        <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 xl:grid-cols-3">
          <form action={approveCompanyClaimAction}>
            <input type="hidden" name="claimId" value={claim.id} />
            <div className="h-full rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <h4 className="font-semibold text-emerald-950">Approve request</h4>
              <p className="mt-2 text-sm leading-6 text-emerald-800">Atomically assigns the company to this user and verifies the profile.</p>
              <button type="submit" className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
                Approve claim
              </button>
            </div>
          </form>

          <form action={requestMoreInfoCompanyClaimAction}>
            <input type="hidden" name="claimId" value={claim.id} />
            <div className="h-full rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <label htmlFor={`claim-info-${claim.id}`} className="font-semibold text-orange-950">Request more information</label>
              <textarea
                id={`claim-info-${claim.id}`}
                name="adminNote"
                required
                minLength={5}
                maxLength={1000}
                rows={3}
                placeholder="What should the claimant provide?"
                className="mt-3 w-full resize-y rounded-xl border border-orange-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
              <button type="submit" className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700">
                Request information
              </button>
            </div>
          </form>

          <form action={rejectCompanyClaimAction}>
            <input type="hidden" name="claimId" value={claim.id} />
            <div className="h-full rounded-2xl border border-red-200 bg-red-50 p-4">
              <label htmlFor={`claim-reject-${claim.id}`} className="font-semibold text-red-950">Reject request</label>
              <textarea
                id={`claim-reject-${claim.id}`}
                name="adminNote"
                required
                minLength={5}
                maxLength={1000}
                rows={3}
                placeholder="Reason for rejection..."
                className="mt-3 w-full resize-y rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
              />
              <button type="submit" className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800">
                Reject claim
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </article>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-all text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}

function CompanyLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-contain p-2" />
      </div>
    )
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-2xl font-bold text-white">
      {name.trim().charAt(0).toUpperCase() || "C"}
    </div>
  )
}
