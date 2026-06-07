import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

const allowedReasons = new Set([
  "spam",
  "scam",
  "fake_job",
  "inappropriate_content",
  "other",
])

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)

  const jobId = String(body?.jobId || "").trim()
  const reason = String(body?.reason || "").trim()
  const messageRaw = String(body?.message || "").trim()
  const message = messageRaw.length > 0 ? messageRaw.slice(0, 1000) : null

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 })
  }

  if (!allowedReasons.has(reason)) {
    return NextResponse.json({ error: "Invalid report reason" }, { status: 400 })
  }

  const { data: job } = await supabase
    .from("jobs")
    .select("id")
    .eq("id", jobId)
    .maybeSingle()

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const { error } = await supabase.from("job_reports").upsert(
    {
      job_id: jobId,
      reporter_id: user.id,
      reason,
      message,
      status: "open",
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "job_id,reporter_id",
    },
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
