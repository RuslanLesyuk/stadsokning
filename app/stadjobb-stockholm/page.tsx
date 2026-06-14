import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Städjobb Stockholm 2026 | Hitta jobb som städare",
  description: "Hitta städjobb i Stockholm. Guide till hemstädning, kontorsstädning, flyttstädning, extrajobb och arbete som städare i Stockholm.",
  alternates: {
    canonical: "/stadjobb-stockholm",
  },
  keywords: ['städjobb Stockholm', 'städare jobb Stockholm', 'hemstädning jobb Stockholm', 'kontorsstädning jobb Stockholm', 'flyttstädning jobb Stockholm', 'extrajobb städning Stockholm', 'deltidsjobb städning', 'städfirma Stockholm jobb'],
  openGraph: {
    title: "Städjobb Stockholm 2026 | Hitta jobb som städare",
    description: "Hitta städjobb i Stockholm. Guide till hemstädning, kontorsstädning, flyttstädning, extrajobb och arbete som städare i Stockholm.",
    url: `${siteUrl}/stadjobb-stockholm`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Städjobb Stockholm 2026 | Hitta jobb som städare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Städjobb Stockholm 2026 | Hitta jobb som städare",
    description: "Hitta städjobb i Stockholm. Guide till hemstädning, kontorsstädning, flyttstädning, extrajobb och arbete som städare i Stockholm.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can Clean Jobs help?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clean Jobs connects people who need cleaning services with cleaners and cleaning companies looking for work.",
      },
    },
    {
      "@type": "Question",
      name: "Is Clean Jobs only for cleaning work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clean Jobs focuses on cleaning work, but people searching for general work in Sweden can also use the guide pages to understand opportunities in the service sector.",
      },
    },
  ],
}

export default function SeoLandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\u003c"),
        }}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="rounded-[36px] border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/50 p-6 shadow-[0_2px_14px_rgba(15,23,42,0.04)] md:p-10">
          <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            Clean Jobs
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Städjobb i Stockholm: hitta arbete som städare eller anlita städhjälp
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Stockholm har ett stort behov av städare för hemstädning, kontorsstädning, flyttstädning och återkommande uppdrag. Clean Jobs hjälper arbetare, privatpersoner och städfirmor att hitta varandra på ett enklare sätt.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
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
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Guide</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Vad är ett städjobb i Stockholm?</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>Ett städjobb i Stockholm kan vara ett kort uppdrag i en lägenhet, återkommande hemstädning, kontorsstädning för ett företag, flyttstädning eller hjälp efter renovering.</p>
            <p>För att få fler uppdrag är det viktigt att vara tydlig med vilka områden du kan arbeta i, vilka tider du är tillgänglig och vilken typ av städning du har erfarenhet av.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Arbetstyper</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Vanliga städjobb i Stockholm</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>De vanligaste uppdragen är hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning, byggstädning och storstädning.</p>
            <p>Städfirmor kan använda Clean Jobs för att visa sitt företag, hitta nya kunder och få fler uppdrag utan att vara beroende av endast egna annonser eller rekommendationer.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Områden</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Sök städjobb i hela Stockholmsområdet</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>Det är klokt att inte bara söka i centrala Stockholm. Det finns ofta uppdrag i Solna, Sundbyberg, Nacka, Täby, Järfälla, Sollentuna, Huddinge och Botkyrka.</p>
            <p>Kunder uppskattar när en städare tydligt skriver var de kan arbeta. Om du bara kan arbeta i ett område, skriv det. Om du kan resa, skriv också det i din profil.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">För kunder</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Så hittar du rätt städare i Stockholm</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>När du lägger upp ett städjobb bör du beskriva bostadens storlek, typ av städning, önskat datum, budget och om material finns på plats.</p>
            <p>Clean Jobs gör det enklare att få kontakt med städare och företag som aktivt söker uppdrag. Du kan lägga upp jobbet, öppna chatten och välja den person eller firma som passar bäst.</p>
          </div>
        </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">SEO search topics</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              This page is written naturally around the most relevant job and cleaning search phrases for Sweden, Stockholm and the cleaning market.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">städjobb Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">städare jobb Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">hemstädning jobb Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">kontorsstädning jobb Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">flyttstädning jobb Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">extrajobb städning Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">deltidsjobb städning</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">städfirma Stockholm jobb</span>
            </div>
          </section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Start with Clean Jobs</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Clean Jobs helps workers, clients and cleaning companies connect through a focused marketplace for cleaning services and cleaning work in Sweden.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">Browse jobs</Link>
              <Link href="/signup" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]">Create account</Link>
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
