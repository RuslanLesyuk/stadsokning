"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase-server"
import { normalizeUserText } from "@/lib/text"

export type ReviewEntityType = "job" | "service" | "company"

export type ReviewActionState = {
  ok: boolean
  error: string | null
  success: string | null
}

type JobEntity = {
  id: string
  created_by: string
  assigned_to: string | null
  status: string | null
}

type ServiceEntity = {
  id: string
  user_id: string
  slug: string
}

type CompanyEntity = {
  id: string
  owner_id: string | null
  slug: string
}

const MAX_COMMENT_LENGTH = 1000

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim()
}

function isReviewEntityType(value: string): value is ReviewEntityType {
  return value === "job" || value === "service" || value === "company"
}

function parseRating(value: string) {
  const rating = Number(value)

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return null
  }

  return rating
}

async function resolveReviewee({
  entityType,
  entityId,
  currentUserId,
}: {
  entityType: ReviewEntityType
  entityId: string
  currentUserId: string
}) {
  const supabase = await createClient()

  if (entityType === "service") {
    const { data } = await supabase
      .from("service_profiles")
      .select("id, user_id, slug")
      .eq("id", entityId)
      .maybeSingle()

    const service = data as ServiceEntity | null

    if (!service) {
      return {
        error: "Service not found.",
        revieweeId: null,
        pathname: null,
        jobId: null,
      }
    }

    if (service.user_id === currentUserId) {
      return {
        error: "You cannot review your own service.",
        revieweeId: null,
        pathname: null,
        jobId: null,
      }
    }

    return {
      error: null,
      revieweeId: service.user_id,
      pathname: `/services/${service.slug}`,
      jobId: null,
    }
  }

  if (entityType === "company") {
    const { data } = await supabase
      .from("companies")
      .select("id, owner_id, slug")
      .eq("id", entityId)
      .maybeSingle()

    const company = data as CompanyEntity | null

    if (!company) {
      return {
        error: "Company not found.",
        revieweeId: null,
        pathname: null,
        jobId: null,
      }
    }

    if (!company.owner_id) {
      return {
        error: "This company does not have an owner yet.",
        revieweeId: null,
        pathname: null,
        jobId: null,
      }
    }

    if (company.owner_id === currentUserId) {
      return {
        error: "You cannot review your own company.",
        revieweeId: null,
        pathname: null,
        jobId: null,
      }
    }

    return {
      error: null,
      revieweeId: company.owner_id,
      pathname: `/companies/${company.slug}`,
      jobId: null,
    }
  }

  const { data } = await supabase
    .from("jobs")
    .select("id, created_by, assigned_to, status")
    .eq("id", entityId)
    .maybeSingle()

  const job = data as JobEntity | null

  if (!job) {
    return {
      error: "Job not found.",
      revieweeId: null,
      pathname: null,
      jobId: null,
    }
  }

  if (job.status !== "done") {
    return {
      error: "Reviews are available only after the job is completed.",
      revieweeId: null,
      pathname: null,
      jobId: null,
    }
  }

  if (!job.assigned_to) {
    return {
      error: "This job does not have an assigned worker.",
      revieweeId: null,
      pathname: null,
      jobId: null,
    }
  }

  if (
    currentUserId !== job.created_by &&
    currentUserId !== job.assigned_to
  ) {
    return {
      error: "Only job participants can leave a review.",
      revieweeId: null,
      pathname: null,
      jobId: null,
    }
  }

  const revieweeId =
    currentUserId === job.created_by
      ? job.assigned_to
      : job.created_by

  return {
    error: null,
    revieweeId,
    pathname: `/jobs/${job.id}`,
    jobId: job.id,
  }
}

export async function createReviewAction(
  _previousState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      ok: false,
      error: "You need to log in first.",
      success: null,
    }
  }

  const entityTypeValue = getText(formData, "entity_type")
  const entityId = getText(formData, "entity_id")
  const rating = parseRating(getText(formData, "rating"))
  const comment = normalizeUserText(getText(formData, "comment"))

  if (!isReviewEntityType(entityTypeValue)) {
    return {
      ok: false,
      error: "Invalid review type.",
      success: null,
    }
  }

  if (!entityId) {
    return {
      ok: false,
      error: "Review target not found.",
      success: null,
    }
  }

  if (!rating) {
    return {
      ok: false,
      error: "Select a rating from 1 to 5.",
      success: null,
    }
  }

  if (comment.length > MAX_COMMENT_LENGTH) {
    return {
      ok: false,
      error: `Comment is too long. Maximum ${MAX_COMMENT_LENGTH} characters.`,
      success: null,
    }
  }

  const resolved = await resolveReviewee({
    entityType: entityTypeValue,
    entityId,
    currentUserId: user.id,
  })

  if (resolved.error || !resolved.revieweeId) {
    return {
      ok: false,
      error: resolved.error || "Review recipient not found.",
      success: null,
    }
  }

  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("reviewer_id", user.id)
    .eq("entity_type", entityTypeValue)
    .eq("entity_id", entityId)
    .maybeSingle()

  if (existingReview) {
    return {
      ok: false,
      error: "You have already reviewed this item.",
      success: null,
    }
  }

  const { error: insertError } = await supabase.from("reviews").insert({
    job_id: resolved.jobId,
    entity_type: entityTypeValue,
    entity_id: entityId,
    reviewer_id: user.id,
    reviewee_id: resolved.revieweeId,
    rating,
    comment: comment || null,
  })

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        ok: false,
        error: "You have already reviewed this item.",
        success: null,
      }
    }

    console.error("Create review error:", insertError)

    return {
      ok: false,
      error: "Failed to publish the review.",
      success: null,
    }
  }

  if (entityTypeValue === "job" && resolved.jobId) {
    const { error: activityError } = await supabase
      .from("job_activity")
      .insert({
        job_id: resolved.jobId,
        type: "review_left",
        actor_id: user.id,
      })

    if (activityError) {
      console.error("Create review activity error:", activityError)
    }
  }

  if (resolved.pathname) {
    revalidatePath(resolved.pathname)
  }

  revalidatePath("/jobs")
  revalidatePath("/services")
  revalidatePath("/companies")
  revalidatePath("/dashboard")

  return {
    ok: true,
    error: null,
    success: "Review published.",
  }
}

export async function deleteReviewAction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const reviewId = getText(formData, "review_id")
  const pathname = getText(formData, "pathname")

  if (!reviewId) {
    return
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("reviewer_id", user.id)

  if (error) {
    console.error("Delete review error:", error)
    return
  }

  if (pathname.startsWith("/")) {
    revalidatePath(pathname)
  }

  revalidatePath("/jobs")
  revalidatePath("/services")
  revalidatePath("/companies")
  revalidatePath("/dashboard")
}