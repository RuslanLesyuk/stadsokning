import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Städfirma Stockholm | Clean Jobs",
  description: "Hitta städfirmor, hemstädning, kontorsstädning och flyttstädning i Stockholm.",
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-5xl font-bold">Städfirma Stockholm</h1>
        <p className="mt-6 text-slate-600">
          Hitta städfirmor och städtjänster i Stockholm.
        </p>
        <Link href="/jobs" className="rounded-2xl bg-rose-600 px-6 py-3 text-white">
          Se städtjänster
        </Link>
      </main>
    </div>
  )
}
