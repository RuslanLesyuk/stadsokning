import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale, type Locale } from "@/lib/i18n"

export const metadata: Metadata = { title: "Payment successful | Clean Jobs", robots: { index: false, follow: false } }

const copy: Record<Locale, { badge: string; title: string; text: string; billing: string; profile: string }> = {
  sv: { badge: "Betalning slutförd", title: "Tack", text: "Stripe behandlar betalningen. Premium-statusen uppdateras via webhook och kan ta några sekunder.", billing: "Öppna fakturering", profile: "Till profil" },
  en: { badge: "Payment completed", title: "Thank you", text: "Stripe is processing the payment. Premium status is synchronized by webhook and can take a few seconds.", billing: "Open billing", profile: "Go to profile" },
  uk: { badge: "Оплату завершено", title: "Дякуємо", text: "Stripe обробляє оплату. Premium-статус синхронізується через webhook і може оновитися за кілька секунд.", billing: "Відкрити оплату", profile: "До профілю" },
  ru: { badge: "Оплата завершена", title: "Спасибо", text: "Stripe обрабатывает оплату. Premium-статус синхронизируется через webhook и может обновиться через несколько секунд.", billing: "Открыть оплату", profile: "К профилю" },
  pl: { badge: "Płatność zakończona", title: "Dziękujemy", text: "Stripe przetwarza płatność. Status Premium jest synchronizowany przez webhook i może zająć kilka sekund.", billing: "Otwórz rozliczenia", profile: "Do profilu" },
}

export default async function BillingSuccessPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE) as Locale
  const t = copy[locale]
  return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><section className="rounded-[2rem] border border-emerald-200 bg-white p-7 shadow-sm"><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{t.badge}</span><h1 className="mt-5 text-4xl font-black text-slate-950">{t.title}</h1><p className="mt-4 leading-7 text-slate-600">{t.text}</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/billing" className="inline-flex min-h-11 items-center rounded-2xl bg-rose-600 px-5 text-sm font-black text-white">{t.billing}</Link><Link href="/profile" className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700">{t.profile}</Link></div></section></div></main>
}
