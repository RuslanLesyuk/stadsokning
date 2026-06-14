import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Städjobb Göteborg 2026 | Hitta jobb som städare",
  description:
    "Hitta städjobb i Göteborg. Guide till hemstädning, kontorsstädning, flyttstädning, extrajobb och arbete som städare i Göteborg.",
  alternates: {
    canonical: "/stadjobb-goteborg",
  },
  keywords: [
    "städjobb Göteborg",
    "städjobb Goteborg",
    "städare jobb Göteborg",
    "hemstädning jobb Göteborg",
    "kontorsstädning jobb Göteborg",
    "flyttstädning jobb Göteborg",
    "extrajobb städning Göteborg",
    "deltidsjobb städning Göteborg",
    "städfirma Göteborg jobb",
    "jobb som städare Göteborg",
  ],
  openGraph: {
    title: "Städjobb Göteborg | Clean Jobs",
    description:
      "Hitta städjobb i Göteborg eller anlita städare för hemstädning, kontorsstädning och flyttstädning.",
    url: `${siteUrl}/stadjobb-goteborg`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Städjobb Göteborg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Städjobb Göteborg | Clean Jobs",
    description:
      "Hitta arbete som städare i Göteborg via Clean Jobs.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hur hittar jag städjobb i Göteborg?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Du kan hitta städjobb i Göteborg genom städfirmor, lokala kontakter, jobbsidor och nischade plattformar som Clean Jobs.",
      },
    },
    {
      "@type": "Question",
      name: "Vilka typer av städjobb finns i Göteborg?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Vanliga städjobb i Göteborg är hemstädning, kontorsstädning, flyttstädning, storstädning och återkommande städuppdrag.",
      },
    },
    {
      "@type": "Question",
      name: "Kan jag hitta städjobb utan perfekt svenska?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Ja, vissa städjobb kräver inte perfekt svenska. Pålitlighet, punktlighet och tydlig kommunikation är ofta viktigast.",
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

function StepCard({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-sm font-semibold text-white">
        {number}
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default function StadjobbGoteborgPage() {
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
            Städjobb Göteborg
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Städjobb i Göteborg: hitta arbete som städare eller anlita städhjälp
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Göteborg har många möjligheter för städare, städfirmor och personer
            som söker extrajobb eller deltidsjobb inom städning. Clean Jobs gör
            det enklare att hitta hemstädning, kontorsstädning, flyttstädning och
            återkommande uppdrag.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs?city=Göteborg"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              Hitta städjobb
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
          <Section eyebrow="Guide" title="Vad innebär städjobb i Göteborg?">
            <p>
              Städjobb i Göteborg kan vara korta uppdrag i privata hem, regelbunden
              hemstädning, kontorsstädning, flyttstädning eller hjälp efter
              renovering. Vissa kunder behöver hjälp en gång, medan andra söker
              någon för återkommande arbete.
            </p>

            <p>
              För arbetare är det viktigt att visa vilka områden man kan arbeta i,
              vilken typ av städning man kan utföra och när man är tillgänglig.
              Tydlig information gör det enklare för kunder att välja rätt städare.
            </p>
          </Section>

          <section className="grid gap-5 md:grid-cols-3">
            <StepCard
              number="1"
              title="Skapa profil"
              text="Lägg till namn, stad, telefonnummer, erfarenhet och gärna bild eller företagslogotyp."
            />
            <StepCard
              number="2"
              title="Sök uppdrag"
              text="Bläddra bland städjobb i Göteborg och välj uppdrag som passar din tid och plats."
            />
            <StepCard
              number="3"
              title="Bygg förtroende"
              text="Svara snabbt, kom i tid och gör ett noggrant jobb för att få fler möjligheter."
            />
          </section>

          <Section eyebrow="Arbetstyper" title="Vanliga städjobb i Göteborg">
            <p>
              Vanliga uppdrag är hemstädning, lägenhetsstädning, kontorsstädning,
              flyttstädning, storstädning och återkommande städning. Kunder letar
              ofta efter någon som är pålitlig, flexibel och lätt att kommunicera
              med.
            </p>

            <p>
              Städfirmor kan använda Clean Jobs för att synas bättre, hitta nya
              uppdrag och få kontakt med personer och företag som redan behöver
              städhjälp.
            </p>
          </Section>

          <Section eyebrow="Områden" title="Sök städjobb i Göteborg med omnejd">
            <p>
              Det finns möjligheter både i centrala Göteborg och i områden som
              Hisingen, Majorna, Linné, Frölunda, Angered, Mölndal, Partille,
              Lerum, Kungälv och Kungsbacka. Om du kan resa mellan flera områden
              ökar dina chanser att hitta uppdrag.
            </p>

            <p>
              När du skapar profil är det bra att skriva vilka områden du kan
              arbeta i och om du kan ta kvällsjobb, helgjobb eller uppdrag med
              kort varsel.
            </p>
          </Section>

          <Section eyebrow="För kunder" title="Så hittar du rätt städare i Göteborg">
            <p>
              Om du behöver städhjälp bör du beskriva bostadens storlek, typ av
              städning, önskat datum, budget och om städmaterial finns. Tydliga
              uppgifter gör att rätt städare eller städfirma kan svara snabbare.
            </p>

            <p>
              Clean Jobs är byggt för att göra kontakten enklare mellan kunder,
              städare och städfirmor. Du kan lägga upp ett jobb och fortsätta
              konversationen via plattformen.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Börja hitta städjobb i Göteborg
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Clean Jobs hjälper arbetare, kunder och städfirmor att hitta
              varandra snabbare. Skapa konto eller börja med att se lediga
              uppdrag.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs?city=Göteborg"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                Se städjobb
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
          <RelatedGuides currentPath="/work-in-sweden" />
                  <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
                  <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
                  <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" title="Relaterade guider" />
        </div>
      </main>
    </div>
  )
}
