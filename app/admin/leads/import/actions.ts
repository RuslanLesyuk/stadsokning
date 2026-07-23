"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { readSheet } from "read-excel-file/node"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

const MAX_IMPORT_ROWS = 500
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

type ImportedLead = {
  company_name: string
  city: string | null
  email: string | null
  phone: string | null
  website: string | null
  source: string
  notes: string | null
  status: "new"
  registered: false
  invite_count: 0
}

type ExcelCell = string | number | boolean | Date | null

const REQUIRED_COLUMN = "company_name"

const COLUMN_ALIASES: Record<string, string[]> = {
  company_name: [
    "company_name",
    "company name",
    "company",
    "företagsnamn",
    "foretagsnamn",
    "name",
    "назва компанії",
  ],
  city: [
    "city",
    "stad",
    "ort",
    "місто",
  ],
  email: [
    "email",
    "e-mail",
    "mail",
    "epost",
    "e-post",
  ],
  phone: [
    "phone",
    "telephone",
    "telefon",
    "mobile",
    "mobil",
    "телефон",
  ],
  website: [
    "website",
    "web",
    "url",
    "homepage",
    "hemsida",
    "сайт",
  ],
  source: [
    "source",
    "källa",
    "kalla",
    "джерело",
  ],
  notes: [
    "notes",
    "note",
    "comment",
    "comments",
    "anteckningar",
    "коментар",
    "нотатки",
  ],
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(
      `/login?next=${encodeURIComponent("/admin/leads/import")}`,
    )
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return createAdminClient()
}

function redirectWithError(message: string): never {
  redirect(
    `/admin/leads/import?error=${encodeURIComponent(message)}`,
  )
}

function normalizeHeader(value: ExcelCell) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("-", "_")
    .replace(/\s+/g, " ")
}

function normalizeText(value: ExcelCell) {
  return String(value ?? "").trim()
}

function normalizeEmail(value: ExcelCell) {
  return normalizeText(value).toLowerCase()
}

function normalizeWebsite(value: ExcelCell) {
  const website = normalizeText(value)

  if (!website) {
    return ""
  }

  if (
    website.startsWith("http://") ||
    website.startsWith("https://")
  ) {
    return website
  }

  return `https://${website}`
}

function normalizeNullable(value: string) {
  return value || null
}

function isValidEmail(email: string) {
  if (!email) {
    return true
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getColumnIndex(
  normalizedHeaders: string[],
  columnName: keyof typeof COLUMN_ALIASES,
) {
  const aliases = COLUMN_ALIASES[columnName].map((alias) =>
    normalizeHeader(alias),
  )

  return normalizedHeaders.findIndex((header) =>
    aliases.includes(header),
  )
}

function getCell(
  row: ExcelCell[],
  index: number,
): ExcelCell {
  if (index < 0) {
    return null
  }

  return row[index] ?? null
}

function getDomainFromWebsite(website: string) {
  if (!website) {
    return ""
  }

  try {
    return new URL(website).hostname
      .toLowerCase()
      .replace(/^www\./, "")
  } catch {
    return ""
  }
}

function createImportSource() {
  const date = new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())

  return `excel_import_${date}`
}

export async function importCompanyLeadsAction(
  formData: FormData,
) {
  const admin = await requireAdmin()

  const uploadedFile = formData.get("file")

  if (!(uploadedFile instanceof File)) {
    redirectWithError("Select an Excel file.")
  }

  if (!uploadedFile.name.toLowerCase().endsWith(".xlsx")) {
    redirectWithError("Only .xlsx files are supported.")
  }

  if (uploadedFile.size === 0) {
    redirectWithError("The selected file is empty.")
  }

  if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
    redirectWithError(
      "The Excel file is too large. Maximum size is 5 MB.",
    )
  }

  let rows: ExcelCell[][]

try {
  const arrayBuffer = await uploadedFile.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const sheet = await readSheet(buffer)

  rows = sheet.map((row) =>
    row.map((cell) => cell as ExcelCell),
  )
} catch (error) {
  console.error("Excel parsing error:", error)

  redirectWithError(
    "Could not read the Excel file. Check that it is a valid .xlsx file.",
  )
}

  const headerRow = rows[0]
  const normalizedHeaders = headerRow.map(normalizeHeader)

  const companyNameIndex = getColumnIndex(
    normalizedHeaders,
    "company_name",
  )
  const cityIndex = getColumnIndex(
    normalizedHeaders,
    "city",
  )
  const emailIndex = getColumnIndex(
    normalizedHeaders,
    "email",
  )
  const phoneIndex = getColumnIndex(
    normalizedHeaders,
    "phone",
  )
  const websiteIndex = getColumnIndex(
    normalizedHeaders,
    "website",
  )
  const sourceIndex = getColumnIndex(
    normalizedHeaders,
    "source",
  )
  const notesIndex = getColumnIndex(
    normalizedHeaders,
    "notes",
  )

  if (companyNameIndex < 0) {
    redirectWithError(
      `Missing required column: ${REQUIRED_COLUMN}`,
    )
  }

  const sourceFallback = createImportSource()

  const dataRows = rows
    .slice(1)
    .filter((row) =>
      row.some((cell) => normalizeText(cell).length > 0),
    )
    .slice(0, MAX_IMPORT_ROWS)

  if (!dataRows.length) {
    redirectWithError(
      "The Excel file does not contain any company rows.",
    )
  }

  const preparedLeads: ImportedLead[] = []

  let invalidCount = 0
  let duplicateInFileCount = 0

  const seenEmails = new Set<string>()
  const seenWebsites = new Set<string>()
  const seenCompanyKeys = new Set<string>()

  for (const row of dataRows) {
    const companyName = normalizeText(
      getCell(row, companyNameIndex),
    )
    const city = normalizeText(
      getCell(row, cityIndex),
    )
    const email = normalizeEmail(
      getCell(row, emailIndex),
    )
    const phone = normalizeText(
      getCell(row, phoneIndex),
    )
    const website = normalizeWebsite(
      getCell(row, websiteIndex),
    )
    const source =
      normalizeText(getCell(row, sourceIndex)) ||
      sourceFallback
    const notes = normalizeText(
      getCell(row, notesIndex),
    )

    if (!companyName) {
      invalidCount += 1
      continue
    }

    if (!email && !phone && !website) {
      invalidCount += 1
      continue
    }

    if (!isValidEmail(email)) {
      invalidCount += 1
      continue
    }

    const websiteDomain = getDomainFromWebsite(website)

    const companyKey = [
      companyName.toLowerCase(),
      city.toLowerCase(),
    ].join("|")

    const isDuplicateInFile =
      Boolean(email && seenEmails.has(email)) ||
      Boolean(
        websiteDomain &&
          seenWebsites.has(websiteDomain),
      ) ||
      seenCompanyKeys.has(companyKey)

    if (isDuplicateInFile) {
      duplicateInFileCount += 1
      continue
    }

    if (email) {
      seenEmails.add(email)
    }

    if (websiteDomain) {
      seenWebsites.add(websiteDomain)
    }

    seenCompanyKeys.add(companyKey)

    preparedLeads.push({
      company_name: companyName,
      city: normalizeNullable(city),
      email: normalizeNullable(email),
      phone: normalizeNullable(phone),
      website: normalizeNullable(website),
      source,
      notes: normalizeNullable(notes),
      status: "new",
      registered: false,
      invite_count: 0,
    })
  }

  if (!preparedLeads.length) {
    redirectWithError(
      "No valid companies were found in the Excel file.",
    )
  }

  const emails = preparedLeads
    .map((lead) => lead.email)
    .filter((email): email is string => Boolean(email))

  const websites = preparedLeads
    .map((lead) => lead.website)
    .filter((website): website is string =>
      Boolean(website),
    )

  const existingEmailSet = new Set<string>()
  const existingWebsiteSet = new Set<string>()

  if (emails.length > 0) {
    const { data: existingByEmail, error } = await admin
      .from("company_leads")
      .select("email")
      .in("email", emails)

    if (error) {
      console.error(
        "Existing lead email check error:",
        error.message,
      )

      redirectWithError(
        "Could not check existing company emails.",
      )
    }

    for (const lead of existingByEmail ?? []) {
      if (lead.email) {
        existingEmailSet.add(
          String(lead.email).toLowerCase(),
        )
      }
    }
  }

  if (websites.length > 0) {
    const { data: existingByWebsite, error } = await admin
      .from("company_leads")
      .select("website")
      .in("website", websites)

    if (error) {
      console.error(
        "Existing lead website check error:",
        error.message,
      )

      redirectWithError(
        "Could not check existing company websites.",
      )
    }

    for (const lead of existingByWebsite ?? []) {
      if (lead.website) {
        existingWebsiteSet.add(
          getDomainFromWebsite(String(lead.website)),
        )
      }
    }
  }

  let duplicateDatabaseCount = 0

  const leadsToInsert = preparedLeads.filter((lead) => {
    const emailExists =
      Boolean(lead.email) &&
      existingEmailSet.has(lead.email)

    const websiteDomain = lead.website
      ? getDomainFromWebsite(lead.website)
      : ""

    const websiteExists =
      Boolean(websiteDomain) &&
      existingWebsiteSet.has(websiteDomain)

    if (emailExists || websiteExists) {
      duplicateDatabaseCount += 1
      return false
    }

    return true
  })

  if (!leadsToInsert.length) {
    const skippedCount =
      invalidCount +
      duplicateInFileCount +
      duplicateDatabaseCount

    const resultParams = new URLSearchParams({
      success: "import-completed",
      created: "0",
      skipped: String(skippedCount),
      failed: "0",
    })

    redirect(
      `/admin/leads/import?${resultParams.toString()}`,
    )
  }

  let createdCount = 0
  let failedCount = 0

  const batchSize = 100

  for (
    let index = 0;
    index < leadsToInsert.length;
    index += batchSize
  ) {
    const batch = leadsToInsert.slice(
      index,
      index + batchSize,
    )

    const { data: insertedRows, error } = await admin
      .from("company_leads")
      .insert(batch)
      .select("id")

    if (error) {
      console.error(
        "Company leads import batch error:",
        error.message,
      )

      failedCount += batch.length
      continue
    }

    createdCount += insertedRows?.length ?? batch.length
  }

  const skippedCount =
    invalidCount +
    duplicateInFileCount +
    duplicateDatabaseCount

  revalidatePath("/admin")
  revalidatePath("/admin/leads")
  revalidatePath("/admin/leads/import")

  const resultParams = new URLSearchParams({
    success: "import-completed",
    created: String(createdCount),
    skipped: String(skippedCount),
    failed: String(failedCount),
  })

  redirect(
    `/admin/leads/import?${resultParams.toString()}`,
  )
}