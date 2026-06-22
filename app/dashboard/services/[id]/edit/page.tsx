import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import FormSubmitButton from "@/components/form-submit-button"
import { Input, Select, Textarea } from "@/components/ui/field"
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
          ← Back to my services
        </Link>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black">
          Edit service profile
        </h1>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Update your public cleaning service profile.
        </p>

        <form
  action={updateServiceProfile}
  encType="multipart/form-data"
  className="mt-8 grid gap-5 md:grid-cols-2"
>
          <input type="hidden" name="service_id" value={service.id} />
          <div className="md:col-span-2">
  <label className="mb-2 block text-sm font-medium text-black">
    Company logo
  </label>

  {service.logo_url ? (
    <div className="mb-4">
      <img
        src={service.logo_url}
        alt={service.company_name}
        className="h-20 w-20 rounded-2xl border border-black/10 object-cover"
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
              label="Company or service name"
              defaultValue={service.company_name || ""}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              id="description"
              name="description"
              rows={5}
              label="Description"
              defaultValue={service.description || ""}
            />
          </div>

          <Input
            id="city"
            name="city"
            required
            label="Main city"
            defaultValue={service.city || "Stockholm"}
          />

          <Input
            id="phone"
            name="phone"
            label="Phone"
            defaultValue={service.phone || ""}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            defaultValue={service.email || ""}
          />

          <Input
            id="website"
            name="website"
            type="url"
            label="Website"
            defaultValue={service.website || ""}
          />

          <Input
            id="hourly_rate"
            name="hourly_rate"
            type="number"
            min="0"
            step="1"
            label="Price from SEK/hour"
            defaultValue={service.hourly_rate?.toString() || ""}
          />

          <Input
            id="minimum_order"
            name="minimum_order"
            type="number"
            min="0"
            step="1"
            label="Minimum order hours"
            defaultValue={service.minimum_order?.toString() || ""}
          />

          <Select
            id="rut_available"
            name="rut_available"
            label="RUT available"
            defaultValue={service.rut_available ? "yes" : "no"}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>

          <Input
            id="languages"
            name="languages"
            label="Languages"
            defaultValue={joinList(service.languages)}
          />

          <div className="md:col-span-2">
            <Input
              id="service_types"
              name="service_types"
              label="Service types"
              defaultValue={joinList(service.service_types)}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              id="service_areas"
              name="service_areas"
              label="Service areas"
              defaultValue={joinList(service.service_areas)}
            />
          </div>

          <div className="md:col-span-2 pt-1">
            <FormSubmitButton
              locale="en"
              idleLabel="Save changes"
              loadingLabel="Saving..."
            />
          </div>
        </form>
      </div>
    </main>
  )
}