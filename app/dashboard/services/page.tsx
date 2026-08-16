import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import CompanyWorkspaceNav from "@/components/company-dashboard/company-workspace-nav"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"
import DeleteServiceButton from "@/components/delete-service-button"

export const dynamic = "force-dynamic"

export default async function DashboardServicesPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )

  const dictionary = getDictionary(locale)
  const t = dictionary.services
  const common = dictionary.common

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/dashboard/services")
  }

  const { data: services } = await supabase
    .from("service_profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <CompanyWorkspaceNav locale={locale} active="services" />

      <div className="mb-8 mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/dashboard"
            prefetch={false}
            className="text-sm text-black/60 transition hover:text-black"
          >
            ← {dictionary.dashboard.title}
          </Link>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-black md:text-4xl">
            {t.myServicesTitle}
          </h1>

          <p className="mt-2 text-sm leading-6 text-black/60">
            {t.myServicesSubtitle}
          </p>
        </div>

        <Link
          href="/services/create"
          prefetch={false}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700"
        >
          {t.addServiceProfile}
        </Link>
      </div>

      {!services || services.length === 0 ? (
        <section className="rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            {t.noServicesYet}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-black/60">
            {t.myServicesSubtitle}
          </p>

          <Link
            href="/services/create"
            prefetch={false}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            {t.createFirstService}
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-4">
                {service.logo_url ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-white">
                    <img
                      src={service.logo_url}
                      alt={service.company_name}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-black/10 bg-rose-50 text-lg font-bold text-rose-600">
                    {service.company_name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="truncate text-xl font-semibold tracking-tight text-black">
                      {service.company_name}
                    </h2>

                    {service.verified ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {common.verified}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {common.pending}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-black/50">
                    {service.city}
                  </p>
                </div>
              </div>

              {service.hourly_rate ? (
                <p className="text-sm font-semibold text-black">
                  {t.fromPrice} {service.hourly_rate} {t.perHour}
                </p>
              ) : null}

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/60">
                {service.description || t.serviceProvider}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {service.service_types?.slice(0, 3).map((type: string) => (
                  <span
                    key={type}
                    className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/services/${service.slug}`}
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                >
                  {t.viewService}
                </Link>

                <Link
                  href={`/dashboard/services/${service.id}/edit`}
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80"
                >
                  {common.edit}
                </Link>

                <DeleteServiceButton serviceId={service.id} />
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}