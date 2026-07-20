"use server"

import { revalidatePath } from "next/cache"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export type DashboardActionState = {
  success: boolean
  message: string
}

type NotificationType =
  | "application_received"
  | "application_accepted"
  | "application_rejected"
  | "new_message"
  | "review_received"

type NotificationInsert = {
  user_id: string
  actor_id: string | null
  job_id: string | null
  application_id: string | null
  type: NotificationType
  title: string
  message: string | null
  is_read?: boolean
}

function ok(message: string): DashboardActionState {
  return {
    success: true,
    message,
  }
}

function fail(message: string): DashboardActionState {
  return {
    success: false,
    message,
  }
}

function getText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim()
}

function parseOptionalPositiveNumber(
  formData: FormData,
  key: string,
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

function revalidateNotificationPaths() {
  revalidatePath("/notifications")
  revalidatePath("/", "layout")
}

async function createNotifications(
  notifications: NotificationInsert[],
): Promise<void> {
  if (notifications.length === 0) {
    return
  }

  try {
    const admin = createAdminClient()

    const { error } = await admin
      .from("notifications")
      .insert(notifications)

    if (error) {
      console.error("Create notifications error:", error)
      return
    }

    revalidateNotificationPaths()
  } catch (error) {
    console.error("Unexpected notification creation error:", error)
  }
}

function getJobTitle(title: string | null | undefined): string {
  const normalizedTitle = title?.trim()

  return normalizedTitle || "Cleaning job"
}

export async function deleteJobAction(
  _prevState: DashboardActionState,
  formData: FormData,
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
    return fail(
      deleteError.message || "Failed to delete job.",
    )
  }

  revalidateJobPaths(jobId)

  return ok("Job deleted.")
}

export async function duplicateJobAction(
  _prevState: DashboardActionState,
  formData: FormData,
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

  const { error: insertError } = await supabase
    .from("jobs")
    .insert({
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
    return fail(
      insertError.message || "Failed to duplicate job.",
    )
  }

  revalidatePath("/")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  return ok("Job duplicated.")
}

export async function updateJobStatusAction(
  _prevState: DashboardActionState,
  formData: FormData,
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
    return fail(
      "You do not have access to update this job.",
    )
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
    isAuthor &&
    (job.status === "assigned" ||
      job.status === "in_progress") &&
    nextStatus === "cancelled"
  break

    case "reopen":
  isAllowed =
    isAuthor &&
    (job.status === "done" ||
      job.status === "cancelled") &&
    nextStatus === "assigned"
  break

    default:
      return fail("Unknown action.")
  }

  if (!isAllowed) {
  return fail(
    actionType === "cancel"
      ? "Only the job owner can cancel this job."
      : "This status change is not allowed.",
  )
}

  const { error: updateError } = await supabase
    .from("jobs")
    .update({
      status: nextStatus,
    })
    .eq("id", jobId)

  if (updateError) {
    return fail(
      updateError.message || "Failed to update status.",
    )
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
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in to apply.")
  }

  const jobId = getText(formData, "jobId")
  const hourlyRate = parseOptionalPositiveNumber(
    formData,
    "hourlyRate",
  )
  const fixedPrice = parseOptionalPositiveNumber(
    formData,
    "fixedPrice",
  )
  const estimatedHours = parseOptionalPositiveNumber(
    formData,
    "estimatedHours",
  )
  const message = getText(formData, "message")
  const availableFrom = getText(
    formData,
    "availableFrom",
  )

  if (!jobId) {
    return fail("Missing job id.")
  }

  if (hourlyRate === null && fixedPrice === null) {
    return fail(
      "Enter an hourly rate or a fixed price.",
    )
  }

  if (message.length > 2000) {
    return fail(
      "The application message cannot exceed 2000 characters.",
    )
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select(
      "id, title, created_by, assigned_to, status",
    )
    .eq("id", jobId)
    .maybeSingle()

  if (jobError || !job) {
    return fail("Job not found.")
  }

  if (job.created_by === user.id) {
    return fail("You cannot apply to your own job.")
  }

  if (job.status !== "new" || job.assigned_to) {
    return fail(
      "This job is no longer accepting applications.",
    )
  }

  const {
    data: existingApplication,
    error: existingError,
  } = await supabase
    .from("job_applications")
    .select("id, status")
    .eq("job_id", jobId)
    .eq("applicant_id", user.id)
    .maybeSingle()

  if (existingError) {
    return fail(
      existingError.message ||
        "Failed to check application.",
    )
  }

  if (existingApplication) {
    return fail(
      existingApplication.status === "withdrawn"
        ? "You already withdrew an application for this job."
        : "You have already applied to this job.",
    )
  }

  const {
    data: insertedApplication,
    error: insertError,
  } = await supabase
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
    .select("id")
    .single()

  if (insertError || !insertedApplication) {
    return fail(
      insertError?.message ||
        "Failed to submit application.",
    )
  }

  const jobTitle = getJobTitle(job.title)

  await createNotifications([
    {
      user_id: job.created_by,
      actor_id: user.id,
      job_id: jobId,
      application_id: insertedApplication.id,
      type: "application_received",
      title: "New application received",
      message: `A new application was submitted for “${jobTitle}”.`,
      is_read: false,
    },
  ])

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
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const applicationId = getText(
    formData,
    "applicationId",
  )
  const jobId = getText(formData, "jobId")
  const hourlyRate = parseOptionalPositiveNumber(
    formData,
    "hourlyRate",
  )
  const fixedPrice = parseOptionalPositiveNumber(
    formData,
    "fixedPrice",
  )
  const estimatedHours = parseOptionalPositiveNumber(
    formData,
    "estimatedHours",
  )
  const message = getText(formData, "message")
  const availableFrom = getText(
    formData,
    "availableFrom",
  )

  if (!applicationId || !jobId) {
    return fail("Missing application information.")
  }

  if (hourlyRate === null && fixedPrice === null) {
    return fail(
      "Enter an hourly rate or a fixed price.",
    )
  }

  if (message.length > 2000) {
    return fail(
      "The application message cannot exceed 2000 characters.",
    )
  }

  const {
    data: application,
    error: applicationError,
  } = await supabase
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
    return fail(
      "Only pending applications can be edited.",
    )
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
    return fail(
      updateError.message ||
        "Failed to update application.",
    )
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
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const applicationId = getText(
    formData,
    "applicationId",
  )
  const jobId = getText(formData, "jobId")

  if (!applicationId || !jobId) {
    return fail("Missing application information.")
  }

  const {
    data: application,
    error: applicationError,
  } = await supabase
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
    return fail(
      "You cannot withdraw this application.",
    )
  }

  if (application.status !== "pending") {
    return fail(
      "Only pending applications can be withdrawn.",
    )
  }

  const { error: updateError } = await supabase
    .from("job_applications")
    .update({
      status: "withdrawn",
    })
    .eq("id", applicationId)
    .eq("applicant_id", user.id)
    .eq("status", "pending")

  if (updateError) {
    return fail(
      updateError.message ||
        "Failed to withdraw application.",
    )
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
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const applicationId = getText(
    formData,
    "applicationId",
  )
  const jobId = getText(formData, "jobId")

  if (!applicationId || !jobId) {
    return fail("Missing application information.")
  }

  const [
    {
      data: application,
      error: applicationError,
    },
    {
      data: job,
      error: jobError,
    },
    {
      data: pendingApplications,
      error: pendingApplicationsError,
    },
  ] = await Promise.all([
    supabase
      .from("job_applications")
      .select(
        "id, job_id, applicant_id, status",
      )
      .eq("id", applicationId)
      .eq("job_id", jobId)
      .maybeSingle(),

    supabase
      .from("jobs")
      .select("id, title, created_by")
      .eq("id", jobId)
      .maybeSingle(),

    supabase
      .from("job_applications")
      .select("id, applicant_id")
      .eq("job_id", jobId)
      .eq("status", "pending"),
  ])

  if (applicationError || !application) {
    return fail("Application not found.")
  }

  if (jobError || !job) {
    return fail("Job not found.")
  }

  if (pendingApplicationsError) {
    return fail(
      pendingApplicationsError.message ||
        "Failed to load pending applications.",
    )
  }

  if (job.created_by !== user.id) {
    return fail(
      "Only the job owner can accept applications.",
    )
  }

  if (application.status !== "pending") {
    return fail(
      "This application is no longer pending.",
    )
  }

  const { error: rpcError } = await supabase.rpc(
    "accept_job_application",
    {
      p_application_id: applicationId,
    },
  )

  if (rpcError) {
    return fail(
      rpcError.message ||
        "Failed to accept application.",
    )
  }

  const jobTitle = getJobTitle(job.title)

  const notifications: NotificationInsert[] = [
    {
      user_id: application.applicant_id,
      actor_id: user.id,
      job_id: jobId,
      application_id: application.id,
      type: "application_accepted",
      title: "Application accepted",
      message: `Your application for “${jobTitle}” was accepted. You can now open the job and use the chat.`,
      is_read: false,
    },
  ]

  for (const pendingApplication of
    pendingApplications ?? []) {
    if (
      pendingApplication.id === applicationId ||
      pendingApplication.applicant_id ===
        application.applicant_id
    ) {
      continue
    }

    notifications.push({
      user_id: pendingApplication.applicant_id,
      actor_id: user.id,
      job_id: jobId,
      application_id: pendingApplication.id,
      type: "application_rejected",
      title: "Application not selected",
      message: `Another applicant was selected for “${jobTitle}”.`,
      is_read: false,
    })
  }

  await createNotifications(notifications)

  revalidateJobPaths(jobId)

  return ok(
    "Application accepted. The job has been assigned.",
  )
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
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const applicationId = getText(
    formData,
    "applicationId",
  )
  const jobId = getText(formData, "jobId")

  if (!applicationId || !jobId) {
    return fail("Missing application information.")
  }

  const [
    {
      data: application,
      error: applicationError,
    },
    {
      data: job,
      error: jobError,
    },
  ] = await Promise.all([
    supabase
      .from("job_applications")
      .select(
        "id, job_id, applicant_id, status",
      )
      .eq("id", applicationId)
      .eq("job_id", jobId)
      .maybeSingle(),

    supabase
      .from("jobs")
      .select("id, title, created_by")
      .eq("id", jobId)
      .maybeSingle(),
  ])

  if (applicationError || !application) {
    return fail("Application not found.")
  }

  if (jobError || !job) {
    return fail("Job not found.")
  }

  if (job.created_by !== user.id) {
    return fail(
      "Only the job owner can reject applications.",
    )
  }

  if (application.status !== "pending") {
    return fail(
      "Only pending applications can be rejected.",
    )
  }

  const { error: rpcError } = await supabase.rpc(
    "reject_job_application",
    {
      p_application_id: applicationId,
    },
  )

  if (rpcError) {
    return fail(
      rpcError.message ||
        "Failed to reject application.",
    )
  }

  const jobTitle = getJobTitle(job.title)

  await createNotifications([
    {
      user_id: application.applicant_id,
      actor_id: user.id,
      job_id: jobId,
      application_id: application.id,
      type: "application_rejected",
      title: "Application rejected",
      message: `Your application for “${jobTitle}” was not accepted.`,
      is_read: false,
    },
  ])

  revalidateJobPaths(jobId)

  return ok("Application rejected.")
}

/**
 * Marks one notification as read.
 *
 * Expected FormData:
 * notificationId
 */
export async function markNotificationReadAction(
  _prevState: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const notificationId = getText(
    formData,
    "notificationId",
  )

  if (!notificationId) {
    return fail("Missing notification id.")
  }

  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("id", notificationId)
    .eq("user_id", user.id)

  if (error) {
    return fail(
      error.message ||
        "Failed to update notification.",
    )
  }

  revalidateNotificationPaths()

  return ok("Notification updated.")
}

/**
 * Marks all notifications as read.
 */
export async function markAllNotificationsReadAction(): Promise<DashboardActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return fail("You must be logged in.")
  }

  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("user_id", user.id)
    .eq("is_read", false)

  if (error) {
    return fail(
      error.message ||
        "Failed to update notifications.",
    )
  }

  revalidateNotificationPaths()

  return ok("Notifications updated.")
}