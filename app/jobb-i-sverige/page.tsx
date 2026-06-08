import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Jobb i Sverige 2026 | Städjobb, extrajobb och arbete",
  description: "Guide till jobb i Sverige 2026. Läs om städjobb, jobb utan perfekt svenska, deltidsjobb, heltidsjobb och hur Clean Jobs hjälper städare och kunder att hitta varandra.",
  alternates: {
    canonical: "/jobb-i-sverige",
  },
  keywords: ['jobb i Sverige', 'städjobb', 'städjobb Stockholm', 'städare jobb', 'jobb utan svenska', 'extrajobb Sverige', 'deltidsjobb Sverige', 'heltidsjobb Sverige', 'städfirma jobb', 'hemstädning jobb'],
  openGraph: {
    title: "Jobb i Sverige 2026 | Städjobb, extrajobb och arbete",
    description: "Guide till jobb i Sverige 2026. Läs om städjobb, jobb utan perfekt svenska, deltidsjobb, heltidsjobb och hur Clean Jobs hjälper städare och kunder att hitta varandra.",
    url: `${siteUrl}/jobb-i-sverige`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jobb i Sverige 2026 | Städjobb, extrajobb och arbete",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobb i Sverige 2026 | Städjobb, extrajobb och arbete",
    description: "Guide till jobb i Sverige 2026. Läs om städjobb, jobb utan perfekt svenska, deltidsjobb, heltidsjobb och hur Clean Jobs hjälper städare och kunder att hitta varandra.",
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
            Jobb i Sverige: städjobb, extrajobb och praktiska vägar till arbete
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Att hitta jobb i Sverige kan kännas svårt, särskilt om man är ny i landet eller fortfarande lär sig svenska. Städjobb, hemstädning, kontorsstädning och flyttstädning kan vara en bra väg in på arbetsmarknaden eftersom behovet finns i många städer.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              Visa städjobb
            </Link>

            <Link
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Lägg upp jobb
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Arbetsmarknad</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Så hittar du jobb i Sverige</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>Börja med att bestämma vilken typ av arbete du söker: heltid, deltid, extrajobb, säsongsarbete eller uppdrag nära där du bor. För många är serviceyrken, lager, restaurang, bygg och städning praktiska första steg.</p>
            <p>Ett tydligt CV, ett aktivt telefonnummer och snabb respons gör stor skillnad. Om du söker städjobb bör du också visa i vilken stad du kan arbeta, vilka tider du är tillgänglig och vilken typ av städning du kan utföra.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Städjobb</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Städjobb i Sverige</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>Städjobb kan vara hemstädning, kontorsstädning, trappstädning, byggstädning, flyttstädning eller återkommande städuppdrag. Kunderna söker ofta någon som är pålitlig, noggrann och lätt att kommunicera med.</p>
            <p>Clean Jobs är byggt för att göra det enklare att hitta städjobb och städare på ett ställe. Arbetare kan hitta uppdrag, kunder kan lägga upp jobb och städfirmor kan visa sin profil.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Språk</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Jobb utan perfekt svenska</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>Vissa arbeten kräver mycket svenska, men alla jobb gör inte det. För städjobb kan det ibland räcka med grundläggande svenska, engelska eller tydliga instruktioner.</p>
            <p>Om du fortfarande lär dig svenska kan du skriva din profil på enkel svenska eller engelska. Lägg till din stad, erfarenhet, tillgänglighet och om du kan arbeta kvällar eller helger.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Städer</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Var finns det flest möjligheter?</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>Stockholm, Göteborg och Malmö är starka områden för städjobb och servicejobb, men även mindre städer och kommuner har behov av städning.</p>
            <p>För dig som bor nära Stockholm kan det vara smart att söka även i Solna, Sundbyberg, Järfälla, Nacka, Huddinge, Täby och Botkyrka.</p>
          </div>
        </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">SEO search topics</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              This page is written naturally around the most relevant job and cleaning search phrases for Sweden, Stockholm and the cleaning market.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">jobb i Sverige</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">städjobb</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">städjobb Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">städare jobb</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">jobb utan svenska</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">extrajobb Sverige</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">deltidsjobb Sverige</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">heltidsjobb Sverige</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">städfirma jobb</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">hemstädning jobb</span>
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
        </div>
      </main>
    </div>
  )
}
