type ContactCardProps = {
  companyName: string
  city: string | null
  phone: string | null
  email: string | null
  website: string | null
  hourlyRate: number | null
  minimumOrder: number | null
  rutAvailable: boolean | null
  labels: {
    title: string
    companySubtitle: string
    call: string
    email: string
    visitWebsite: string
    city: string
    phone: string
    hourlyRate: string
    minimumOrder: string
    rutAvailable: string
    yes: string
    no: string
  }
}

function normalizeWebsite(url: string | null) {
  if (!url) return null

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  return `https://${url}`
}

export default function ContactCard({
  companyName,
  city,
  phone,
  email,
  website,
  hourlyRate,
  minimumOrder,
  rutAvailable,
  labels,
}: ContactCardProps) {
  const websiteUrl = normalizeWebsite(website)

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          {labels.title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {companyName}
        </p>

        <div className="mt-6 space-y-3">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              {labels.call}
            </a>
          ) : null}

          {email ? (
            <a
              href={`mailto:${email}`}
              className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              {labels.email}
            </a>
          ) : null}

          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              {labels.visitWebsite} ↗
            </a>
          ) : null}
        </div>

        <dl className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
          {city ? (
            <div className="flex items-start justify-between gap-4 py-4">
              <dt className="text-sm text-slate-500">
                {labels.city}
              </dt>

              <dd className="text-right text-sm font-semibold text-slate-900">
                {city}
              </dd>
            </div>
          ) : null}

          {phone ? (
            <div className="flex items-start justify-between gap-4 py-4">
              <dt className="text-sm text-slate-500">
                {labels.phone}
              </dt>

              <dd className="text-right text-sm font-semibold text-slate-900 break-all">
                {phone}
              </dd>
            </div>
          ) : null}

          {hourlyRate ? (
            <div className="flex items-start justify-between gap-4 py-4">
              <dt className="text-sm text-slate-500">
                {labels.hourlyRate}
              </dt>

              <dd className="text-right text-sm font-semibold text-slate-900">
                {hourlyRate} SEK
              </dd>
            </div>
          ) : null}

          {minimumOrder ? (
            <div className="flex items-start justify-between gap-4 py-4">
              <dt className="text-sm text-slate-500">
                {labels.minimumOrder}
              </dt>

              <dd className="text-right text-sm font-semibold text-slate-900">
                {minimumOrder} h
              </dd>
            </div>
          ) : null}

          <div className="flex items-start justify-between gap-4 py-4">
            <dt className="text-sm text-slate-500">
              {labels.rutAvailable}
            </dt>

            <dd className="text-right text-sm font-semibold text-slate-900">
              {rutAvailable ? labels.yes : labels.no}
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}