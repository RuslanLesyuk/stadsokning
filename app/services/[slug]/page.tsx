import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import ReviewsSection from "@/components/reviews/review-section"
import ContactCard from "@/components/services/contact-card"
import Gallery from "@/components/services/gallery"
import RelatedServices, {
  type RelatedServiceItem,
} from "@/components/services/related-services"
import WorkingHours from "@/components/services/working-hours"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"
import { getLanguageAlternates } from "@/lib/seo"
import { createClient } from "@/lib/supabase-server"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

type WorkingHoursData = {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

type WorkingHoursDay = keyof WorkingHoursData

type ServiceProfile = {
  id: string
  user_id: string
  company_name: string
  slug: string
  description: string | null
  city: string | null
  phone: string | null
  email: string | null
  website: string | null
  hourly_rate: number | null
  minimum_order: number | null
  rut_available: boolean | null
  languages: string[] | null
  service_types: string[] | null
  service_areas: string[] | null
  logo_url: string | null
  gallery_urls: string[] | null
  working_hours: WorkingHoursData | null
  verified: boolean | null
}

type ServiceReview = {
  id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}

const serviceSelect = `
  id,
  user_id,
  company_name,
  slug,
  description,
  city,
  phone,
  email,
  website,
  hourly_rate,
  minimum_order,
  rut_available,
  languages,
  service_types,
  service_areas,
  logo_url,
  gallery_urls,
  working_hours,
  verified
`

const relatedServiceSelect = `
  id,
  company_name,
  slug,
  description,
  city,
  hourly_rate,
  service_types,
  logo_url,
  verified
`

const workingHoursLabels = {
  sv: {
    title: "Öppettider",
    monday: "Måndag",
    tuesday: "Tisdag",
    wednesday: "Onsdag",
    thursday: "Torsdag",
    friday: "Fredag",
    saturday: "Lördag",
    sunday: "Söndag",
    closed: "Stängt",
  },
  en: {
    title: "Working hours",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    closed: "Closed",
  },
  uk: {
    title: "Графік роботи",
    monday: "Понеділок",
    tuesday: "Вівторок",
    wednesday: "Середа",
    thursday: "Четвер",
    friday: "П’ятниця",
    saturday: "Субота",
    sunday: "Неділя",
    closed: "Зачинено",
  },
  ru: {
    title: "График работы",
    monday: "Понедельник",
    tuesday: "Вторник",
    wednesday: "Среда",
    thursday: "Четверг",
    friday: "Пятница",
    saturday: "Суббота",
    sunday: "Воскресенье",
    closed: "Закрыто",
  },
  pl: {
    title: "Godziny pracy",
    monday: "Poniedziałek",
    tuesday: "Wtorek",
    wednesday: "Środa",
    thursday: "Czwartek",
    friday: "Piątek",
    saturday: "Sobota",
    sunday: "Niedziela",
    closed: "Zamknięte",
  },
} as const

const reviewsLabels = {
  sv: {
    title: "Recensioner",
    summaryReviews: "recensioner",
    noReviews: "Det finns inga recensioner ännu.",
    anonymousUser: "Användare",
    leaveReview: "Lämna en recension",
    leaveReviewSubtitle:
      "Dela din upplevelse av företagets tjänster.",
    rating: "Betyg",
    comment: "Kommentar",
    commentPlaceholder: "Beskriv din upplevelse...",
    submit: "Publicera recension",
    submitting: "Publicerar...",
    success: "Recensionen har publicerats.",
    alreadyReviewed: "Du har redan recenserat den här tjänsten.",
    ownEntity: "Du kan inte recensera din egen tjänst.",
    loginRequired: "Logga in för att lämna en recension.",
    loginButton: "Logga in",
    deleteReview: "Ta bort recension",
  },
  en: {
    title: "Reviews",
    summaryReviews: "reviews",
    noReviews: "There are no reviews yet.",
    anonymousUser: "User",
    leaveReview: "Leave a review",
    leaveReviewSubtitle:
      "Share your experience with this company’s services.",
    rating: "Rating",
    comment: "Comment",
    commentPlaceholder: "Describe your experience...",
    submit: "Publish review",
    submitting: "Publishing...",
    success: "Your review has been published.",
    alreadyReviewed: "You have already reviewed this service.",
    ownEntity: "You cannot review your own service.",
    loginRequired: "Log in to leave a review.",
    loginButton: "Log in",
    deleteReview: "Delete review",
  },
  uk: {
    title: "Відгуки",
    summaryReviews: "відгуків",
    noReviews: "Відгуків поки немає.",
    anonymousUser: "Користувач",
    leaveReview: "Залишити відгук",
    leaveReviewSubtitle:
      "Поділіться своїм досвідом користування послугами компанії.",
    rating: "Оцінка",
    comment: "Коментар",
    commentPlaceholder: "Опишіть свій досвід...",
    submit: "Опублікувати відгук",
    submitting: "Публікуємо...",
    success: "Ваш відгук опубліковано.",
    alreadyReviewed: "Ви вже залишили відгук про цю послугу.",
    ownEntity: "Не можна оцінювати власну послугу.",
    loginRequired: "Увійдіть, щоб залишити відгук.",
    loginButton: "Увійти",
    deleteReview: "Видалити відгук",
  },
  ru: {
    title: "Отзывы",
    summaryReviews: "отзывов",
    noReviews: "Отзывов пока нет.",
    anonymousUser: "Пользователь",
    leaveReview: "Оставить отзыв",
    leaveReviewSubtitle:
      "Поделитесь своим опытом использования услуг компании.",
    rating: "Оценка",
    comment: "Комментарий",
    commentPlaceholder: "Опишите свой опыт...",
    submit: "Опубликовать отзыв",
    submitting: "Публикуем...",
    success: "Ваш отзыв опубликован.",
    alreadyReviewed: "Вы уже оставили отзыв об этой услуге.",
    ownEntity: "Нельзя оценивать собственную услугу.",
    loginRequired: "Войдите, чтобы оставить отзыв.",
    loginButton: "Войти",
    deleteReview: "Удалить отзыв",
  },
  pl: {
    title: "Opinie",
    summaryReviews: "opinii",
    noReviews: "Nie ma jeszcze żadnych opinii.",
    anonymousUser: "Użytkownik",
    leaveReview: "Dodaj opinię",
    leaveReviewSubtitle:
      "Podziel się swoim doświadczeniem z usługami firmy.",
    rating: "Ocena",
    comment: "Komentarz",
    commentPlaceholder: "Opisz swoje doświadczenie...",
    submit: "Opublikuj opinię",
    submitting: "Publikowanie...",
    success: "Twoja opinia została opublikowana.",
    alreadyReviewed: "Ta usługa została już przez Ciebie oceniona.",
    ownEntity: "Nie możesz ocenić własnej usługi.",
    loginRequired: "Zaloguj się, aby dodać opinię.",
    loginButton: "Zaloguj się",
    deleteReview: "Usuń opinię",
  },
} as const

const schemaDayNames: Record<WorkingHoursDay, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
}

function normalizeWebsiteUrl(value: string | null) {
  if (!value) {
    return null
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  if (
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("http://")
  ) {
    return trimmedValue
  }

  return `https://${trimmedValue}`
}

function normalizeGalleryUrls(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  )
}

function normalizeWorkingHours(value: unknown): WorkingHoursData {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  const record = value as Record<string, unknown>
  const result: WorkingHoursData = {}

  for (const day of Object.keys(schemaDayNames) as WorkingHoursDay[]) {
    const dayValue = record[day]

    if (typeof dayValue === "string" && dayValue.trim()) {
      result[day] = dayValue.trim()
    }
  }

  return result
}

function getServiceDescription(service: ServiceProfile) {
  if (service.description?.trim()) {
    return service.description.trim()
  }

  return `${service.company_name} provides professional cleaning services in ${
    service.city || "Sweden"
  }. View prices, service areas and contact information.`
}

function getMetadataDescription(service: ServiceProfile) {
  const description = getServiceDescription(service)

  if (description.length <= 160) {
    return description
  }

  return `${description.slice(0, 157).trimEnd()}...`
}

function parseOpeningHours(value: string | undefined) {
  if (!value) {
    return null
  }

  const normalized = value
    .trim()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, "")

  const match = normalized.match(
    /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/,
  )

  if (!match) {
    return null
  }

  return {
    opens: `${match[1]}:${match[2]}`,
    closes: `${match[3]}:${match[4]}`,
  }
}

function createOpeningHoursSpecification(hours: WorkingHoursData) {
  return (Object.keys(schemaDayNames) as WorkingHoursDay[])
    .map((day) => {
      const parsedHours = parseOpeningHours(hours[day])

      if (!parsedHours) {
        return null
      }

      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${schemaDayNames[day]}`,
        opens: parsedHours.opens,
        closes: parsedHours.closes,
      }
    })
    .filter(
      (
        specification,
      ): specification is {
        "@type": string
        dayOfWeek: string
        opens: string
        closes: string
      } => specification !== null,
    )
}

function calculateRatingStats(reviews: ServiceReview[]) {
  const validRatings = reviews
    .map((review) => Number(review.rating))
    .filter(
      (rating) =>
        Number.isFinite(rating) &&
        rating >= 1 &&
        rating <= 5,
    )

  if (validRatings.length === 0) {
    return {
      reviewsCount: 0,
      averageRating: null as number | null,
    }
  }

  const ratingTotal = validRatings.reduce(
    (total, rating) => total + rating,
    0,
  )

  return {
    reviewsCount: validRatings.length,
    averageRating: Number(
      (ratingTotal / validRatings.length).toFixed(1),
    ),
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params

  const supabase = await createClient()

  const { data: serviceData } = await supabase
    .from("service_profiles")
    .select(serviceSelect)
    .eq("slug", slug)
    .maybeSingle()

  if (!serviceData) {
    return {
      title: "Service Not Found | Clean Jobs",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const service = serviceData as ServiceProfile
  const pathname = `/services/${service.slug}`
  const canonicalUrl = `https://cleansjob.com${pathname}`
  const description = getMetadataDescription(service)
  const city = service.city || "Sweden"
  const galleryUrls = normalizeGalleryUrls(service.gallery_urls)
  const socialImage = service.logo_url || galleryUrls[0]

  return {
    title: `${service.company_name} | Cleaning Services in ${city} | Clean Jobs`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "Clean Jobs",
      title: `${service.company_name} | Cleaning Services in ${city}`,
      description,
      images: socialImage
        ? [
            {
              url: socialImage,
              alt: `${service.company_name} cleaning services`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title: `${service.company_name} | Clean Jobs`,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )

  const dictionary = getDictionary(locale)
  const t = dictionary.services
  const hoursLabels = workingHoursLabels[locale]
  const serviceReviewLabels = reviewsLabels[locale]

  const supabase = await createClient()

  const { data: serviceData } = await supabase
    .from("service_profiles")
    .select(serviceSelect)
    .eq("slug", slug)
    .maybeSingle()

  if (!serviceData) {
    notFound()
  }

  const service = serviceData as ServiceProfile

  let relatedQuery = supabase
    .from("service_profiles")
    .select(relatedServiceSelect)
    .neq("id", service.id)
    .order("verified", { ascending: false })
    .order("company_name", { ascending: true })
    .limit(3)

  if (service.city) {
    relatedQuery = relatedQuery.eq("city", service.city)
  }

  const [
    { data: relatedData, error: relatedError },
    { data: reviewsData, error: reviewsError },
  ] = await Promise.all([
    relatedQuery,
    supabase
      .from("reviews")
      .select(
        `
          id,
          reviewer_id,
          reviewee_id,
          rating,
          comment,
          created_at
        `,
      )
      .eq("entity_type", "service")
      .eq("entity_id", service.id)
      .order("created_at", { ascending: false }),
  ])

  if (relatedError) {
    console.error("Load related services error:", relatedError)
  }

  if (reviewsError) {
    console.error("Load service reviews error:", reviewsError)
  }

  const relatedServices = (relatedData || []) as RelatedServiceItem[]
  const serviceReviews = (reviewsData || []) as ServiceReview[]

  const { reviewsCount, averageRating } =
    calculateRatingStats(serviceReviews)

  const galleryUrls = normalizeGalleryUrls(service.gallery_urls)
  const workingHours = normalizeWorkingHours(service.working_hours)
  const openingHoursSpecification =
    createOpeningHoursSpecification(workingHours)

  const websiteUrl = normalizeWebsiteUrl(service.website)
  const pathname = `/services/${service.slug}`
  const canonicalUrl = `https://cleansjob.com${pathname}`
  const fullDescription = getServiceDescription(service)

  const schemaReviews = serviceReviews
    .filter((review) => {
      const rating = Number(review.rating)

      return (
        Number.isFinite(rating) &&
        rating >= 1 &&
        rating <= 5
      )
    })
    .slice(0, 20)
    .map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Clean Jobs user",
      },
      datePublished: review.created_at,
      reviewBody: review.comment?.trim() || undefined,
      reviewRating: {
        "@type": "Rating",
        ratingValue: Number(review.rating),
        bestRating: 5,
        worstRating: 1,
      },
      itemReviewed: {
        "@id": `${canonicalUrl}#business`,
      },
    }))

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${canonicalUrl}#business`,
    name: service.company_name,
    url: canonicalUrl,
    image:
      galleryUrls.length > 0
        ? galleryUrls
        : service.logo_url || undefined,
    logo: service.logo_url || undefined,
    description: fullDescription,
    telephone: service.phone || undefined,
    email: service.email || undefined,
    address: service.city
      ? {
          "@type": "PostalAddress",
          addressLocality: service.city,
          addressCountry: "SE",
        }
      : undefined,
    areaServed:
      service.service_areas?.map((area) => ({
        "@type": "City",
        name: area,
      })) || undefined,
    priceRange: service.hourly_rate
      ? `From ${service.hourly_rate} SEK per hour`
      : undefined,
    sameAs: websiteUrl ? [websiteUrl] : undefined,
    openingHoursSpecification:
      openingHoursSpecification.length > 0
        ? openingHoursSpecification
        : undefined,
    aggregateRating:
      averageRating !== null && reviewsCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: reviewsCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    review: schemaReviews.length > 0 ? schemaReviews : undefined,
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonicalUrl}#service`,
    name: `${service.company_name} cleaning services`,
    url: canonicalUrl,
    description: fullDescription,
    image:
      galleryUrls.length > 0
        ? galleryUrls
        : service.logo_url || undefined,
    provider: {
      "@id": `${canonicalUrl}#business`,
    },
    serviceType:
      service.service_types && service.service_types.length > 0
        ? service.service_types
        : "Cleaning services",
    areaServed:
      service.service_areas?.map((area) => ({
        "@type": "City",
        name: area,
      })) || undefined,
    offers: service.hourly_rate
      ? {
          "@type": "Offer",
          price: service.hourly_rate,
          priceCurrency: "SEK",
          availability: "https://schema.org/InStock",
          url: canonicalUrl,
        }
      : undefined,
    aggregateRating:
      averageRating !== null && reviewsCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: reviewsCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Clean Jobs",
        item: "https://cleansjob.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.pageTitle,
        item: "https://cleansjob.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.company_name,
        item: canonicalUrl,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link
            href="/"
            prefetch={false}
            className="transition hover:text-rose-600"
          >
            Clean Jobs
          </Link>

          <span aria-hidden="true">/</span>

          <Link
            href="/services"
            prefetch={false}
            className="transition hover:text-rose-600"
          >
            {t.pageTitle}
          </Link>

          <span aria-hidden="true">/</span>

          <span className="font-medium text-slate-900">
            {service.company_name}
          </span>
        </nav>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-rose-50 via-white to-slate-50 p-6 md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {service.logo_url ? (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <img
                      src={service.logo_url}
                      alt={`${service.company_name} logo`}
                      className="h-full w-full object-contain p-3"
                    />
                  </div>
                ) : (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl border border-rose-100 bg-rose-50 text-4xl font-bold text-rose-600 shadow-sm">
                    {service.company_name
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
                      {t.serviceProvider}
                    </p>

                    {service.verified ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        ✓ {t.verified}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {t.pending}
                      </span>
                    )}
                  </div>

                  <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                    {service.company_name}
                  </h1>

                  {service.city ? (
                    <p className="mt-3 text-lg font-medium text-slate-600">
                      {service.city}, Sweden
                    </p>
                  ) : null}

                  {averageRating !== null && reviewsCount > 0 ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="text-lg tracking-wide text-amber-400"
                      >
                        ★★★★★
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {averageRating.toFixed(1)}
                      </span>

                      <span className="text-sm text-slate-500">
                        ({reviewsCount} {serviceReviewLabels.summaryReviews})
                      </span>
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.rut_available ? (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                        {t.rutAvailable}
                      </span>
                    ) : null}

                    {service.minimum_order ? (
                      <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                        {t.minimumOrderHours} {service.minimum_order}h
                      </span>
                    ) : null}

                    {service.service_types
                      ?.slice(0, 4)
                      .map((serviceType) => (
                        <span
                          key={serviceType}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                        >
                          {serviceType}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {service.hourly_rate ? (
                <div className="rounded-3xl border border-rose-100 bg-white px-6 py-5 shadow-sm lg:min-w-56">
                  <p className="text-sm font-medium text-slate-500">
                    {t.priceFrom}
                  </p>

                  <p className="mt-1 text-3xl font-bold text-rose-600">
                    {service.hourly_rate} SEK
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    / {t.hours}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <Gallery
              images={galleryUrls}
              companyName={service.company_name}
            />

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-bold text-slate-950">
                {t.serviceDetails}
              </h2>

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                {fullDescription}
              </p>
            </section>

            {service.service_types &&
            service.service_types.length > 0 ? (
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-bold text-slate-950">
                  {t.servicesTitle}
                </h2>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.service_types.map((serviceType) => (
                    <div
                      key={serviceType}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-600">
                        ✓
                      </span>

                      <span className="font-medium text-slate-800">
                        {serviceType}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {service.service_areas &&
            service.service_areas.length > 0 ? (
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-bold text-slate-950">
                  {t.serviceAreasTitle}
                </h2>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.service_areas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {service.languages && service.languages.length > 0 ? (
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-bold text-slate-950">
                  {t.languagesTitle}
                </h2>

                <div className="mt-6 flex flex-wrap gap-2">
                  {service.languages.map((language) => (
                    <span
                      key={language}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <WorkingHours
              hours={workingHours}
              labels={hoursLabels}
            />

            <ReviewsSection
              entityType="service"
              entityId={service.id}
              revieweeId={service.user_id}
              pathname={pathname}
              locale={locale}
              labels={serviceReviewLabels}
            />
          </div>

          <ContactCard
            companyName={service.company_name}
            city={service.city}
            phone={service.phone}
            email={service.email}
            website={service.website}
            hourlyRate={service.hourly_rate}
            minimumOrder={service.minimum_order}
            rutAvailable={service.rut_available}
            labels={{
              title: t.contactInformation,
              companySubtitle: t.serviceProvider,
              call: t.call,
              email: t.email,
              visitWebsite: t.visitWebsite,
              city: t.cityLabel,
              phone: t.phone,
              hourlyRate: t.hourlyRate,
              minimumOrder: t.minimumOrderHours,
              rutAvailable: t.rutAvailable,
              yes: t.yes,
              no: t.no,
            }}
          />
        </div>

        <RelatedServices
          services={relatedServices}
          city={service.city}
          labels={{
            title: t.relatedServices,
            subtitle: t.pageSubtitle,
            priceFrom: t.priceFrom,
            serviceProvider: t.serviceProvider,
            viewService: t.viewService,
          }}
        />
      </main>
    </div>
  )
}