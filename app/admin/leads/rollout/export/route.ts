import { NextRequest, NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

const MIN_PUBLICATION_QUALITY = 55
const MAX_ENRICHMENT_ATTEMPTS = 3

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function csvCell(value: unknown) {
  const text = String(value ?? "")
  return `"${text.replaceAll('"', '""')}"`
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !getAdminEmails().includes(user.email.toLowerCase())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const requestedBatch = String(request.nextUrl.searchParams.get("batch") || "").trim()
  const batchId = isUuid(requestedBatch) ? requestedBatch : null
  const admin = createAdminClient()

  const { data, error } = await (admin as any).rpc("get_company_import_rollout_issues", {
    p_import_batch_id: batchId,
    p_min_quality: MIN_PUBLICATION_QUALITY,
    p_max_attempts: MAX_ENRICHMENT_ATTEMPTS,
    p_limit: 5000,
  })

  if (error) {
    console.error("Mass import rollout CSV error:", error.message)
    return NextResponse.json({ error: "Could not export rollout QA issues." }, { status: 500 })
  }

  const rows = Array.isArray(data) ? data : []
  const header = [
    "issue_code",
    "severity",
    "lead_id",
    "company_name",
    "city",
    "data_quality_score",
    "email_scan_status",
    "email_scan_attempt_count",
    "catalog_publication_status",
    "detail",
  ]

  const csv = [
    header.map(csvCell).join(","),
    ...rows.map((row: Record<string, unknown>) => header.map((key) => csvCell(row[key])).join(",")),
  ].join("\n")

  const suffix = batchId ? `-${batchId.slice(0, 8)}` : "-all"

  return new NextResponse(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clean-jobs-rollout-issues${suffix}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
