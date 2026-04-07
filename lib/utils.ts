export function formatDate(value: string | null) {
  if (!value) return "-"
  return value
}

export function getStatusLabel(status: string | null) {
  switch (status) {
    case "new":
      return "Нове"
    case "assigned":
      return "Призначено"
    case "in_progress":
      return "В роботі"
    case "done":
      return "Завершено"
    case "cancelled":
      return "Скасовано"
    default:
      return status || "Невідомо"
  }
}

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ")
}

