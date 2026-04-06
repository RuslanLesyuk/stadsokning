export function normalizeUserText(input: string) {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export function normalizeForCompare(input: string) {
  return normalizeUserText(input).toLowerCase()
}