import Link from "next/link"

import {
  companyDashboardCopy,
  type CompanyWorkspaceSection,
} from "@/lib/company-dashboard/copy"
import type { Locale } from "@/lib/i18n"

type Props = {
  locale: Locale
  active: CompanyWorkspaceSection
  companyId?: string | null
  newLeadsCount?: number
  pendingBookingsCount?: number
}

function CountBadge({ value }: { value?: number }) {
  if (!value || value <= 0) return null

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-black text-white">
      {value > 99 ? "99+" : value}
    </span>
  )
}

export default function CompanyWorkspaceNav({
  locale,
  active,
  companyId,
  newLeadsCount,
  pendingBookingsCount,
}: Props) {
  const t = companyDashboardCopy[locale] || companyDashboardCopy.en

  const withCompany = (href: string) => {
    if (!companyId) return href
    const separator = href.includes("?") ? "&" : "?"
    return `${href}${separator}company=${encodeURIComponent(companyId)}`
  }

  const items: Array<{
    key: CompanyWorkspaceSection
    label: string
    href: string
    count?: number
  }> = [
    {
      key: "overview",
      label: t.navOverview,
      href: withCompany("/dashboard/company"),
    },
    {
      key: "leads",
      label: t.navLeads,
      href: withCompany("/dashboard/company-leads"),
      count: newLeadsCount,
    },
    {
      key: "customers",
      label: t.navCustomers,
      href: withCompany("/dashboard/company-customers"),
    },
    {
      key: "bookings",
      label: t.navBookings,
      href: withCompany("/dashboard/company-bookings"),
      count: pendingBookingsCount,
    },
    {
      key: "websites",
      label: t.navWebsites,
      href: "/dashboard/websites",
    },
    {
      key: "services",
      label: t.navServices,
      href: "/dashboard/services",
    },
    {
      key: "billing",
      label: t.navBilling,
      href: "/billing",
    },
  ]

  return (
    <nav
      aria-label="Company workspace"
      className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
    >
      <div className="flex min-w-max items-center gap-1">
        {items.map((item) => {
          const selected = item.key === active

          return (
            <Link
              key={item.key}
              href={item.href}
              prefetch={false}
              aria-current={selected ? "page" : undefined}
              className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-black transition ${
                selected
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-rose-50 hover:text-rose-700"
              }`}
            >
              <span>{item.label}</span>
              {item.key === "leads" ? <CountBadge value={item.count} /> : null}
              {item.key === "bookings" ? (
                <CountBadge value={item.count} />
              ) : null}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
