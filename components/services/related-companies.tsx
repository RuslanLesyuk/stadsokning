import Link from "next/link"

export type RelatedCompanyItem = {
  id: string
  name: string
  slug: string
  city: string | null
  description: string | null
  logo_url: string | null
  verified: boolean | null
  rating: number | null
  services: string | null
}

type RelatedCompaniesProps = {
  companies: RelatedCompanyItem[]
  city: string | null
  labels: {
    title: string
    subtitle: string
    verified: string
    rating: string
    viewCompany: string
    fallbackDescription: string
  }
}

function normalizeRating(value: number | null) {
  if (value === null || !Number.isFinite(Number(value))) {
    return null
  }

  const rating = Number(value)

  if (rating < 0 || rating > 5) {
    return null
  }

  return Number(rating.toFixed(1))
}

function getServices(value: string | null) {
  if (!value?.trim()) {
    return []
  }

  return value
    .split(",")
    .map((service) => service.trim())
    .filter(Boolean)
    .slice(0, 3)
}

export default function RelatedCompanies({
  companies,
  city,
  labels,
}: RelatedCompaniesProps) {
  if (companies.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">
          {labels.title}
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {city ? `${labels.subtitle} ${city}` : labels.subtitle}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => {
          const rating = normalizeRating(company.rating)
          const services = getServices(company.services)

          return (
            <Link
              key={company.id}
              href={`/companies/${company.slug}`}
              prefetch={false}
              className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                {company.logo_url ? (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <img
                      src={company.logo_url}
                      alt={`${company.name} logo`}
                      loading="lazy"
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-xl font-bold text-rose-600">
                    {company.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-lg font-bold text-slate-950">
                      {company.name}
                    </h3>

                    {company.verified ? (
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        ✓ {labels.verified}
                      </span>
                    ) : null}
                  </div>

                  {company.city ? (
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      {company.city}
                    </p>
                  ) : null}
                </div>
              </div>

              {rating !== null ? (
                <div className="mt-5 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="tracking-wide text-amber-400"
                  >
                    ★★★★★
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {rating.toFixed(1)}
                  </span>

                  <span className="text-xs text-slate-500">
                    {labels.rating}
                  </span>
                </div>
              ) : null}

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                {company.description?.trim() || labels.fallbackDescription}
              </p>

              {services.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-auto flex items-center justify-between pt-6">
                <span className="text-sm font-semibold text-rose-600">
                  {labels.viewCompany}
                </span>

                <span
                  aria-hidden="true"
                  className="text-slate-400 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}