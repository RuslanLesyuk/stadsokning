import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import FormSubmitButton from "@/components/form-submit-button"

export const dynamic = "force-dynamic"

type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  city: string | null
  avatar_url: string | null
  company_logo_url: string | null
  company_name: string | null
  bio: string | null
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const profile = data as Profile | null

  async function updateProfile(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const avatar = formData.get("avatar") as File
    const logo = formData.get("logo") as File

    let avatar_url = profile?.avatar_url || null
    let company_logo_url = profile?.company_logo_url || null

    if (avatar && avatar.size > 0) {
      const path = `${user.id}/avatar-${Date.now()}`
      await supabase.storage.from("avatars").upload(path, avatar, { upsert: true })
      avatar_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl
    }

    if (logo && logo.size > 0) {
      const path = `${user.id}/logo-${Date.now()}`
      await supabase.storage.from("avatars").upload(path, logo, { upsert: true })
      company_logo_url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl
    }

    await supabase.from("profiles").update({
      full_name: String(formData.get("full_name") || ""),
      phone: String(formData.get("phone") || ""),
      city: String(formData.get("city") || ""),
      company_name: String(formData.get("company_name") || ""),
      bio: String(formData.get("bio") || ""),
      avatar_url,
      company_logo_url,
    }).eq("id", user.id)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Profile</h1>

      <form action={updateProfile} className="space-y-6">

        {/* AVATAR + LOGO */}
        <div className="flex gap-6 items-center">
          <div>
            <p className="text-sm mb-2 text-slate-500">Avatar</p>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-slate-200" />
            )}
            <input type="file" name="avatar" className="mt-2 text-sm" />
          </div>

          <div>
            <p className="text-sm mb-2 text-slate-500">Company logo</p>
            {profile?.company_logo_url ? (
              <img src={profile.company_logo_url} className="h-16 w-16 rounded-xl object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-xl bg-slate-200" />
            )}
            <input type="file" name="logo" className="mt-2 text-sm" />
          </div>
        </div>

        {/* FIELDS */}
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="full_name"
            defaultValue={profile?.full_name || ""}
            placeholder="Full name"
            className="input"
          />

          <input
            value={user.email || ""}
            disabled
            className="input bg-slate-100"
          />

          <input
            name="phone"
            defaultValue={profile?.phone || ""}
            placeholder="Phone"
            className="input"
          />

          <input
            name="city"
            defaultValue={profile?.city || ""}
            placeholder="City"
            className="input"
          />

          <input
            name="company_name"
            defaultValue={profile?.company_name || ""}
            placeholder="Company name"
            className="input md:col-span-2"
          />

          <textarea
            name="bio"
            defaultValue={profile?.bio || ""}
            placeholder="About you"
            className="input md:col-span-2"
          />
        </div>

        <FormSubmitButton
          locale={locale}
          idleLabel="Save changes"
          loadingLabel="Saving..."
        />

      </form>
    </div>
  )
}