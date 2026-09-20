import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import OutreachEmailForm from "@/app/admin/email/outreach-email-form"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Email Sender | Clean Jobs Admin",
  description: "Send manual Clean Jobs outreach emails.",
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export default async function AdminEmailPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin/email")
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Admin · manual outreach
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Clean Jobs email sender
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
              Paste one email address, edit the Clean Jobs template and send it manually.
              Before sending, Clean Jobs checks both this sender history and earlier company invitations.
            </p>
          </div>

          <Link
            href="/admin"
            prefetch={false}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            ← Admin
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          <strong>Sender:</strong> Clean Jobs &lt;noreply@cleansjob.com&gt;. The same Resend sender already used by the site is reused here.
        </div>

        <div className="mt-7">
          <OutreachEmailForm />
        </div>
      </div>
    </main>
  )
}
