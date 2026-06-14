import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

export const metadata: Metadata = {
  title: "Hire a Cleaner in Stockholm | Clean Jobs",
  description: "Find trusted cleaners, cleaning companies, home cleaning and office cleaning services in Stockholm.",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-5xl font-bold">Hire a Cleaner in Stockholm</h1>
        <p className="mt-6 text-slate-600">
          Looking for a cleaner in Stockholm? Clean Jobs helps connect clients with cleaners and cleaning companies.
        </p>
        <Link href="/jobs" className="rounded-2xl bg-rose-600 px-6 py-3 text-white">
          Find Cleaners
        </Link>
        <RelatedGuides currentPath="/work-in-sweden" />
                <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
                <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
                <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" title="Relaterade guider" />
      </main>
    </div>
  )
}
