import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Jobb utan svenska 2026 | Hitta arbete i Sverige",
  description:
    "Guide till jobb utan perfekt svenska. Läs om städjobb, servicejobb, extrajobb och hur du kan hitta arbete i Sverige även om du lär dig svenska.",
  alternates: {
    canonical: "/jobb-utan-svenska",
  },
  keywords: [
    "jobb utan svenska",
    "jobb i Sverige utan svenska",
    "jobb utan flytande svenska",
    "städjobb utan svenska",
    "extrajobb utan svenska",
    "jobb för nyanlända",
    "jobb för utlänningar Sverige",
    "arbete utan svenska",
    "jobb med engelska Sverige",
    "städare jobb utan svenska",
  ],
  openGraph: {
    title: "Jobb utan svenska | Clean Jobs",
    description:
      "Praktisk guide för dig som söker jobb i Sverige men ännu inte talar flytande svenska.",
    url: `${siteUrl}/jobb-utan-svenska`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jobb utan svenska",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobb utan svenska | Clean Jobs",
    description:
      "Hitta städjobb, servicejobb och praktiska vägar till arbete utan perfekt svenska.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Kan man få jobb i Sverige utan flytande svenska?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja, vissa jobb kräver inte flytande svenska. Städjobb, lagerarbete, restaurang, hotell och vissa servicejobb kan ibland fungera med engelska eller grundläggande svenska.",
      },
    },
    {
      "@type": "Question",
      name: "Vilka jobb kan passa utan perfekt svenska?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Städjobb, hemstädning, kontorsstädning, flyttstädning, lagerarbete, disk, hotellstädning och enklare servicejobb kan vara möjliga alternativ.",
      },
    },
    {
      "@type": "Question",
      name: "Kan Clean Jobs hjälpa mig hitta städjobb?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja. Clean Jobs är en marknadsplats där arbetare kan hitta städjobb och där kunder eller städfirmor kan hitta personer som vill arbeta.",
      },
    },
  ],
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
      {eyebrow ? (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          {eyebrow}
        </div>
      ) : null}

      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
        {title}
      </h2>

      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
        {children}
      </div>
    </section>
  )
}

function TipCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default function JobbUtanSvenskaPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="rounded-[36px] border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/50 p-6 shadow-[0_2px_14px_rgba(15,23,42,0.04)] md:p-10">
          <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            Jobb utan svenska
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Jobb utan svenska: hitta arbete i Sverige medan du lär dig språket
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Det kan vara svårt att hitta jobb i Sverige om du ännu inte talar
            flytande svenska. Men det finns praktiska vägar in på arbetsmarknaden.
            Städjobb, servicejobb, hotell, restaurang, lager och vissa enklare
            uppdrag kan ibland fungera med engelska, grundläggande svenska eller
            tydliga instruktioner.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              Se städjobb
            </Link>

            <Link
              href="/signup"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Skapa profil
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <Section eyebrow="Start" title="Kan man få jobb utan flytande svenska?">
            <p>
              Ja, det är möjligt att hitta vissa jobb utan att tala flytande
              svenska. Det beror på arbetsuppgiften, arbetsgivaren och hur mycket
              kundkontakt jobbet kräver. Vissa jobb kräver svenska, men andra
              handlar mer om punktlighet, ansvar och att kunna följa tydliga
              instruktioner.
            </p>

            <p>
              Det betyder inte att svenska är oviktigt. Att lära sig svenska ökar
              dina chanser mycket. Men du behöver inte alltid vänta tills du är
              perfekt innan du börjar söka praktiska jobb.
            </p>
          </Section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <TipCard
              title="Städjobb"
              text="Hemstädning, kontorsstädning och flyttstädning kan ibland fungera med enkel kommunikation."
            />
            <TipCard
              title="Lager"
              text="Vissa lagerjobb bygger på tydliga rutiner och kan passa om du kan följa instruktioner."
            />
            <TipCard
              title="Restaurang"
              text="Disk, kökshjälp och enklare serviceuppgifter kan vara möjliga första jobb."
            />
            <TipCard
              title="Hotell"
              text="Hotellstädning och servicearbete kan vara ett alternativ i större städer."
            />
          </section>

          <Section eyebrow="Städning" title="Varför städjobb kan vara ett bra första steg">
            <p>
              Städjobb är ofta praktiska och tydliga. Kunden behöver hjälp med ett
              konkret problem: hemstädning, kontorsstädning, lägenhetsstädning,
              flyttstädning eller återkommande städning. Om du är noggrann, kommer
              i tid och kommunicerar tydligt kan du bygga förtroende.
            </p>

            <p>
              Clean Jobs fokuserar på just städjobb eftersom behovet finns i många
              städer. Plattformen hjälper arbetare, kunder och städfirmor att hitta
              varandra utan att allt måste gå via stora generella jobbsajter.
            </p>
          </Section>

          <Section eyebrow="Profil" title="Så ökar du dina chanser">
            <p>
              Skapa en tydlig profil med ditt namn, stad, telefonnummer,
              erfarenhet och tillgänglighet. Skriv vilka typer av jobb du kan göra:
              hemstädning, kontorsstädning, flyttstädning, kvällsjobb, helgjobb
              eller återkommande uppdrag.
            </p>

            <p>
              Svara snabbt när någon kontaktar dig. Var ärlig med din språknivå och
              skriv gärna att du kan kommunicera på engelska eller enkel svenska.
              Det är bättre att vara tydlig från början än att kunden blir osäker.
            </p>
          </Section>

          <Section eyebrow="Städer" title="Var finns det flest jobb utan perfekt svenska?">
            <p>
              De största möjligheterna finns ofta i Stockholm, Göteborg och Malmö,
              men även Uppsala, Västerås, Örebro, Helsingborg, Lund, Linköping och
              andra större städer kan ha många servicejobb och städjobb.
            </p>

            <p>
              Om du kan resa till närliggande kommuner får du fler möjligheter.
              Många städjobb finns inte bara i centrum utan också i bostadsområden,
              kontor och mindre företag utanför stadskärnan.
            </p>
          </Section>

          <Section eyebrow="Språk" title="Fortsätt lära dig svenska samtidigt">
            <p>
              Även om du kan hitta vissa jobb utan flytande svenska bör du fortsätta
              lära dig språket. Svenska hjälper dig förstå avtal, instruktioner,
              säkerhet, kunder och arbetsgivare bättre. Det kan också ge dig bättre
              jobb på längre sikt.
            </p>

            <p>
              En bra strategi är att arbeta, samla erfarenhet och samtidigt studera
              svenska. Varje kundkontakt och varje arbetsdag kan också bli ett sätt
              att träna språket.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Börja med städjobb på Clean Jobs
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Om du söker jobb utan perfekt svenska kan städjobb vara ett praktiskt
              första steg. Skapa profil, visa din tillgänglighet och börja söka
              uppdrag nära dig.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                Se jobb
              </Link>

              <Link
                href="/jobb-i-sverige"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                Läs jobbguiden
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
