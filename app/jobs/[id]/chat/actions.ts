"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"
import { normalizeUserText } from "@/lib/text"

export type ChatActionState = {
  ok: boolean
  error: string | null
  success: string | null
  resetToken: number
}

const MAX_MESSAGE_LENGTH = 1000
const MESSAGE_COOLDOWN_MS = 3000

type JobRow = {
  id: string
  created_by: string | null
  assigned_to: string | null
  status: string | null
}

type MessageRow = {
  id: string
  created_at: string
}

export async function sendMessageAction(
  _prevState: ChatActionState,
  formData: FormData,
): Promise<ChatActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      error: "You need to log in first.",
      success: null,
      resetToken: 0,
    }
  }

  const jobId = String(formData.get("jobId") || "")
  const rawBody = String(formData.get("body") || "")
  const body = normalizeUserText(rawBody)

  if (!jobId) {
    return {
      ok: false,
      error: "Job not found.",
      success: null,
      resetToken: 0,
    }
  }

  if (!body) {
    return {
      ok: false,
      error: "Message cannot be empty.",
      success: null,
      resetToken: 0,
    }
  }

  if (body.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: `Message is too long. Max ${MAX_MESSAGE_LENGTH} characters.`,
      success: null,
      resetToken: 0,
    }
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, created_by, assigned_to, status")
    .eq("id", jobId)
    .single()

  const typedJob = job as JobRow | null

  if (jobError || !typedJob) {
    return {
      ok: false,
      error: "Job not found.",
      success: null,
      resetToken: 0,
    }
  }

  const isParticipant =
    typedJob.created_by === user.id || typedJob.assigned_to === user.id

  const canUseChat =
    !!typedJob.created_by &&
    !!typedJob.assigned_to &&
    ["assigned", "in_progress", "done"].includes(typedJob.status || "")

  if (!isParticipant || !canUseChat) {
    return {
      ok: false,
      error: "You do not have access to this chat.",
      success: null,
      resetToken: 0,
    }
  }

  const { data: lastOwnMessage } = await supabase
    .from("messages")
    .select("id, created_at")
    .eq("job_id", jobId)
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const typedLastOwnMessage = lastOwnMessage as MessageRow | null

  if (typedLastOwnMessage?.created_at) {
    const diffMs = Date.now() - new Date(typedLastOwnMessage.created_at).getTime()

    if (diffMs < MESSAGE_COOLDOWN_MS) {
      const secondsLeft = Math.ceil((MESSAGE_COOLDOWN_MS - diffMs) / 1000)

      return {
        ok: false,
        error: `Too fast. Try again in ${secondsLeft}s.`,
        success: null,
        resetToken: 0,
      }
    }
  }

  const { error: insertError } = await supabase.from("messages").insert({
    job_id: jobId,
    sender_id: user.id,
    body,
  })

  if (insertError) {
    return {
      ok: false,
      error: insertError.message || "Failed to send message.",
      success: null,
      resetToken: 0,
    }
  }

  revalidatePath(`/jobs/${jobId}/chat`)
  revalidatePath(`/jobs/${jobId}`)
  revalidatePath("/dashboard")

  return {
    ok: true,
    error: null,
    success: "Message sent.",
    resetToken: Date.now(),
  }
}