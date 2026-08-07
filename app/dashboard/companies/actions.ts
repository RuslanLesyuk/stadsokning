"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

const COMPANY_MEDIA_BUCKET = "company-media"
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_GALLERY_IMAGES = 10
const FAQ_ROWS = 6

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
])

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

type WorkingHours = Record<DayKey, string>

type FaqItem = {
  question: string
  answer: string
}

type CurrentCompany = {
  id: string
  slug: string
  owner_id: string | null
  logo_url: string | null
  cover_url: string | null
  gallery_urls: unknown
}

function cleanText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function cleanRequiredText(value: FormDataEntryValue | null) {
  return cleanText(value) || ""
}

function parseInteger(value: FormDataEntryValue | null) {
  const text = cleanText(value)

  if (!text) return null

  const number = Number(text)
  return Number.isFinite(number) ? Math.round(number) : null
}

function parseList(value: FormDataEntryValue | null) {
  const text = cleanText(value)

  if (!text) return []

  return Array.from(
    new Set(
      text
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  )
}

function getFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File)) return null
  if (value.size <= 0) return null
  return value
}

function getFiles(values: FormDataEntryValue[]) {
  return values.filter(
    (value): value is File => value instanceof File && value.size > 0,
  )
}

function validateImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP and AVIF images are allowed.")
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Each image must be smaller than 5 MB.")
  }
}

function getFileExtension(file: File) {
  const extensionFromName = file.name.split(".").pop()?.toLowerCase()

  if (extensionFromName && /^[a-z0-9]+$/.test(extensionFromName)) {
    return extensionFromName
  }

  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  }

  return extensionByType[file.type] || "jpg"
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return []

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  )
}

function parseWorkingHours(formData: FormData): WorkingHours {
  return {
    monday: cleanRequiredText(formData.get("working_hours_monday")),
    tuesday: cleanRequiredText(formData.get("working_hours_tuesday")),
    wednesday: cleanRequiredText(formData.get("working_hours_wednesday")),
    thursday: cleanRequiredText(formData.get("working_hours_thursday")),
    friday: cleanRequiredText(formData.get("working_hours_friday")),
    saturday: cleanRequiredText(formData.get("working_hours_saturday")),
    sunday: cleanRequiredText(formData.get("working_hours_sunday")),
  }
}

function parseFaq(formData: FormData): FaqItem[] {
  const items: FaqItem[] = []

  for (let index = 0; index < FAQ_ROWS; index += 1) {
    const question = cleanText(formData.get(`faq_question_${index}`))
    const answer = cleanText(formData.get(`faq_answer_${index}`))

    if (question && answer) {
      items.push({ question, answer })
    }
  }

  return items
}

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${COMPANY_MEDIA_BUCKET}/`
  const markerIndex = url.indexOf(marker)

  if (markerIndex < 0) return null

  const encodedPath = url.slice(markerIndex + marker.length)

  try {
    return decodeURIComponent(encodedPath)
  } catch {
    return encodedPath
  }
}

async function removePublicUrls({
  supabase,
  urls,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  urls: Array<string | null | undefined>
}) {
  const paths = Array.from(
    new Set(
      urls
        .filter((url): url is string => Boolean(url))
        .map(getStoragePathFromPublicUrl)
        .filter((path): path is string => Boolean(path)),
    ),
  )

  if (paths.length === 0) return

  const { error } = await supabase.storage
    .from(COMPANY_MEDIA_BUCKET)
    .remove(paths)

  if (error) {
    console.error("Company media cleanup error:", error)
  }
}

async function uploadCompanyImage({
  supabase,
  userId,
  companyId,
  folder,
  file,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  companyId: string
  folder: "logo" | "cover"
  file: File | null
}) {
  if (!file) return null

  validateImage(file)

  const extension = getFileExtension(file)
  const path = `${userId}/${companyId}/${folder}/${folder}-${Date.now()}.${extension}`

  const { error } = await supabase.storage
    .from(COMPANY_MEDIA_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage
    .from(COMPANY_MEDIA_BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}

async function uploadGalleryImages({
  supabase,
  userId,
  companyId,
  files,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  companyId: string
  files: File[]
}) {
  const uploadedUrls: string[] = []

  for (const [index, file] of files.entries()) {
    validateImage(file)

    const extension = getFileExtension(file)
    const path = `${userId}/${companyId}/gallery/gallery-${Date.now()}-${index}.${extension}`

    const { error } = await supabase.storage
      .from(COMPANY_MEDIA_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      await removePublicUrls({ supabase, urls: uploadedUrls })
      throw new Error(error.message)
    }

    const { data } = supabase.storage
      .from(COMPANY_MEDIA_BUCKET)
      .getPublicUrl(path)

    uploadedUrls.push(data.publicUrl)
  }

  return uploadedUrls
}

function getEditPath(companyId: string, status?: "saved" | "error") {
  const basePath = `/dashboard/companies/${companyId}/edit`

  if (!status) return basePath
  return `${basePath}?${status}=true`
}

export async function updateCompanyProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  const companyId = cleanText(formData.get("company_id"))

  if (!companyId) {
    redirect("/dashboard/company-claims")
  }

  const { data: currentCompanyData, error: companyError } = await supabase
    .from("companies")
    .select("id, slug, owner_id, logo_url, cover_url, gallery_urls")
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .maybeSingle()

  const currentCompany = currentCompanyData as CurrentCompany | null

  if (companyError || !currentCompany) {
    console.error("Company owner lookup error:", companyError)
    redirect("/dashboard/company-claims")
  }

  const name = cleanText(formData.get("name"))
  const city = cleanText(formData.get("city"))
  const description = cleanText(formData.get("description"))

  if (!name || !city || !description) {
    redirect(getEditPath(companyId, "error"))
  }

  const hourlyRate = parseInteger(formData.get("hourly_rate"))
  const minimumOrder = parseInteger(formData.get("minimum_order"))
  const foundedYear = parseInteger(formData.get("founded_year"))

  if (
    (hourlyRate !== null && hourlyRate < 0) ||
    (minimumOrder !== null && minimumOrder < 0) ||
    (foundedYear !== null && (foundedYear < 1800 || foundedYear > 2100))
  ) {
    redirect(getEditPath(companyId, "error"))
  }

  const logoFile = getFile(formData.get("logo"))
  const coverFile = getFile(formData.get("cover"))
  const galleryFiles = getFiles(formData.getAll("gallery"))

  const removeLogo = formData.get("remove_logo") === "yes"
  const removeCover = formData.get("remove_cover") === "yes"
  const galleryUrlsToRemove = new Set(
    formData
      .getAll("remove_gallery_url")
      .filter((value): value is string => typeof value === "string"),
  )

  const existingGalleryUrls = normalizeStringArray(currentCompany.gallery_urls)
  const keptGalleryUrls = existingGalleryUrls.filter(
    (url) => !galleryUrlsToRemove.has(url),
  )

  if (keptGalleryUrls.length + galleryFiles.length > MAX_GALLERY_IMAGES) {
    redirect(getEditPath(companyId, "error"))
  }

  let uploadedLogoUrl: string | null = null
  let uploadedCoverUrl: string | null = null
  let uploadedGalleryUrls: string[] = []

  try {
    uploadedLogoUrl = await uploadCompanyImage({
      supabase,
      userId: user.id,
      companyId,
      folder: "logo",
      file: logoFile,
    })

    uploadedCoverUrl = await uploadCompanyImage({
      supabase,
      userId: user.id,
      companyId,
      folder: "cover",
      file: coverFile,
    })

    uploadedGalleryUrls = await uploadGalleryImages({
      supabase,
      userId: user.id,
      companyId,
      files: galleryFiles,
    })
  } catch (error) {
    console.error("Company media upload error:", error)

    await removePublicUrls({
      supabase,
      urls: [uploadedLogoUrl, uploadedCoverUrl, ...uploadedGalleryUrls],
    })

    redirect(getEditPath(companyId, "error"))
  }

  const nextLogoUrl = uploadedLogoUrl
    ? uploadedLogoUrl
    : removeLogo
      ? null
      : currentCompany.logo_url

  const nextCoverUrl = uploadedCoverUrl
    ? uploadedCoverUrl
    : removeCover
      ? null
      : currentCompany.cover_url

  const nextGalleryUrls = [
    ...keptGalleryUrls,
    ...uploadedGalleryUrls,
  ].slice(0, MAX_GALLERY_IMAGES)

  const payload = {
    name,
    description,
    city,
    address: cleanText(formData.get("address")),
    postal_code: cleanText(formData.get("postal_code")),
    organization_number: cleanText(formData.get("organization_number")),
    founded_year: foundedYear,
    phone: cleanText(formData.get("phone")),
    email: cleanText(formData.get("email")),
    website: cleanText(formData.get("website")),
    hourly_rate: hourlyRate,
    minimum_order: minimumOrder,
    rut_available: formData.get("rut_available") === "yes",
    languages: parseList(formData.get("languages")),
    service_types: parseList(formData.get("service_types")),
    service_areas: parseList(formData.get("service_areas")),
    working_hours: parseWorkingHours(formData),
    faq: parseFaq(formData),
    logo_url: nextLogoUrl,
    cover_url: nextCoverUrl,
    gallery_urls: nextGalleryUrls,
  }

  const { data: updatedCompany, error: updateError } = await supabase
    .from("companies")
    .update(payload)
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .select("slug")
    .single()

  if (updateError || !updatedCompany) {
    console.error("Company profile update error:", updateError)

    await removePublicUrls({
      supabase,
      urls: [uploadedLogoUrl, uploadedCoverUrl, ...uploadedGalleryUrls],
    })

    redirect(getEditPath(companyId, "error"))
  }

  const oldUrlsToRemove: string[] = []

  if (uploadedLogoUrl || removeLogo) {
    if (currentCompany.logo_url) oldUrlsToRemove.push(currentCompany.logo_url)
  }

  if (uploadedCoverUrl || removeCover) {
    if (currentCompany.cover_url) oldUrlsToRemove.push(currentCompany.cover_url)
  }

  oldUrlsToRemove.push(
    ...existingGalleryUrls.filter((url) => galleryUrlsToRemove.has(url)),
  )

  await removePublicUrls({ supabase, urls: oldUrlsToRemove })

  revalidatePath("/companies")
  revalidatePath(`/companies/${updatedCompany.slug}`)
  revalidatePath("/dashboard/company-claims")
  revalidatePath(`/dashboard/companies/${companyId}/edit`)

  redirect(getEditPath(companyId, "saved"))
}
