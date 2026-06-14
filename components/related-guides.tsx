import Link from "next/link"

type Guide = {
  href: string
  title: string
  description: string
  label: string
}

const guides: Guide[] = [
  {
    href: "/work-in-sweden",
    label: "Guide",
    title: "Work in Sweden",
    description: "Complete guide to jobs, work and cleaning opportunities in Sweden.",
  },
  {
    href: "/jobs-for-foreigners-in-sweden",
    label: "Foreigners",
    title: "Jobs for Foreigners in Sweden",
    description: "Practical guide for newcomers, immigrants and expats looking for work.",
  },
  {
    href: "/how-to-find-a-job-in-sweden",
    label: "Guide",
    title: "How to Find a Job in Sweden",
    description: "Learn where to search, how to apply and how to get hired faster.",
  },
  {
    href: "/jobb-i-sverige",
    label: "Svenska",
    title: "Jobb i Sverige",
    description: "Guide till arbete, städjobb och möjligheter i Sverige.",
  },
  {
    href: "/jobb-utan-svenska",
    label: "Svenska",
    title: "Jobb utan svenska",
    description: "Hitta arbete i Sverige även om du inte talar flytande svenska.",
  },
  {
    href: "/hur-man-far-jobb-i-sverige",
    label: "Svenska",
    title: "Hur man får jobb i Sverige",
    description: "Praktisk guide för att hitta arbete och få fler intervjuer.",
  },
  {
    href: "/how-much-do-cleaners-earn-in-sweden",
    label: "Salary",
    title: "How Much Do Cleaners Earn in Sweden",
    description: "Cleaner salary guide with monthly pay and income factors.",
  },
  {
    href: "/vad-tjanar-en-stadare-i-sverige",
    label: "Lön",
    title: "Vad tjänar en städare i Sverige",
    description: "Guide till städare lön, månadslön och fler städjobb.",
  },
  {
    href: "/cleaning-company-statistics-sweden",
    label: "Statistics",
    title: "Cleaning Company Statistics Sweden",
    description: "Market data, cleaning companies and industry trends.",
  },
  {
    href: "/stadbranschen-i-sverige-statistik",
    label: "Statistik",
    title: "Städbranschen i Sverige Statistik",
    description: "Guide till städbranschen, marknad och städföretag.",
  },
  {
    href: "/best-cleaning-companies-in-sweden",
    label: "Companies",
    title: "Best Cleaning Companies in Sweden",
    description: "Find trusted cleaning companies and services across Sweden.",
  },
  {
    href: "/basta-stadforetag-i-sverige",
    label: "Företag",
    title: "Bästa Städföretag i Sverige",
    description: "Hitta städföretag, hemstädning och kontorsstädning.",
  },
  {
    href: "/cleaning-jobs-stockholm",
    label: "Stockholm",
    title: "Cleaning Jobs Stockholm",
    description: "Find cleaning jobs and cleaner work in Stockholm.",
  },
  {
    href: "/stadjobb-stockholm",
    label: "Städjobb",
    title: "Städjobb Stockholm",
    description: "Hitta städjobb, hemstädning och flyttstädning i Stockholm.",
  },
  {
    href: "/cleaning-jobs-gothenburg",
    label: "Gothenburg",
    title: "Cleaning Jobs Gothenburg",
    description: "Find cleaning jobs and cleaner work in Gothenburg.",
  },
  {
    href: "/stadjobb-goteborg",
    label: "Städjobb",
    title: "Städjobb Göteborg",
    description: "Hitta städjobb och städuppdrag i Göteborg.",
  },
  {
    href: "/cleaning-jobs-malmo",
    label: "Malmö",
    title: "Cleaning Jobs Malmö",
    description: "Find cleaning jobs and cleaner work in Malmö.",
  },
  {
    href: "/stadjobb-malmo",
    label: "Städjobb",
    title: "Städjobb Malmö",
    description: "Hitta städjobb och städuppdrag i Malmö.",
  },
  {
    href: "/hire-cleaner-stockholm",
    label: "Clients",
    title: "Hire a Cleaner in Stockholm",
    description: "Find trusted cleaners and cleaning companies in Stockholm.",
  },
  {
    href: "/stadfirma-stockholm",
    label: "Städfirma",
    title: "Städfirma Stockholm",
    description: "Hitta städfirmor och städtjänster i Stockholm.",
  },
]

function hashString(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

export default function RelatedGuides({
  currentPath,
  title = "Related guides",
}: {
  currentPath: string
  title?: string
}) {
  const availableGuides = guides.filter((guide) => guide.href !== currentPath)
  const startIndex = hashString(currentPath) % availableGuides.length

  const selectedGuides = [
    ...availableGuides.slice(startIndex),
    ...availableGuides.slice(0, startIndex),
  ].slice(0, 4)

  return (
    <section className="mt-10 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            SEO hub
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            {title}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            Explore more guides about jobs, cleaning work, salaries and cleaning
            companies in Sweden.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {selectedGuides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            prefetch={false}
            className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
          >
            <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              {guide.label}
            </div>

            <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-rose-700">
              {guide.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {guide.description}
            </p>

            <div className="mt-5 text-sm font-semibold text-rose-700">
              Read guide →
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}