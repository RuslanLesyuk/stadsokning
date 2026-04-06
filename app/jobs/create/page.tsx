import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"
import FormSubmitButton from "@/components/form-submit-button"

export const dynamic = "force-dynamic"

function normalizeText(value: FormDataEntryValue | null) {
  return String(value || "").trim()
}

function parseBudget(value: string) {
  if (!value) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export default async function CreateJobPage() {
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
    redirect("/login?next=/jobs/create")
  }

  async function createJobAction(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login?next=/jobs/create")
    }

    const payload = {
      title: normalizeText(formData.get("title")),
      description: normalizeText(formData.get("description")) || null,
      city: normalizeText(formData.get("city")) || null,
      address: normalizeText(formData.get("address")) || null,
      budget: parseBudget(normalizeText(formData.get("budget"))),
      job_type: normalizeText(formData.get("job_type")) || null,
      property_type: normalizeText(formData.get("property_type")) || null,
      scheduled_date: normalizeText(formData.get("scheduled_date")) || null,
      scheduled_time: normalizeText(formData.get("scheduled_time")) || null,
      created_by: user.id,
      status: "new",
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert(payload)
      .select("id")
      .single()

    if (error || !data) {
      redirect("/jobs/create")
    }

    redirect(`/jobs/${data.id}`)
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-black/60 transition hover:text-black"
        >
          {dictionary.jobForm.backToDashboard}
        </Link>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-semibold text-black">
          {dictionary.jobForm.createTitle}
        </h1>
        <p className="mt-2 text-sm text-black/60">
          {dictionary.jobForm.createSubtitle}
        </p>

        <form action={createJobAction} className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black">
              {dictionary.jobForm.titleLabel}
            </label>
            <input
              name="title"
              required
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
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              defaultValue=""
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
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              defaultValue=""
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
              className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
            />
          </div>

          <div className="md:col-span-2">
            <FormSubmitButton
              locale={locale}
              idleLabel={dictionary.jobForm.createButton}
              loadingLabel={dictionary.jobForm.saving}
            />
          </div>
        </form>
      </div>
    </main>
  )
}