"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { sendEmail } from "@/lib/resend"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"

export type JobsActionState = {
  success: boolean
  message: string
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
  await sendEmail({
    to,
    subject: "Someone took your job | Clean Jobs",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h1>Your job has been accepted</h1>

        <p>
          <strong>${workerName}</strong> accepted your job:
        </p>

        <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 12px;">
          <strong>${title}</strong>
        </div>

        <a
          href="${siteUrl}/jobs/${jobId}"
          style="display:inline-block;padding:12px 18px;background:#e11d48;color:white;text-decoration:none;border-radius:12px;"
        >
          Open job
        </a>
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
  const description = String(
    formData.get("description") ?? "",
  ).trim()
  const city = String(formData.get("city") ?? "").trim()
  const address = String(formData.get("address") ?? "").trim()
  const budgetRaw = String(formData.get("budget") ?? "").trim()
  const jobType = String(formData.get("job_type") ?? "").trim()
  const propertyType = String(
    formData.get("property_type") ?? "",
  ).trim()
  const scheduledDate = String(
    formData.get("scheduled_date") ?? "",
  ).trim()
  const scheduledTime = String(
    formData.get("scheduled_time") ?? "",
  ).trim()

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

  let budget: number | null = null

  if (budgetRaw) {
    const parsedBudget = Number(budgetRaw)

    if (
      Number.isNaN(parsedBudget) ||
      parsedBudget < 0
    ) {
      return {
        success: false,
        message:
          "Budget must be a valid positive number.",
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
      message:
        error?.message || "Failed to create job.",
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
      message:
        "You must be logged in to take a job.",
    }
  }

  const jobId = String(
    formData.get("jobId") ?? "",
  ).trim()

  if (!jobId) {
    return {
      success: false,
      message: "Missing job id.",
    }
  }

  const { data: job, error: jobError } =
    await supabase
      .from("jobs")
      .select(
        "id, title, created_by, assigned_to, status",
      )
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
      message:
        "You cannot take your own job.",
    }
  }

  if (job.assigned_to) {
    return {
      success: false,
      message:
        "This job is already assigned.",
    }
  }

  if (job.status !== "new") {
    return {
      success: false,
      message:
        "Only new jobs can be taken.",
    }
  }

  const { error: updateError } =
    await supabase
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
      message:
        updateError.message ||
        "Failed to take job.",
    }
  }

  try {
    const { data: ownerProfile } =
      await supabase
        .from("profiles")
        .select("email")
        .eq("id", job.created_by)
        .maybeSingle()

    const { data: workerProfile } =
      await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle()

    if (ownerProfile?.email) {
      await sendJobTakenEmail({
        to: ownerProfile.email,
        title: job.title || "Cleaning job",
        workerName:
          workerProfile?.full_name ||
          user.email ||
          "Worker",
        jobId,
      })
    }
  } catch (emailError) {
    console.error(emailError)
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