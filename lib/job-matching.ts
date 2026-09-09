import { revalidatePath } from "next/cache"

import { createAdminClient } from "@/lib/supabase-admin"
import { evaluatePublicJobSeo } from "@/lib/seo/public-jobs"

export type JobMatchType =
  | "home_cleaning"
  | "office_cleaning"

export type JobMatchPreferenceRow = {
  user_id: string
  enabled: boolean
  in_app_enabled: boolean
  email_enabled: boolean
  cities: string[]
  job_types: string[]
  created_at: string
  updated_at: string
}

export type EffectiveJobMatchSettings = {
  source: "preference" | "service_profile" | "none"
  enabled: boolean
  inAppEnabled: boolean
  emailEnabled: boolean
  cities: string[]
  jobTypes: JobMatchType[]
}

export type MatchableJob = {
  id: string
  title: string
  description: string | null
  city: string | null
  budget: number | null
  job_type: string | null
  status: string | null
  assigned_to: string | null
  created_at: string | null
  scheduled_date: string | null
  created_by: string
}

type ServiceProfileMatchRow = {
  user_id: string | null
  city: string
  service_areas: string[] | null
  service_types: string[] | null
}

type MatchedRecipient = {
  userId: string
  inAppEnabled: boolean
  emailEnabled: boolean
}

const MAX_MATCH_RECIPIENTS = 50
const MAX_MATCH_SOURCE_ROWS = 2000

function clean(value: unknown) {
  return String(value || "").trim()
}

function normalize(value: unknown) {
  return clean(value)
    .toLocaleLowerCase("sv-SE")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function uniqueStrings(values: unknown[]) {
  const seen = new Set<string>()
  const output: string[] = []

  for (const raw of values) {
    const value = clean(raw)

    if (!value) {
      continue
    }

    const key = normalize(value)

    if (!key || seen.has(key)) {
      continue
    }

    seen.add(key)
    output.push(value)
  }

  return output
}

function normalizeJobTypes(
  values: unknown[],
): JobMatchType[] {
  const result = new Set<JobMatchType>()

  for (const raw of values) {
    const value = normalize(raw)

    if (!value) {
      continue
    }

    if (
      value === "home cleaning" ||
      value === "home_cleaning" ||
      value.includes("hemstad") ||
      value.includes("home clean") ||
      value.includes("house clean") ||
      value.includes("apartment clean") ||
      value.includes("residential") ||
      value.includes("lagenhet") ||
      value.includes("privat")
    ) {
      result.add("home_cleaning")
    }

    if (
      value === "office cleaning" ||
      value === "office_cleaning" ||
      value.includes("kontorsstad") ||
      value.includes("office clean") ||
      value === "kontor"
    ) {
      result.add("office_cleaning")
    }
  }

  return Array.from(result)
}

function serviceFallback(
  profiles: ServiceProfileMatchRow[],
) {
  const cities = uniqueStrings(
    profiles.flatMap((profile) => [
      profile.city,
      ...(profile.service_areas || []),
    ]),
  )

  const recognizedTypes =
    normalizeJobTypes(
      profiles.flatMap(
        (profile) =>
          profile.service_types || [],
      ),
    )

  return {
    cities,
    jobTypes:
      recognizedTypes.length > 0
        ? recognizedTypes
        : ([
            "home_cleaning",
            "office_cleaning",
          ] as JobMatchType[]),
  }
}

function matchesCity(
  city: string | null,
  cities: string[],
) {
  const wanted = normalize(city)

  if (!wanted) {
    return false
  }

  return cities.some(
    (candidate) =>
      normalize(candidate) === wanted,
  )
}

function matchesJobType(
  jobType: string | null,
  allowed: JobMatchType[],
) {
  return allowed.includes(
    clean(jobType) as JobMatchType,
  )
}

function buildNotificationMessage(
  job: MatchableJob,
) {
  const city = clean(job.city) || "Sverige"

  const budget =
    typeof job.budget === "number" &&
    Number.isFinite(job.budget)
      ? ` · ${Math.round(job.budget)} kr`
      : ""

  return `${clean(job.title) || "Städjobb"} · ${city}${budget}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function buildMatchEmail(
  job: MatchableJob,
) {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://cleansjob.com"
  ).replace(/\/$/, "")

  const jobUrl = `${siteUrl}/jobs/${job.id}`
  const profileUrl = `${siteUrl}/profile#job-matching`

  const safeTitle = escapeHtml(
    clean(job.title) || "Städjobb",
  )

  const safeCity = escapeHtml(
    clean(job.city) || "Sverige",
  )

  const budget =
    typeof job.budget === "number" &&
    Number.isFinite(job.budget)
      ? `${Math.round(job.budget)} kr`
      : "Ej angiven"

  return `
    <div style="margin:0;background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="margin:0 auto;max-width:620px;border:1px solid #e2e8f0;border-radius:28px;background:#ffffff;padding:28px;">
        <div style="display:inline-block;border-radius:999px;background:#fff1f2;color:#be123c;padding:8px 12px;font-size:13px;font-weight:700;">
          Clean Jobs
        </div>

        <h1 style="margin:22px 0 12px;font-size:28px;line-height:1.2;">
          Nytt städjobb som matchar dig
        </h1>

        <p style="margin:0;color:#475569;font-size:16px;line-height:1.7;">
          Ett nytt öppet städjobb matchar dina valda områden och jobbtyper.
        </p>

        <div style="margin-top:24px;border:1px solid #e2e8f0;border-radius:20px;background:#f8fafc;padding:18px;">
          <div style="font-size:20px;font-weight:700;">${safeTitle}</div>
          <div style="margin-top:12px;color:#475569;font-size:14px;">
            <strong>Stad:</strong> ${safeCity}
          </div>
          <div style="margin-top:8px;color:#475569;font-size:14px;">
            <strong>Budget:</strong> ${budget}
          </div>
        </div>

        <a href="${jobUrl}" style="display:inline-block;margin-top:24px;border-radius:16px;background:#e11d48;color:#ffffff;text-decoration:none;padding:14px 20px;font-size:14px;font-weight:700;">
          Öppna jobbet
        </a>

        <p style="margin-top:24px;color:#64748b;font-size:12px;line-height:1.6;">
          Du får detta mejl eftersom e-postaviseringar för jobbmatchning är aktiverade.
          <a href="${profileUrl}" style="color:#be123c;">Hantera aviseringar</a>.
        </p>
      </div>
    </div>
  `
}

async function loadMatchingSources() {
  const admin = createAdminClient()

  const [
    { data: preferences, error: preferencesError },
    { data: services, error: servicesError },
  ] = await Promise.all([
    admin
      .from("job_match_preferences")
      .select(
        "user_id,enabled,in_app_enabled,email_enabled,cities,job_types,created_at,updated_at",
      )
      .limit(MAX_MATCH_SOURCE_ROWS),
    admin
      .from("service_profiles")
      .select(
        "user_id,city,service_areas,service_types",
      )
      .not("user_id", "is", null)
      .limit(MAX_MATCH_SOURCE_ROWS),
  ])

  if (preferencesError) {
    throw preferencesError
  }

  if (servicesError) {
    throw servicesError
  }

  return {
    preferences:
      (preferences || []) as JobMatchPreferenceRow[],
    services:
      (services || []) as ServiceProfileMatchRow[],
  }
}

function resolveRecipients(
  job: MatchableJob,
  preferences: JobMatchPreferenceRow[],
  services: ServiceProfileMatchRow[],
) {
  const preferenceByUser = new Map(
    preferences.map((preference) => [
      preference.user_id,
      preference,
    ]),
  )

  const servicesByUser = new Map<
    string,
    ServiceProfileMatchRow[]
  >()

  for (const service of services) {
    if (!service.user_id) {
      continue
    }

    const current =
      servicesByUser.get(service.user_id) || []

    current.push(service)
    servicesByUser.set(
      service.user_id,
      current,
    )
  }

  const userIds = new Set<string>([
    ...preferenceByUser.keys(),
    ...servicesByUser.keys(),
  ])

  const recipients: MatchedRecipient[] = []

  for (const userId of userIds) {
    if (userId === job.created_by) {
      continue
    }

    const preference =
      preferenceByUser.get(userId)

    const userServices =
      servicesByUser.get(userId) || []

    if (!preference && userServices.length === 0) {
      continue
    }

    if (preference && !preference.enabled) {
      continue
    }

    const fallback =
      serviceFallback(userServices)

    const cities =
      preference?.cities?.length
        ? uniqueStrings(preference.cities)
        : fallback.cities

    const preferenceTypes =
      normalizeJobTypes(
        preference?.job_types || [],
      )

    const jobTypes =
      preferenceTypes.length > 0
        ? preferenceTypes
        : fallback.jobTypes

    if (
      !matchesCity(job.city, cities) ||
      !matchesJobType(job.job_type, jobTypes)
    ) {
      continue
    }

    const inAppEnabled =
      preference
        ? preference.in_app_enabled
        : true

    const emailEnabled =
      preference
        ? preference.email_enabled
        : false

    if (!inAppEnabled && !emailEnabled) {
      continue
    }

    recipients.push({
      userId,
      inAppEnabled,
      emailEnabled,
    })

    if (
      recipients.length >=
      MAX_MATCH_RECIPIENTS
    ) {
      break
    }
  }

  return recipients
}

async function claimDelivery({
  jobId,
  userId,
  channel,
}: {
  jobId: string
  userId: string
  channel: "in_app" | "email"
}) {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from("job_match_deliveries")
    .insert({
      job_id: jobId,
      user_id: userId,
      channel,
      status: "pending",
    })
    .select("id")
    .maybeSingle()

  if (error) {
    if (error.code === "23505") {
      return null
    }

    throw error
  }

  return data?.id || null
}

async function finishDelivery(
  deliveryId: string,
  result:
    | { status: "sent" }
    | { status: "failed"; error: string },
) {
  const admin = createAdminClient()

  await admin
    .from("job_match_deliveries")
    .update({
      status: result.status,
      delivered_at:
        result.status === "sent"
          ? new Date().toISOString()
          : null,
      error:
        result.status === "failed"
          ? result.error.slice(0, 1000)
          : null,
    })
    .eq("id", deliveryId)
}

async function deliverInApp(
  job: MatchableJob,
  recipient: MatchedRecipient,
) {
  const deliveryId = await claimDelivery({
    jobId: job.id,
    userId: recipient.userId,
    channel: "in_app",
  })

  if (!deliveryId) {
    return
  }

  try {
    const admin = createAdminClient()

    const { error } = await admin
      .from("notifications")
      .upsert(
        {
          user_id: recipient.userId,
          actor_id: job.created_by,
          job_id: job.id,
          application_id: null,
          type: "job_match",
          title:
            "Nytt städjobb som matchar dig",
          message:
            buildNotificationMessage(job),
          is_read: false,
          href: `/jobs/${job.id}`,
          entity_type: "job_match",
          entity_id: job.id,
          dedupe_key: `job_match:${job.id}:${recipient.userId}`,
        },
        {
          onConflict: "dedupe_key",
          ignoreDuplicates: true,
        },
      )

    if (error) {
      throw error
    }

    await finishDelivery(deliveryId, {
      status: "sent",
    })
  } catch (error) {
    await finishDelivery(deliveryId, {
      status: "failed",
      error:
        error instanceof Error
          ? error.message
          : "Unknown in-app notification error",
    })
  }
}

async function deliverEmail(
  job: MatchableJob,
  recipient: MatchedRecipient,
) {
  const deliveryId = await claimDelivery({
    jobId: job.id,
    userId: recipient.userId,
    channel: "email",
  })

  if (!deliveryId) {
    return
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not configured",
      )
    }

    const admin = createAdminClient()

    const { data, error } =
      await admin.auth.admin.getUserById(
        recipient.userId,
      )

    if (error || !data.user?.email) {
      throw new Error(
        error?.message ||
          "Matched user has no email address",
      )
    }

    const { sendEmail } = await import(
      "@/lib/resend"
    )

    const result = await sendEmail({
      to: data.user.email,
      subject:
        "Nytt städjobb som matchar dig | Clean Jobs",
      html: buildMatchEmail(job),
    })

    if (result.error) {
      throw new Error(
        result.error.message ||
          "Resend delivery failed",
      )
    }

    await finishDelivery(deliveryId, {
      status: "sent",
    })
  } catch (error) {
    await finishDelivery(deliveryId, {
      status: "failed",
      error:
        error instanceof Error
          ? error.message
          : "Unknown email notification error",
    })
  }
}

export async function notifyMatchedUsersForJob(
  job: MatchableJob,
) {
  const seo = evaluatePublicJobSeo({
    title: job.title,
    description: job.description,
    city: job.city,
    job_type: job.job_type,
    status: job.status,
    assigned_to: job.assigned_to,
    created_at: job.created_at,
    scheduled_date: job.scheduled_date,
    open_report_count: 0,
  })

  /*
   * Matching alerts are deliberately limited to jobs that pass the same
   * quality gate used for public indexing. This prevents low-information
   * or suspicious jobs from generating notification bursts.
   */
  if (!seo.indexable) {
    return {
      matched: 0,
      skipped: true,
      reasons: seo.reasons,
    }
  }

  const { preferences, services } =
    await loadMatchingSources()

  const recipients = resolveRecipients(
    job,
    preferences,
    services,
  )

  await Promise.allSettled(
    recipients.flatMap((recipient) => {
      const deliveries: Promise<void>[] = []

      if (recipient.inAppEnabled) {
        deliveries.push(
          deliverInApp(job, recipient),
        )
      }

      if (recipient.emailEnabled) {
        deliveries.push(
          deliverEmail(job, recipient),
        )
      }

      return deliveries
    }),
  )

  if (recipients.length > 0) {
    revalidatePath("/notifications")
    revalidatePath("/", "layout")
  }

  return {
    matched: recipients.length,
    skipped: false,
    reasons: [] as string[],
  }
}

export async function getEffectiveJobMatchSettingsForUser(
  userId: string,
): Promise<EffectiveJobMatchSettings> {
  const admin = createAdminClient()

  const [
    { data: preference, error: preferenceError },
    { data: services, error: serviceError },
  ] = await Promise.all([
    admin
      .from("job_match_preferences")
      .select(
        "user_id,enabled,in_app_enabled,email_enabled,cities,job_types,created_at,updated_at",
      )
      .eq("user_id", userId)
      .maybeSingle(),
    admin
      .from("service_profiles")
      .select(
        "user_id,city,service_areas,service_types",
      )
      .eq("user_id", userId),
  ])

  if (preferenceError) {
    console.error(
      "Load job match preference error:",
      preferenceError,
    )
  }

  if (serviceError) {
    console.error(
      "Load service profiles for matching error:",
      serviceError,
    )
  }

  const userServices =
    (services || []) as ServiceProfileMatchRow[]

  const fallback =
    serviceFallback(userServices)

  if (preference) {
    const explicitTypes =
      normalizeJobTypes(
        preference.job_types || [],
      )

    return {
      source: "preference",
      enabled: preference.enabled,
      inAppEnabled:
        preference.in_app_enabled,
      emailEnabled:
        preference.email_enabled,
      cities:
        preference.cities?.length
          ? uniqueStrings(
              preference.cities,
            )
          : fallback.cities,
      jobTypes:
        explicitTypes.length
          ? explicitTypes
          : fallback.jobTypes,
    }
  }

  if (userServices.length > 0) {
    return {
      source: "service_profile",
      enabled: true,
      inAppEnabled: true,
      emailEnabled: false,
      cities: fallback.cities,
      jobTypes: fallback.jobTypes,
    }
  }

  return {
    source: "none",
    enabled: false,
    inAppEnabled: true,
    emailEnabled: false,
    cities: [],
    jobTypes: [
      "home_cleaning",
      "office_cleaning",
    ],
  }
}
