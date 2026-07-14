import Link from "next/link"

export type RelatedServiceItem = {
  id: string
  company_name: string
  slug: string
  description: string | null
  city: string | null
  hourly_rate: number | null
  service_types: string[] | null
  logo_url: string | null
  verified: boolean | null
}

type RelatedServicesProps = {
  services: RelatedServiceItem[]
  city: string | null
  labels: {
    title: string
    subtitle: string
    priceFrom: string
    serviceProvider: string
    viewService: string
  }
}

export default function RelatedServices({
  services,
  city,
  labels,
}: RelatedServicesProps) {
  if (services.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">
          {labels.title}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {city || labels.subtitle}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.slug}`}
            prefetch={false}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              {service.logo_url ? (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={service.logo_url}
                    alt={`${service.company_name} logo`}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-xl font-bold text-rose-600">
                  {service.company_name?.charAt(0)?.toUpperCase() || "C"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 text-lg font-bold text-slate-950">
                    {service.company_name}
                  </h3>

                  {service.verified ? (
                    <span
                      aria-label="Verified"
                      className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700"
                    >
                      ✓
                    </span>
                  ) : null}
                </div>

                {service.city ? (
                  <p className="mt-1 text-sm text-slate-500">
                    {service.city}
                  </p>
                ) : null}
              </div>
            </div>

            {service.hourly_rate ? (
              <p className="mt-5 text-sm font-semibold text-slate-950">
                {labels.priceFrom} {service.hourly_rate} SEK/h
              </p>
            ) : null}

            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
              {service.description || labels.serviceProvider}
            </p>

            {service.service_types && service.service_types.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {service.service_types.slice(0, 3).map((serviceType) => (
                  <span
                    key={serviceType}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {serviceType}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-rose-600">
                {labels.viewService}
              </span>

              <span
                aria-hidden="true"
                className="text-slate-400 transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}