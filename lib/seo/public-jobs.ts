import {
  JOB_CITY_MAX_LENGTH,
  JOB_DESCRIPTION_MAX_LENGTH,
  JOB_TITLE_MAX_LENGTH,
  SUPPORTED_JOB_TYPES,
  containsPublicContactDetails,
  containsPublicSpamSignals,
  redactPublicJobText,
} from "@/lib/jobs/content-policy"

export {
  containsPublicContactDetails,
  containsPublicSpamSignals,
  redactPublicJobText,
} from "@/lib/jobs/content-policy"

export const PUBLIC_JOB_MIN_TITLE_LENGTH = 10
export const PUBLIC_JOB_MIN_DESCRIPTION_LENGTH = 80
export const PUBLIC_JOB_MAX_AGE_DAYS = 120
export const PUBLIC_JOB_SITEMAP_LIMIT = 5000

export type PublicJobSeoInput = {
  title: string | null
  description: string | null
  city: string | null
  job_type: string | null
  status: string | null
  assigned_to: string | null
  created_at: string | null
  scheduled_date?: string | null
  open_report_count?: number | null
}

export type PublicJobSeoEvaluation = {
  indexable: boolean
  reasons: string[]
}

function clean(
  value: string | null | undefined,
) {
  return String(value || "").trim()
}

function isStale(
  createdAt: string | null,
  now: Date,
) {
  if (!createdAt) {
    return true
  }

  const created = new Date(createdAt)

  if (Number.isNaN(created.getTime())) {
    return true
  }

  const maxAgeMs =
    PUBLIC_JOB_MAX_AGE_DAYS *
    24 *
    60 *
    60 *
    1000

  return (
    now.getTime() - created.getTime() >
    maxAgeMs
  )
}

function isPastScheduledDate(
  scheduledDate:
    | string
    | null
    | undefined,
  now: Date,
) {
  if (!scheduledDate) {
    return false
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      scheduledDate,
    )
  ) {
    return true
  }

  const today =
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Europe/Stockholm",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now)

  return scheduledDate < today
}

export function evaluatePublicJobSeo(
  job: PublicJobSeoInput,
  now = new Date(),
): PublicJobSeoEvaluation {
  const reasons: string[] = []

  const title = clean(job.title)
  const description =
    clean(job.description)
  const city = clean(job.city)

  if (job.status !== "new") {
    reasons.push("job_not_open")
  }

  if (job.assigned_to) {
    reasons.push(
      "worker_already_assigned",
    )
  }

  if (
    title.length <
    PUBLIC_JOB_MIN_TITLE_LENGTH
  ) {
    reasons.push("title_too_short")
  }

  if (
    title.length >
    JOB_TITLE_MAX_LENGTH
  ) {
    reasons.push("title_too_long")
  }

  if (
    description.length <
    PUBLIC_JOB_MIN_DESCRIPTION_LENGTH
  ) {
    reasons.push(
      "description_too_short",
    )
  }

  if (
    description.length >
    JOB_DESCRIPTION_MAX_LENGTH
  ) {
    reasons.push(
      "description_too_long",
    )
  }

  if (city.length < 2) {
    reasons.push("city_missing")
  }

  if (
    city.length >
    JOB_CITY_MAX_LENGTH
  ) {
    reasons.push("city_too_long")
  }

  if (
    !SUPPORTED_JOB_TYPES.has(
      clean(job.job_type),
    )
  ) {
    reasons.push(
      "unsupported_job_type",
    )
  }

  if (
    containsPublicContactDetails(
      title,
    ) ||
    containsPublicContactDetails(
      description,
    )
  ) {
    reasons.push(
      "contains_contact_details",
    )
  }

  if (
    containsPublicSpamSignals(title) ||
    containsPublicSpamSignals(
      description,
    )
  ) {
    reasons.push("spam_signal")
  }

  if (
    Number(job.open_report_count || 0) >
    0
  ) {
    reasons.push(
      "open_moderation_report",
    )
  }

  if (isStale(job.created_at, now)) {
    reasons.push("stale_job")
  }

  if (
    isPastScheduledDate(
      job.scheduled_date,
      now,
    )
  ) {
    reasons.push(
      "scheduled_date_in_past",
    )
  }

  return {
    indexable: reasons.length === 0,
    reasons,
  }
}

export function isPublicJobIndexable(
  job: PublicJobSeoInput,
  now = new Date(),
) {
  return evaluatePublicJobSeo(
    job,
    now,
  ).indexable
}

export function getPublicJobsHubPath(
  city: string | null | undefined,
) {
  const normalized = clean(city)
    .toLocaleLowerCase("sv-SE")
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")

  if (normalized === "stockholm") {
    return "/stadjobb-stockholm"
  }

  if (
    normalized === "goteborg" ||
    normalized === "gothenburg"
  ) {
    return "/stadjobb-goteborg"
  }

  if (normalized === "malmo") {
    return "/stadjobb-malmo"
  }

  return null
}
