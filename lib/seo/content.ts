import type { SeoCity, SeoLocale, SeoService } from "./types"
import { getSeoDictionary, replaceSeoVars } from "./dictionary"

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

export function createSeoContent({
  locale,
  city,
  service,
}: CreateSeoContentParams): SeoContent {
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