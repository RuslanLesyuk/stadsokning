"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js"
import { sendEmail } from "@/lib/resend"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"

export type JobsActionState = {
  success: boolean
  message: string
}

type SpamCheckResult = {
  blocked: boolean
  score: number
  reasons: string[]
}

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function analyzeJobForSpam({
  title,
  description,
  address,
  budget,
}: {
  title: string
  description: string
  address: string
  budget: number | null
}): SpamCheckResult {
  const text = `${title} ${description} ${address}`.toLowerCase()
  const reasons: string[] = []
  let score = 0

  const suspiciousPatterns: Array<{
    pattern: RegExp
    points: number
    reason: string
  }> = [
    {
      pattern: /\b(whatsapp|telegram|signal)\b/i,
      points: 2,
      reason: "Mentions external messenger contact.",
    },
    {
      pattern: /\b(crypto|bitcoin|btc|usdt|wallet|binance)\b/i,
      points: 4,
      reason: "Mentions crypto or wallet payments.",
    },
    {
      pattern: /\b(pay\s*first|payment\s*before|deposit\s*first|advance\s*payment|förskottsbetalning)\b/i,
      points: 4,
      reason: "Asks for payment before work.",
    },
    {
      pattern: /\b(bankid|bank\s*id|passport|id\s*card|personnummer)\b/i,
      points: 3,
      reason: "Requests sensitive identity information.",
    },
    {
      pattern: /\b(make\s*money\s*fast|easy\s*money|guaranteed\s*income|work\s*from\s*home)\b/i,
      points: 3,
      reason: "Uses common scam wording.",
    },
    {
      pattern: /(https?:\/\/|www\.)/i,
      points: 2,
      reason: "Contains external links.",
    },
    {
      pattern: /\b\d{10,}\b/,
      points: 1,
      reason: "Contains long phone-like number.",
    },
  ]

  for (const item of suspiciousPatterns) {
    if (item.pattern.test(text)) {
      score += item.points
      reasons.push(item.reason)
    }
  }

  if (description.length < 15) {
    score += 1
    reasons.push("Description is very short.")
  }

  if (title.length > 120) {
    score += 1
    reasons.push("Title is unusually long.")
  }

  if (budget !== null && budget > 50000) {
    score += 2
    reasons.push("Budget is unusually high for a cleaning job.")
  }

  const repeatedCharacters = /(.)\1{7,}/.test(text)

  if (repeatedCharacters) {
    score += 2
    reasons.push("Text contains repeated spam-like characters.")
  }

  return {
    blocked: score >= 6,
    score,
    reasons,
  }
}

async function sendJobTakenEmail({
  to,
  title,
  workerName,
  jobId,
}: {
  to: string
  title: string
  workerName: string
  jobId: string
}) {
  const safeTitle = escapeHtml(title)
  const safeWorkerName = escapeHtml(workerName)

  await sendEmail({
    to,
    subject: "Someone took your job | Clean Jobs",
    html: `
      <div style="font-family: Arial, sans-serif; background: #fafafa; padding: 32px;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 28px;">
          <div style="display: inline-block; background: #fff1f2; color: #be123c; padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 700;">
            Clean Jobs
          </div>

          <h1 style="margin: 20px 0 12px; color: #0f172a; font-size: 26px;">
            Someone took your job
          </h1>

          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            <strong>${safeWorkerName}</strong> accepted your cleaning job.
          </p>

          <div style="margin-top: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px;">
            <div style="font-size: 13px; color: #64748b; margin-bottom: 6px;">Job</div>
            <div style="font-size: 18px; font-weight: 700; color: #0f172a;">${safeTitle}</div>
          </div>

          <a href="${siteUrl}/jobs/${jobId}" style="display: inline-block; margin-top: 24px; background: #e11d48; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 16px; font-weight: 700;">
            Open job
          </a>
        </div>
      </div>
    `,
  })
}

export async function createJobAction(
  _prevState: JobsActionState,
  formData: FormData,
): Promise<JobsActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to create a job.",
    }
  }

  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()
  const address = String(formData.get("address") ?? "").trim()
  const budgetRaw = String(formData.get("budget") ?? "").trim()
  const jobType = String(formData.get("job_type") ?? "").trim()
  const propertyType = String(formData.get("property_type") ?? "").trim()
  const scheduledDate = String(formData.get("scheduled_date") ?? "").trim()
  const scheduledTime = String(formData.get("scheduled_time") ?? "").trim()

  if (!title) {
    return { success: false, message: "Title is required." }
  }

  if (!city) {
    return { success: false, message: "City is required." }
  }

  if (jobType !== "home_cleaning" && jobType !== "office_cleaning") {
    return {
      success: false,
      message: "Please select a valid job type.",
    }
  }

  let budget: number | null = null

  if (budgetRaw) {
    const parsedBudget = Number(budgetRaw)

    if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
      return {
        success: false,
        message: "Budget must be a valid positive number.",
      }
    }

    budget = parsedBudget
  }

  const spamCheck = analyzeJobForSpam({
    title,
    description,
    address,
    budget,
  })

  if (spamCheck.blocked) {
    return {
      success: false,
      message:
        "This job looks suspicious and could not be posted. Please remove external links, crypto/payment requests, sensitive ID requests, or spam-like text.",
    }
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      title,
      description: description || null,
      city,
      address: address || null,
      budget,
      job_type: jobType,
      property_type: propertyType || null,
      scheduled_date: scheduledDate || null,
      scheduled_time: scheduledTime || null,
      created_by: user.id,
      assigned_to: null,
      status: "new",
    })
    .select("id")
    .single()

  if (error || !data) {
    return {
      success: false,
      message: error?.message || "Failed to create job.",
    }
  }

  revalidatePath("/")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  redirect(`/jobs/${data.id}`)
}

export async function takeJobAction(
  _prevState: JobsActionState,
  formData: FormData,
): Promise<JobsActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to take a job.",
    }
  }

  const jobId = String(formData.get("jobId") ?? "").trim()

  if (!jobId) {
    return {
      success: false,
      message: "Missing job id.",
    }
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, title, created_by, assigned_to, status")
    .eq("id", jobId)
    .maybeSingle()

  if (jobError || !job) {
    return {
      success: false,
      message: "Job not found.",
    }
  }

  if (job.created_by === user.id) {
    return {
      success: false,
      message: "You cannot take your own job.",
    }
  }

  if (job.assigned_to) {
    return {
      success: false,
      message: "This job is already assigned.",
    }
  }

  if (job.status !== "new") {
    return {
      success: false,
      message: "Only new jobs can be taken.",
    }
  }

  const { error: updateError } = await supabase
    .from("jobs")
    .update({
      assigned_to: user.id,
      status: "assigned",
    })
    .eq("id", jobId)
    .is("assigned_to", null)
    .eq("status", "new")

  if (updateError) {
    return {
      success: false,
      message: updateError.message || "Failed to take job.",
    }
  }

  try {
    const admin = createAdminClient()

    if (admin) {
      const [{ data: ownerData }, { data: workerProfile }] = await Promise.all([
        admin.auth.admin.getUserById(job.created_by),
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle(),
      ])

      const ownerEmail = ownerData.user?.email
      const workerName = workerProfile?.full_name?.trim() || user.email || "Worker"

      if (ownerEmail) {
        await sendJobTakenEmail({
          to: ownerEmail,
          title: job.title || "Cleaning job",
          workerName,
          jobId,
        })
      }
    } else {
      console.error("Missing Supabase admin env variables for email notification.")
    }
  } catch (emailError) {
    console.error("Failed to send take job email:", emailError)
  }

  revalidatePath("/jobs")
  revalidatePath("/dashboard")
  revalidatePath(`/jobs/${jobId}`)

  return {
    success: true,
    message: "Job taken successfully.",
  }
}

export const takeJob = takeJobAction