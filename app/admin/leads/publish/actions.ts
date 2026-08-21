"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

const MIN_PUBLICATION_QUALITY = 55
const ALLOWED_BATCH_SIZES = new Set([10, 50, 100, 250])

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(`/login?next=${encodeURIComponent("/admin/leads/publish")}`)
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  return createAdminClient()
}

function text(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function parseBatchSize(value: string) {
  const parsed = Number(value)
  return ALLOWED_BATCH_SIZES.has(parsed) ? parsed : 50
}

type PublishRpcResult = {
  processed: number
  created: number
  linked: number
  failed: number
  remaining: number
  min_quality: number
}

function parseRpcResult(value: unknown): PublishRpcResult {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {}

  const integer = (key: keyof PublishRpcResult, fallback = 0) => {
    const parsed = Number(raw[key] ?? fallback)
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback
  }

  return {
    processed: integer("processed"),
    created: integer("created"),
    linked: integer("linked"),
    failed: integer("failed"),
    remaining: integer("remaining"),
    min_quality: integer("min_quality", MIN_PUBLICATION_QUALITY),
  }
}

export async function publishCompanyLeadsAction(formData: FormData) {
  const admin = await requireAdmin()
  const batchId = text(formData, "batchId")
  const batchSize = parseBatchSize(text(formData, "batchSize"))

  const { data, error } = await (admin as any).rpc("publish_company_leads_batch", {
    p_limit: batchSize,
    p_import_batch_id: batchId || null,
    p_min_quality: MIN_PUBLICATION_QUALITY,
  })

  if (error) {
    console.error("Company catalog publication RPC error:", error)
    const params = new URLSearchParams({ error: "Could not publish companies to the public directory." })
    if (batchId) params.set("batch", batchId)
    redirect(`/admin/leads/publish?${params.toString()}`)
  }

  const result = parseRpcResult(data)

  revalidatePath("/admin")
  revalidatePath("/admin/leads")
  revalidatePath("/admin/leads/import")
  revalidatePath("/admin/leads/publish")
  revalidatePath("/companies")
  revalidatePath("/sitemap.xml")

  const params = new URLSearchParams({
    success: "publication-completed",
    processed: String(result.processed),
    created: String(result.created),
    linked: String(result.linked),
    failed: String(result.failed),
    remaining: String(result.remaining),
  })

  if (batchId) params.set("batch", batchId)

  redirect(`/admin/leads/publish?${params.toString()}`)
}
