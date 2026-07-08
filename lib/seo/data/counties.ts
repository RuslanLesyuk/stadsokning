export type SeoCounty = {
  slug: string
  name: {
    sv: string
    en: string
    uk: string
    ru: string
    pl: string
  }
}

export const seoCounties: SeoCounty[] = [
  {
    slug: "stockholm",
    name: {
      sv: "Stockholm",
      en: "Stockholm County",
      uk: "лен Стокгольм",
      ru: "лен Стокгольм",
      pl: "region Sztokholm",
    },
  },
  {
    slug: "vastra-gotaland",
    name: {
      sv: "Västra Götaland",
      en: "Västra Götaland County",
      uk: "лен Вестра-Йоталанд",
      ru: "лен Вестра-Гёталанд",
      pl: "region Västra Götaland",
    },
  },
  {
    slug: "skane",
    name: {
      sv: "Skåne",
      en: "Skåne County",
      uk: "лен Сконе",
      ru: "лен Сконе",
      pl: "region Skania",
    },
  },
  {
    slug: "uppsala",
    name: {
      sv: "Uppsala",
      en: "Uppsala County",
      uk: "лен Уппсала",
      ru: "лен Уппсала",
      pl: "region Uppsala",
    },
  },
  {
    slug: "vastmanland",
    name: {
      sv: "Västmanland",
      en: "Västmanland County",
      uk: "лен Вестманланд",
      ru: "лен Вестманланд",
      pl: "region Västmanland",
    },
  },
  {
    slug: "orebro",
    name: {
      sv: "Örebro",
      en: "Örebro County",
      uk: "лен Еребру",
      ru: "лен Эребру",
      pl: "region Örebro",
    },
  },
  {
    slug: "ostergotland",
    name: {
      sv: "Östergötland",
      en: "Östergötland County",
      uk: "лен Естерйотланд",
      ru: "лен Эстергётланд",
      pl: "region Östergötland",
    },
  },
  {
    slug: "jonkoping",
    name: {
      sv: "Jönköping",
      en: "Jönköping County",
      uk: "лен Єнчепінг",
      ru: "лен Йёнчёпинг",
      pl: "region Jönköping",
    },
  },
]