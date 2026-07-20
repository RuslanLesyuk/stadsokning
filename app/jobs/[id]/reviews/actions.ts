"use server"

import { revalidatePath } from "next/cache"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export type ReviewActionState = {
  success: boolean
  message: string
}

type JobRow = {
  id: string
  title: string | null
  created_by: string | null
  assigned_to: string | null
  status: string | null
}

function getReviewNotificationCopy({
  rating,
  jobTitle,
}: {
  rating: number
  jobTitle: string
}) {
  return {
    title: "You received a new review",
    message: `You received a ${rating}-star review for “${jobTitle}”.`,
  }
}

async function createReviewNotification({
  recipientId,
  actorId,
  jobId,
  rating,
  jobTitle,
}: {
  recipientId: string
  actorId: string
  jobId: string
  rating: number
  jobTitle: string
}) {
  try {
    const admin = createAdminClient()

    const { data: existingNotification, error: existingError } =
      await admin
        .from("notifications")
        .select("id")
        .eq("user_id", recipientId)
        .eq("actor_id", actorId)
        .eq("job_id", jobId)
        .eq("type", "review_received")
        .maybeSingle()

    if (existingError) {
      console.error(
        "Check review notification error:",
        existingError,
      )

      return
    }

    if (existingNotification) {
      return
    }

    const notificationCopy = getReviewNotificationCopy({
      rating,
      jobTitle,
    })

    const { error: notificationError } = await admin
      .from("notifications")
      .insert({
        user_id: recipientId,
        actor_id: actorId,
        job_id: jobId,
        application_id: null,
        type: "review_received",
        title: notificationCopy.title,
        message: notificationCopy.message,
        is_read: false,
      })

    if (notificationError) {
      console.error(
        "Create review notification error:",
        notificationError,
      )
    }
  } catch (error) {
    console.error(
      "Unexpected review notification error:",
      error,
    )
  }
}

export async function leaveReviewAction(
  _prevState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      message: "Not authenticated.",
    }
  }

  const jobId = String(
    formData.get("jobId") ?? "",
  ).trim()

  const rating = Number(formData.get("rating"))

  const comment = String(
    formData.get("comment") ?? "",
  ).trim()

  if (!jobId) {
    return {
      success: false,
      message: "Missing job id.",
    }
  }

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return {
      success: false,
      message: "Rating must be 1–5.",
    }
  }

  const { data: jobData, error: jobError } =
    await supabase
      .from("jobs")
      .select(
        "id, title, created_by, assigned_to, status",
      )
      .eq("id", jobId)
      .maybeSingle()

  const job = jobData as JobRow | null

  if (jobError || !job) {
    return {
      success: false,
      message: "Job not found.",
    }
  }

  if (job.status !== "done") {
    return {
      success: false,
      message:
        "Reviews allowed only after completion.",
    }
  }

  const isAuthor =
    user.id === job.created_by

  const isWorker =
    user.id === job.assigned_to

  if (!isAuthor && !isWorker) {
    return {
      success: false,
      message: "No access.",
    }
  }

  if (!job.assigned_to) {
    return {
      success: false,
      message: "No worker assigned.",
    }
  }

  const revieweeId = isAuthor
    ? job.assigned_to
    : job.created_by

  if (!revieweeId) {
    return {
      success: false,
      message: "Invalid review target.",
    }
  }

  if (revieweeId === user.id) {
    return {
      success: false,
      message: "You cannot review yourself.",
    }
  }

  const { data: existingReview, error: existingError } =
    await supabase
      .from("reviews")
      .select("id")
      .eq("job_id", jobId)
      .eq("reviewer_id", user.id)
      .maybeSingle()

  if (existingError) {
    return {
      success: false,
      message: existingError.message,
    }
  }

  if (existingReview) {
    return {
      success: false,
      message: "You already left a review.",
    }
  }

  const { error: insertError } = await supabase
    .from("reviews")
    .insert({
      job_id: jobId,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      rating,
      comment: comment || null,
    })

  if (insertError) {
    return {
      success: false,
      message: insertError.message,
    }
  }

  await createReviewNotification({
    recipientId: revieweeId,
    actorId: user.id,
    jobId,
    rating,
    jobTitle:
      job.title?.trim() || "Cleaning job",
  })

  revalidatePath(`/jobs/${jobId}`)
  revalidatePath("/dashboard")
  revalidatePath("/profile")
  revalidatePath("/notifications")
  revalidatePath("/", "layout")

  return {
    success: true,
    message: "Review submitted.",
  }
}