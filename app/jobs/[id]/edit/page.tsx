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
import JobCityField from "@/components/job-city-field"
import { Input, Select, Textarea } from "@/components/ui/field"

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

function resolveCity(formData: FormData) {
  const selectedCity = normalizeText(formData.get("city_select"))
  const customCity = normalizeText(formData.get("city_other"))

  if (selectedCity === "other") {
    return customCity || null
  }

  return selectedCity || customCity || null
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
        city: resolveCity(formData),
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
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <div className="mb-6">
        <Link
          href={`/jobs/${id}`}
          prefetch={false}
          className="rounded-md text-sm text-black/60 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
        >
          {dictionary.jobForm.backToJob}
        </Link>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black">
          {dictionary.jobForm.editTitle}
        </h1>

        <p className="mt-2 text-sm leading-6 text-black/60">
          {dictionary.jobForm.editSubtitle}
        </p>

        <form action={updateJobAction} className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              id="title"
              name="title"
              required
              defaultValue={job.title || ""}
              label={dictionary.jobForm.titleLabel}
              placeholder={dictionary.jobForm.titlePlaceholder}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={job.description || ""}
              label={dictionary.jobForm.descriptionLabel}
              placeholder={dictionary.jobForm.descriptionPlaceholder}
            />
          </div>

          <JobCityField
            label={dictionary.jobForm.cityLabel}
            placeholder={dictionary.jobForm.cityPlaceholder}
            otherLabel={dictionary.jobForm.other}
            selectOptionLabel={dictionary.jobForm.selectOption}
            initialCity={job.city}
          />

          <Input
            id="address"
            name="address"
            defaultValue={job.address || ""}
            label={dictionary.jobForm.addressLabel}
            placeholder={dictionary.jobForm.addressPlaceholder}
          />

          <Input
            id="budget"
            name="budget"
            type="number"
            min="0"
            step="1"
            defaultValue={job.budget ?? ""}
            label={dictionary.jobForm.budgetLabel}
            placeholder={dictionary.jobForm.budgetPlaceholder}
          />

          <Select
            id="job_type"
            name="job_type"
            defaultValue={job.job_type || ""}
            label={dictionary.jobForm.jobTypeLabel}
          >
            <option value="">{dictionary.jobForm.selectOption}</option>
            <option value="home_cleaning">{dictionary.jobForm.homeCleaning}</option>
            <option value="office_cleaning">{dictionary.jobForm.officeCleaning}</option>
          </Select>

          <Select
            id="property_type"
            name="property_type"
            defaultValue={job.property_type || ""}
            label={dictionary.jobForm.propertyTypeLabel}
          >
            <option value="">{dictionary.jobForm.selectOption}</option>
            <option value="apartment">{dictionary.jobForm.apartment}</option>
            <option value="house">{dictionary.jobForm.house}</option>
            <option value="office">{dictionary.jobForm.office}</option>
            <option value="other">{dictionary.jobForm.other}</option>
          </Select>

          <Input
            id="scheduled_date"
            name="scheduled_date"
            type="date"
            defaultValue={job.scheduled_date || ""}
            label={dictionary.jobForm.scheduledDateLabel}
          />

          <Input
            id="scheduled_time"
            name="scheduled_time"
            type="time"
            defaultValue={job.scheduled_time || ""}
            label={dictionary.jobForm.scheduledTimeLabel}
          />

          <div className="md:col-span-2 pt-1">
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