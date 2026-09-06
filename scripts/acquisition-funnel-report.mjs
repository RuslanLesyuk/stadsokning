import { createClient } from "@supabase/supabase-js"

const daysArg =
  process.argv.find((item) =>
    item.startsWith("--days="),
  )

const rawDays = daysArg
  ? Number(daysArg.split("=")[1])
  : 30

const days =
  Number.isFinite(rawDays) &&
  rawDays > 0 &&
  rawDays <= 3650
    ? Math.floor(rawDays)
    : 30

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
  )
  process.exit(1)
}

const supabase = createClient(
  url,
  serviceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
)

const since = new Date(
  Date.now() -
    days * 24 * 60 * 60 * 1000,
).toISOString()

async function fetchJobs() {
  const rows = []
  const pageSize = 1000

  for (
    let from = 0;
    ;
    from += pageSize
  ) {
    const { data, error } =
      await supabase
        .from("jobs")
        .select(
          [
            "id",
            "created_at",
            "status",
            "assigned_to",
            "acquisition_source",
            "acquisition_medium",
            "acquisition_campaign",
          ].join(","),
        )
        .gte("created_at", since)
        .order("created_at", {
          ascending: true,
        })
        .range(
          from,
          from + pageSize - 1,
        )

    if (error) {
      throw error
    }

    rows.push(...(data || []))

    if (
      !data ||
      data.length < pageSize
    ) {
      break
    }
  }

  return rows
}

async function fetchByJobIds(
  table,
  select,
  jobIds,
) {
  const result = []
  const chunkSize = 100

  for (
    let index = 0;
    index < jobIds.length;
    index += chunkSize
  ) {
    const chunk =
      jobIds.slice(
        index,
        index + chunkSize,
      )

    const { data, error } =
      await supabase
        .from(table)
        .select(select)
        .in("job_id", chunk)

    if (error) {
      throw error
    }

    result.push(...(data || []))
  }

  return result
}

function percentage(
  numerator,
  denominator,
) {
  if (!denominator) {
    return "0.0%"
  }

  return (
    (
      (numerator / denominator) *
      100
    ).toFixed(1) + "%"
  )
}

const jobs = await fetchJobs()
const jobIds = jobs.map((job) => job.id)

const applications =
  jobIds.length > 0
    ? await fetchByJobIds(
        "job_applications",
        "job_id,created_at",
        jobIds,
      )
    : []

const activity =
  jobIds.length > 0
    ? await fetchByJobIds(
        "job_activity",
        "job_id,new_status,created_at",
        jobIds,
      )
    : []

const jobsWithApplication =
  new Set(
    applications.map(
      (row) => row.job_id,
    ),
  )

const assignedEver = new Set()
const startedEver = new Set()
const completedEver = new Set()

for (const row of activity) {
  if (row.new_status === "assigned") {
    assignedEver.add(row.job_id)
  }

  if (
    row.new_status === "in_progress"
  ) {
    startedEver.add(row.job_id)
  }

  if (row.new_status === "done") {
    completedEver.add(row.job_id)
  }
}

for (const job of jobs) {
  if (job.assigned_to) {
    assignedEver.add(job.id)
  }

  if (
    job.status === "in_progress" ||
    job.status === "done"
  ) {
    startedEver.add(job.id)
  }

  if (job.status === "done") {
    completedEver.add(job.id)
  }
}

const groups = new Map()

function getGroup(job) {
  const source =
    job.acquisition_source ||
    "unattributed"

  const medium =
    job.acquisition_medium ||
    "unknown"

  return `${source} / ${medium}`
}

for (const job of jobs) {
  const key = getGroup(job)

  if (!groups.has(key)) {
    groups.set(key, {
      source: key,
      published: 0,
      application: 0,
      assigned: 0,
      started: 0,
      completed: 0,
    })
  }

  const group = groups.get(key)

  group.published += 1

  if (
    jobsWithApplication.has(job.id)
  ) {
    group.application += 1
  }

  if (assignedEver.has(job.id)) {
    group.assigned += 1
  }

  if (startedEver.has(job.id)) {
    group.started += 1
  }

  if (completedEver.has(job.id)) {
    group.completed += 1
  }
}

const rows =
  Array.from(groups.values())
    .sort(
      (a, b) =>
        b.published - a.published,
    )
    .map((group) => ({
      Source: group.source,
      Published: group.published,
      "Got application":
        group.application,
      "Application %":
        percentage(
          group.application,
          group.published,
        ),
      Assigned: group.assigned,
      "Assigned %":
        percentage(
          group.assigned,
          group.published,
        ),
      Started: group.started,
      Completed: group.completed,
      "Completed %":
        percentage(
          group.completed,
          group.published,
        ),
    }))

const total = {
  published: jobs.length,
  application:
    jobs.filter((job) =>
      jobsWithApplication.has(job.id),
    ).length,
  assigned:
    jobs.filter((job) =>
      assignedEver.has(job.id),
    ).length,
  started:
    jobs.filter((job) =>
      startedEver.has(job.id),
    ).length,
  completed:
    jobs.filter((job) =>
      completedEver.has(job.id),
    ).length,
}

console.log("")
console.log(
  `Clean Jobs acquisition funnel — last ${days} days`,
)
console.log(
  `Since: ${since}`,
)
console.log("")

if (rows.length > 0) {
  console.table(rows)
} else {
  console.log("No jobs in this period.")
}

console.log("")
console.log("TOTAL FUNNEL")
console.log(
  `Published jobs:       ${total.published}`,
)
console.log(
  `Got application:      ${total.application} (${percentage(total.application, total.published)})`,
)
console.log(
  `Worker selected:      ${total.assigned} (${percentage(total.assigned, total.published)})`,
)
console.log(
  `Job started:          ${total.started} (${percentage(total.started, total.published)})`,
)
console.log(
  `Job completed:        ${total.completed} (${percentage(total.completed, total.published)})`,
)
