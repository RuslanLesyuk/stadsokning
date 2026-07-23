import Link from "next/link"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

import { importCompanyLeadsAction } from "./actions"

type PageProps = {
  searchParams: Promise<{
    success?: string
    error?: string
    created?: string
    skipped?: string
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
      `/login?next=${encodeURIComponent("/admin/leads/import")}`,
    )
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return user
}

function NumberCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  )
}

export default async function ImportCompanyLeadsPage({
  searchParams,
}: PageProps) {
  await requireAdmin()

  const params = await searchParams

  const isImportCompleted =
    params.success === "import-completed"

  const created = Number(params.created || "0")
  const skipped = Number(params.skipped || "0")
  const failed = Number(params.failed || "0")

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link
                href="/admin"
                className="transition hover:text-slate-950"
              >
                Admin
              </Link>

              <span>/</span>

              <Link
                href="/admin/leads"
                className="transition hover:text-slate-950"
              >
                Company leads
              </Link>

              <span>/</span>

              <span className="text-slate-700">
                Import
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Import companies from Excel
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Upload an Excel file and create multiple company
              leads in one operation. Existing companies and
              invalid rows will be skipped automatically.
            </p>
          </div>

          <Link
            href="/admin/leads"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-100"
          >
            Back to leads
          </Link>
        </div>

        {params.error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
            <p className="font-semibold">
              Import failed
            </p>

            <p className="mt-1">
              {params.error}
            </p>
          </div>
        ) : null}

        {isImportCompleted ? (
          <div className="mb-8">
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
              <p className="font-semibold">
                Import completed
              </p>

              <p className="mt-1 text-sm leading-6">
                The Excel file was processed. Review the results
                below before sending invitations.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <NumberCard
                label="Created"
                value={String(created)}
                description="New company leads added to the CRM."
              />

              <NumberCard
                label="Skipped"
                value={String(skipped)}
                description="Duplicates, invalid rows or incomplete records."
              />

              <NumberCard
                label="Failed"
                value={String(failed)}
                description="Rows that could not be inserted into the database."
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/leads"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Review imported companies
              </Link>

              <Link
                href="/admin/leads/import"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Import another file
              </Link>
            </div>
          </div>
        ) : null}

        {!isImportCompleted ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Excel upload
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Select an .xlsx file
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The first row must contain column names. A
                  maximum of 500 company rows can be imported at
                  once.
                </p>
              </div>

              <form
                action={importCompanyLeadsAction}
                className="mt-7 space-y-6"
              >
                <div>
                  <label
                    htmlFor="file"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Excel file
                  </label>

                  <div className="mt-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                    <input
                      id="file"
                      name="file"
                      type="file"
                      accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      required
                      className="block w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
                    />

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Supported format: .xlsx. Maximum file size:
                      5 MB.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">
                    Review before sending invitations
                  </p>

                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    Importing companies does not send emails
                    automatically. After import, open the leads
                    page, select the companies and start the bulk
                    invitation manually.
                  </p>
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:w-auto"
                >
                  Import companies
                </button>
              </form>
            </section>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950">
                  Required columns
                </h2>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-slate-100 p-3">
                    <code className="text-sm font-semibold text-slate-900">
                      company_name
                    </code>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Required for every imported company.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-800">
                      Contact information
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Every row must contain at least one of:
                      email, phone or website.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950">
                  Supported columns
                </h2>

                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-3 py-2.5 font-semibold">
                          Column
                        </th>

                        <th className="px-3 py-2.5 font-semibold">
                          Required
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="px-3 py-2.5">
                          company_name
                        </td>
                        <td className="px-3 py-2.5">
                          Yes
                        </td>
                      </tr>

                      <tr>
                        <td className="px-3 py-2.5">
                          city
                        </td>
                        <td className="px-3 py-2.5">
                          No
                        </td>
                      </tr>

                      <tr>
                        <td className="px-3 py-2.5">
                          email
                        </td>
                        <td className="px-3 py-2.5">
                          No
                        </td>
                      </tr>

                      <tr>
                        <td className="px-3 py-2.5">
                          phone
                        </td>
                        <td className="px-3 py-2.5">
                          No
                        </td>
                      </tr>

                      <tr>
                        <td className="px-3 py-2.5">
                          website
                        </td>
                        <td className="px-3 py-2.5">
                          No
                        </td>
                      </tr>

                      <tr>
                        <td className="px-3 py-2.5">
                          source
                        </td>
                        <td className="px-3 py-2.5">
                          No
                        </td>
                      </tr>

                      <tr>
                        <td className="px-3 py-2.5">
                          notes
                        </td>
                        <td className="px-3 py-2.5">
                          No
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
                <h2 className="text-sm font-bold text-blue-950">
                  Example header row
                </h2>

                <div className="mt-3 overflow-x-auto rounded-xl bg-white p-3">
                  <code className="whitespace-nowrap text-xs text-slate-800">
                    company_name | city | email | phone |
                    website | source | notes
                  </code>
                </div>
              </section>
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  )
}