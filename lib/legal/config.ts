export type LegalOperator = {
  serviceName: string
  legalName: string
  organizationNumber: string | null
  postalAddress: string | null
  country: string
  supportEmail: string
  privacyEmail: string
  configured: boolean
}

function value(name: string) {
  const result = process.env[name]?.trim()
  return result || null
}

export function getLegalOperator(): LegalOperator {
  const legalName = value("NEXT_PUBLIC_LEGAL_ENTITY_NAME")
  const organizationNumber = value("NEXT_PUBLIC_LEGAL_ORG_NUMBER")
  const postalAddress = value("NEXT_PUBLIC_LEGAL_POSTAL_ADDRESS")
  const supportEmail = value("NEXT_PUBLIC_SUPPORT_EMAIL") || "support@cleansjob.com"
  const privacyEmail = value("NEXT_PUBLIC_PRIVACY_EMAIL") || supportEmail

  return {
    serviceName: "Clean Jobs",
    legalName: legalName || "Clean Jobs",
    organizationNumber,
    postalAddress,
    country: "Sweden",
    supportEmail,
    privacyEmail,
    configured: Boolean(legalName && organizationNumber && postalAddress),
  }
}

export function formatLegalOperator(operator: LegalOperator) {
  return [
    operator.legalName,
    operator.organizationNumber ? `Org.nr ${operator.organizationNumber}` : null,
    operator.postalAddress,
    operator.country,
    operator.privacyEmail,
  ]
    .filter(Boolean)
    .join(" · ")
}
