import type { SeoLandingPage, SeoServiceType } from "@/lib/seo-landing-pages"
import type { SeoMarketplaceSnapshot } from "@/lib/seo/marketplace"

const PHASE_3B_CITY_SLUGS = new Set([
  "stockholm",
  "goteborg",
  "malmo",
  "uppsala",
  "vasteras",
])

const PHASE_3B_SERVICE_TYPES = new Set<SeoServiceType>([
  "hemstadning",
  "flyttstadning",
  "kontorsstadning",
  "fonsterputs",
])

type QualitySection = {
  title: string
  paragraphs: string[]
  checklist?: string[]
}

type QualityFaq = {
  question: string
  answer: string
}

export type SwedishSeoQualityContent = {
  eyebrow: string
  title: string
  intro: string
  catalogueTitle: string
  catalogueText: string
  sections: QualitySection[]
  faq: QualityFaq[]
}

function getCitySlug(page: SeoLandingPage) {
  return page.slug.split("-").at(-1) || ""
}

function serviceName(serviceType: SeoServiceType) {
  switch (serviceType) {
    case "hemstadning":
      return "hemstädning"
    case "flyttstadning":
      return "flyttstädning"
    case "kontorsstadning":
      return "kontorsstädning"
    case "fonsterputs":
      return "fönsterputs"
    default:
      return "städning"
  }
}

function buildCatalogueText({
  page,
  marketplace,
}: {
  page: SeoLandingPage
  marketplace: SeoMarketplaceSnapshot
}) {
  const service = marketplace.serviceLabel?.toLowerCase() || serviceName(page.serviceType)

  if (marketplace.serviceMatchCount === 0) {
    return `Clean Jobs har ${marketplace.totalCityCompanies} publicerade företagsprofiler i ${page.city}, men ingen profil har just nu ${service} registrerad som tjänst. Det betyder inte att tjänsten saknas i området, bara att den inte är registrerad i de publicerade profilerna ännu.`
  }

  const parts = [
    `${marketplace.serviceMatchCount} av ${marketplace.totalCityCompanies} publicerade företagsprofiler i ${page.city} har ${service} registrerad som tjänst.`,
    `${marketplace.contactCount} av dessa profiler har kontaktuppgifter registrerade.`,
  ]

  if (marketplace.rutCount > 0) {
    parts.push(
      `${marketplace.rutCount} profiler innehåller även RUT-information.`,
    )
  }

  if (marketplace.verifiedCount > 0) {
    parts.push(
      `${marketplace.verifiedCount} profiler är markerade som verifierade på Clean Jobs.`,
    )
  }

  return parts.join(" ")
}

function getServiceSections(
  page: SeoLandingPage,
): QualitySection[] {
  const city = page.city

  switch (page.serviceType) {
    case "hemstadning":
      return [
        {
          title: `Vad kan hemstädning i ${city} omfatta?`,
          paragraphs: [
            "Hemstädning kan omfatta återkommande rengöring av bostadens vanligaste ytor, till exempel dammsugning, golvrengöring, dammtorkning samt rengöring av kök och badrum. Exakt omfattning varierar mellan företag och bör därför bekräftas före bokning.",
            "Kontrollera också om städmaterial och utrustning ingår, om samma upplägg gäller vid varje tillfälle och hur företaget hanterar tilläggstjänster.",
          ],
        },
        {
          title: "Så jämför du hemstädningsföretag",
          paragraphs: [
            "Jämför företagen utifrån vad som faktiskt står i profilen och komplettera med frågor innan du beställer. Ett tydligt upplägg gör offerter lättare att jämföra.",
          ],
          checklist: [
            "Vilka moment ingår i den vanliga städningen?",
            "Hur ofta ska städningen utföras?",
            "Ingår material och utrustning?",
            "Hur fungerar nycklar, portkod eller annan tillgång till bostaden?",
            "Finns RUT-information registrerad och vad behöver bekräftas med företaget?",
          ],
        },
        {
          title: "Vad påverkar offerten?",
          paragraphs: [
            "Offerten kan påverkas av bostadens storlek, städfrekvens, vilka moment som ska ingå och om extra arbete behövs. Därför är det bättre att jämföra samma omfattning mellan flera företag än att utgå från ett enda prisfält.",
            "Clean Jobs fyller inte i saknade priser. Om pris inte visas i profilen behöver du be företaget om en aktuell offert.",
          ],
        },
      ]

    case "flyttstadning":
      return [
        {
          title: `Vad bör ingå i flyttstädning i ${city}?`,
          paragraphs: [
            "Flyttstädning är normalt mer omfattande än vanlig hemstädning och kan beröra många ytor som ska lämnas rena inför överlämning. Exakt checklista varierar mellan företag och fastigheter.",
            "Be därför företaget specificera hur kök, vitvaror, badrum, skåp, golv, lister och fönster hanteras samt om eventuella förråd eller andra utrymmen ingår.",
          ],
        },
        {
          title: "Kontrollera detta före flyttdagen",
          paragraphs: [
            "En tydlig överenskommelse minskar risken för missförstånd när bostaden ska lämnas över.",
          ],
          checklist: [
            "Vilken städchecklista använder företaget?",
            "Ingår fönsterputs och rengöring av vitvaror?",
            "Finns villkor för kompletterande städning om något behöver rättas till?",
            "När måste bostaden vara tömd och tillgänglig?",
            "Hur hanteras nycklar och tid för överlämning?",
          ],
        },
        {
          title: "Jämför offerter på samma underlag",
          paragraphs: [
            "Priset kan påverkas av bostadens storlek, skick, antal fönster, extra utrymmen och hur nära flyttdatumet arbetet ska göras. Skicka därför samma information till företagen du jämför.",
            "Om en profil saknar pris visar Clean Jobs inget uppskattat belopp. Begär en aktuell offert direkt från företaget.",
          ],
        },
      ]

    case "kontorsstadning":
      return [
        {
          title: `Planera kontorsstädning i ${city}`, 
          paragraphs: [
            "Kontorsstädning behöver anpassas efter lokalens användning, storlek och vilka utrymmen som ska prioriteras. Vanliga delar kan vara arbetsytor, golv, kök, toaletter och gemensamma ytor, men innehållet varierar mellan avtal.",
            "Beskriv därför lokalen och önskad frekvens så konkret som möjligt när du ber om offert.",
          ],
        },
        {
          title: "Frågor att ta med i jämförelsen",
          paragraphs: [
            "För företag är det ofta lika viktigt att arbetet fungerar praktiskt som att själva städningen är tydligt definierad.",
          ],
          checklist: [
            "Vilka ytor och moment ingår?",
            "Hur ofta ska städningen utföras?",
            "Kan arbetet utföras före eller efter ordinarie arbetstid?",
            "Hur hanteras larm, nycklar och tillträde?",
            "Ingår förbrukningsmaterial eller beställs det separat?",
          ],
        },
        {
          title: "Vad påverkar kostnaden?",
          paragraphs: [
            "Kostnaden kan påverkas av lokalens storlek, städfrekvens, arbetstid, vilka hygien- eller specialytor som ingår och om uppdraget kräver extra moment. Ett skriftligt tjänsteinnehåll gör olika offerter mer jämförbara.",
            "Clean Jobs visar endast pris när ett företag faktiskt har registrerat ett pris i sin profil.",
          ],
        },
      ]

    case "fonsterputs":
      return [
        {
          title: `Vad ska du ange när du söker fönsterputs i ${city}?`,
          paragraphs: [
            "För fönsterputs är det bra att beskriva antal fönster, typ av fönster och om putsning ska göras på in- och utsida. Tillgänglighet kan också påverka hur arbetet behöver planeras.",
            "Fråga dessutom om karmar, bågar eller fönsterbleck ingår om de är viktiga för beställningen.",
          ],
        },
        {
          title: "Jämför mer än bara priset",
          paragraphs: [
            "Två offerter kan avse olika omfattning. Kontrollera därför att företagen räknar på samma antal fönster och samma moment.",
          ],
          checklist: [
            "Gäller offerten både in- och utsida?",
            "Hur räknas kopplade eller delade fönster?",
            "Är alla fönster enkelt åtkomliga?",
            "Ingår karmar, bågar eller andra detaljer?",
            "Vad händer om väder eller åtkomst gör att arbetet behöver flyttas?",
          ],
        },
        {
          title: "Vad kan påverka offerten?",
          paragraphs: [
            "Antal och typ av fönster, åtkomlighet, arbetshöjd och vilka delar som ska rengöras kan påverka offerten. Ge företaget så tydliga uppgifter som möjligt innan priset fastställs.",
            "Om inget pris finns registrerat i företagsprofilen skapar Clean Jobs inte ett uppskattat pris.",
          ],
        },
      ]

    default:
      return []
  }
}

function getFaq(page: SeoLandingPage): QualityFaq[] {
  const city = page.city
  const service = serviceName(page.serviceType)

  return [
    {
      question: `Vad bör jag kontrollera innan jag bokar ${service} i ${city}?`,
      answer:
        "Kontrollera vad som ingår i tjänsten, hur tillgång till bostaden eller lokalen hanteras, vilka villkor som gäller och vilka kontaktuppgifter som finns. Be företaget bekräfta sådant som inte framgår av profilen.",
    },
    {
      question: `Hur jämför jag offerter för ${service}?`,
      answer:
        "Ge företagen samma information om uppdraget och jämför sedan omfattning, villkor och pris på samma underlag. Ett lägre pris behöver inte avse samma moment som en annan offert.",
    },
    {
      question: "Vad betyder RUT-informationen på Clean Jobs?",
      answer:
        "RUT visas när företagsprofilen innehåller information om RUT. Clean Jobs avgör inte om ett enskilt arbete ger rätt till avdrag, så aktuella villkor och din beställning behöver alltid bekräftas med företaget och vid behov mot Skatteverkets regler.",
    },
  ]
}

export function createSwedishSeoQualityContent({
  page,
  marketplace,
}: {
  page: SeoLandingPage
  marketplace: SeoMarketplaceSnapshot
}): SwedishSeoQualityContent | null {
  const citySlug = getCitySlug(page)

  if (
    !PHASE_3B_CITY_SLUGS.has(citySlug) ||
    !PHASE_3B_SERVICE_TYPES.has(page.serviceType)
  ) {
    return null
  }

  const service = serviceName(page.serviceType)

  return {
    eyebrow: "Guide för att jämföra städföretag",
    title: `Så jämför du ${service} i ${page.city}`,
    intro: `Använd företagsprofilerna som utgångspunkt och kontrollera sedan omfattning, villkor och offert direkt med företaget. Guiden nedan fokuserar på sådant som går att jämföra utan att Clean Jobs behöver anta priser eller tjänsteinnehåll som saknas i profilen.`,
    catalogueTitle: `Aktuellt underlag på Clean Jobs för ${page.city}`,
    catalogueText: buildCatalogueText({ page, marketplace }),
    sections: getServiceSections(page),
    faq: getFaq(page),
  }
}
