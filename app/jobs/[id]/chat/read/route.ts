import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

type JobRow = {
  id: string
  created_by: string | null
  assigned_to: string | null
  status: string | null
}

export async function POST(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const { data: jobData, error: jobError } = await supabase
    .from("jobs")
    .select("id, created_by, assigned_to, status")
    .eq("id", id)
    .single()

  const job = jobData as JobRow | null

  if (jobError || !job) {
    return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 })
  }

  const isParticipant =
    job.created_by === user.id || job.assigned_to === user.id

  const canUseChat =
    !!job.created_by &&
    !!job.assigned_to &&
    ["assigned", "in_progress", "done"].includes(job.status || "")

  if (!isParticipant || !canUseChat) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 })
  }

  const { error: updateError } = await supabase
    .from("messages")
    .update({
      read_at: new Date().toISOString(),
      read_by: user.id,
    })
    .eq("job_id", id)
    .neq("sender_id", user.id)
    .is("read_at", null)

  if (updateError) {
    return NextResponse.json(
      { ok: false, error: updateError.message || "Failed to mark messages as read" },
      { status: 500 },
    )
  }

  revalidatePath("/dashboard")
  revalidatePath(`/jobs/${id}`)
  revalidatePath(`/jobs/${id}/chat`)

  return NextResponse.json({ ok: true })
}