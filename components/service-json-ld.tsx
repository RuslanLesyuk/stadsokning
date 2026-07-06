type ServiceJsonLdProps = {
  name: string
  description: string
  url: string
  areaServed?: string
  serviceType?: string
}

const siteUrl = "https://cleansjob.com"

export default function ServiceJsonLd({
  name,
  description,
  url,
  areaServed = "Sweden",
  serviceType = "Cleaning services",
}: ServiceJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    serviceType,
    url,
    provider: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Clean Jobs",
      url: siteUrl,
    },
    areaServed: {
      "@type": "Place",
      name: areaServed,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  )
}