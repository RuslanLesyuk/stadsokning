"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export type DashboardActionState = {
  success: boolean
  message: string
}

function ok(message: string): DashboardActionState {
  return { success: true, message }
}

function fail(message: string): DashboardActionState {
  return { success: false, message }
}

function getText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim()
}

function parseOptionalPositiveNumber(
  formData: FormData,
  key: string
): number | null {
  const rawValue = getText(formData, key)

  if (!rawValue) {
    return null
  }

  const normalizedValue = rawValue.replace(",", ".")
  const parsedValue = Number(normalizedValue)

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null
  }

  return parsedValue
}

function revalidateJobPaths(jobId: string) {
  revalidatePath("/")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")
  revalidatePath(`/jobs/${jobId}`)
}

export async function deleteJobAction(
  _prevState: DashboardActionState,
  formData: FormData
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const jobId = getText(formData, "jobId")

  if (!jobId) {
    return fail("Missing job id.")
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, created_by")
    .eq("id", jobId)
    .maybeSingle()

  if (jobError || !job) {
    return fail("Job not found.")
  }

  if (job.created_by !== user.id) {
    return fail("You can delete only your own job.")
  }

  const { error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("created_by", user.id)

  if (deleteError) {
    return fail(deleteError.message || "Failed to delete job.")
  }

  revalidateJobPaths(jobId)

  return ok("Job deleted.")
}

export async function duplicateJobAction(
  _prevState: DashboardActionState,
  formData: FormData
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const jobId = getText(formData, "jobId")

  if (!jobId) {
    return fail("Missing job id.")
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select(`
      title,
      description,
      city,
      address,
      budget,
      job_type,
      property_type,
      scheduled_date,
      scheduled_time,
      created_by
    `)
    .eq("id", jobId)
    .maybeSingle()

  if (jobError || !job) {
    return fail("Job not found.")
  }

  if (job.created_by !== user.id) {
    return fail("You can duplicate only your own job.")
  }

  const { error: insertError } = await supabase.from("jobs").insert({
    title: job.title,
    description: job.description,
    city: job.city,
    address: job.address,
    budget: job.budget,
    job_type: job.job_type,
    property_type: job.property_type,
    scheduled_date: job.scheduled_date,
    scheduled_time: job.scheduled_time,
    created_by: user.id,
    assigned_to: null,
    status: "new",
  })

  if (insertError) {
    return fail(insertError.message || "Failed to duplicate job.")
  }

  revalidatePath("/")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  return ok("Job duplicated.")
}

export async function updateJobStatusAction(
  _prevState: DashboardActionState,
  formData: FormData
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const jobId = getText(formData, "jobId")
  const nextStatus = getText(formData, "status")
  const actionType = getText(formData, "actionType")

  if (!jobId) {
    return fail("Missing job id.")
  }

  const allowedStatuses = new Set([
    "assigned",
    "in_progress",
    "done",
    "cancelled",
  ])

  if (!allowedStatuses.has(nextStatus)) {
    return fail("Invalid target status.")
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, created_by, assigned_to, status")
    .eq("id", jobId)
    .maybeSingle()

  if (jobError || !job) {
    return fail("Job not found.")
  }

  const isAuthor = user.id === job.created_by
  const isAssignedWorker = user.id === job.assigned_to
  const isParticipant = isAuthor || isAssignedWorker

  if (!isParticipant) {
    return fail("You do not have access to update this job.")
  }

  if (!job.assigned_to) {
    return fail("This job is not assigned yet.")
  }

  let isAllowed = false

  switch (actionType) {
    case "start":
      isAllowed =
        isAssignedWorker &&
        job.status === "assigned" &&
        nextStatus === "in_progress"
      break

    case "mark_done":
      isAllowed =
        isAssignedWorker &&
        job.status === "in_progress" &&
        nextStatus === "done"
      break

    case "cancel":
      isAllowed =
        (isAuthor || isAssignedWorker) &&
        (job.status === "assigned" || job.status === "in_progress") &&
        nextStatus === "cancelled"
      break

    case "reopen":
      isAllowed =
        (isAuthor || isAssignedWorker) &&
        (job.status === "done" || job.status === "cancelled") &&
        nextStatus === "assigned"
      break

    default:
      return fail("Unknown action.")
  }

  if (!isAllowed) {
    return fail("This status change is not allowed.")
  }

  const { error: updateError } = await supabase
    .from("jobs")
    .update({ status: nextStatus })
    .eq("id", jobId)

  if (updateError) {
    return fail(updateError.message || "Failed to update status.")
  }

  revalidateJobPaths(jobId)

  if (nextStatus === "assigned") {
    return ok("Job reopened.")
  }

  if (nextStatus === "in_progress") {
    return ok("Job started.")
  }

  if (nextStatus === "done") {
    return ok("Job marked as done.")
  }

  if (nextStatus === "cancelled") {
    return ok("Job cancelled.")
  }

  return ok("Job updated.")
}

/**
 * Creates a new application for an open job.
 *
 * Expected FormData:
 * jobId
 * hourlyRate
 * fixedPrice
 * message
 * availableFrom
 * estimatedHours
 */
export async function applyToJobAction(
  _prevState: DashboardActionState,
  formData: FormData
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in to apply.")
  }

  const jobId = getText(formData, "jobId")
  const hourlyRate = parseOptionalPositiveNumber(formData, "hourlyRate")
  const fixedPrice = parseOptionalPositiveNumber(formData, "fixedPrice")
  const estimatedHours = parseOptionalPositiveNumber(
    formData,
    "estimatedHours"
  )
  const message = getText(formData, "message")
  const availableFrom = getText(formData, "availableFrom")

  if (!jobId) {
    return fail("Missing job id.")
  }

  if (hourlyRate === null && fixedPrice === null) {
    return fail("Enter an hourly rate or a fixed price.")
  }

  if (message.length > 2000) {
    return fail("The application message cannot exceed 2000 characters.")
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, created_by, assigned_to, status")
    .eq("id", jobId)
    .maybeSingle()

  if (jobError || !job) {
    return fail("Job not found.")
  }

  if (job.created_by === user.id) {
    return fail("You cannot apply to your own job.")
  }

  if (job.status !== "new" || job.assigned_to) {
    return fail("This job is no longer accepting applications.")
  }

  const { data: existingApplication, error: existingError } = await supabase
    .from("job_applications")
    .select("id, status")
    .eq("job_id", jobId)
    .eq("applicant_id", user.id)
    .maybeSingle()

  if (existingError) {
    return fail(existingError.message || "Failed to check application.")
  }

  if (existingApplication) {
    return fail(
      existingApplication.status === "withdrawn"
        ? "You already withdrew an application for this job."
        : "You have already applied to this job."
    )
  }

  const { error: insertError } = await supabase
    .from("job_applications")
    .insert({
      job_id: jobId,
      applicant_id: user.id,
      hourly_rate: hourlyRate,
      fixed_price: fixedPrice,
      estimated_hours: estimatedHours,
      message: message || null,
      available_from: availableFrom || null,
      status: "pending",
    })

  if (insertError) {
    return fail(insertError.message || "Failed to submit application.")
  }

  revalidateJobPaths(jobId)

  return ok("Application submitted.")
}

/**
 * Updates the current user's pending application.
 *
 * Expected FormData:
 * applicationId
 * jobId
 * hourlyRate
 * fixedPrice
 * message
 * availableFrom
 * estimatedHours
 */
export async function updateJobApplicationAction(
  _prevState: DashboardActionState,
  formData: FormData
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const applicationId = getText(formData, "applicationId")
  const jobId = getText(formData, "jobId")
  const hourlyRate = parseOptionalPositiveNumber(formData, "hourlyRate")
  const fixedPrice = parseOptionalPositiveNumber(formData, "fixedPrice")
  const estimatedHours = parseOptionalPositiveNumber(
    formData,
    "estimatedHours"
  )
  const message = getText(formData, "message")
  const availableFrom = getText(formData, "availableFrom")

  if (!applicationId || !jobId) {
    return fail("Missing application information.")
  }

  if (hourlyRate === null && fixedPrice === null) {
    return fail("Enter an hourly rate or a fixed price.")
  }

  if (message.length > 2000) {
    return fail("The application message cannot exceed 2000 characters.")
  }

  const { data: application, error: applicationError } = await supabase
    .from("job_applications")
    .select("id, job_id, applicant_id, status")
    .eq("id", applicationId)
    .maybeSingle()

  if (applicationError || !application) {
    return fail("Application not found.")
  }

  if (
    application.applicant_id !== user.id ||
    application.job_id !== jobId
  ) {
    return fail("You cannot edit this application.")
  }

  if (application.status !== "pending") {
    return fail("Only pending applications can be edited.")
  }

  const { error: updateError } = await supabase
    .from("job_applications")
    .update({
      hourly_rate: hourlyRate,
      fixed_price: fixedPrice,
      estimated_hours: estimatedHours,
      message: message || null,
      available_from: availableFrom || null,
    })
    .eq("id", applicationId)
    .eq("applicant_id", user.id)
    .eq("status", "pending")

  if (updateError) {
    return fail(updateError.message || "Failed to update application.")
  }

  revalidateJobPaths(jobId)

  return ok("Application updated.")
}

/**
 * Withdraws the current user's pending application.
 *
 * Expected FormData:
 * applicationId
 * jobId
 */
export async function withdrawJobApplicationAction(
  _prevState: DashboardActionState,
  formData: FormData
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const applicationId = getText(formData, "applicationId")
  const jobId = getText(formData, "jobId")

  if (!applicationId || !jobId) {
    return fail("Missing application information.")
  }

  const { data: application, error: applicationError } = await supabase
    .from("job_applications")
    .select("id, job_id, applicant_id, status")
    .eq("id", applicationId)
    .maybeSingle()

  if (applicationError || !application) {
    return fail("Application not found.")
  }

  if (
    application.applicant_id !== user.id ||
    application.job_id !== jobId
  ) {
    return fail("You cannot withdraw this application.")
  }

  if (application.status !== "pending") {
    return fail("Only pending applications can be withdrawn.")
  }

  const { error: updateError } = await supabase
    .from("job_applications")
    .update({ status: "withdrawn" })
    .eq("id", applicationId)
    .eq("applicant_id", user.id)
    .eq("status", "pending")

  if (updateError) {
    return fail(updateError.message || "Failed to withdraw application.")
  }

  revalidateJobPaths(jobId)

  return ok("Application withdrawn.")
}

/**
 * Accepts a pending application and assigns the job.
 *
 * Expected FormData:
 * applicationId
 * jobId
 */
export async function acceptJobApplicationAction(
  _prevState: DashboardActionState,
  formData: FormData
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const applicationId = getText(formData, "applicationId")
  const jobId = getText(formData, "jobId")

  if (!applicationId || !jobId) {
    return fail("Missing application information.")
  }

  const { data: application, error: applicationError } = await supabase
    .from("job_applications")
    .select("id, job_id, status")
    .eq("id", applicationId)
    .eq("job_id", jobId)
    .maybeSingle()

  if (applicationError || !application) {
    return fail("Application not found.")
  }

  if (application.status !== "pending") {
    return fail("This application is no longer pending.")
  }

  const { error: rpcError } = await supabase.rpc(
    "accept_job_application",
    {
      p_application_id: applicationId,
    }
  )

  if (rpcError) {
    return fail(rpcError.message || "Failed to accept application.")
  }

  revalidateJobPaths(jobId)

  return ok("Application accepted. The job has been assigned.")
}

/**
 * Rejects a pending application.
 *
 * Expected FormData:
 * applicationId
 * jobId
 */
export async function rejectJobApplicationAction(
  _prevState: DashboardActionState,
  formData: FormData
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const applicationId = getText(formData, "applicationId")
  const jobId = getText(formData, "jobId")

  if (!applicationId || !jobId) {
    return fail("Missing application information.")
  }

  const { data: application, error: applicationError } = await supabase
    .from("job_applications")
    .select("id, job_id, status")
    .eq("id", applicationId)
    .eq("job_id", jobId)
    .maybeSingle()

  if (applicationError || !application) {
    return fail("Application not found.")
  }

  if (application.status !== "pending") {
    return fail("Only pending applications can be rejected.")
  }

  const { error: rpcError } = await supabase.rpc(
    "reject_job_application",
    {
      p_application_id: applicationId,
    }
  )

  if (rpcError) {
    return fail(rpcError.message || "Failed to reject application.")
  }

  revalidateJobPaths(jobId)

  return ok("Application rejected.")
}