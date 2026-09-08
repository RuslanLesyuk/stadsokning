import { createAdminClient } from "@/lib/supabase-admin"
import {
  evaluatePublicJobSeo,
  getPublicJobsHubPath,
  redactPublicJobText,
} from "@/lib/seo/public-jobs"

export const LIVE_CITY_JOB_DISPLAY_LIMIT = 6
const LIVE_CITY_JOB_SCAN_LIMIT = 100

export type LiveCityJob = {
  id: string
  title: string
  description: string
  city: string
  budget: number | null
  jobType: string
  propertyType: string | null
  scheduledDate: string | null
  createdAt: string | null
}

const routeAliases: Record<string, string[]> = {
  "/stadjobb-stockholm": ["Stockholm"],
  "/stadjobb-goteborg": [
    "Göteborg",
    "Goteborg",
    "Gothenburg",
  ],
  "/stadjobb-malmo": [
    "Malmö",
    "Malmo",
  ],
}

function truncate(
  value: string,
  maxLength = 180,
) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

export async function getLiveCityJobs(
  city: string,
): Promise<LiveCityJob[]> {
  const hubPath = getPublicJobsHubPath(city)

  if (!hubPath) {
    return []
  }

  const aliases =
    routeAliases[hubPath] || [city]

  const admin = createAdminClient()

  const cityFilter = aliases
    .map((alias) => `city.ilike.${alias}`)
    .join(",")

  const { data: candidates, error } =
    await admin
      .from("jobs")
      .select(
        "id,title,description,city,budget,job_type,property_type,scheduled_date,status,created_at",
      )
      .eq("status", "new")
      .is("assigned_to", null)
      .or(cityFilter)
      .order("created_at", {
        ascending: false,
      })
      .limit(LIVE_CITY_JOB_SCAN_LIMIT)

  if (error) {
    console.error(
      "Live city jobs query failed:",
      error,
    )
    return []
  }

  if (!candidates?.length) {
    return []
  }

  const candidateIds = candidates.map(
    (job) => job.id,
  )

  const { data: openReports, error: reportError } =
    await admin
      .from("job_reports")
      .select("job_id")
      .eq("status", "open")
      .in("job_id", candidateIds)

  if (reportError) {
    /*
     * Fail closed. If moderation state cannot be checked,
     * do not promote jobs on an SEO city hub.
     */
    console.error(
      "Live city jobs moderation query failed:",
      reportError,
    )
    return []
  }

  const openReportCount = new Map<
    string,
    number
  >()

  for (const report of openReports ?? []) {
    openReportCount.set(
      report.job_id,
      (openReportCount.get(report.job_id) ||
        0) + 1,
    )
  }

  const now = new Date()

  return candidates
    .filter((job) => {
      if (
        getPublicJobsHubPath(job.city) !==
        hubPath
      ) {
        return false
      }

      return evaluatePublicJobSeo(
        {
          title: job.title,
          description: job.description,
          city: job.city,
          job_type: job.job_type,
          status: job.status,
          assigned_to: null,
          created_at: job.created_at,
          scheduled_date:
            job.scheduled_date,
          open_report_count:
            openReportCount.get(job.id) ||
            0,
        },
        now,
      ).indexable
    })
    .slice(0, LIVE_CITY_JOB_DISPLAY_LIMIT)
    .map((job) => ({
      id: job.id,
      title: redactPublicJobText(job.title),
      description: truncate(
        redactPublicJobText(
          job.description,
        ),
      ),
      city: String(job.city || city),
      budget: job.budget,
      jobType: job.job_type,
      propertyType:
        job.property_type || null,
      scheduledDate:
        job.scheduled_date || null,
      createdAt: job.created_at,
    }))
}
