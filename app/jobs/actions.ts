"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { sendEmail } from "@/lib/resend"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"

export type JobsActionState = {
  success: boolean
  message: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function getJobUrl(jobId: string) {
  return `${siteUrl}/jobs/${jobId}`
}

async function sendJobCreatedEmail({
  to,
  jobId,
  title,
  city,
  budget,
}: {
  to: string
  jobId: string
  title: string
  city: string
  budget: number | null
}) {
  const safeTitle = escapeHtml(title)
  const safeCity = escapeHtml(city)
  const budgetText = budget == null ? "Not specified" : `${budget} kr`

  await sendEmail({
    to,
    subject: "Your job was created | Clean Jobs",
    html: `
      <div style="font-family: Arial, sans-serif; background: #fafafa; padding: 32px;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 28px;">
          <div style="display: inline-block; background: #fff1f2; color: #be123c; padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 700;">
            Clean Jobs
          </div>

          <h1 style="margin: 20px 0 12px; color: #0f172a; font-size: 26px; line-height: 1.25;">
            Your job was created successfully
          </h1>

          <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.6;">
            Your cleaning job is now visible on Clean Jobs.
          </p>

          <div style="margin-top: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px;">
            <div style="font-size: 13px; color: #64748b; margin-bottom: 6px;">Job</div>
            <div style="font-size: 18px; font-weight: 700; color: #0f172a;">${safeTitle}</div>

            <div style="margin-top: 14px; font-size: 14px; color: #475569;">
              City: <strong>${safeCity}</strong>
            </div>

            <div style="margin-top: 6px; font-size: 14px; color: #475569;">
              Budget: <strong>${budgetText}</strong>
            </div>
          </div>

          <a href="${getJobUrl(jobId)}" style="display: inline-block; margin-top: 24px; background: #e11d48; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 16px; font-weight: 700;">
            Open job
          </a>
        </div>
      </div>
    `,
  })
}

async function sendJobTakenEmail({
  to,
  jobId,
  title,
  workerName,
}: {
  to: string
  jobId: string
  title: string
  workerName: string
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

          <h1 style="margin: 20px 0 12px; color: #0f172a; font-size: 26px; line-height: 1.25;">
            Someone took your job
          </h1>

          <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.6;">
            <strong>${safeWorkerName}</strong> accepted your cleaning job.
          </p>

          <div style="margin-top: 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px;">
            <div style="font-size: 13px; color: #64748b; margin-bottom: 6px;">Job</div>
            <div style="font-size: 18px; font-weight: 700; color: #0f172a;">${safeTitle}</div>
          </div>

          <a href="${getJobUrl(jobId)}" style="display: inline-block; margin-top: 24px; background: #e11d48; color: #ffffff; text-decoration: none; padding: 14px 20px; border-radius: 16px; font-weight: 700;">
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
    return {
      success: false,
      message: "Title is required.",
    }
  }

  if (!city) {
    return {
      success: false,
      message: "City is required.",
    }
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

  if (user.email) {
    try {
      await sendJobCreatedEmail({
        to: user.email,
        jobId: data.id,
        title,
        city,
        budget,
      })
    } catch (emailError) {
      console.error("Failed to send job created email:", emailError)
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
    const [{ data: owner }, { data: workerProfile }] = await Promise.all([
      supabase.auth.admin.getUserById(job.created_by),
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle(),
    ])

    const ownerEmail = owner.user?.email
    const workerName =
      workerProfile?.full_name?.trim() || user.email || "A worker"

    if (ownerEmail) {
      await sendJobTakenEmail({
        to: ownerEmail,
        jobId,
        title: job.title || "Cleaning job",
        workerName,
      })
    }
  } catch (emailError) {
    console.error("Failed to send job taken email:", emailError)
  }

  revalidatePath("/jobs")
  revalidatePath("/dashboard")
  revalidatePath(`/jobs/${jobId}`)

  return {
    success: true,
    message: "Job taken successfully.",
  }
}

/**
 * backward-compatible export
 * so older components importing `takeJob` keep working
 */
export const takeJob = takeJobAction