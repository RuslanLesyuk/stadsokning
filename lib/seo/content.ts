
import type { SeoCity, SeoLocale, SeoService } from "./types"
import { getSeoDictionary, replaceSeoVars } from "./dictionary"
import { getSwedishServiceGuide } from "./swedish-content"

type CreateSeoContentParams = {
  locale: SeoLocale
  city: SeoCity
  service: SeoService
}

export type SeoContentSection = {
  eyebrow: string
  title: string
  text: string[]
}

export type SeoContentFaqItem = {
  question: string
  answer: string
}

export type SeoContent = {
  hero: {
    eyebrow: string
    title: string
    text: string
    primaryCta: string
    secondaryCta: string
  }
  sections: SeoContentSection[]
  cta: {
    title: string
    text: string
    primaryCta: string
    secondaryCta: string
  }
  faq: SeoContentFaqItem[]
}

function createSwedishContent({
  city,
  service,
}: {
  city: SeoCity
  service: SeoService
}): SeoContent {
  const serviceName = service.name.sv || service.name.en
  const serviceLower = serviceName.toLowerCase()
  const guide = getSwedishServiceGuide(service.slug)
  const regionText = city.region ? ` i ${city.region}` : ""

  return {
    hero: {
      eyebrow: `${serviceName} i ${city.name}`,
      title: `${serviceName} i ${city.name} – jämför städföretag`,
      text:
        `Letar du efter ${serviceLower} i ${city.name}? Jämför lokala städföretag, se företagsprofiler och hitta kontaktuppgifter på Clean Jobs. ` +
        `Sidan hjälper dig att förstå vad tjänsten brukar omfatta och vad som är bra att kontrollera innan du begär offert.`,
      primaryCta: "Jämför städföretag",
      secondaryCta: "Lägg upp städjobb",
    },

    sections: [
      {
        eyebrow: "Tjänsten",
        title: `Vad innebär ${serviceLower}?`,
        text: [
          guide.scope,
          `Behovet kan skilja sig mellan olika kunder i ${city.name}${regionText}. Beskriv därför yta, önskad tid, frekvens och särskilda moment så tydligt som möjligt.`,
        ],
      },
      {
        eyebrow: "Pris och offert",
        title: `Vad påverkar priset på ${serviceLower} i ${city.name}?`,
        text: [
          guide.price,
          "När du jämför offerter är det bäst att kontrollera samma arbetsomfattning, så att ett lägre pris inte beror på att färre moment ingår.",
        ],
      },
      {
        eyebrow: "Jämför företag",
        title: `Så jämför du städföretag för ${serviceLower}`,
        text: [
          guide.compare,
          "På Clean Jobs kan du gå vidare till företagsprofiler och jämföra information innan du tar kontakt.",
        ],
      },
      {
        eyebrow: "Lokalt",
        title: `${serviceName} i ${city.name} med omnejd`,
        text: [
          guide.local,
          `Om du behöver hjälp utanför centrala ${city.name}, kontrollera företagets serviceområde innan du bokar.`,
        ],
      },
    ],

    cta: {
      title: `Hitta rätt företag för ${serviceLower} i ${city.name}`,
      text:
        `Jämför städföretag i ${city.name}, läs företagsinformation och välj nästa steg utifrån ditt behov.`,
      primaryCta: "Se städföretag",
      secondaryCta: "Alla städtjänster",
    },

    faq: [
      {
        question: `Vad brukar ingå i ${serviceLower}?`,
        answer: guide.faqIncluded,
      },
      {
        question: `Vad påverkar priset på ${serviceLower} i ${city.name}?`,
        answer: guide.faqPrice,
      },
      {
        question: `Hur väljer jag städföretag i ${city.name}?`,
        answer: guide.faqChoose,
      },
    ],
  }
}

export function createSeoContent({
  locale,
  city,
  service,
}: CreateSeoContentParams): SeoContent {
  if (locale === "sv") {
    return createSwedishContent({ city, service })
  }

  const dictionary = getSeoDictionary(locale)
  const serviceName = service.name[locale] ?? service.name.en

  const vars = {
    city: city.name,
    service: serviceName,
    serviceLower: serviceName.toLowerCase(),
  }

  return {
    hero: {
      eyebrow: replaceSeoVars(dictionary.serviceCity.heroEyebrow, vars),
      title: replaceSeoVars(dictionary.serviceCity.heroTitle, vars),
      text: replaceSeoVars(dictionary.serviceCity.heroText, vars),
      primaryCta: dictionary.primaryCta,
      secondaryCta: dictionary.secondaryCta,
    },

    sections: [
      {
        eyebrow: replaceSeoVars(dictionary.serviceCity.introEyebrow, vars),
        title: replaceSeoVars(dictionary.serviceCity.introTitle, vars),
        text: [
          replaceSeoVars(dictionary.serviceCity.introText1, vars),
          replaceSeoVars(dictionary.serviceCity.introText2, vars),
        ],
      },
      {
        eyebrow: replaceSeoVars(dictionary.serviceCity.trustEyebrow, vars),
        title: replaceSeoVars(dictionary.serviceCity.trustTitle, vars),
        text: [
          replaceSeoVars(dictionary.serviceCity.trustText1, vars),
          replaceSeoVars(dictionary.serviceCity.trustText2, vars),
        ],
      },
      {
        eyebrow: replaceSeoVars(dictionary.serviceCity.areasEyebrow, vars),
        title: replaceSeoVars(dictionary.serviceCity.areasTitle, vars),
        text: [
          replaceSeoVars(dictionary.serviceCity.areasText1, vars),
          replaceSeoVars(dictionary.serviceCity.areasText2, vars),
        ],
      },
    ],

    cta: {
      title: replaceSeoVars(dictionary.serviceCity.heroTitle, vars),
      text: replaceSeoVars(dictionary.serviceCity.heroText, vars),
      primaryCta: dictionary.browseJobs,
      secondaryCta: dictionary.createAccount,
    },

    faq: [
      {
        question: replaceSeoVars(dictionary.serviceCity.faqOneQuestion, vars),
        answer: replaceSeoVars(dictionary.serviceCity.faqOneAnswer, vars),
      },
      {
        question: replaceSeoVars(dictionary.serviceCity.faqTwoQuestion, vars),
        answer: replaceSeoVars(dictionary.serviceCity.faqTwoAnswer, vars),
      },
      {
        question: replaceSeoVars(dictionary.serviceCity.faqThreeQuestion, vars),
        answer: replaceSeoVars(dictionary.serviceCity.faqThreeAnswer, vars),
      },
    ],
  }
}
