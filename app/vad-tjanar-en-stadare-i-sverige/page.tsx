import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Vad tjänar en städare i Sverige 2026?",
  description:
    "Guide till städare lön i Sverige. Läs om medellön, månadslön, timlön, vad som påverkar lönen och hur du hittar städjobb.",
  alternates: {
    canonical: "/vad-tjanar-en-stadare-i-sverige",
  },
  keywords: [
    "vad tjänar en städare",
    "städare lön",
    "städare lön Sverige",
    "lokalvårdare lön",
    "hemstädning lön",
    "kontorsstädning lön",
    "flyttstädning lön",
    "städjobb lön",
    "städare månadslön",
    "städare timlön",
  ],
  openGraph: {
    title: "Vad tjänar en städare i Sverige? | Clean Jobs",
    description:
      "Guide till städare lön, lönenivåer, städer och hur du hittar fler städjobb.",
    url: `${siteUrl}/vad-tjanar-en-stadare-i-sverige`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Städare lön i Sverige",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vad tjänar en städare i Sverige?",
    description:
      "Löneguide för städare i Sverige med tips för att hitta fler städjobb.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Vad tjänar en städare i Sverige?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Offentlig lönestatistik visar att städare i Sverige ofta ligger runt den övre delen av 20 000 kronor per månad före skatt, beroende på erfarenhet, region, arbetsgivare och arbetstid.",
      },
    },
    {
      "@type": "Question",
      name: "Vad påverkar lönen för en städare?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Lönen påverkas av erfarenhet, arbetsgivare, stad, arbetstid, ansvar och typ av städning, till exempel hemstädning, kontorsstädning eller flyttstädning.",
      },
    },
    {
      "@type": "Question",
      name: "Hur kan en städare få fler jobb?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "En städare kan få fler jobb genom en tydlig profil, snabb kommunikation, bra kvalitet, återkommande kunder och genom att använda plattformar som Clean Jobs.",
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

export default function VadTjanarEnStadarePage() {
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
            Städare lön
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Vad tjänar en städare i Sverige?
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Lönen för en städare i Sverige beror på erfarenhet, arbetsgivare,
            stad, arbetstid och typ av städning. Hemstädning, kontorsstädning,
            flyttstädning och återkommande uppdrag kan ha olika lönenivåer och
            olika möjligheter.
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
              href="/jobb-utan-svenska"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Jobb utan svenska
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <section className="grid gap-5 md:grid-cols-3">
            <StatCard
              title="Typisk månadslön"
              value="≈ 27 600–28 700 kr"
              text="Aktuella lönekällor placerar städare runt den övre delen av 20 000 kronor per månad före skatt."
            />

            <StatCard
              title="Undre kvartil / median / övre kvartil"
              value="26 800 / 28 600 / 30 400"
              text="SCB:s regionala lönestatistik visar detta intervall för städare i den senaste tabellen."
            />

            <StatCard
              title="Lönen påverkas av"
              value="Stad + arbetsgivare"
              text="Erfarenhet, arbetstid, ansvar, arbetsgivare och typ av städning påverkar inkomsten."
            />
          </section>

          <Section eyebrow="Löneöversikt" title="Städare lön i Sverige">
            <p>
              Offentlig lönestatistik visar att städare i Sverige ofta ligger
              runt den övre delen av 20 000 kronor per månad före skatt. SCB:s
              senaste tabell för städare visar nivåer omkring 26 800 kronor,
              28 600 kronor och 30 400 kronor för undre kvartil, median och övre
              kvartil. Andra lönekällor sammanfattar medellönen till ungefär
              27 600 kronor per månad.
            </p>

            <p>
              Det här är vägledande siffror, inte en garanti. Din faktiska lön kan
              bli högre eller lägre beroende på om du arbetar heltid, deltid, via
              företag, med privata kunder eller med återkommande uppdrag.
            </p>
          </Section>

          <Section eyebrow="Faktorer" title="Vad påverkar lönen för en städare?">
            <p>
              De viktigaste faktorerna är erfarenhet, kvalitet, pålitlighet,
              arbetsgivare, stad och typ av städning. En städare som kan utföra
              hemstädning, kontorsstädning, flyttstädning och återkommande uppdrag
              kan ofta få fler möjligheter.
            </p>

            <p>
              Kommunikation spelar också stor roll. Kunder i Sverige värdesätter
              förtroende, punktlighet och tydliga förväntningar. En tydlig profil,
              snabb respons och bra bemötande kan hjälpa dig få fler jobb.
            </p>
          </Section>

          <Section eyebrow="Städer" title="Städare lön i Stockholm, Göteborg och Malmö">
            <p>
              Stockholm, Göteborg och Malmö har ofta fler städjobb eftersom det
              finns fler bostäder, kontor, företag och flyttar. Större städer kan
              ge fler möjligheter, men också mer konkurrens och högre reskostnader.
            </p>

            <p>
              Om du kan arbeta i flera områden ökar dina chanser. I Stockholm kan
              det till exempel vara värdefullt att även söka i Solna, Sundbyberg,
              Järfälla, Nacka och Huddinge. I Göteborg och Malmö kan närliggande
              kommuner också ge fler uppdrag.
            </p>
          </Section>

          <Section eyebrow="Arbetstyper" title="Vilka städjobb kan ge bättre inkomst?">
            <p>
              Återkommande städning kan ge stabilare inkomst eftersom kunden
              behöver hjälp varje vecka eller varje månad. Flyttstädning kan ibland
              ha högre budget eftersom jobbet är större och tidskänsligt.
              Kontorsstädning kan också vara värdefullt om det blir ett längre
              avtal.
            </p>

            <p>
              För enskilda arbetare handlar det ofta om att skapa ett stabilt flöde
              av uppdrag. För städfirmor handlar det om att få fler förfrågningar
              och behålla bra kunder över tid.
            </p>
          </Section>

          <Section eyebrow="Tips" title="Så kan du öka din inkomst som städare">
            <p>
              Skapa en tydlig profil, lägg till stad, beskriv din erfarenhet och
              visa vilken typ av städning du kan utföra. Skriv om du kan ta
              hemstädning, kontorsstädning, flyttstädning, kvällsjobb, helgjobb
              eller återkommande uppdrag.
            </p>

            <p>
              Om du fortfarande lär dig svenska, fortsätt utveckla språket. Även
              grundläggande svenska kan skapa mer förtroende. Bra omdömen,
              punktlighet och snabb kommunikation kan också hjälpa dig få fler
              kunder.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Hitta städjobb i Sverige
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Clean Jobs hjälper städare, kunder och städfirmor att hitta varandra
              i Sverige. Börja med att se lediga jobb eller skapa en profil.
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
