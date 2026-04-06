"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export type ReviewActionState = {
  success: boolean
  message: string
}

export async function leaveReviewAction(
  _prevState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Not authenticated." }
  }

  const jobId = String(formData.get("jobId") ?? "").trim()
  const rating = Number(formData.get("rating"))
  const comment = String(formData.get("comment") ?? "").trim()

  if (!jobId) {
    return { success: false, message: "Missing job id." }
  }

  if (!rating || rating < 1 || rating > 5) {
    return { success: false, message: "Rating must be 1–5." }
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, created_by, assigned_to, status")
    .eq("id", jobId)
    .maybeSingle()

  if (jobError || !job) {
    return { success: false, message: "Job not found." }
  }

  if (job.status !== "done") {
    return { success: false, message: "Reviews allowed only after completion." }
  }

  const isAuthor = user.id === job.created_by
  const isWorker = user.id === job.assigned_to

  if (!isAuthor && !isWorker) {
    return { success: false, message: "No access." }
  }

  if (!job.assigned_to) {
    return { success: false, message: "No worker assigned." }
  }

  // 🔥 КЛЮЧОВА ЛОГІКА
  const revieweeId = isAuthor ? job.assigned_to : job.created_by

  if (!revieweeId) {
    return { success: false, message: "Invalid review target." }
  }

  // 🚫 ДОДАТКОВИЙ ЗАХИСТ
  if (revieweeId === user.id) {
    return { success: false, message: "You cannot review yourself." }
  }

  // перевірка на дубль
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("job_id", jobId)
    .eq("reviewer_id", user.id)
    .maybeSingle()

  if (existing) {
    return { success: false, message: "You already left a review." }
  }

  const { error: insertError } = await supabase.from("reviews").insert({
    job_id: jobId,
    reviewer_id: user.id,
    reviewee_id: revieweeId,
    rating,
    comment: comment || null,
  })

  if (insertError) {
    return { success: false, message: insertError.message }
  }

  revalidatePath(`/jobs/${jobId}`)
  revalidatePath("/dashboard")
  revalidatePath("/profile")

  return {
    success: true,
    message: "Review submitted.",
  }
}