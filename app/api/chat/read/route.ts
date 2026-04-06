import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { markJobChatAsRead } from "@/lib/chat-notifications"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const jobId = body?.jobId

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid jobId" }, { status: 400 })
    }

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, created_by, assigned_to")
      .eq("id", jobId)
      .maybeSingle()

    if (jobError || !job) {
      return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 })
    }

    const isParticipant =
      user.id === job.created_by || user.id === job.assigned_to

    if (!isParticipant) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 })
    }

    const { error } = await markJobChatAsRead(jobId, user.id)

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message || "Failed to mark as read" },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unexpected server error" },
      { status: 500 }
    )
  }
}