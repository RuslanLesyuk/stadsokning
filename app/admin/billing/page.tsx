import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Billing | Clean Jobs Admin",
  robots: { index: false, follow: false },
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function formatDate(value: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

type BillingRow = {
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  billing_interval: string
  price_id: string | null
  status: string
  cancel_at_period_end: boolean
  current_period_end: string | null
  grace_until: string | null
  last_invoice_status: string | null
  last_payment_failed_at: string | null
  updated_at: string
}

type ProfileRow = {
  id: string
  full_name: string | null
  company_name: string | null
  is_premium: boolean | null
  premium_source: string | null
  premium_override_until: string | null
}

export default async function AdminBillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) redirect("/login?next=/admin/billing")
  if (!getAdminEmails().includes(user.email.toLowerCase())) redirect("/dashboard")

  const admin = createAdminClient()
  const [{ data: billingData, error: billingError }, { data: profilesData, error: profilesError }, usersResult] =
    await Promise.all([
      admin.from("billing_subscriptions").select("*").order("updated_at", { ascending: false }).limit(250),
      admin
        .from("profiles")
        .select("id, full_name, company_name, is_premium, premium_source, premium_override_until")
        .order("premium_updated_at", { ascending: false })
        .limit(500),
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ])

  if (billingError) console.error("Admin billing subscriptions error:", billingError)
  if (profilesError) console.error("Admin billing profiles error:", profilesError)
  if (usersResult.error) console.error("Admin billing auth users error:", usersResult.error)

  const billing = (billingData ?? []) as BillingRow[]
  const profiles = (profilesData ?? []) as ProfileRow[]
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]))
  const emailById = new Map(
    (usersResult.data?.users ?? []).map((authUser) => [authUser.id, authUser.email || ""]),
  )

  const activeCount = billing.filter((row) => ["active", "trialing"].includes(row.status)).length
  const pastDueCount = billing.filter((row) => row.status === "past_due").length
  const legacyCount = billing.filter((row) => row.status === "legacy").length

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-sm font-bold text-slate-500 hover:text-rose-600">← Admin</Link>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-rose-600">Monetization</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">Billing subscriptions</h1>
          <p className="mt-3 text-slate-600">Stripe subscription state, grace periods and legacy Premium records.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <Stat label="Active / trialing" value={activeCount} />
            <Stat label="Past due" value={pastDueCount} />
            <Stat label="Legacy" value={legacyCount} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {billing.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
            No billing records yet.
          </div>
        ) : (
          <div className="space-y-4">
            {billing.map((row) => {
              const profile = profileById.get(row.user_id)
              return (
                <article key={row.user_id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-lg font-black text-slate-950">{profile?.full_name || emailById.get(row.user_id) || row.user_id}</h2>
                      <p className="mt-1 text-sm text-slate-500">{emailById.get(row.user_id) || "No email"}{profile?.company_name ? ` · ${profile.company_name}` : ""}</p>
                      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
                        <Detail label="Interval" value={row.billing_interval} />
                        <Detail label="Period end" value={formatDate(row.current_period_end)} />
                        <Detail label="Grace until" value={formatDate(row.grace_until)} />
                        <Detail label="Last invoice" value={row.last_invoice_status || "—"} />
                      </div>
                      <div className="mt-4 space-y-1 break-all text-xs text-slate-400">
                        <p>Customer: {row.stripe_customer_id || "—"}</p>
                        <p>Subscription: {row.stripe_subscription_id || "—"}</p>
                        <p>Price: {row.price_id || "—"}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{row.status}</Badge>
                      {row.cancel_at_period_end ? <Badge>cancel at period end</Badge> : null}
                      {profile?.premium_source ? <Badge>{profile.premium_source}</Badge> : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-3xl font-black text-slate-950">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p></div>
}
function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-800">{value}</p></div>
}
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-700">{children}</span>
}
