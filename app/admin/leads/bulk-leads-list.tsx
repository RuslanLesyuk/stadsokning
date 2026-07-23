"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import {
  sendBulkCompanyInvitesAction,
  sendCompanyInviteAction,
} from "@/app/admin/leads/actions"

type LeadStatus =
  | "new"
  | "invited"
  | "opened"
  | "registered"
  | "ignored"

export type BulkCompanyLead = {
  id: string
  company_name: string
  city: string | null
  website: string | null
  email: string | null
  phone: string | null
  status: LeadStatus
  invited_at: string | null
  last_invited_at: string | null
  invite_count: number
  registered: boolean
  created_at: string
}

type BulkLeadsListProps = {
  leads: BulkCompanyLead[]
}

function formatDate(value: string | null) {
  if (!value) return "—"

  try {
    return new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function getStatusClasses(status: LeadStatus) {
  switch (status) {
    case "new":
      return "border-sky-200 bg-sky-50 text-sky-700"

    case "invited":
      return "border-amber-200 bg-amber-50 text-amber-700"

    case "opened":
      return "border-violet-200 bg-violet-50 text-violet-700"

    case "registered":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"

    case "ignored":
      return "border-slate-200 bg-slate-100 text-slate-600"

    default:
      return "border-slate-200 bg-slate-100 text-slate-600"
  }
}

function getStatusLabel(status: LeadStatus) {
  switch (status) {
    case "new":
      return "New"

    case "invited":
      return "Invited"

    case "opened":
      return "Opened"

    case "registered":
      return "Registered"

    case "ignored":
      return "Ignored"

    default:
      return status
  }
}

function canReceiveInvite(lead: BulkCompanyLead) {
  return Boolean(
    lead.email &&
      lead.email.includes("@") &&
      lead.status !== "registered" &&
      !lead.registered,
  )
}

export default function BulkLeadsList({
  leads,
}: BulkLeadsListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const eligibleLeadIds = useMemo(
    () =>
      leads
        .filter(canReceiveInvite)
        .map((lead) => lead.id),
    [leads],
  )

  const selectedEligibleIds = useMemo(
    () =>
      selectedIds.filter((id) =>
        eligibleLeadIds.includes(id),
      ),
    [eligibleLeadIds, selectedIds],
  )

  const allEligibleSelected =
    eligibleLeadIds.length > 0 &&
    selectedEligibleIds.length === eligibleLeadIds.length

  function toggleLead(leadId: string) {
    setSelectedIds((current) =>
      current.includes(leadId)
        ? current.filter((id) => id !== leadId)
        : [...current, leadId],
    )
  }

  function selectAllEligible() {
    setSelectedIds(eligibleLeadIds)
  }

  function clearSelection() {
    setSelectedIds([])
  }

  return (
    <section className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-950">
              Companies
            </h2>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {leads.length} shown
            </span>

            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              {selectedEligibleIds.length} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={
                allEligibleSelected
                  ? clearSelection
                  : selectAllEligible
              }
              disabled={eligibleLeadIds.length === 0}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {allEligibleSelected
                ? "Clear selection"
                : `Select all (${eligibleLeadIds.length})`}
            </button>

            <form action={sendBulkCompanyInvitesAction}>
              <input
                type="hidden"
                name="leadIds"
                value={JSON.stringify(selectedEligibleIds)}
              />

              <button
                type="submit"
                disabled={selectedEligibleIds.length === 0}
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                Send invitations
              </button>
            </form>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Only companies with a valid email address that are not
          registered can be selected.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="p-6 md:p-10">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <h3 className="text-lg font-semibold text-slate-950">
              No companies found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add the first company or change the current filters.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile */}
          <div className="divide-y divide-slate-200 lg:hidden">
            {leads.map((lead) => {
              const eligible = canReceiveInvite(lead)
              const selected = selectedIds.includes(lead.id)

              return (
                <article
                  key={lead.id}
                  className={
                    selected
                      ? "min-w-0 bg-rose-50/50 p-5"
                      : "min-w-0 p-5"
                  }
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <label className="mt-1 flex shrink-0">
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={!eligible}
                        onChange={() => toggleLead(lead.id)}
                        aria-label={`Select ${lead.company_name}`}
                        className="h-5 w-5 rounded border-slate-300 accent-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                      />
                    </label>

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-base font-semibold text-slate-950">
                            {lead.company_name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {lead.city || "No city"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            lead.status,
                          )}`}
                        >
                          {getStatusLabel(lead.status)}
                        </span>
                      </div>

                      <dl className="mt-4 space-y-3 text-sm">
                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Email
                          </dt>

                          <dd className="mt-1 break-all text-slate-700">
                            {lead.email || "—"}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Website
                          </dt>

                          <dd className="mt-1 min-w-0">
                            {lead.website ? (
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noreferrer"
                                className="block break-all text-rose-700 hover:underline"
                              >
                                {lead.website}
                              </a>
                            ) : (
                              <span className="text-slate-500">
                                —
                              </span>
                            )}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Invites
                          </dt>

                          <dd className="mt-1 text-slate-700">
                            {lead.invite_count}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {eligible ? (
                          <form action={sendCompanyInviteAction}>
                            <input
                              type="hidden"
                              name="leadId"
                              value={lead.id}
                            />

                            <button
                              type="submit"
                              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]"
                            >
                              {lead.invite_count > 0
                                ? "Send again"
                                : "Send invite"}
                            </button>
                          </form>
                        ) : (
                          <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-400">
                            {lead.status === "registered" ||
                            lead.registered
                              ? "Registered"
                              : "No email"}
                          </span>
                        )}

                        <Link
                          href={`/admin/leads/${lead.id}/edit`}
                          prefetch={false}
                          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1120px] border-collapse text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="w-16 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={allEligibleSelected}
                      disabled={eligibleLeadIds.length === 0}
                      onChange={() =>
                        allEligibleSelected
                          ? clearSelection()
                          : selectAllEligible()
                      }
                      aria-label="Select all eligible companies"
                      className="h-5 w-5 rounded border-slate-300 accent-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                    />
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Invites
                  </th>

                  <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Added
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {leads.map((lead) => {
                  const eligible = canReceiveInvite(lead)
                  const selected = selectedIds.includes(lead.id)

                  return (
                    <tr
                      key={lead.id}
                      className={
                        selected
                          ? "align-top bg-rose-50/50 transition"
                          : "align-top transition hover:bg-slate-50"
                      }
                    >
                      <td className="px-6 py-5">
                        <input
                          type="checkbox"
                          checked={selected}
                          disabled={!eligible}
                          onChange={() => toggleLead(lead.id)}
                          aria-label={`Select ${lead.company_name}`}
                          className="h-5 w-5 rounded border-slate-300 accent-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                        />
                      </td>

                      <td className="px-4 py-5">
                        <div className="max-w-[260px]">
                          <div className="break-words text-sm font-semibold text-slate-950">
                            {lead.company_name}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {lead.city || "No city"}
                          </div>

                          {lead.website ? (
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 block truncate text-xs font-medium text-rose-700 hover:underline"
                            >
                              {lead.website}
                            </a>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="max-w-[250px]">
                          <div className="break-all text-sm text-slate-700">
                            {lead.email || "No email"}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {lead.phone || "No phone"}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            lead.status,
                          )}`}
                        >
                          {getStatusLabel(lead.status)}
                        </span>

                        {lead.registered &&
                        lead.status !== "registered" ? (
                          <div className="mt-2 text-xs font-medium text-emerald-700">
                            Registered
                          </div>
                        ) : null}
                      </td>

                      <td className="px-4 py-5">
                        <div className="text-sm font-semibold text-slate-950">
                          {lead.invite_count}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {lead.last_invited_at
                            ? formatDate(lead.last_invited_at)
                            : "Never invited"}
                        </div>
                      </td>

                      <td className="px-4 py-5 text-sm text-slate-600">
                        {formatDate(lead.created_at)}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {eligible ? (
                            <form action={sendCompanyInviteAction}>
                              <input
                                type="hidden"
                                name="leadId"
                                value={lead.id}
                              />

                              <button
                                type="submit"
                                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]"
                              >
                                {lead.invite_count > 0
                                  ? "Send again"
                                  : "Send invite"}
                              </button>
                            </form>
                          ) : (
                            <span className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-400">
                              {lead.status === "registered" ||
                              lead.registered
                                ? "Registered"
                                : "No email"}
                            </span>
                          )}

                          <Link
                            href={`/admin/leads/${lead.id}/edit`}
                            prefetch={false}
                            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}