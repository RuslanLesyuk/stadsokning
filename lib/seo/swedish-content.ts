
type SwedishServiceGuide = {
  scope: string
  price: string
  compare: string
  local: string
  faqIncluded: string
  faqPrice: string
  faqChoose: string
}

const serviceGuides: Record<string, SwedishServiceGuide> = {
  hemstadning: {
    scope:
      "Hemstädning kan anpassas efter bostadens storlek och hur ofta städningen ska göras. Vanliga moment är dammsugning, våttorkning, rengöring av kök och badrum samt avtorkning av fria ytor.",
    price:
      "Priset påverkas bland annat av bostadens storlek, städfrekvens, restid, vilka moment som ingår och om städmaterial ska tas med. Be om en tydlig offert där omfattning och eventuella tillägg framgår.",
    compare:
      "Jämför vad som faktiskt ingår i besöket, företagets serviceområde, kontaktvägar och villkor för ombokning. För återkommande städning är kontinuitet och tydlig kommunikation ofta viktigare än enbart lägsta timpris.",
    local:
      "För lokal hemstädning är det praktiskt att välja en utförare som redan arbetar i området. Det kan göra planering, återkommande tider och kortare ombokningar enklare.",
    faqIncluded:
      "Det varierar mellan företag. Be om en checklista för kök, badrum, golv och övriga rum innan du bokar.",
    faqPrice:
      "Bostadens storlek, städfrekvens, omfattning, material och resväg är vanliga faktorer. Jämför alltid offertens innehåll, inte bara timpriset.",
    faqChoose:
      "Kontrollera vad som ingår, serviceområde, kontaktuppgifter, omdömen där de finns och hur företaget hanterar ändringar eller reklamationer.",
  },
  flyttstadning: {
    scope:
      "Flyttstädning är normalt mer omfattande än vanlig hemstädning och planeras för en tom eller nästan tom bostad. Fokus ligger ofta på kök, badrum, skåp, golv, lister och andra ytor som ska lämnas rena inför överlämning.",
    price:
      "Priset påverkas av bostadens storlek, antal badrum, skick, fönster och eventuella tillägg. En bra offert bör tydligt beskriva vilka moment som ingår och hur företaget hanterar en eventuell efterkontroll.",
    compare:
      "Jämför omfattning, garanti eller rättelsevillkor, tillgängliga tider och vad som gäller för fönster, balkong, förråd eller andra extra ytor. Säkerställ att datumet fungerar med nyckelöverlämningen.",
    local:
      "Vid flytt är tidplanen ofta fast. En utförare som arbetar lokalt kan vara enklare att samordna med flytt, besiktning och överlämning.",
    faqIncluded:
      "Omfattningen varierar, men flyttstädning brukar vara mer detaljerad än vanlig hemstädning. Be företaget om en skriftlig checklista.",
    faqPrice:
      "Boyta, skick, antal rum, fönster och extra utrymmen påverkar ofta priset. Be om fast pris eller en tydligt avgränsad offert när det är möjligt.",
    faqChoose:
      "Kontrollera vad som ingår, vilka rättelsevillkor som gäller och att företaget kan utföra städningen i rätt tidsfönster.",
  },
  kontorsstadning: {
    scope:
      "Kontorsstädning kan omfatta arbetsytor, kök, toaletter, entréer, mötesrum och gemensamma utrymmen. Upplägget bör anpassas efter lokalens storlek, antal personer och hur ofta lokalerna används.",
    price:
      "Pris och tidsåtgång påverkas av lokalens yta, städfrekvens, antal hygienutrymmen, golvtyper och när arbetet ska utföras. För återkommande avtal är en tydlig arbetsbeskrivning viktig.",
    compare:
      "Jämför arbetsbeskrivning, frekvens, kontaktperson, rutiner för nycklar och larm samt hur avvikelser hanteras. För företag är en stabil leverans och tydlig uppföljning ofta centralt.",
    local:
      "Lokala städföretag kan vara praktiska när kontoret behöver fasta tider, snabb återkoppling eller extra städning vid möten och evenemang.",
    faqIncluded:
      "Det beror på avtalet. Vanliga delar är golv, fria ytor, kök, toaletter, entré och avfall. Specificera behoven innan offert.",
    faqPrice:
      "Yta, frekvens, arbetstid, hygienutrymmen och specialmoment påverkar priset. Be om en offert baserad på lokalens faktiska behov.",
    faqChoose:
      "Jämför arbetsbeskrivning, ansvarig kontaktperson, kvalitetssäkring och hur företaget hanterar nycklar, larm och extra beställningar.",
  },
  fonsterputs: {
    scope:
      "Fönsterputs kan gälla lägenheter, villor, butiker och kontor. Antal glasytor, fönstertyp, åtkomlighet och om in- och utsida ska putsas påverkar arbetets omfattning.",
    price:
      "Priset påverkas ofta av antal fönster, storlek, spröjs, höjd och åtkomlighet. Beskriv fönstren tydligt när du begär offert för att få ett mer jämförbart pris.",
    compare:
      "Jämför om priset gäller in- och utsida, karmar eller endast glas, och om svåråtkomliga fönster kräver särskild utrustning. Fråga även hur ombokning fungerar vid olämpligt väder.",
    local:
      "En lokal utförare kan vara praktisk för återkommande fönsterputs i bostäder, butiker och kontor, särskilt när flera besök ska samordnas under året.",
    faqIncluded:
      "Det skiljer sig mellan offerter. Kontrollera om både in- och utsida, spröjs och karmar ingår.",
    faqPrice:
      "Antal fönster, storlek, spröjs, höjd och åtkomlighet är vanliga prisfaktorer.",
    faqChoose:
      "Beskriv fönstertyp och åtkomlighet, jämför vad som ingår och kontrollera att utföraren har rätt utrustning för arbetet.",
  },
  trappstadning: {
    scope:
      "Trappstädning gäller vanligtvis entré, trappor, vilplan, räcken och gemensamma ytor i flerbostadshus eller kommersiella fastigheter. Frekvensen behöver anpassas efter trafik och årstid.",
    price:
      "Priset påverkas av antal våningar, entréer, frekvens, hissar och andra gemensamma ytor. Återkommande avtal bör ha en tydlig arbetsbeskrivning och plan för periodiska moment.",
    compare:
      "Jämför frekvens, kvalitetskontroll, kontaktväg för felanmälan och vilka periodiska moment som ingår. För fastigheter är förutsägbar leverans viktig.",
    local:
      "När flera fastigheter finns i samma område kan ett lokalt städföretag ofta planera rutter och återkommande tider effektivt.",
    faqIncluded:
      "Vanliga delar är entré, trappor, vilplan och räcken, men exakt omfattning ska stå i avtalet.",
    faqPrice:
      "Antal trapphus, våningar, städfrekvens och extra gemensamma ytor påverkar priset.",
    faqChoose:
      "Be om en tydlig arbetsplan, rutiner för kvalitetskontroll och en kontaktväg för avvikelser.",
  },
  byggstadning: {
    scope:
      "Byggstädning och slutstädning efter renovering handlar om att ta bort byggdamm, smuts och rester så att lokalen kan användas eller besiktigas. Arbetet behöver planeras efter projektets omfattning och säkerhetskrav.",
    price:
      "Priset påverkas av yta, mängden byggdamm, tillgänglighet, tidsplan och om grovstädning eller finstädning krävs. Bilder och en tydlig beskrivning gör offerter lättare att jämföra.",
    compare:
      "Jämför vad som räknas som byggstädning, vem som ansvarar för bortforsling och vilka ytor som ska vara färdiga. Vid större projekt bör ansvar, tidplan och kontaktperson vara tydliga.",
    local:
      "För byggprojekt kan närhet vara en fördel när städningen behöver samordnas med hantverkare, besiktning och andra entreprenörer.",
    faqIncluded:
      "Det kan omfatta grovstädning, dammborttagning och finstädning, men omfattningen måste anpassas till projektet.",
    faqPrice:
      "Yta, dammnivå, projektets skick, tillgänglighet och tidskrav påverkar priset.",
    faqChoose:
      "Beskriv projektets status, tidsplan och ansvar för avfall. Jämför offerter med samma arbetsomfattning.",
  },
  storstadning: {
    scope:
      "Storstädning är en mer grundlig städning än den löpande vardagsstädningen. Den kan exempelvis fokusera på kök, badrum, lister, dörrar, svåråtkomliga ytor och andra moment som inte görs varje vecka.",
    price:
      "Priset påverkas av bostadens storlek, skick och vilka fördjupade moment som beställs. Det är bra att ange prioriterade områden när du ber om offert.",
    compare:
      "Jämför checklistor och tidsuppskattning. Två offerter kan se lika ut i pris men innehålla olika många moment.",
    local:
      "Storstädning bokas ofta inför säsong, besök eller som komplement till vanlig hemstädning. Lokala företag kan göra återkommande bokningar enklare.",
    faqIncluded:
      "Det varierar. Be om en checklista och ange vilka områden som behöver extra fokus.",
    faqPrice:
      "Boyta, skick, antal rum och valda extramoment påverkar normalt tidsåtgång och pris.",
    faqChoose:
      "Jämför checklistan, tidsuppskattningen och vilka tillägg som kostar extra.",
  },
  "dodsbo-stadning": {
    scope:
      "Dödsbostädning kan kräva ett lugnt och strukturerat upplägg där städning samordnas med tömning, sortering eller överlämning av bostaden. Behovet varierar mycket mellan olika bostäder.",
    price:
      "Priset påverkas av bostadens storlek, skick, hur mycket som finns kvar och vilka moment som ska göras. En beskrivning eller genomgång före offert kan minska risken för missförstånd.",
    compare:
      "Jämför arbetsomfattning, bemötande, kontaktperson och hur extra moment hanteras. Det är särskilt viktigt att ansvarsfördelningen är tydlig.",
    local:
      "När flera praktiska moment ska samordnas kan en lokal kontakt göra planering och nyckelhantering enklare.",
    faqIncluded:
      "Det beror på bostadens skick och vad som redan är tömt. Kom överens skriftligt om städning och eventuella extra moment.",
    faqPrice:
      "Storlek, skick, kvarvarande saker och extra moment påverkar priset. En genomgång före offert kan vara värdefull.",
    faqChoose:
      "Välj en utförare som beskriver omfattningen tydligt och erbjuder en enkel kontaktväg under hela arbetet.",
  },
}

const fallbackGuide: SwedishServiceGuide = {
  scope:
    "Tjänstens omfattning beror på lokal, behov och hur ofta arbetet ska utföras. Beskriv uppdraget tydligt när du kontaktar ett städföretag.",
  price:
    "Pris påverkas normalt av omfattning, tidsåtgång, frekvens, material och resväg. Be om en tydlig offert så att olika alternativ går att jämföra.",
  compare:
    "Jämför vad som ingår, serviceområde, kontaktuppgifter och villkor. Ett tydligt uppdrag ger bättre förutsättningar för en relevant offert.",
  local:
    "En utförare som redan arbetar i området kan vara enklare att boka för både enstaka och återkommande uppdrag.",
  faqIncluded:
    "Omfattningen varierar mellan företag. Be om en tydlig arbetsbeskrivning innan bokning.",
  faqPrice:
    "Omfattning, tidsåtgång, frekvens, material och resväg är vanliga prisfaktorer.",
  faqChoose:
    "Jämför arbetsbeskrivning, kontaktvägar, serviceområde och villkor innan du bestämmer dig.",
}

export function getSwedishServiceGuide(serviceSlug: string) {
  return serviceGuides[serviceSlug] || fallbackGuide
}
