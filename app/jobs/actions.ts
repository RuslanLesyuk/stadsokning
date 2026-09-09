"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  JOB_ADDRESS_MAX_LENGTH,
  JOB_BUDGET_MAX,
  JOB_CITY_MAX_LENGTH,
  JOB_DESCRIPTION_MAX_LENGTH,
  JOB_TITLE_MAX_LENGTH,
  SUPPORTED_JOB_TYPES,
  SUPPORTED_PROPERTY_TYPES,
  analyzeJobContentForSubmission,
} from "@/lib/jobs/content-policy"
import { createClient } from "@/lib/supabase-server"
import { notifyMatchedUsersForJob } from "@/lib/job-matching"

export type JobsActionState = {
  success: boolean
  message: string
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

  if (title.length > JOB_TITLE_MAX_LENGTH) {
    return { success: false, message: "Title cannot exceed 120 characters." }
  }

  if (description.length > JOB_DESCRIPTION_MAX_LENGTH) {
    return { success: false, message: "Description cannot exceed 5,000 characters." }
  }

  if (!city) {
    return { success: false, message: "City is required." }
  }

  if (city.length > JOB_CITY_MAX_LENGTH || address.length > JOB_ADDRESS_MAX_LENGTH) {
    return { success: false, message: "City or address is too long." }
  }

  if (scheduledDate.length > 10 || scheduledTime.length > 8) {
    return { success: false, message: "Invalid schedule." }
  }

  if (!SUPPORTED_JOB_TYPES.has(jobType)) {
    return {
      success: false,
      message: "Please select a valid job type.",
    }
  }

  if (!SUPPORTED_PROPERTY_TYPES.has(propertyType)) {
    return { success: false, message: "Please select a valid property type." }
  }

  let budget: number | null = null

  if (budgetRaw) {
    const parsedBudget = Number(budgetRaw)

    if (!Number.isFinite(parsedBudget) || parsedBudget < 0 || parsedBudget > JOB_BUDGET_MAX) {
      return {
        success: false,
        message: "Budget must be a valid positive number.",
      }
    }

    budget = parsedBudget
  }

  const spamCheck =
    analyzeJobContentForSubmission({
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
    })
    .select(
      "id,title,description,city,budget,job_type,status,assigned_to,created_at,scheduled_date,created_by",
    )
    .single()

  if (error || !data) {
    return {
      success: false,
      message: error?.message || "Failed to create job.",
    }
  }

  try {
    await notifyMatchedUsersForJob({
      id: data.id,
      title: data.title,
      description: data.description,
      city: data.city,
      budget: data.budget,
      job_type: data.job_type,
      status: data.status,
      assigned_to: data.assigned_to,
      created_at: data.created_at,
      scheduled_date: data.scheduled_date,
      created_by: data.created_by,
    })
  } catch (matchingError) {
    console.error(
      "Failed to notify matched users:",
      matchingError,
    )
  }

  revalidatePath("/")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  redirect(`/jobs/${data.id}`)
}

export async function takeJobAction(
  _prevState: JobsActionState,
  _formData: FormData,
): Promise<JobsActionState> {
  return {
    success: false,
    message: "Direct job claiming is disabled. Apply to the job instead.",
  }
}

export const takeJob = takeJobAction
