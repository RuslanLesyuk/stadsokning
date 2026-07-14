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

type WorkingHours = {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

type DayKey = keyof WorkingHours

const dayOrder: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

const pageLabels = {
  sv: {
    galleryTitle: "Bildgalleri",
    galleryDescription:
      "Ladda upp bilder som visar företagets arbete. Du kan ha högst 10 bilder.",
    galleryUpload: "Lägg till bilder",
    galleryHelp: "JPG, PNG eller WebP. Högst 5 MB per bild.",
    noGalleryImages: "Inga bilder har laddats upp ännu.",
    workingHoursTitle: "Öppettider",
    workingHoursDescription:
      "Ange tider i formatet 08:00–17:00. Skriv Stängt om företaget inte arbetar den dagen.",
    timePlaceholder: "08:00–17:00",
    monday: "Måndag",
    tuesday: "Tisdag",
    wednesday: "Onsdag",
    thursday: "Torsdag",
    friday: "Fredag",
    saturday: "Lördag",
    sunday: "Söndag",
  },
  en: {
    galleryTitle: "Photo gallery",
    galleryDescription:
      "Upload photos that show the company’s work. You can have up to 10 images.",
    galleryUpload: "Add gallery images",
    galleryHelp: "JPG, PNG or WebP. Maximum 5 MB per image.",
    noGalleryImages: "No gallery images have been uploaded yet.",
    workingHoursTitle: "Working hours",
    workingHoursDescription:
      "Enter hours in the format 08:00–17:00. Enter Closed if the company does not work that day.",
    timePlaceholder: "08:00–17:00",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },
  uk: {
    galleryTitle: "Фотогалерея",
    galleryDescription:
      "Завантажте фотографії робіт компанії. Максимальна кількість — 10 фотографій.",
    galleryUpload: "Додати фотографії",
    galleryHelp: "JPG, PNG або WebP. Максимум 5 МБ на одне зображення.",
    noGalleryImages: "Фотографії ще не завантажені.",
    workingHoursTitle: "Графік роботи",
    workingHoursDescription:
      "Вкажіть години у форматі 08:00–17:00. Напишіть Зачинено, якщо компанія не працює цього дня.",
    timePlaceholder: "08:00–17:00",
    monday: "Понеділок",
    tuesday: "Вівторок",
    wednesday: "Середа",
    thursday: "Четвер",
    friday: "П’ятниця",
    saturday: "Субота",
    sunday: "Неділя",
  },
  ru: {
    galleryTitle: "Фотогалерея",
    galleryDescription:
      "Загрузите фотографии работ компании. Максимальное количество — 10 фотографий.",
    galleryUpload: "Добавить фотографии",
    galleryHelp: "JPG, PNG или WebP. Максимум 5 МБ на одно изображение.",
    noGalleryImages: "Фотографии ещё не загружены.",
    workingHoursTitle: "График работы",
    workingHoursDescription:
      "Укажите часы в формате 08:00–17:00. Напишите Закрыто, если компания не работает в этот день.",
    timePlaceholder: "08:00–17:00",
    monday: "Понедельник",
    tuesday: "Вторник",
    wednesday: "Среда",
    thursday: "Четверг",
    friday: "Пятница",
    saturday: "Суббота",
    sunday: "Воскресенье",
  },
  pl: {
    galleryTitle: "Galeria zdjęć",
    galleryDescription:
      "Prześlij zdjęcia przedstawiające pracę firmy. Możesz dodać maksymalnie 10 zdjęć.",
    galleryUpload: "Dodaj zdjęcia",
    galleryHelp: "JPG, PNG lub WebP. Maksymalnie 5 MB na zdjęcie.",
    noGalleryImages: "Nie przesłano jeszcze żadnych zdjęć.",
    workingHoursTitle: "Godziny pracy",
    workingHoursDescription:
      "Wpisz godziny w formacie 08:00–17:00. Wpisz Zamknięte, jeśli firma nie pracuje tego dnia.",
    timePlaceholder: "08:00–17:00",
    monday: "Poniedziałek",
    tuesday: "Wtorek",
    wednesday: "Środa",
    thursday: "Czwartek",
    friday: "Piątek",
    saturday: "Sobota",
    sunday: "Niedziela",
  },
} as const

function joinList(value: string[] | null) {
  return value?.join(", ") || ""
}

function normalizeGalleryUrls(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  )
}

function normalizeWorkingHours(value: unknown): WorkingHours {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  const record = value as Record<string, unknown>
  const result: WorkingHours = {}

  for (const day of dayOrder) {
    const dayValue = record[day]

    if (typeof dayValue === "string") {
      result[day] = dayValue
    }
  }

  return result
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )

  const dictionary = getDictionary(locale)
  const t = dictionary.services
  const labels = pageLabels[locale]

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

  const galleryUrls = normalizeGalleryUrls(service.gallery_urls)
  const workingHours = normalizeWorkingHours(service.working_hours)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-10">
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

          <section className="md:col-span-2">
            <label
              htmlFor="logo"
              className="mb-2 block text-sm font-medium text-black"
            >
              {t.companyLogo}
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
              className="block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
            />

            <p className="mt-2 text-xs text-black/50">{t.logoHelp}</p>
          </section>

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
              rows={6}
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

          <section className="mt-3 rounded-3xl border border-black/10 bg-black/[0.015] p-5 md:col-span-2 md:p-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-black">
                {labels.galleryTitle}
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">
                {labels.galleryDescription}
              </p>
            </div>

            {galleryUrls.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {galleryUrls.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white"
                  >
                    <img
                      src={url}
                      alt={`${service.company_name} gallery image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-black/15 bg-white p-6 text-center text-sm text-black/50">
                {labels.noGalleryImages}
              </div>
            )}

            <div className="mt-6">
              <label
                htmlFor="gallery"
                className="mb-2 block text-sm font-medium text-black"
              >
                {labels.galleryUpload}
              </label>

              <input
                id="gallery"
                name="gallery"
                type="file"
                accept="image/*"
                multiple
                className="block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
              />

              <p className="mt-2 text-xs text-black/50">
                {labels.galleryHelp}
              </p>
            </div>
          </section>

          <section className="mt-3 rounded-3xl border border-black/10 bg-black/[0.015] p-5 md:col-span-2 md:p-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-black">
                {labels.workingHoursTitle}
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">
                {labels.workingHoursDescription}
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {dayOrder.map((day) => (
                <Input
                  key={day}
                  id={`working_hours_${day}`}
                  name={`working_hours_${day}`}
                  label={labels[day]}
                  placeholder={labels.timePlaceholder}
                  defaultValue={workingHours[day] || ""}
                />
              ))}
            </div>
          </section>

          <div className="md:col-span-2 pt-2">
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