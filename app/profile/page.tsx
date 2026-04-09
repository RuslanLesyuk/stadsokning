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

type SearchParams = Promise<Record<string, string | string[] | undefined>>

type Copy = {
  title: string
  subtitle: string
  account_title: string
  branding_title: string
  stats_title: string
  full_name: string
  email: string
  phone: string
  city: string
  company_name: string
  bio: string
  avatar: string
  company_logo: string
  upload_hint: string
  logo_hint: string
  email_hint: string
  bio_placeholder: string
  company_placeholder: string
  no_phone: string
  no_city: string
  no_name: string
  no_company: string
  no_bio: string
  rating: string
  reviews: string
  save: string
  saving: string
  saved: string
  save_failed: string
  avatar_empty: string
  logo_empty: string
}

const copy: Record<Locale, Copy> = {
  uk: {
    title: "Профіль",
    subtitle: "Керуйте особистими даними, брендингом та тим, як ваш профіль бачать інші.",
    account_title: "Дані акаунта",
    branding_title: "Аватар і брендинг",
    stats_title: "Статистика",
    full_name: "Ім’я",
    email: "Email",
    phone: "Телефон",
    city: "Місто",
    company_name: "Назва компанії",
    bio: "Про вас",
    avatar: "Фото профілю",
    company_logo: "Логотип компанії",
    upload_hint: "PNG, JPG або WEBP. Найкраще квадратне фото.",
    logo_hint: "Невеликий logo mark для профілю та брендингу.",
    email_hint: "Email береться з акаунта і тут не редагується.",
    bio_placeholder: "Коротко розкажіть про себе, досвід або тип послуг, які ви надаєте.",
    company_placeholder: "Наприклад: Clean Pro Stockholm",
    no_phone: "Не вказано",
    no_city: "Не вказано",
    no_name: "Користувач",
    no_company: "Без компанії",
    no_bio: "Поки що без опису.",
    rating: "Рейтинг",
    reviews: "Відгуки",
    save: "Зберегти зміни",
    saving: "Збереження...",
    saved: "Профіль оновлено",
    save_failed: "Не вдалося оновити профіль",
    avatar_empty: "Аватар ще не додано",
    logo_empty: "Логотип ще не додано",
  },
  ru: {
    title: "Профиль",
    subtitle: "Управляйте личными данными, брендингом и тем, как ваш профиль видят другие.",
    account_title: "Данные аккаунта",
    branding_title: "Аватар и брендинг",
    stats_title: "Статистика",
    full_name: "Имя",
    email: "Email",
    phone: "Телефон",
    city: "Город",
    company_name: "Название компании",
    bio: "О вас",
    avatar: "Фото профиля",
    company_logo: "Логотип компании",
    upload_hint: "PNG, JPG или WEBP. Лучше всего квадратное фото.",
    logo_hint: "Небольшой logo mark для профиля и брендинга.",
    email_hint: "Email берётся из аккаунта и здесь не редактируется.",
    bio_placeholder: "Коротко расскажите о себе, опыте или типе услуг, которые вы предоставляете.",
    company_placeholder: "Например: Clean Pro Stockholm",
    no_phone: "Не указано",
    no_city: "Не указано",
    no_name: "Пользователь",
    no_company: "Без компании",
    no_bio: "Пока без описания.",
    rating: "Рейтинг",
    reviews: "Отзывы",
    save: "Сохранить изменения",
    saving: "Сохранение...",
    saved: "Профиль обновлён",
    save_failed: "Не удалось обновить профиль",
    avatar_empty: "Аватар ещё не добавлен",
    logo_empty: "Логотип ещё не добавлен",
  },
  en: {
    title: "Profile",
    subtitle: "Manage your personal details, branding, and how your profile appears to others.",
    account_title: "Account details",
    branding_title: "Avatar and branding",
    stats_title: "Stats",
    full_name: "Name",
    email: "Email",
    phone: "Phone",
    city: "City",
    company_name: "Company name",
    bio: "About you",
    avatar: "Profile photo",
    company_logo: "Company logo",
    upload_hint: "PNG, JPG, or WEBP. A square image works best.",
    logo_hint: "A small logo mark for your profile and branding.",
    email_hint: "Your email comes from your account and cannot be edited here.",
    bio_placeholder: "Briefly describe yourself, your experience, or the services you provide.",
    company_placeholder: "For example: Clean Pro Stockholm",
    no_phone: "Not specified",
    no_city: "Not specified",
    no_name: "User",
    no_company: "No company",
    no_bio: "No description yet.",
    rating: "Rating",
    reviews: "Reviews",
    save: "Save changes",
    saving: "Saving...",
    saved: "Profile updated",
    save_failed: "Failed to update profile",
    avatar_empty: "No avatar yet",
    logo_empty: "No logo yet",
  },
  sv: {
    title: "Profil",
    subtitle: "Hantera dina personuppgifter, ditt varumärke och hur din profil visas för andra.",
    account_title: "Kontouppgifter",
    branding_title: "Avatar och varumärke",
    stats_title: "Statistik",
    full_name: "Namn",
    email: "E-post",
    phone: "Telefon",
    city: "Stad",
    company_name: "Företagsnamn",
    bio: "Om dig",
    avatar: "Profilbild",
    company_logo: "Företagslogotyp",
    upload_hint: "PNG, JPG eller WEBP. En kvadratisk bild fungerar bäst.",
    logo_hint: "En liten logotyp för din profil och ditt varumärke.",
    email_hint: "Din e-post kommer från kontot och kan inte redigeras här.",
    bio_placeholder: "Berätta kort om dig själv, din erfarenhet eller vilka tjänster du erbjuder.",
    company_placeholder: "Till exempel: Clean Pro Stockholm",
    no_phone: "Inte angivet",
    no_city: "Inte angivet",
    no_name: "Användare",
    no_company: "Inget företag",
    no_bio: "Ingen beskrivning ännu.",
    rating: "Betyg",
    reviews: "Recensioner",
    save: "Spara ändringar",
    saving: "Sparar...",
    saved: "Profilen har uppdaterats",
    save_failed: "Det gick inte att uppdatera profilen",
    avatar_empty: "Ingen avatar ännu",
    logo_empty: "Ingen logotyp ännu",
  },
  pl: {
    title: "Profil",
    subtitle: "Zarządzaj swoimi danymi, brandingiem i tym, jak Twój profil widzą inni.",
    account_title: "Dane konta",
    branding_title: "Avatar i branding",
    stats_title: "Statystyki",
    full_name: "Imię",
    email: "Email",
    phone: "Telefon",
    city: "Miasto",
    company_name: "Nazwa firmy",
    bio: "O Tobie",
    avatar: "Zdjęcie profilu",
    company_logo: "Logo firmy",
    upload_hint: "PNG, JPG lub WEBP. Najlepiej sprawdza się kwadratowe zdjęcie.",
    logo_hint: "Mały znak logo do profilu i brandingu.",
    email_hint: "Email pochodzi z konta i nie można go tutaj edytować.",
    bio_placeholder: "Krótko opisz siebie, swoje doświadczenie lub rodzaj usług, które oferujesz.",
    company_placeholder: "Na przykład: Clean Pro Stockholm",
    no_phone: "Nie podano",
    no_city: "Nie podano",
    no_name: "Użytkownik",
    no_company: "Bez firmy",
    no_bio: "Brak opisu.",
    rating: "Ocena",
    reviews: "Opinie",
    save: "Zapisz zmiany",
    saving: "Zapisywanie...",
    saved: "Profil został zaktualizowany",
    save_failed: "Nie udało się zaktualizować profilu",
    avatar_empty: "Brak avatara",
    logo_empty: "Brak logo",
  },
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("")
  return initials || "U"
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value || "").trim()
}

function getFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase()
  if (fromName) return fromName

  if (file.type === "image/png") return "png"
  if (file.type === "image/webp") return "webp"
  if (file.type === "image/jpeg") return "jpg"

  return "bin"
}

function isValidImageFile(file: File) {
  if (!file || file.size === 0) return false
  return ["image/png", "image/jpeg", "image/webp"].includes(file.type)
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] md:p-6">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 md:text-sm">
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        {value}
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-medium text-slate-900">
      {children}
    </label>
  )
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 active:scale-[0.995] disabled:cursor-not-allowed disabled:bg-slate-100"
    />
  )
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full min-h-[120px] resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 active:scale-[0.995]"
    />
  )
}

function UploadCard({
  title,
  hint,
  emptyLabel,
  imageUrl,
  inputName,
  roundedClassName,
}: {
  title: string
  hint: string
  emptyLabel: string
  imageUrl: string | null
  inputName: string
  roundedClassName: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden bg-slate-100 ${roundedClassName}`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="px-3 text-center text-xs font-medium text-slate-500">
              {emptyLabel}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">{hint}</p>

          <input
            type="file"
            name={inputName}
            accept="image/png,image/jpeg,image/webp"
            className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-2xl file:border-0 file:bg-rose-600 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-rose-700"
          />
        </div>
      </div>
    </div>
  )
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en

  const params = (await searchParams) ?? {}
  const saved = params.saved === "1"
  const failed = params.error === "1"

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("id, full_name, phone, city, avatar_url, company_logo_url, company_name, bio")
    .eq("id", user.id)
    .single()

  const profile = profileRaw as Profile | null

  async function updateProfileAction(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("avatar_url, company_logo_url")
      .eq("id", user.id)
      .single()

    let avatarUrl = currentProfile?.avatar_url || null
    let companyLogoUrl = currentProfile?.company_logo_url || null

    const avatarFile = formData.get("avatar")
    if (avatarFile instanceof File && avatarFile.size > 0) {
      if (!isValidImageFile(avatarFile)) {
        redirect("/profile?error=1")
      }

      const extension = getFileExtension(avatarFile)
      const path = `${user.id}/avatar-${Date.now()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, {
          upsert: true,
          contentType: avatarFile.type,
        })

      if (uploadError) {
        redirect("/profile?error=1")
      }

      avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl
    }

    const logoFile = formData.get("company_logo")
    if (logoFile instanceof File && logoFile.size > 0) {
      if (!isValidImageFile(logoFile)) {
        redirect("/profile?error=1")
      }

      const extension = getFileExtension(logoFile)
      const path = `${user.id}/company-logo-${Date.now()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, logoFile, {
          upsert: true,
          contentType: logoFile.type,
        })

      if (uploadError) {
        redirect("/profile?error=1")
      }

      companyLogoUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl
    }

    const payload = {
      id: user.id,
      full_name: normalizeText(formData.get("full_name")) || null,
      phone: normalizeText(formData.get("phone")) || null,
      city: normalizeText(formData.get("city")) || null,
      company_name: normalizeText(formData.get("company_name")) || null,
      bio: normalizeText(formData.get("bio")) || null,
      avatar_url: avatarUrl,
      company_logo_url: companyLogoUrl,
    }

    const { error } = await supabase.from("profiles").upsert(payload, {
      onConflict: "id",
    })

    if (error) {
      redirect("/profile?error=1")
    }

    redirect("/profile?saved=1")
  }

  const { data: reviewsRaw } = await supabase
    .from("reviews")
    .select("rating")
    .eq("review_target_id", user.id)

  const ratings = (reviewsRaw ?? []) as Array<{ rating: number }>
  const reviewsCount = ratings.length
  const averageRating =
    reviewsCount > 0
      ? (ratings.reduce((sum, item) => sum + item.rating, 0) / reviewsCount).toFixed(1)
      : "0.0"

  const displayName = profile?.full_name?.trim() || user.email || t.no_name
  const companyName = profile?.company_name?.trim() || t.no_company
  const bio = profile?.bio?.trim() || t.no_bio

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <section className="rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-rose-50/40 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-2xl font-semibold text-white md:h-24 md:w-24 md:text-3xl">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(displayName)
                )}
              </div>

              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-500">{t.title}</div>

                <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {displayName}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                    {companyName}
                  </span>
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                    {profile?.city?.trim() || t.no_city}
                  </span>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {profile?.company_logo_url ? (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm md:h-24 md:w-24">
                <img
                  src={profile.company_logo_url}
                  alt={companyName}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>

          {saved ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {t.saved}
            </div>
          ) : null}

          {failed ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {t.save_failed}
            </div>
          ) : null}

          <div className="mt-6">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
              {t.stats_title}
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <StatCard label={t.rating} value={averageRating} />
              <StatCard label={t.reviews} value={String(reviewsCount)} />
            </div>
          </div>
        </section>

        <form action={updateProfileAction} className="mt-6 space-y-6 md:mt-8">
          <section className="grid gap-4 lg:grid-cols-2">
            <UploadCard
              title={t.avatar}
              hint={t.upload_hint}
              emptyLabel={t.avatar_empty}
              imageUrl={profile?.avatar_url || null}
              inputName="avatar"
              roundedClassName="h-20 w-20 rounded-full md:h-24 md:w-24"
            />

            <UploadCard
              title={t.company_logo}
              hint={t.logo_hint}
              emptyLabel={t.logo_empty}
              imageUrl={profile?.company_logo_url || null}
              inputName="company_logo"
              roundedClassName="h-20 w-20 rounded-[24px] md:h-24 md:w-24"
            />
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              {t.account_title}
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>{t.full_name}</FieldLabel>
                <TextInput
                  name="full_name"
                  defaultValue={profile?.full_name || ""}
                  placeholder={t.full_name}
                />
              </div>

              <div>
                <FieldLabel>{t.email}</FieldLabel>
                <TextInput
                  value={user.email || ""}
                  disabled
                  readOnly
                />
                <p className="mt-2 text-xs text-slate-500">{t.email_hint}</p>
              </div>

              <div>
                <FieldLabel>{t.phone}</FieldLabel>
                <TextInput
                  name="phone"
                  defaultValue={profile?.phone || ""}
                  placeholder={t.phone}
                />
              </div>

              <div>
                <FieldLabel>{t.city}</FieldLabel>
                <TextInput
                  name="city"
                  defaultValue={profile?.city || ""}
                  placeholder={t.city}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel>{t.company_name}</FieldLabel>
                <TextInput
                  name="company_name"
                  defaultValue={profile?.company_name || ""}
                  placeholder={t.company_placeholder}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel>{t.bio}</FieldLabel>
                <TextArea
                  name="bio"
                  rows={5}
                  defaultValue={profile?.bio || ""}
                  placeholder={t.bio_placeholder}
                />
              </div>
            </div>

            <div className="mt-6">
              <FormSubmitButton
                locale={locale}
                idleLabel={t.save}
                loadingLabel={t.saving}
              />
            </div>
          </section>
        </form>

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:mt-8 md:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            {locale === "uk"
              ? "Як профіль виглядає"
              : locale === "ru"
                ? "Как выглядит профиль"
                : locale === "sv"
                  ? "Så här ser profilen ut"
                  : locale === "pl"
                    ? "Jak wygląda profil"
                    : "Profile preview"}
          </h2>

          <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 md:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-lg font-semibold text-white">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(displayName)
                  )}
                </div>

                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold tracking-tight text-slate-900">
                    {displayName}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {companyName}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {profile?.city?.trim() || t.no_city}
                  </div>
                </div>
              </div>

              {profile?.company_logo_url ? (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={profile.company_logo_url}
                    alt={companyName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-5 text-sm leading-7 text-slate-700">
              {bio}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}