import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import FormSubmitButton from "@/components/form-submit-button"
import { Input, Select, Textarea } from "@/components/ui/field"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"
import { updateServiceProfile } from "../../actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

function joinList(value: string[] | null) {
  return value?.join(", ") || ""
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const dictionary = getDictionary(locale)
  const t = dictionary.services

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/dashboard/services/${id}/edit`)
  }

  const { data: service } = await supabase
    .from("service_profiles")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!service) {
    redirect("/dashboard/services")
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <div className="mb-6">
        <Link
          href="/dashboard/services"
          prefetch={false}
          className="rounded-md text-sm text-black/60 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
        >
          ← {t.myServicesTitle}
        </Link>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black">
          {t.editServiceTitle}
        </h1>

        <p className="mt-2 text-sm leading-6 text-black/60">
          {t.editServiceSubtitle}
        </p>

        <form
          action={updateServiceProfile}
          encType="multipart/form-data"
          className="mt-8 grid gap-5 md:grid-cols-2"
        >
          <input type="hidden" name="service_id" value={service.id} />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black">
              {t.companyName}
            </label>

            {service.logo_url ? (
              <div className="mb-4">
                <img
                  src={service.logo_url}
                  alt={service.company_name}
                  className="h-20 w-20 rounded-2xl border border-black/10 object-contain p-2"
                />
              </div>
            ) : null}

            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              className="block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
            />

            <p className="mt-2 text-xs text-black/50">
              JPG, PNG or WEBP. Maximum 5MB.
            </p>
          </div>

          <div className="md:col-span-2">
            <Input
              id="company_name"
              name="company_name"
              required
              label={t.companyName}
              defaultValue={service.company_name || ""}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              id="description"
              name="description"
              rows={5}
              label={t.description}
              defaultValue={service.description || ""}
            />
          </div>

          <Input
            id="city"
            name="city"
            required
            label={t.city}
            defaultValue={service.city || "Stockholm"}
          />

          <Input
            id="phone"
            name="phone"
            label={t.phone}
            defaultValue={service.phone || ""}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label={t.email}
            defaultValue={service.email || ""}
          />

          <Input
            id="website"
            name="website"
            type="url"
            label={t.website}
            defaultValue={service.website || ""}
          />

          <Input
            id="hourly_rate"
            name="hourly_rate"
            type="number"
            min="0"
            step="1"
            label={t.hourlyRate}
            defaultValue={service.hourly_rate?.toString() || ""}
          />

          <Input
            id="minimum_order"
            name="minimum_order"
            type="number"
            min="0"
            step="1"
            label={t.minimumOrder}
            defaultValue={service.minimum_order?.toString() || ""}
          />

          <Select
            id="rut_available"
            name="rut_available"
            label={t.rutAvailable}
            defaultValue={service.rut_available ? "yes" : "no"}
          >
            <option value="yes">{t.yes}</option>
            <option value="no">{t.no}</option>
          </Select>

          <Input
            id="languages"
            name="languages"
            label={t.languages}
            defaultValue={joinList(service.languages)}
          />

          <div className="md:col-span-2">
            <Input
              id="service_types"
              name="service_types"
              label={t.serviceTypes}
              defaultValue={joinList(service.service_types)}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              id="service_areas"
              name="service_areas"
              label={t.serviceAreas}
              defaultValue={joinList(service.service_areas)}
            />
          </div>

          <div className="md:col-span-2 pt-1">
            <FormSubmitButton
              locale={locale}
              idleLabel={t.saveChanges}
              loadingLabel={t.saving}
            />
          </div>
        </form>
      </div>
    </main>
  )
}