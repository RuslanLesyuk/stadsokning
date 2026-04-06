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

  const jobId = String(formData.get("jobId") ?? "").trim()

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

  revalidatePath("/")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")
  revalidatePath(`/jobs/${jobId}`)

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

  const jobId = String(formData.get("jobId") ?? "").trim()

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

  const jobId = String(formData.get("jobId") ?? "").trim()
  const nextStatus = String(formData.get("status") ?? "").trim()
  const actionType = String(formData.get("actionType") ?? "").trim()

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
      isAllowed = isAssignedWorker && job.status === "assigned" && nextStatus === "in_progress"
      break

    case "mark_done":
      isAllowed = isAssignedWorker && job.status === "in_progress" && nextStatus === "done"
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

  revalidatePath("/dashboard")
  revalidatePath("/jobs")
  revalidatePath(`/jobs/${jobId}`)

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