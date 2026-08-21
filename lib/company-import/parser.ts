import { readSheet } from "read-excel-file/node"

export const MAX_IMPORT_ROWS = 5000
export const MAX_IMPORT_FILE_SIZE_BYTES = 3 * 1024 * 1024

export type ImportFileType = "xlsx" | "csv"

export type ParsedCompanyImportRow = {
  company_name: string
  city: string | null
  organization_number: string | null
  website: string | null
  email: string | null
  phone: string | null
  address: string | null
  postal_code: string | null
  source: string | null
  notes: string | null
  row_number: number
}

type Cell = string | number | boolean | Date | null

const COLUMN_ALIASES: Record<keyof Omit<ParsedCompanyImportRow, "row_number">, string[]> = {
  company_name: [
    "company_name",
    "company name",
    "company",
    "name",
    "företagsnamn",
    "foretagsnamn",
    "företag",
    "foretag",
    "bolagsnamn",
    "назва компанії",
  ],
  city: ["city", "stad", "ort", "kommun", "місто"],
  organization_number: [
    "organization_number",
    "organisation_number",
    "organization number",
    "organisation number",
    "org_number",
    "org number",
    "orgnr",
    "org.nr",
    "organisationsnummer",
    "organisations nr",
  ],
  website: ["website", "web", "url", "homepage", "hemsida", "webbplats", "сайт"],
  email: ["email", "e-mail", "mail", "epost", "e-post"],
  phone: ["phone", "telephone", "telefon", "mobile", "mobil", "телефон"],
  address: ["address", "adress", "street", "street address", "gatuadress"],
  postal_code: ["postal_code", "postal code", "postcode", "zip", "zip code", "postnummer"],
  source: ["source", "källa", "kalla", "джерело"],
  notes: ["notes", "note", "comment", "comments", "anteckningar", "коментар", "нотатки"],
}

function normalizeHeader(value: Cell) {
  return String(value ?? "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
}

function normalizeAlias(value: string) {
  return normalizeHeader(value)
}

function normalizeText(value: Cell) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeNullable(value: Cell) {
  const normalized = normalizeText(value)
  return normalized || null
}

function normalizeEmail(value: Cell) {
  const normalized = normalizeText(value).toLowerCase()
  if (!normalized) return null

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    ? normalized
    : null
}

function normalizeWebsite(value: Cell) {
  const raw = normalizeText(value)
  if (!raw) return null

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`

  try {
    const url = new URL(candidate)
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "")

    if (!hostname.includes(".") || hostname.includes("@")) {
      return null
    }

    return candidate
  } catch {
    return null
  }
}

function findColumn(headers: string[], key: keyof Omit<ParsedCompanyImportRow, "row_number">) {
  const aliases = COLUMN_ALIASES[key].map(normalizeAlias)
  return headers.findIndex((header) => aliases.includes(header))
}

function getCell(row: Cell[], index: number): Cell {
  return index >= 0 ? (row[index] ?? null) : null
}

function detectCsvDelimiter(text: string): "," | ";" {
  const firstRecord = (() => {
    let value = ""
    let quoted = false

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index]

      if (char === '"') {
        if (quoted && text[index + 1] === '"') {
          value += '""'
          index += 1
          continue
        }

        quoted = !quoted
        value += char
        continue
      }

      if (!quoted && (char === "\n" || char === "\r")) {
        break
      }

      value += char
    }

    return value
  })()

  let commas = 0
  let semicolons = 0
  let quoted = false

  for (let index = 0; index < firstRecord.length; index += 1) {
    const char = firstRecord[index]

    if (char === '"') {
      if (quoted && firstRecord[index + 1] === '"') {
        index += 1
        continue
      }

      quoted = !quoted
      continue
    }

    if (quoted) continue
    if (char === ",") commas += 1
    if (char === ";") semicolons += 1
  }

  return semicolons > commas ? ";" : ","
}

function parseCsv(text: string): string[][] {
  const delimiter = detectCsvDelimiter(text)
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]

    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"'
          index += 1
        } else {
          quoted = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      quoted = true
      continue
    }

    if (char === delimiter) {
      row.push(field)
      field = ""
      continue
    }

    if (char === "\n") {
      row.push(field.replace(/\r$/, ""))
      rows.push(row)
      row = []
      field = ""
      continue
    }

    field += char
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""))
    rows.push(row)
  }

  return rows
}

function validateFile(file: File) {
  if (!file.name) throw new Error("The selected file does not have a name.")
  if (file.size <= 0) throw new Error("The selected file is empty.")
  if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
    throw new Error("The import file is too large. Maximum size is 3 MB.")
  }

  const lowerName = file.name.toLowerCase()
  if (lowerName.endsWith(".xlsx")) return "xlsx" as const
  if (lowerName.endsWith(".csv")) return "csv" as const

  throw new Error("Only .xlsx and .csv files are supported.")
}

export async function parseCompanyImportFile(file: File) {
  const fileType = validateFile(file)
  let rows: Cell[][]

  if (fileType === "xlsx") {
    const buffer = Buffer.from(await file.arrayBuffer())
    const sheet = await readSheet(buffer)
    rows = sheet.map((row) => row.map((cell) => cell as Cell))
  } else {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(await file.arrayBuffer())
    rows = parseCsv(text)
  }

  const nonEmptyRows = rows.filter((row) => row.some((cell) => normalizeText(cell).length > 0))
  if (nonEmptyRows.length < 2) {
    throw new Error("The file must contain a header row and at least one company row.")
  }

  const headers = nonEmptyRows[0].map(normalizeHeader)
  const indexes = {
    company_name: findColumn(headers, "company_name"),
    city: findColumn(headers, "city"),
    organization_number: findColumn(headers, "organization_number"),
    website: findColumn(headers, "website"),
    email: findColumn(headers, "email"),
    phone: findColumn(headers, "phone"),
    address: findColumn(headers, "address"),
    postal_code: findColumn(headers, "postal_code"),
    source: findColumn(headers, "source"),
    notes: findColumn(headers, "notes"),
  }

  if (indexes.company_name < 0) {
    throw new Error("Missing required column: company_name (or Företagsnamn).")
  }

  const sourceRows = nonEmptyRows.slice(1)
  if (sourceRows.length > MAX_IMPORT_ROWS) {
    throw new Error(`The file contains ${sourceRows.length} rows. Import at most ${MAX_IMPORT_ROWS} companies per batch.`)
  }

  const parsedRows: ParsedCompanyImportRow[] = sourceRows.map((row, index) => ({
    company_name: normalizeText(getCell(row, indexes.company_name)),
    city: normalizeNullable(getCell(row, indexes.city)),
    organization_number: normalizeNullable(getCell(row, indexes.organization_number)),
    website: normalizeWebsite(getCell(row, indexes.website)),
    email: normalizeEmail(getCell(row, indexes.email)),
    phone: normalizeNullable(getCell(row, indexes.phone)),
    address: normalizeNullable(getCell(row, indexes.address)),
    postal_code: normalizeNullable(getCell(row, indexes.postal_code)),
    source: normalizeNullable(getCell(row, indexes.source)),
    notes: normalizeNullable(getCell(row, indexes.notes)),
    row_number: index + 2,
  }))

  return {
    fileType,
    rows: parsedRows,
    totalRows: parsedRows.length,
  }
}
