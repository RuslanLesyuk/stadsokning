import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Hur man får jobb i Sverige 2026",
  description:
    "Komplett guide för att hitta jobb i Sverige. Läs om jobbsökning, svenska arbetsgivare, städjobb och arbete för utlänningar.",
  alternates: {
    canonical: "/hur-man-far-jobb-i-sverige",
  },
  keywords: [
    "hur man får jobb i Sverige",
    "jobb i Sverige",
    "arbete i Sverige",
    "jobb för utlänningar",
    "jobb utan svenska",
    "städjobb Sverige",
    "jobb Stockholm",
    "jobb Göteborg",
    "jobb Malmö",
    "jobbsökning Sverige",
  ],
  openGraph: {
    title: "Hur man får jobb i Sverige",
    description:
      "Praktisk guide för att hitta arbete i Sverige som svensk eller utlänning.",
    url: `${siteUrl}/hur-man-far-jobb-i-sverige`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hur man får jobb i Sverige",
      },
    ],
  },
}

export default function HurManFarJobbISverigePage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900 md:text-6xl">
            Hur man får jobb i Sverige
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Sverige är ett av Europas mest attraktiva länder för arbete.
            Varje år söker tusentals människor jobb i Stockholm,
            Göteborg, Malmö och andra svenska städer.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            1. Skapa ett professionellt CV
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Ett tydligt CV är ofta det första en arbetsgivare ser.
            Beskriv tidigare erfarenhet, utbildning, språk och
            kontaktuppgifter på ett enkelt och professionellt sätt.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            2. Använd specialiserade jobbsajter
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Många använder bara stora jobbsidor, men mindre nischade
            plattformar kan ge bättre möjligheter eftersom konkurrensen
            ofta är lägre.
          </p>

          <p className="mt-4 leading-7 text-slate-600">
            Clean Jobs fokuserar exempelvis på städjobb och hjälper
            arbetare, kunder och städfirmor att hitta varandra.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            3. Sök många jobb
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            En vanlig miss är att bara skicka några få ansökningar.
            Personer som lyckas snabbare brukar söka många jobb och
            följa upp när arbetsgivare svarar.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            4. Lär dig svenska
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Det går att hitta vissa jobb på engelska, men svenska ökar
            dina möjligheter betydligt. Även grundläggande svenska kan
            göra stor skillnad i kontakten med arbetsgivare och kunder.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            Branscher som anställer i Sverige
          </h2>

          <ul className="mt-4 space-y-2 pl-6 text-slate-600">
            <li>Städning och facility services</li>
            <li>Byggbranschen</li>
            <li>Vård och omsorg</li>
            <li>Hotell och restaurang</li>
            <li>Lager och logistik</li>
            <li>IT och mjukvaruutveckling</li>
          </ul>

          <h2 className="mt-10 text-3xl font-semibold">
            Städjobb i Sverige
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Städning är fortfarande en av de enklaste vägarna in på
            arbetsmarknaden för många nyanlända. Hemstädning,
            kontorsstädning och flyttstädning efterfrågas i hela Sverige.
          </p>

          <h2 className="mt-10 text-3xl font-semibold">
            Största arbetsmarknaderna
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Stockholm, Göteborg och Malmö erbjuder flest möjligheter,
            men även Uppsala, Västerås, Örebro, Linköping och
            Helsingborg har många lediga tjänster inom service,
            städni<RelatedGuides currentPath="/work-in-sweden" />
        <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
        <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
        <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" title="Relaterade guider" />ng och andra yrken.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/jobs"
              prefetch={false}
              className="rounded-2xl bg-rose-600 px-6 py-3 font-medium text-white transition hover:bg-rose-700"
            >
              Se jobb
            </Link>

            <Link
              href="/signup"
              prefetch={false}
              className="rounded-2xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-50"
            >
              Skapa konto
            </Link>
            <RelatedGuides currentPath="/work-in-sweden" />
                    <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
                    <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
                    <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" title="Relaterade guider" />
          </div>
        </article>
      </main>
    </div>
  )
}