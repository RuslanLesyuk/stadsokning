import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import FormSubmitButton from "@/components/form-submit-button"
import { Input, Select, Textarea } from "@/components/ui/field"

export const dynamic = "force-dynamic"

function normalizeText(value: FormDataEntryValue | null) {
  return String(value || "").trim()
}

function parseInteger(value: string) {
  if (!value) return null
  const number = Number(value)
  return Number.isFinite(number) ? Math.round(number) : null
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default async function CreateServicePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/services/create")
  }

  async function createServiceAction(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login?next=/services/create")
    }

    const companyName = normalizeText(formData.get("company_name"))
    const city = normalizeText(formData.get("city")) || "Stockholm"
    const baseSlug = slugify(`${companyName}-${city}`)

    const payload = {
      user_id: user.id,
      company_name: companyName,
      slug: baseSlug,
      description: normalizeText(formData.get("description")) || null,
      city,
      phone: normalizeText(formData.get("phone")) || null,
      email: normalizeText(formData.get("email")) || null,
      website: normalizeText(formData.get("website")) || null,
      hourly_rate: parseInteger(normalizeText(formData.get("hourly_rate"))),
      minimum_order: parseInteger(normalizeText(formData.get("minimum_order"))),
      rut_available: normalizeText(formData.get("rut_available")) === "yes",
      languages: parseList(normalizeText(formData.get("languages"))),
      service_types: parseList(normalizeText(formData.get("service_types"))),
      service_areas: parseList(normalizeText(formData.get("service_areas"))),
      verified: false,
    }

    const { data, error } = await supabase
      .from("service_profiles")
      .insert(payload)
      .select("slug")
      .single()

    if (error || !data) {
      redirect("/services/create")
    }

    redirect(`/services/${data.slug}`)
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-10">
      <div className="mb-6">
        <Link
          href="/services"
          prefetch={false}
          className="rounded-md text-sm text-black/60 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2"
        >
          ← Back to services
        </Link>
      </div>

      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-black">
          Add your cleaning service
        </h1>

        <p className="mt-2 text-sm leading-6 text-black/60">
          Create a public service profile for your cleaning company or private
          cleaning service.
        </p>

        <form
          action={createServiceAction}
          className="mt-8 grid gap-5 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <Input
              id="company_name"
              name="company_name"
              required
              label="Company or service name"
              placeholder="Example: Stockholm Clean Service"
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              id="description"
              name="description"
              rows={5}
              label="Description"
              placeholder="Describe your cleaning services, experience and what areas you work in."
            />
          </div>

          <Input
            id="city"
            name="city"
            required
            label="Main city"
            placeholder="Stockholm"
            defaultValue="Stockholm"
          />

          <Input
            id="phone"
            name="phone"
            label="Phone"
            placeholder="+46 ..."
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="company@email.com"
          />

          <Input
            id="website"
            name="website"
            type="url"
            label="Website"
            placeholder="https://example.com"
          />

          <Input
            id="hourly_rate"
            name="hourly_rate"
            type="number"
            min="0"
            step="1"
            label="Price from SEK/hour"
            placeholder="295"
          />

          <Input
            id="minimum_order"
            name="minimum_order"
            type="number"
            min="0"
            step="1"
            label="Minimum order hours"
            placeholder="2"
          />

          <Select
            id="rut_available"
            name="rut_available"
            label="RUT available"
            defaultValue="yes"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>

          <Input
            id="languages"
            name="languages"
            label="Languages"
            placeholder="Svenska, English, Polski, Українська"
          />

          <div className="md:col-span-2">
            <Input
              id="service_types"
              name="service_types"
              label="Service types"
              placeholder="Hemstädning, Flyttstädning, Kontorsstädning, Fönsterputs"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              id="service_areas"
              name="service_areas"
              label="Service areas"
              placeholder="Stockholm, Solna, Täby, Järfälla, Nacka"
            />
          </div>

          <div className="md:col-span-2 pt-1">
            <FormSubmitButton
              locale="en"
              idleLabel="Create service profile"
              loadingLabel="Creating..."
            />
          </div>
        </form>
      </div>
    </main>
  )
}