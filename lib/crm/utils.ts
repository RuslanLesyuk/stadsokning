
import {
  CRM_CUSTOMER_STAGES,
  type CrmCustomerStage,
} from "./types"

export function normalizeCrmCustomerStage(value: unknown): CrmCustomerStage {
  return CRM_CUSTOMER_STAGES.includes(value as CrmCustomerStage)
    ? (value as CrmCustomerStage)
    : "prospect"
}

export function normalizeCrmTags(values: string[]) {
  const seen = new Set<string>()
  const result: string[] = []

  for (const raw of values) {
    const tag = raw
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 40)

    if (!tag) continue

    const key = tag.toLocaleLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    result.push(tag)

    if (result.length >= 20) break
  }

  return result
}

export function parseCrmTags(value: string) {
  return normalizeCrmTags(value.split(","))
}

export function numberValue(
  value: number | string | null | undefined,
) {
  if (value === null || value === undefined || value === "") return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatCrmMoney(
  value: number | string | null | undefined,
  currency = "SEK",
) {
  const parsed = numberValue(value)
  if (parsed <= 0) return "—"

  return `${Math.round(parsed).toLocaleString("sv-SE")} ${currency}`
}
