import { createClient } from "@/lib/supabase-server"

type JobRow = {
  id: string
}

type ReadRow = {
  job_id: string
  last_read_at: string
}

type MessageRow = {
  job_id: string
  sender_id: string
  created_at: string
}

export async function getUnreadChatCountsForUser(userId: string) {
  const supabase = await createClient()

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id")
    .not("assigned_to", "is", null)
    .or(`created_by.eq.${userId},assigned_to.eq.${userId}`)

  if (jobsError || !jobs || jobs.length === 0) {
    return {
      totalUnreadCount: 0,
      perJobUnreadCount: {} as Record<string, number>,
    }
  }

  const jobIds = (jobs as JobRow[]).map((job) => job.id)

  const [{ data: reads }, { data: messages }] = await Promise.all([
    supabase
      .from("job_chat_reads")
      .select("job_id, last_read_at")
      .eq("user_id", userId)
      .in("job_id", jobIds),
    supabase
      .from("messages")
      .select("job_id, sender_id, created_at")
      .in("job_id", jobIds)
      .neq("sender_id", userId)
      .order("created_at", { ascending: false }),
  ])

  const readMap = new Map<string, string>()

  for (const row of (reads ?? []) as ReadRow[]) {
    readMap.set(row.job_id, row.last_read_at)
  }

  const perJobUnreadCount: Record<string, number> = {}

  for (const jobId of jobIds) {
    perJobUnreadCount[jobId] = 0
  }

  for (const row of (messages ?? []) as MessageRow[]) {
    const lastReadAt = readMap.get(row.job_id)

    if (!lastReadAt) {
      perJobUnreadCount[row.job_id] = (perJobUnreadCount[row.job_id] ?? 0) + 1
      continue
    }

    const messageTime = new Date(row.created_at).getTime()
    const readTime = new Date(lastReadAt).getTime()

    if (Number.isNaN(messageTime) || Number.isNaN(readTime)) {
      continue
    }

    if (messageTime > readTime) {
      perJobUnreadCount[row.job_id] = (perJobUnreadCount[row.job_id] ?? 0) + 1
    }
  }

  const totalUnreadCount = Object.values(perJobUnreadCount).reduce(
    (sum, count) => sum + count,
    0
  )

  return {
    totalUnreadCount,
    perJobUnreadCount,
  }
}

export async function markJobChatAsRead(jobId: string, userId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("job_chat_reads").upsert(
    {
      user_id: userId,
      job_id: jobId,
      last_read_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,job_id",
    }
  )

  return { error }
}