import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase-admin"
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

export async function POST(
  _request: Request,
  { params }: RouteContext,
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    )
  }

  const { data: jobData, error: jobError } =
    await supabase
      .from("jobs")
      .select(
        "id, created_by, assigned_to, status",
      )
      .eq("id", id)
      .single()

  const job = jobData as JobRow | null

  if (jobError || !job) {
    return NextResponse.json(
      {
        ok: false,
        error: "Job not found",
      },
      {
        status: 404,
      },
    )
  }

  const isParticipant =
    job.created_by === user.id ||
    job.assigned_to === user.id

  const canOpenChat =
    Boolean(job.created_by) &&
    Boolean(job.assigned_to) &&
    [
      "assigned",
      "in_progress",
      "done",
      "cancelled",
    ].includes(job.status || "")

  if (!isParticipant || !canOpenChat) {
    return NextResponse.json(
      {
        ok: false,
        error: "Forbidden",
      },
      {
        status: 403,
      },
    )
  }

  const readAt = new Date().toISOString()

  const { error: messagesError } = await supabase
    .from("messages")
    .update({
      read_at: readAt,
      read_by: user.id,
    })
    .eq("job_id", id)
    .neq("sender_id", user.id)
    .is("read_at", null)

  if (messagesError) {
    return NextResponse.json(
      {
        ok: false,
        error:
          messagesError.message ||
          "Failed to mark messages as read",
      },
      {
        status: 500,
      },
    )
  }

  try {
    const admin = createAdminClient()

    const { error: notificationsError } = await admin
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("user_id", user.id)
      .eq("job_id", id)
      .eq("type", "new_message")
      .eq("is_read", false)

    if (notificationsError) {
      console.error(
        "Failed to mark message notifications as read:",
        notificationsError,
      )
    }
  } catch (error) {
    console.error(
      "Failed to update message notifications:",
      error,
    )
  }

  revalidatePath("/dashboard")
  revalidatePath("/notifications")
  revalidatePath(`/jobs/${id}`)
  revalidatePath(`/jobs/${id}/chat`)
  revalidatePath("/", "layout")

  return NextResponse.json({
    ok: true,
  })
}