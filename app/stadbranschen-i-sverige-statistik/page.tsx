
import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Städbranschen i Sverige Statistik 2026 | Marknadsguide",
  description:
    "Statistik och guide om städbranschen i Sverige. Läs om städföretag, efterfrågan, anställda, marknad och möjligheter för städare och kunder.",
  alternates: {
    canonical: "/stadbranschen-i-sverige-statistik",
  },
  keywords: [
    "städbranschen Sverige statistik",
    "städbranschen Sverige",
    "städföretag Sverige",
    "städmarknaden Sverige",
    "städservice Sverige",
    "hemstädning Sverige",
    "kontorsstädning Sverige",
    "städjobb Sverige",
    "facility management Sverige",
    "städfirma statistik",
  ],
  openGraph: {
    title: "Städbranschen i Sverige Statistik | Clean Jobs",
    description:
      "Guide till städbranschen i Sverige, städföretag, städjobb och marknadens utveckling.",
    url: `${siteUrl}/stadbranschen-i-sverige-statistik`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Städbranschen i Sverige statistik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Städbranschen i Sverige Statistik",
    description:
      "Statistik och marknadsguide för städbranschen i Sverige.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Var hittar man statistik om städbranschen i Sverige?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Officiell statistik om företag och anställda finns hos SCB, bland annat i Företagsregistret och statistikdatabasen efter bransch.",
      },
    },
    {
      "@type": "Question",
      name: "Är städbranschen viktig i Sverige?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja. Städbranschen omfattar hemstädning, kontorsstädning, facility management, flyttstädning och städföretag som hjälper både privatpersoner och företag.",
      },
    },
    {
      "@type": "Question",
      name: "Hur kan städföretag få fler kunder?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Städföretag kan få fler kunder genom lokal synlighet, tydlig profil, snabb kommunikation, bra omdömen och plattformar som Clean Jobs.",
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

function StatCard({
  title,
  value,
  text,
}: {
  title: string
  value: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default function StadbranschenStatistikPage() {
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
            Städbranschen statistik
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Städbranschen i Sverige: statistik, marknad och möjligheter
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Städbranschen i Sverige omfattar hemstädning, kontorsstädning,
            facility management, flyttstädning, sanering och städföretag som
            arbetar mot både privatpersoner och företag. Den här guiden sammanfattar
            branschen och varför digital synlighet blir allt viktigare.
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
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Lägg upp städjobb
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <section className="grid gap-5 md:grid-cols-3">
            <StatCard
              title="Officiell företagsdata"
              value="SCB"
              text="SCB:s Företagsregister redovisar antal företag och anställda efter bransch och storleksklass."
            />

            <StatCard
              title="Branschens utveckling"
              value="Tillväxtfas"
              text="Almega Serviceföretagens branschrapport 2024 beskriver städ-, FM- och hemservicebranschen som en bransch i tillväxtfas."
            />

            <StatCard
              title="Omsättning per anställd"
              value="€54,7k"
              text="En internationell dataset för cleaning services angav cirka 54,7 tusen euro i omsättning per anställd i Sverige 2023."
            />
          </section>

          <Section eyebrow="Översikt" title="Vad ingår i städbranschen?">
            <p>
              Städbranschen är bredare än bara hemstädning. Den omfattar även
              kontorsstädning, trappstädning, flyttstädning, storstädning,
              facility management, sanering och löpande städservice åt företag,
              bostadsrättsföreningar, fastighetsägare och privatpersoner.
            </p>

            <p>
              Det gör att olika kunder söker på olika sätt. En privatperson kan
              söka efter “städfirma Stockholm”, medan ett företag kan söka efter
              “kontorsstädning Göteborg” eller “facility services Sverige”.
            </p>
          </Section>

          <Section eyebrow="Statistik" title="Varifrån kommer statistiken?">
            <p>
              Den mest tillförlitliga källan för officiell statistik är SCB.
              Företagsregistret visar antal företag och anställda efter bransch
              och storleksklass. För städföretag är den typen av data viktig för
              att förstå hur marknaden är uppbyggd och hur många små företag som
              finns i branschen.
            </p>

            <p>
              Branschorganisationer publicerar också rapporter. Almega
              Serviceföretagens branschrapport 2024 behandlar städ-, facility
              management- och hemserviceföretag och beskriver en bransch som
              fortsätter utvecklas trots ett tuffare omvärldsläge.
            </p>
          </Section>

          <Section eyebrow="Efterfrågan" title="Varför finns det fortsatt efterfrågan?">
            <p>
              Städning är ett återkommande behov. Bostäder, kontor, butiker,
              restauranger, hyreslägenheter och fastighetsägare behöver städning.
              En del efterfrågan är regelbunden, medan annan uppstår vid flytt,
              renovering, kontorsöppning eller akut behov av hjälp.
            </p>

            <p>
              Det skapar möjligheter för både enskilda städare och städföretag.
              Arbetare kan hitta hemstädning, kontorsstädning och flyttstädning,
              medan företag kan bygga långsiktiga kundrelationer.
            </p>
          </Section>

          <Section eyebrow="Digitalisering" title="Varför behöver städföretag synas digitalt?">
            <p>
              Många städföretag är fortfarande beroende av rekommendationer,
              lokala grupper, gamla kataloger eller manuell försäljning. Det kan
              fungera, men det går långsamt. Kunder förväntar sig i allt större
              utsträckning att kunna hitta, jämföra och kontakta städhjälp online.
            </p>

            <p>
              Clean Jobs är byggt för att göra detta enklare. Ett städföretag kan
              skapa profil, visa företagsnamn och logotyp, ta emot förfrågningar
              och bli synligt för personer som redan söker städhjälp.
            </p>
          </Section>

          <Section eyebrow="Städer" title="Starka städmarknader i Sverige">
            <p>
              De starkaste marknaderna finns ofta i Stockholm, Göteborg och Malmö.
              Där finns många bostäder, kontor, flyttar och lokala företag. Även
              Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund och Jönköping
              är relevanta städer för städjobb och städföretag.
            </p>

            <p>
              Därför bör en långsiktig SEO-strategi innehålla både nationella
              sidor och lokala stadssidor. Nationella sidor bygger förtroende,
              medan stadssidor fångar lokala sökningar.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Väx som städföretag med Clean Jobs
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Clean Jobs hjälper städföretag, städare och kunder att hitta varandra
              i en fokuserad marknadsplats. Skapa profil, hitta uppdrag eller lägg
              upp ett städjobb idag.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                Skapa konto
              </Link>

              <Link
                href="/stadfirma-stockholm"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                Städfirma Stockholm
              </Link>
            </div>
          </section>
          <RelatedGuides currentPath="/work-in-sweden" />
                  <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
                  <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
                  <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" title="Relaterade guider" />
        </div>
      </main>
    </div>
  )
}
