import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale, type Locale } from "@/lib/i18n"

export const metadata: Metadata = { title: "Payment cancelled | Clean Jobs", robots: { index: false, follow: false } }

const copy: Record<Locale, { badge: string; title: string; text: string; billing: string; profile: string }> = {
  sv: { badge: "Betalning avbruten", title: "Checkout avbröts", text: "Ingen ny betalning slutfördes. Din befintliga plan har inte ändrats.", billing: "Tillbaka till fakturering", profile: "Till profil" },
  en: { badge: "Payment cancelled", title: "Checkout was cancelled", text: "No new payment was completed. Your existing plan has not been changed.", billing: "Back to billing", profile: "Go to profile" },
  uk: { badge: "Оплату скасовано", title: "Checkout скасовано", text: "Нову оплату не завершено. Ваш поточний план не змінено.", billing: "Назад до оплати", profile: "До профілю" },
  ru: { badge: "Оплата отменена", title: "Checkout отменён", text: "Новая оплата не завершена. Ваш текущий план не изменён.", billing: "Назад к оплате", profile: "К профилю" },
  pl: { badge: "Płatność anulowana", title: "Checkout anulowany", text: "Nowa płatność nie została zakończona. Obecny plan nie został zmieniony.", billing: "Wróć do rozliczeń", profile: "Do profilu" },
}

export default async function BillingCancelPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE) as Locale
  const t = copy[locale]
  return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{t.badge}</span><h1 className="mt-5 text-4xl font-black text-slate-950">{t.title}</h1><p className="mt-4 leading-7 text-slate-600">{t.text}</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/billing" className="inline-flex min-h-11 items-center rounded-2xl bg-slate-950 px-5 text-sm font-black text-white">{t.billing}</Link><Link href="/profile" className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700">{t.profile}</Link></div></section></div></main>
}
