import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import ToastListener from "@/components/toast-listener"
import DeleteJobForm from "@/components/delete-job-form"
import DuplicateJobForm from "@/components/duplicate-job-form"
import JobStatusBadge from "@/components/job-status-badge"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  const { data: myJobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <ToastListener />

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Вітаю{profile?.full_name ? `, ${profile.full_name}` : ""}.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/jobs/create" className="rounded-xl bg-black px-5 py-3 text-white">
            + Створити замовлення
          </Link>
          <Link href="/profile" className="rounded-xl border px-5 py-3">
            Профіль
          </Link>
        </div>
      </div>

      {!myJobs?.length ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          У вас ще немає замовлень
        </div>
      ) : (
        <div className="grid gap-4">
          {myJobs.map((job) => (
            <div key={job.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <Link href={`/jobs/${job.id}`} className="text-xl font-semibold hover:underline">
                      {job.title}
                    </Link>
                    <JobStatusBadge status={job.status} />
                  </div>

                  <p className="text-gray-700">{job.description || "Без опису"}</p>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                    <span>{job.city || "-"}</span>
                    <span>{job.job_type || "-"}</span>
                    <span>{job.budget ? `${job.budget} kr` : "-"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/jobs/${job.id}`} className="rounded-xl border px-4 py-2">
                    Відкрити
                  </Link>
                  <Link href={`/jobs/${job.id}/edit`} className="rounded-xl border px-4 py-2">
                    Редагувати
                  </Link>
                  <DuplicateJobForm jobId={job.id} />
                  <DeleteJobForm jobId={job.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}