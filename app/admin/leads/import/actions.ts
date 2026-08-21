"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { parseCompanyImportFile } from "@/lib/company-import/parser"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

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
    redirect(`/login?next=${encodeURIComponent("/admin/leads/import")}`)
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  return {
    admin: createAdminClient(),
    userId: user.id,
  }
}

function redirectWithError(message: string): never {
  redirect(`/admin/leads/import?error=${encodeURIComponent(message)}`)
}

function createSourceFallback(fileType: "xlsx" | "csv") {
  const date = new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

  return `${fileType}_import_${date}`
}

type ImportRpcResult = {
  total: number
  created: number
  updated: number
  duplicates: number
  invalid: number
  failed: number
}

function parseRpcResult(value: unknown): ImportRpcResult {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {}

  const numberValue = (key: keyof ImportRpcResult) => {
    const parsed = Number(raw[key] ?? 0)
    return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0
  }

  return {
    total: numberValue("total"),
    created: numberValue("created"),
    updated: numberValue("updated"),
    duplicates: numberValue("duplicates"),
    invalid: numberValue("invalid"),
    failed: numberValue("failed"),
  }
}

export async function importCompanyLeadsAction(formData: FormData) {
  const { admin, userId } = await requireAdmin()
  const uploadedFile = formData.get("file")

  if (!(uploadedFile instanceof File)) {
    redirectWithError("Select an Excel or CSV file.")
  }

  let parsed: Awaited<ReturnType<typeof parseCompanyImportFile>>

  try {
    parsed = await parseCompanyImportFile(uploadedFile)
  } catch (error) {
    console.error("Company import parsing error:", error)
    redirectWithError(error instanceof Error ? error.message : "Could not read the import file.")
  }

  const fallbackSource = createSourceFallback(parsed.fileType)
  const rows = parsed.rows.map((row) => ({
    ...row,
    source: row.source || fallbackSource,
  }))

  const { data: batch, error: batchError } = await admin
    .from("company_import_batches")
    .insert({
      uploaded_by: userId,
      file_name: uploadedFile.name.slice(0, 255),
      file_type: parsed.fileType,
      source: fallbackSource,
      status: "processing",
      total_rows: parsed.totalRows,
    })
    .select("id")
    .single()

  if (batchError || !batch) {
    console.error("Company import batch create error:", batchError)
    redirectWithError("Could not create the import batch.")
  }

  const result: ImportRpcResult = {
    total: 0,
    created: 0,
    updated: 0,
    duplicates: 0,
    invalid: 0,
    failed: 0,
  }

  const databaseChunkSize = 500

  for (let index = 0; index < rows.length; index += databaseChunkSize) {
    const chunk = rows.slice(index, index + databaseChunkSize)
    const { data, error } = await admin.rpc("import_company_leads_batch", {
      p_batch_id: batch.id,
      p_rows: chunk,
    })

    if (error) {
      console.error("Company mass import RPC error:", error)

      const remainingRows = Math.max(0, rows.length - result.total)

      await admin
        .from("company_import_batches")
        .update({
          status: "failed",
          total_rows: rows.length,
          created_count: result.created,
          updated_count: result.updated,
          duplicate_count: result.duplicates,
          invalid_count: result.invalid,
          failed_count: result.failed + remainingRows,
          error_message: error.message.slice(0, 1000),
          completed_at: new Date().toISOString(),
        })
        .eq("id", batch.id)

      redirectWithError("The import stopped before all chunks were completed. The batch was marked as failed.")
    }

    const chunkResult = parseRpcResult(data)
    result.total += chunkResult.total
    result.created += chunkResult.created
    result.updated += chunkResult.updated
    result.duplicates += chunkResult.duplicates
    result.invalid += chunkResult.invalid
    result.failed += chunkResult.failed
  }

  const categorizedRows =
    result.created + result.updated + result.duplicates + result.invalid + result.failed

  if (result.total !== rows.length || categorizedRows !== result.total) {
    console.error("Company import result integrity error:", {
      expectedRows: rows.length,
      result,
      categorizedRows,
    })

    const unaccountedRows = Math.max(0, rows.length - categorizedRows)

    await admin
      .from("company_import_batches")
      .update({
        status: "failed",
        total_rows: rows.length,
        created_count: result.created,
        updated_count: result.updated,
        duplicate_count: result.duplicates,
        invalid_count: result.invalid,
        failed_count: result.failed + unaccountedRows,
        error_message: "Import result counters did not reconcile with the uploaded rows.",
        completed_at: new Date().toISOString(),
      })
      .eq("id", batch.id)

    redirectWithError("The import result could not be verified. The batch was marked as failed.")
  }

  const { error: completeBatchError } = await admin
    .from("company_import_batches")
    .update({
      status: "completed",
      total_rows: result.total,
      created_count: result.created,
      updated_count: result.updated,
      duplicate_count: result.duplicates,
      invalid_count: result.invalid,
      failed_count: result.failed,
      error_message: null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", batch.id)

  if (completeBatchError) {
    console.error("Company import batch completion error:", completeBatchError)
    redirectWithError("Companies were imported, but the batch summary could not be saved.")
  }

  revalidatePath("/admin")
  revalidatePath("/admin/leads")
  revalidatePath("/admin/leads/import")
  revalidatePath("/admin/leads/enrich")

  const params = new URLSearchParams({
    success: "import-completed",
    batch: batch.id,
    total: String(result.total),
    created: String(result.created),
    updated: String(result.updated),
    duplicates: String(result.duplicates),
    invalid: String(result.invalid),
    failed: String(result.failed),
  })

  redirect(`/admin/leads/import?${params.toString()}`)
}
