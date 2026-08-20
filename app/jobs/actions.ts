"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

export type JobsActionState = {
  success: boolean
  message: string
}

type SpamCheckResult = {
  blocked: boolean
  score: number
  reasons: string[]
}

function analyzeJobForSpam({
  title,
  description,
  address,
  budget,
}: {
  title: string
  description: string
  address: string
  budget: number | null
}): SpamCheckResult {
  const text = `${title} ${description} ${address}`.toLowerCase()
  const reasons: string[] = []
  let score = 0

  const suspiciousPatterns: Array<{
    pattern: RegExp
    points: number
    reason: string
  }> = [
    {
      pattern: /\b(whatsapp|telegram|signal)\b/i,
      points: 2,
      reason: "Mentions external messenger contact.",
    },
    {
      pattern: /\b(crypto|bitcoin|btc|usdt|wallet|binance)\b/i,
      points: 4,
      reason: "Mentions crypto or wallet payments.",
    },
    {
      pattern: /\b(pay\s*first|payment\s*before|deposit\s*first|advance\s*payment|förskottsbetalning)\b/i,
      points: 4,
      reason: "Asks for payment before work.",
    },
    {
      pattern: /\b(bankid|bank\s*id|passport|id\s*card|personnummer)\b/i,
      points: 3,
      reason: "Requests sensitive identity information.",
    },
    {
      pattern: /\b(make\s*money\s*fast|easy\s*money|guaranteed\s*income|work\s*from\s*home)\b/i,
      points: 3,
      reason: "Uses common scam wording.",
    },
    {
      pattern: /(https?:\/\/|www\.)/i,
      points: 2,
      reason: "Contains external links.",
    },
    {
      pattern: /\b\d{10,}\b/,
      points: 1,
      reason: "Contains long phone-like number.",
    },
  ]

  for (const item of suspiciousPatterns) {
    if (item.pattern.test(text)) {
      score += item.points
      reasons.push(item.reason)
    }
  }

  if (description.length < 15) {
    score += 1
    reasons.push("Description is very short.")
  }

  if (title.length > 120) {
    score += 1
    reasons.push("Title is unusually long.")
  }

  if (budget !== null && budget > 50000) {
    score += 2
    reasons.push("Budget is unusually high for a cleaning job.")
  }

  const repeatedCharacters = /(.)\1{7,}/.test(text)

  if (repeatedCharacters) {
    score += 2
    reasons.push("Text contains repeated spam-like characters.")
  }

  return {
    blocked: score >= 6,
    score,
    reasons,
  }
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

  if (title.length > 120) {
    return { success: false, message: "Title cannot exceed 120 characters." }
  }

  if (description.length > 5000) {
    return { success: false, message: "Description cannot exceed 5,000 characters." }
  }

  if (!city) {
    return { success: false, message: "City is required." }
  }

  if (city.length > 120 || address.length > 300) {
    return { success: false, message: "City or address is too long." }
  }

  if (scheduledDate.length > 10 || scheduledTime.length > 8) {
    return { success: false, message: "Invalid schedule." }
  }

  if (jobType !== "home_cleaning" && jobType !== "office_cleaning") {
    return {
      success: false,
      message: "Please select a valid job type.",
    }
  }

  const allowedPropertyTypes = new Set(["apartment", "house", "office", "other", ""])
  if (!allowedPropertyTypes.has(propertyType)) {
    return { success: false, message: "Please select a valid property type." }
  }

  let budget: number | null = null

  if (budgetRaw) {
    const parsedBudget = Number(budgetRaw)

    if (!Number.isFinite(parsedBudget) || parsedBudget < 0 || parsedBudget > 10_000_000) {
      return {
        success: false,
        message: "Budget must be a valid positive number.",
      }
    }

    budget = parsedBudget
  }

  const spamCheck = analyzeJobForSpam({
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
  _formData: FormData,
): Promise<JobsActionState> {
  return {
    success: false,
    message: "Direct job claiming is disabled. Apply to the job instead.",
  }
}

export const takeJob = takeJobAction
