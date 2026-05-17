import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Payment cancelled | Clean Jobs",
  description: "Your payment was cancelled.",
}

export default function BillingCancelPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
            Payment cancelled
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Checkout was cancelled
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            No payment was completed. You can return to your profile or try
            again later.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/profile"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              Back to profile
            </Link>

            <Link
              href="/jobs"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Browse jobs
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}