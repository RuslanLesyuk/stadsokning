
import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Bästa Städföretag i Sverige 2026 | Clean Jobs",
  description:
    "Guide till att hitta bästa städföretag i Sverige. Jämför hemstädning, kontorsstädning, flyttstädning, priser, omdömen och lokal städhjälp.",
  alternates: {
    canonical: "/basta-stadforetag-i-sverige",
  },
  keywords: [
    "bästa städföretag i Sverige",
    "städföretag Sverige",
    "städfirma Sverige",
    "hemstädning Sverige",
    "kontorsstädning Sverige",
    "flyttstädning Sverige",
    "anlita städare Sverige",
    "städhjälp Sverige",
    "städfirma Stockholm",
    "städservice Sverige",
  ],
  openGraph: {
    title: "Bästa Städföretag i Sverige | Clean Jobs",
    description:
      "Guide till att jämföra städföretag i Sverige och hitta rätt städhjälp.",
    url: `${siteUrl}/basta-stadforetag-i-sverige`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bästa städföretag i Sverige",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bästa Städföretag i Sverige",
    description:
      "Guide till städföretag, hemstädning och kontorsstädning i Sverige.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hur väljer man bästa städföretaget?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Jämför tjänster, pris, tillgänglighet, kommunikation, omdömen, företagsinformation och om företaget erbjuder den typ av städning du behöver.",
      },
    },
    {
      "@type": "Question",
      name: "Vilka städtjänster är vanligast?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Vanliga tjänster är hemstädning, kontorsstädning, flyttstädning, lägenhetsstädning, storstädning och återkommande städning.",
      },
    },
    {
      "@type": "Question",
      name: "Kan Clean Jobs hjälpa mig hitta städföretag?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja. Clean Jobs hjälper kunder, städare och städföretag att hitta varandra via en fokuserad marknadsplats för städjobb och städtjänster.",
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

function CheckCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-lg text-rose-700">
        ✓
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default function BastaStadforetagISverigePage() {
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
            Städföretag
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Bästa städföretag i Sverige: så väljer du rätt städhjälp
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Att välja städföretag handlar inte bara om pris. De bästa
            städföretagen är pålitliga, tydliga i kommunikationen, enkla att
            kontakta och transparenta med vilka tjänster de erbjuder. Den här
            guiden hjälper dig jämföra hemstädning, kontorsstädning, flyttstädning
            och återkommande städning.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              Lägg upp städjobb
            </Link>

            <Link
              href="/stadfirma-stockholm"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Städfirma Stockholm
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <Section eyebrow="Jämförelse" title="Vad gör ett städföretag till ett av de bästa?">
            <p>
              Ett bra städföretag ska tydligt visa vilka tjänster som erbjuds,
              vilka områden företaget arbetar i och hur man kontaktar dem. För
              privatkunder är förtroende extra viktigt eftersom städaren kan arbeta
              i hemmet. För företag är pålitlighet och långsiktig kvalitet ofta
              viktigast.
            </p>

            <p>
              Clean Jobs är byggt för att göra jämförelsen enklare. Kunder kan
              lägga upp städjobb, städare och företag kan visa sina profiler och
              kommunikationen kan ske direkt på plattformen.
            </p>
          </Section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <CheckCard
              title="Tydliga tjänster"
              text="Ett bra företag visar om det erbjuder hemstädning, kontorsstädning, flyttstädning eller återkommande städning."
            />
            <CheckCard
              title="Lokal täckning"
              text="Kontrollera om företaget arbetar i din stad, stadsdel och närliggande kommuner."
            />
            <CheckCard
              title="Snabba svar"
              text="Bra kommunikation är ofta ett tecken på att företaget är organiserat och pålitligt."
            />
            <CheckCard
              title="Förtroendesignaler"
              text="Leta efter företagsnamn, profilinformation, omdömen, verifiering, logotyp och professionell presentation."
            />
          </section>

          <Section eyebrow="Tjänster" title="Vanliga städtjänster i Sverige">
            <p>
              De vanligaste tjänsterna är hemstädning, lägenhetsstädning,
              kontorsstädning, flyttstädning, trappstädning, storstädning och
              återkommande städning. Vissa företag erbjuder även fönsterputs,
              byggstädning eller städning för bostadsrättsföreningar.
            </p>

            <p>
              Innan du väljer företag bör du beskriva jobbet tydligt. Ange stad,
              ungefärligt område, bostadens storlek, typ av städning, datum, tid
              och budget. Tydlig information gör att städföretag kan svara snabbare.
            </p>
          </Section>

          <Section eyebrow="Städer" title="Var hittar man städföretag i Sverige?">
            <p>
              De största marknaderna är Stockholm, Göteborg och Malmö, eftersom
              dessa städer har många bostäder, kontor, flyttar och företag. Det
              finns också efterfrågan i Uppsala, Västerås, Örebro, Linköping,
              Helsingborg, Lund och Jönköping.
            </p>

            <p>
              Om du är kund är det bäst att börja lokalt. Om du driver städföretag
              bör din profil tydligt visa vilka städer och områden du täcker.
              Lokal synlighet är mycket viktig för städtjänster.
            </p>
          </Section>

          <Section eyebrow="Kunder" title="Så anlitar du städare tryggare">
            <p>
              Börja med en tydlig beskrivning och undvik otydliga meddelanden.
              Förklara vad som ska städas, hur stor bostaden eller lokalen är och
              om städmaterial finns på plats. Ställ praktiska frågor innan jobbet
              startar och samla kommunikationen på ett ställe.
            </p>

            <p>
              På Clean Jobs kan du lägga upp ett städjobb och få intresse från
              städare eller städföretag. Det är enklare än att kontakta många
              företag manuellt.
            </p>
          </Section>

          <Section eyebrow="Företag" title="Hur städföretag kan synas på framtida listor">
            <p>
              Den här sidan är just nu en guide, inte en ranking av specifika
              företag. I framtiden kan Clean Jobs lyfta fram registrerade
              städföretag baserat på profilkvalitet, verifiering, omdömen,
              aktivitet och vilka områden de arbetar i.
            </p>

            <p>
              Därför bör städföretag skapa en komplett profil redan nu:
              företagsnamn, logotyp, stad, serviceområden och tydlig beskrivning.
              Ju bättre profil, desto lättare blir det för kunder att känna
              förtroende.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Hitta rätt städhjälp i Sverige
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Clean Jobs hjälper kunder, städare och städföretag att hitta varandra
              på en marknadsplats för städjobb och städtjänster.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs/create"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                Lägg upp jobb
              </Link>

              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                Skapa konto
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
