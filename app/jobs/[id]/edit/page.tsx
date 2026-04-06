import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"
import FormSubmitButton from "@/components/form-submit-button"


export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

type JobRow = {
  id: string
  title: string | null
  description: string | null
  city: string | null
  address: string | null
  budget: number | null
  job_type: string | null
  property_type: string | null
  scheduled_date: string | null
  scheduled_time: string | null
  created_by: string | null
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value || "").trim()
}

function parseBudget(value: string) {
  if (!value) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const dictionary = getDictionary(locale)

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/jobs/${id}/edit`)
  }

  const { data: jobData, error: jobError } = await supabase
    .from("jobs")
    .select(
      "id, title, description, city, address, budget, job_type, property_type, scheduled_date, scheduled_time, created_by",
    )
    .eq("id", id)
    .single()

  const job = jobData as JobRow | null

  if (jobError || !job) {
    notFound()
  }

  if (job.created_by !== user.id) {
    redirect(`/jobs/${id}`)
  }

  async function updateJobAction(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect(`/login?next=/jobs/${id}/edit`)
    }

    const { data: currentJob } = await supabase
      .from("jobs")
      .select("id, created_by")
      .eq("id", id)
      .single()

    if (!currentJob || currentJob.created_by !== user.id) {
      redirect(`/jobs/${id}`)
    }

    await supabase
      .from("jobs")
      .update({
        title: normalizeText(formData.get("title")),
        description: normalizeText(formData.get("description")) || null,
        city: normalizeText(formData.get("city")) || null,
        address: normalizeText(formData.get("address")) || null,
        budget: parseBudget(normalizeText(formData.get("budget"))),
        job_type: normalizeText(formData.get("job_type")) || null,
        property_type: normalizeText(formData.get("property_type")) || null,
        scheduled_date: normalizeText(formData.get("scheduled_date")) || null,
        scheduled_time: normalizeText(formData.get("scheduled_time")) || null,
      })
      .eq("id", id)

    redirect(`/jobs/${id}`)
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/jobs/${id}`}
          className="text-sm text-black/60 transition hover:text-black"
        >
          {dictionary.jobForm.backToJob}
        </Link>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-semibold text-black">
          {dictionary.jobForm.editTitle}
        </h1>
        <p className="mt-2 text-sm text-black/60">
          {dictionary.jobForm.editSubtitle}
        </p>

        <form action={updateJobAction} className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.titleLabel}
            </label>
            <input
              name="title"
              required
              defaultValue={job.title || ""}
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              placeholder={dictionary.jobForm.titlePlaceholder}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.descriptionLabel}
            </label>
            <textarea
              name="description"
              rows={5}
              defaultValue={job.description || ""}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/30"
              placeholder={dictionary.jobForm.descriptionPlaceholder}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.cityLabel}
            </label>
            <input
              name="city"
              defaultValue={job.city || ""}
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              placeholder={dictionary.jobForm.cityPlaceholder}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.addressLabel}
            </label>
            <input
              name="address"
              defaultValue={job.address || ""}
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              placeholder={dictionary.jobForm.addressPlaceholder}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.budgetLabel}
            </label>
            <input
              name="budget"
              type="number"
              min="0"
              step="1"
              defaultValue={job.budget ?? ""}
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              placeholder={dictionary.jobForm.budgetPlaceholder}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.jobTypeLabel}
            </label>
            <select
              name="job_type"
              defaultValue={job.job_type || ""}
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
            >
              <option value="">{dictionary.jobForm.selectOption}</option>
              <option value="home_cleaning">{dictionary.jobForm.homeCleaning}</option>
              <option value="office_cleaning">{dictionary.jobForm.officeCleaning}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.propertyTypeLabel}
            </label>
            <select
              name="property_type"
              defaultValue={job.property_type || ""}
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
            >
              <option value="">{dictionary.jobForm.selectOption}</option>
              <option value="apartment">{dictionary.jobForm.apartment}</option>
              <option value="house">{dictionary.jobForm.house}</option>
              <option value="office">{dictionary.jobForm.office}</option>
              <option value="other">{dictionary.jobForm.other}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.scheduledDateLabel}
            </label>
            <input
              name="scheduled_date"
              type="date"
              defaultValue={job.scheduled_date || ""}
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.scheduledTimeLabel}
            </label>
            <input
              name="scheduled_time"
              type="time"
              defaultValue={job.scheduled_time || ""}
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
            />
          </div>

          <div className="md:col-span-2">
            <FormSubmitButton
              locale={locale}
              idleLabel={dictionary.jobForm.updateButton}
              loadingLabel={dictionary.jobForm.saving}
            />
          </div>
        </form>
      </div>
    </main>
  )
}