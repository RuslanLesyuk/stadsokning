"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

export type JobsActionState = {
  success: boolean
  message: string
}

export async function createJobAction(
  _prevState: JobsActionState,
  formData: FormData
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

  revalidatePath("/")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  redirect(`/jobs/${data.id}`)
}

export async function takeJobAction(
  _prevState: JobsActionState,
  formData: FormData
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
    .select("id, created_by, assigned_to, status")
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