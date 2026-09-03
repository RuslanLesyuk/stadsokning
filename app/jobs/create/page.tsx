import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import CreateJobWizard from "@/components/create-job-wizard"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
} from "@/lib/i18n"
import { sendEmail } from "@/lib/resend"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://cleansjob.com"

const STOCKHOLM_TIME_ZONE = "Europe/Stockholm"

const hourOptions = Array.from(
  { length: 24 },
  (_, index) => String(index).padStart(2, "0"),
)

const minuteOptions = ["00", "15", "30", "45"]

function normalizeText(
  value: FormDataEntryValue | null,
) {
  return String(value || "").trim()
}

function parseBudget(value: string) {
  if (!value) {
    return null
  }

  const number = Number(value)

  return Number.isFinite(number) && number >= 0
    ? number
    : null
}

function resolveCity(formData: FormData) {
  const selectedCity = normalizeText(
    formData.get("city_select"),
  )

  const customCity = normalizeText(
    formData.get("city_other"),
  )

  if (selectedCity === "other") {
    return customCity || null
  }

  return selectedCity || customCity || null
}

function getStockholmDateString() {
  const formatter = new Intl.DateTimeFormat(
    "sv-SE",
    {
      timeZone: STOCKHOLM_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  )

  return formatter.format(new Date())
}

function resolveScheduledTime(formData: FormData) {
  const hour = normalizeText(
    formData.get("scheduled_hour"),
  )

  const minute = normalizeText(
    formData.get("scheduled_minute"),
  )

  if (!hour && !minute) {
    return null
  }

  if (!hourOptions.includes(hour)) {
    return null
  }

  if (!minuteOptions.includes(minute)) {
    return null
  }

  return `${hour}:${minute}`
}

function isValidScheduledDate(
  scheduledDate: string | null,
  today: string,
) {
  if (!scheduledDate) {
    return true
  }

  const isDateFormat =
    /^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)

  if (!isDateFormat) {
    return false
  }

  return scheduledDate >= today
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function buildCreatedJobEmail({
  title,
  city,
  budget,
  jobUrl,
}: {
  title: string
  city: string | null
  budget: number | null
  jobUrl: string
}) {
  const safeTitle = escapeHtml(
    title || "Cleaning job",
  )

  const safeCity = city
    ? escapeHtml(city)
    : "Not specified"

  const budgetText =
    budget == null
      ? "Not specified"
      : `${budget} kr`

  return `
    <div style="margin:0;background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="margin:0 auto;max-width:620px;border:1px solid #e2e8f0;border-radius:28px;background:#ffffff;padding:28px;box-shadow:0 8px 30px rgba(15,23,42,0.06);">
        <div style="display:inline-block;border-radius:999px;background:#fff1f2;color:#be123c;padding:8px 12px;font-size:13px;font-weight:700;">
          Clean Jobs
        </div>

        <h1 style="margin:22px 0 12px;font-size:28px;line-height:1.2;color:#0f172a;">
          Your job was created successfully
        </h1>

        <p style="margin:0;color:#475569;font-size:16px;line-height:1.7;">
          Your cleaning job is now published on Clean Jobs. Workers can send applications with their price, availability and message. You can then review the candidates and choose the best offer.
        </p>

        <div style="margin-top:24px;border:1px solid #e2e8f0;border-radius:20px;background:#f8fafc;padding:18px;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;font-weight:700;">
            Job title
          </div>

          <div style="margin-top:8px;font-size:20px;font-weight:700;color:#0f172a;">
            ${safeTitle}
          </div>

          <div style="margin-top:18px;display:grid;gap:10px;">
            <div style="font-size:14px;color:#475569;">
              <strong style="color:#0f172a;">City:</strong> ${safeCity}
            </div>

            <div style="font-size:14px;color:#475569;">
              <strong style="color:#0f172a;">Budget:</strong> ${budgetText}
            </div>
          </div>
        </div>

        <a
          href="${jobUrl}"
          style="display:inline-block;margin-top:24px;border-radius:16px;background:#e11d48;color:#ffffff;text-decoration:none;padding:14px 20px;font-size:14px;font-weight:700;"
        >
          Open job
        </a>

        <p style="margin-top:24px;color:#94a3b8;font-size:12px;line-height:1.6;">
          You received this email because you created a job on Clean Jobs.
        </p>
      </div>
    </div>
  `
}

export default async function CreateJobPage() {
  const cookieStore = await cookies()

  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value ||
      DEFAULT_LOCALE,
  )

  const today = getStockholmDateString()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/jobs/create")
  }

  async function createJobAction(
    formData: FormData,
  ) {
    "use server"

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login?next=/jobs/create")
    }

    const title = normalizeText(
      formData.get("title"),
    )

    const scheduledDate =
      normalizeText(
        formData.get("scheduled_date"),
      ) || null

    const scheduledHour = normalizeText(
      formData.get("scheduled_hour"),
    )

    const scheduledMinute = normalizeText(
      formData.get("scheduled_minute"),
    )

    const currentStockholmDate =
      getStockholmDateString()

    if (!title) {
      redirect("/jobs/create")
    }

    if (
      !isValidScheduledDate(
        scheduledDate,
        currentStockholmDate,
      )
    ) {
      redirect("/jobs/create")
    }

    const hasPartialTime =
      Boolean(scheduledHour) !==
      Boolean(scheduledMinute)

    if (hasPartialTime) {
      redirect("/jobs/create")
    }

    const scheduledTime =
      resolveScheduledTime(formData)

    if (
      (scheduledHour || scheduledMinute) &&
      !scheduledTime
    ) {
      redirect("/jobs/create")
    }

    const payload = {
  title,
  description:
    normalizeText(
      formData.get("description"),
    ) || null,
  city: resolveCity(formData),
  address:
    normalizeText(
      formData.get("address"),
    ) || null,
  budget: parseBudget(
    normalizeText(
      formData.get("budget"),
    ),
  ),
  job_type:
    normalizeText(
      formData.get("job_type"),
    ) || null,
  property_type:
    normalizeText(
      formData.get("property_type"),
    ) || null,
  scheduled_date: scheduledDate,
  scheduled_time: scheduledTime,
  created_by: user.id,
}

    const { data, error } = await supabase
      .from("jobs")
      .insert(payload)
      .select("id")
      .single()

    if (error || !data) {
      console.error(
        "Create job error:",
        error,
      )

      redirect("/jobs/create")
    }

    if (user.email) {
      try {
        const jobUrl =
          `${siteUrl}/jobs/${data.id}`

        await sendEmail({
          to: user.email,
          subject:
            "Job created successfully | Clean Jobs",
          html: buildCreatedJobEmail({
            title: payload.title,
            city: payload.city,
            budget: payload.budget,
            jobUrl,
          }),
        })
      } catch (emailError) {
        console.error(
          "Failed to send created job email:",
          emailError,
        )
      }
    }

    redirect(`/jobs/${data.id}`)
  }

  return (
    <CreateJobWizard
      locale={locale}
      today={today}
      action={createJobAction}
    />
  )
}
