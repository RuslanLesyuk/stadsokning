export type SeoLandingPageConfig = {
  slug: string
  city: string
  serviceType: string
  title: string
  description: string
  h1: string
  intro: string
  primaryKeyword: string
  relatedServiceTypes: string[]
  faq: {
    question: string
    answer: string
  }[]
}

export const seoLandingPages: SeoLandingPageConfig[] = [
  {
    slug: "stadfirma-stockholm",
    city: "Stockholm",
    serviceType: "Städfirma",
    title: "Städfirma i Stockholm | Hitta städföretag | Clean Jobs",
    description:
      "Hitta städfirma i Stockholm. Jämför städföretag, städtjänster, priser och kontaktuppgifter på Clean Jobs.",
    h1: "Städfirma i Stockholm",
    intro:
      "Letar du efter en städfirma i Stockholm? På Clean Jobs kan du hitta och jämföra städföretag, privata städare och olika städtjänster i Stockholm med omnejd.",
    primaryKeyword: "städfirma stockholm",
    relatedServiceTypes: [
      "Hemstädning",
      "Flyttstädning",
      "Kontorsstädning",
      "Fönsterputs",
      "Storstädning",
      "Trappstädning",
      "Byggstädning",
    ],
    faq: [
      {
        question: "Hur hittar jag en städfirma i Stockholm?",
        answer:
          "Du kan jämföra städföretag och städtjänster på Clean Jobs, se vilka områden de arbetar i och kontakta dem direkt.",
      },
      {
        question: "Vilka städtjänster finns i Stockholm?",
        answer:
          "Vanliga tjänster är hemstädning, flyttstädning, kontorsstädning, fönsterputs, byggstädning och storstädning.",
      },
      {
        question: "Kan jag hitta städfirmor med RUT-avdrag?",
        answer:
          "Ja, många städföretag erbjuder tjänster där RUT-avdrag kan vara tillgängligt. Kontrollera alltid informationen på företagets profil.",
      },
    ],
  },
  {
    slug: "hemstadning-stockholm",
    city: "Stockholm",
    serviceType: "Hemstädning",
    title: "Hemstädning i Stockholm | Hitta städfirma | Clean Jobs",
    description:
      "Hitta hemstädning i Stockholm. Jämför städfirmor, priser, serviceområden och kontaktuppgifter.",
    h1: "Hemstädning i Stockholm",
    intro:
      "Behöver du hjälp med hemstädning i Stockholm? Clean Jobs hjälper dig att hitta städfirmor och privata städare som erbjuder regelbunden städning av hem och lägenheter.",
    primaryKeyword: "hemstädning stockholm",
    relatedServiceTypes: [
      "Hemstädning",
      "Storstädning",
      "Fönsterputs",
      "Flyttstädning",
    ],
    faq: [
      {
        question: "Vad ingår i hemstädning?",
        answer:
          "Hemstädning kan inkludera dammsugning, golvtorkning, köksstädning, badrumsstädning, dammtorkning och annan regelbunden städning.",
      },
      {
        question: "Finns hemstädning med RUT-avdrag?",
        answer:
          "Många städfirmor erbjuder hemstädning där RUT-avdrag kan användas. Kontrollera alltid med företaget innan bokning.",
      },
      {
        question: "Kan jag hitta hemstädning nära mig?",
        answer:
          "Ja, på Clean Jobs kan du hitta städföretag och städare som arbetar i Stockholm och närliggande områden.",
      },
    ],
  },
  {
    slug: "flyttstadning-stockholm",
    city: "Stockholm",
    serviceType: "Flyttstädning",
    title: "Flyttstädning i Stockholm | Hitta städfirma | Clean Jobs",
    description:
      "Hitta flyttstädning i Stockholm. Jämför städföretag, kontaktuppgifter och tjänster för flyttstädning.",
    h1: "Flyttstädning i Stockholm",
    intro:
      "Ska du flytta och behöver flyttstädning i Stockholm? På Clean Jobs kan du hitta städfirmor som erbjuder flyttstädning för lägenheter, hus och kontor.",
    primaryKeyword: "flyttstädning stockholm",
    relatedServiceTypes: [
      "Flyttstädning",
      "Storstädning",
      "Fönsterputs",
      "Hemstädning",
    ],
    faq: [
      {
        question: "Vad ingår i flyttstädning?",
        answer:
          "Flyttstädning omfattar vanligtvis noggrann rengöring av kök, badrum, golv, skåp, fönster och övriga ytor inför flytt.",
      },
      {
        question: "När bör jag boka flyttstädning?",
        answer:
          "Det är bäst att boka i god tid före flytten, särskilt under perioder då många flyttar.",
      },
      {
        question: "Kan jag jämföra flera städfirmor?",
        answer:
          "Ja, Clean Jobs gör det lättare att hitta och jämföra olika städfirmor i Stockholm.",
      },
    ],
  },
  {
    slug: "kontorsstadning-stockholm",
    city: "Stockholm",
    serviceType: "Kontorsstädning",
    title: "Kontorsstädning i Stockholm | Hitta städfirma | Clean Jobs",
    description:
      "Hitta kontorsstädning i Stockholm. Jämför städföretag för kontor, arbetsplatser och lokaler.",
    h1: "Kontorsstädning i Stockholm",
    intro:
      "Letar ditt företag efter kontorsstädning i Stockholm? Clean Jobs hjälper dig att hitta städföretag som arbetar med kontor, arbetsplatser och kommersiella lokaler.",
    primaryKeyword: "kontorsstädning stockholm",
    relatedServiceTypes: [
      "Kontorsstädning",
      "Trappstädning",
      "Byggstädning",
      "Fönsterputs",
    ],
    faq: [
      {
        question: "Vad ingår i kontorsstädning?",
        answer:
          "Kontorsstädning kan inkludera tömning av papperskorgar, dammsugning, golvvård, rengöring av kök, toaletter och arbetsytor.",
      },
      {
        question: "Kan kontorsstädning bokas regelbundet?",
        answer:
          "Ja, många städföretag erbjuder regelbunden kontorsstädning varje vecka eller flera gånger i veckan.",
      },
      {
        question: "Passar kontorsstädning små företag?",
        answer:
          "Ja, kontorsstädning kan anpassas för både små kontor och större arbetsplatser.",
      },
    ],
  },
  {
    slug: "fonsterputs-stockholm",
    city: "Stockholm",
    serviceType: "Fönsterputs",
    title: "Fönsterputs i Stockholm | Hitta städfirma | Clean Jobs",
    description:
      "Hitta fönsterputs i Stockholm. Jämför företag som erbjuder fönsterputs för hem, kontor och lokaler.",
    h1: "Fönsterputs i Stockholm",
    intro:
      "Behöver du fönsterputs i Stockholm? På Clean Jobs kan du hitta företag och städare som erbjuder fönsterputs för hem, kontor och andra lokaler.",
    primaryKeyword: "fönsterputs stockholm",
    relatedServiceTypes: [
      "Fönsterputs",
      "Hemstädning",
      "Flyttstädning",
      "Kontorsstädning",
    ],
    faq: [
      {
        question: "Vad kostar fönsterputs i Stockholm?",
        answer:
          "Priset beror på antal fönster, tillgänglighet och typ av objekt. Jämför flera företag innan du bestämmer dig.",
      },
      {
        question: "Kan jag boka fönsterputs för kontor?",
        answer:
          "Ja, många företag erbjuder fönsterputs för både privata hem och kontor.",
      },
      {
        question: "Finns fönsterputs med RUT-avdrag?",
        answer:
          "Fönsterputs kan ofta omfattas av RUT-avdrag för privatpersoner, men kontrollera alltid med företaget.",
      },
    ],
  },
]