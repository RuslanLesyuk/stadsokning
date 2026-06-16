import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

export const metadata: Metadata = {
  title: "Städfirma Stockholm | Clean Jobs",
  description: "Hitta städfirmor, hemstädning, kontorsstädning och flyttstädning i Stockholm.",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-5xl font-bold">Städfirma Stockholm</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
  Hitta städfirmor och städtjänster i Stockholm.
</p>

<div className="mt-8 flex flex-wrap gap-3">
  <Link
    href="/jobs/create"
    prefetch={false}
    className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
  >
    Lägg upp städjobb
  </Link>

  <Link
    href="/jobs"
    prefetch={false}
    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
  >
    Se städtjänster
  </Link>
</div>
        <RelatedGuides currentPath="/work-in-sweden" />
                <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
                <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
                <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" title="Relaterade guider" />
      </main>
    </div>
  )
}
