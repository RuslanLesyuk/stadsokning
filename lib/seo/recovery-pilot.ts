/**
 * Strictly scoped editorial experiment. Do not expand automatically.
 * Control URLs are intentionally absent from this whitelist.
 */
export const SEO_RECOVERY_PILOT_PATHS = [
  "stockholm/hotellstadning",
  "stockholm/industristadning",
  "goteborg/garage-stadning",
  "goteborg/restaurangstadning",
  "goteborg/skolstadning",
  "malmo/garage-stadning",
  "malmo/butiksstadning",
  "lund/garage-stadning",
  "uppsala/garage-stadning",
  "sodertalje/garage-stadning",
  "vasteras/garage-stadning",
  "goteborg/butiksstadning",
] as const

const pilotPaths: ReadonlySet<string> = new Set(SEO_RECOVERY_PILOT_PATHS)

export function isSeoRecoveryPilotPage(citySlug: string, serviceSlug: string) {
  return pilotPaths.has(`${citySlug}/${serviceSlug}`)
}

export type SeoRecoveryGuide = {
  lead: string
  scopeTitle: string
  scope: readonly string[]
  quoteTitle: string
  quote: readonly string[]
  qualityNote: string
}

/** Content is industry-specific, not fabricated city-specific facts. */
const guides: Record<string, SeoRecoveryGuide> = {
  hotellstadning: {
    lead: "För hotell är städfrekvens, rumsvändning och tydliga kvalitetskrav avgörande när du jämför en städoffert.",
    scopeTitle: "Moment att beskriva för hotellstädning",
    scope: [
      "Antal rum, gemensamma ytor, badrum och vilka delar som ingår i uppdraget.",
      "Om städningen sker mellan utcheckning och incheckning eller som löpande service.",
      "Ansvar för sänglinne, förbrukningsmaterial, avfall och påfyllning.",
    ],
    quoteTitle: "Frågor före offert",
    quote: [
      "Hur hanteras variation i beläggning, helger och högsäsong?",
      "Vilken checklista används för kvalitetskontroll och avvikelser?",
      "Ingår städmaterial, utrustning och eventuella tillägg i priset?",
    ],
    qualityNote: "Be om en tydlig rums- och ytspecifikation samt rutiner för nyckelhantering innan arbetet påbörjas.",
  },
  industristadning: {
    lead: "Industrilokaler ställer olika krav beroende på processer, ytskikt och tillträdesregler. Börja med en platsanpassad behovsbeskrivning.",
    scopeTitle: "Moment att specificera vid industristädning",
    scope: [
      "Vilka produktionsytor, lagerutrymmen och personalutrymmen som omfattas.",
      "Golvmaterial, maskinnära zoner och områden där särskilda restriktioner gäller.",
      "Om arbetet måste ske utanför produktionstid eller kräver ledsagning.",
    ],
    quoteTitle: "Frågor före offert",
    quote: [
      "Hur anpassas metoder, skyddsutrustning och tillträde efter arbetsplatsens riskbedömning?",
      "Hur hanteras material som kräver särskild avfallshantering?",
      "Vilka begränsningar och ansvarsförhållanden ska stå i avtalet?",
    ],
    qualityNote: "Förutsätt inte att en vanlig städleverantör har kompetens för industrimiljöer; verifiera relevanta rutiner och försäkringar.",
  },
  "garage-stadning": {
    lead: "Ett garage behöver en städplan anpassad för trafik, golvtyp, dränering och smuts från fordon.",
    scopeTitle: "Moment vid garagestädning",
    scope: [
      "Yta, antal plan, infarter, parkeringsplatser och tillgängliga arbetstider.",
      "Sopning, damm, golvrengöring och rengöring runt pelare och väggkanter.",
      "Förekomst av oljespill eller andra föroreningar som kräver särskild hantering.",
    ],
    quoteTitle: "Frågor före offert",
    quote: [
      "Hur påverkas arbetet av parkerade bilar och löpande trafik?",
      "Vilken metod och utrustning är lämplig för just det aktuella golvet?",
      "Vem ansvarar för avspärrning, vatten, avfall och tillgång till lokalerna?",
    ],
    qualityNote: "Fotografera problemområden och ange åtkomstregler så att offerten blir jämförbar.",
  },
  restaurangstadning: {
    lead: "Restaurangstädning behöver skilja mellan gästytor och köksnära arbetszoner, med tydliga rutiner för hygien och ansvar.",
    scopeTitle: "Moment att dela upp i uppdraget",
    scope: [
      "Matsal, entré, toaletter, personalytor och eventuella köksutrymmen.",
      "Kontaktpunkter, golv, avfallsutrymmen och områden med hög belastning.",
      "Städning under öppettid jämfört med efter stängning.",
    ],
    quoteTitle: "Frågor före offert",
    quote: [
      "Vilka ytor kräver särskilda hygienrutiner eller kundens egna instruktioner?",
      "Hur dokumenteras utfört arbete och avvikelser?",
      "Vem tillhandahåller förbrukningsmaterial och lämpliga rengöringsprodukter?",
    ],
    qualityNote: "Beskriv om kök, livsmedelsytor och specialrengöring ingår; anta inte att de täcks av en standardoffert.",
  },
  skolstadning: {
    lead: "Städning i skolmiljö behöver planeras kring undervisning, gemensamma utrymmen och tydliga säkerhetsrutiner.",
    scopeTitle: "Utrymmen att ta med i städplanen",
    scope: [
      "Klassrum, korridorer, entréer, toaletter och personalutrymmen.",
      "Kontaktytor, golv och ytor med hög användningsfrekvens.",
      "Tider när lokalerna är tomma samt eventuell särskild åtkomstkontroll.",
    ],
    quoteTitle: "Frågor före offert",
    quote: [
      "Hur dokumenteras kvalitet, städfrekvens och avvikelser per utrymme?",
      "Vilka rutiner gäller för tillträde när barn och personal är på plats?",
      "Vilka produkter och metoder är lämpliga för lokalerna enligt verksamhetens krav?",
    ],
    qualityNote: "Kontrollera verksamhetens egna säkerhets- och hygienkrav innan leverantör väljs.",
  },
  butiksstadning: {
    lead: "En butik behöver en lösning som fungerar med kundflöde, öppettider, varuexponering och olika golvmaterial.",
    scopeTitle: "Moment att ange för butiksstädning",
    scope: [
      "Butiksyta, provrum, lager, entré och personalutrymmen.",
      "Entrémattor, golv, glaspartier och ytor nära hyllor eller kassor.",
      "Om städning ska ske före öppning, efter stängning eller under dagtid.",
    ],
    quoteTitle: "Frågor före offert",
    quote: [
      "Hur skyddas varor, inventarier och känsliga ytskikt?",
      "Hur hanteras tillgång till larmade eller låsta utrymmen?",
      "Vad ingår i frekvensen och vad räknas som extra arbete?",
    ],
    qualityNote: "Be om ett tydligt rums- och frekvensschema så att olika offerter kan jämföras på samma grund.",
  },
}

export function getSeoRecoveryGuide(serviceSlug: string) {
  return guides[serviceSlug] ?? null
}
