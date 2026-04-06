import { getUiDictionary } from "@/lib/ui-i18n"

export type ActionMessageKey =
  | "unauthorized"
  | "forbidden"
  | "notFound"
  | "generic"
  | "required"
  | "invalidEmail"
  | "invalidPassword"
  | "invalidBudget"
  | "tooFast"
  | "duplicate"
  | "messageEmpty"
  | "messageTooLong"
  | "failedToSendMessage"
  | "failedToSaveProfile"
  | "failedToCreateJob"
  | "failedToUpdateJob"
  | "saved"
  | "created"
  | "updated"
  | "deleted"
  | "sent"

export function getActionMessage(locale: string | undefined, key: ActionMessageKey) {
  const dictionary = getUiDictionary(locale)

  if (key in dictionary.errors) {
    return dictionary.errors[key as keyof typeof dictionary.errors]
  }

  return dictionary.feedback[key as keyof typeof dictionary.feedback] || dictionary.errors.generic
}

export function inferActionMessageKey(raw: string): ActionMessageKey {
  const normalized = raw.toLowerCase().trim()

  if (
    normalized.includes("log in") ||
    normalized.includes("login") ||
    normalized.includes("unauthorized")
  ) {
    return "unauthorized"
  }

  if (
    normalized.includes("forbidden") ||
    normalized.includes("no access")
  ) {
    return "forbidden"
  }

  if (
    normalized.includes("not found") ||
    normalized.includes("job not found")
  ) {
    return "notFound"
  }

  if (
    normalized.includes("empty")
  ) {
    return "messageEmpty"
  }

  if (
    normalized.includes("too long")
  ) {
    return "messageTooLong"
  }

  if (
    normalized.includes("too fast")
  ) {
    return "tooFast"
  }

  if (
    normalized.includes("duplicate")
  ) {
    return "duplicate"
  }

  if (
    normalized.includes("budget")
  ) {
    return "invalidBudget"
  }

  if (
    normalized.includes("save profile")
  ) {
    return "failedToSaveProfile"
  }

  if (
    normalized.includes("create job")
  ) {
    return "failedToCreateJob"
  }

  if (
    normalized.includes("update job")
  ) {
    return "failedToUpdateJob"
  }

  if (
    normalized.includes("send message")
  ) {
    return "failedToSendMessage"
  }

  return "generic"
}