import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { closeVacancyAction } from "@/app/lediga-jobb/actions"
import { VacancyDeleteButton } from "@/components/vacancies/vacancy-delete-button"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Mina lediga jobb",
  robots: { index: false, follow: true },
}

type VacancyApplicationRow = {
  id: string
  vacancy_id: string
  applicant_name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

export default async function MyVacanciesPage() {
  const store = await cookies()
  const locale = normalizeLocale(
    store.get("clean_jobs_locale")?.value,
  ) as Locale
  const t = getVacancyDictionary(locale).dashboard

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login?next=/dashboard/vacancies")

  const { data: vacancies } = await supabase
    .from("vacancies")
    .select("id,slug,title,company_name,city,status,created_at")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  const ids = (vacancies || []).map((vacancy) => vacancy.id)
  const { data: applications } = ids.length
    ? await supabase
        .from("vacancy_applications")
        .select(
          "id,vacancy_id,applicant_name,email,phone,message,created_at",
        )
        .in("vacancy_id", ids)
        .order("created_at", { ascending: false })
    : { data: [] as VacancyApplicationRow[] }

  const applicationsByVacancy = new Map<
    string,
    VacancyApplicationRow[]
  >()

  for (const application of applications || []) {
    const list =
      applicationsByVacancy.get(application.vacancy_id) || []
    list.push(application)
    applicationsByVacancy.set(application.vacancy_id, list)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-700">
            {t.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {t.title}
          </h1>
        </div>
        <Link
          href="/lediga-jobb/create"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 text-sm font-semibold text-white"
        >
          {t.add}
        </Link>
      </div>

      <div className="mt-7 space-y-5">
        {(vacancies || []).length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-600">
            {t.empty}
          </div>
        ) : (
          (vacancies || []).map((vacancy) => {
            const vacancyApplications =
              applicationsByVacancy.get(vacancy.id) || []

            return (
              <section
                key={vacancy.id}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        vacancy.status === "active"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {vacancy.status === "active"
                        ? t.active
                        : t.closed}
                    </span>
                    <h2 className="mt-3 text-xl font-black text-slate-950">
                      {vacancy.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {vacancy.company_name} · {vacancy.city}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {vacancy.status === "active" ? (
                      <Link
                        href={`/lediga-jobb/${vacancy.slug}`}
                        className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold"
                      >
                        {t.view}
                      </Link>
                    ) : null}

                    <Link
                      href={`/lediga-jobb/${vacancy.slug}/edit`}
                      className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold"
                    >
                      {t.edit}
                    </Link>

                    {vacancy.status === "active" ? (
                      <form action={closeVacancyAction}>
                        <input
                          type="hidden"
                          name="vacancy_id"
                          value={vacancy.id}
                        />
                        <button className="min-h-10 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white">
                          {t.close}
                        </button>
                      </form>
                    ) : null}

                    <VacancyDeleteButton
                      vacancyId={vacancy.id}
                      slug={vacancy.slug}
                      label={t.delete}
                      confirmMessage={t.deleteConfirm}
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <h3 className="font-black text-slate-950">
                    {t.applications} ({vacancyApplications.length})
                  </h3>

                  {vacancyApplications.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">
                      {t.noApplications}
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {vacancyApplications.map((application) => (
                        <div
                          key={application.id}
                          className="rounded-2xl bg-slate-50 p-4"
                        >
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <strong className="text-sm text-slate-950">
                              {application.applicant_name}
                            </strong>
                            <a
                              className="text-sm text-rose-700"
                              href={`mailto:${application.email}`}
                            >
                              {application.email}
                            </a>
                            {application.phone ? (
                              <a
                                className="text-sm text-rose-700"
                                href={`tel:${application.phone}`}
                              >
                                {application.phone}
                              </a>
                            ) : null}
                          </div>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {application.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )
          })
        )}
      </div>
    </main>
  )
}
