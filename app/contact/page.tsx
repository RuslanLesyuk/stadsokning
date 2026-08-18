import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { normalizeLocale, type Locale } from "@/lib/i18n"
import { formatLegalOperator, getLegalOperator } from "@/lib/legal/config"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Contact | Clean Jobs", description: "Contact Clean Jobs support." }

const copy: Record<Locale, { title: string; subtitle: string; back: string; support: string; legal: string; response: string }> = {
  sv: { title: "Kontakt", subtitle: "Support, integritetsfrågor och juridisk kontakt för Clean Jobs.", back: "Tillbaka", support: "Support", legal: "Tjänsteoperatör", response: "Vanligtvis svar inom 1–2 arbetsdagar." },
  en: { title: "Contact", subtitle: "Support, privacy questions, and legal contact for Clean Jobs.", back: "Back", support: "Support", legal: "Service operator", response: "Usually replies within 1–2 business days." },
  uk: { title: "Контакти", subtitle: "Підтримка, privacy-запити та юридичні контакти Clean Jobs.", back: "Назад", support: "Підтримка", legal: "Оператор сервісу", response: "Зазвичай відповідаємо протягом 1–2 робочих днів." },
  ru: { title: "Контакты", subtitle: "Поддержка, privacy-запросы и юридические контакты Clean Jobs.", back: "Назад", support: "Поддержка", legal: "Оператор сервиса", response: "Обычно отвечаем в течение 1–2 рабочих дней." },
  pl: { title: "Kontakt", subtitle: "Wsparcie, pytania dotyczące prywatności i kontakt prawny Clean Jobs.", back: "Wróć", support: "Wsparcie", legal: "Operator usługi", response: "Zwykle odpowiadamy w ciągu 1–2 dni roboczych." },
}

export default async function ContactPage() {
  const store = await cookies(); const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale; const t = copy[locale] || copy.en; const operator = getLegalOperator()
  return <main className="min-h-screen bg-[#fafafa]"><div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12"><Link href="/" className="text-sm font-bold text-slate-600 hover:text-rose-700">← {t.back}</Link><header className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 md:p-8"><h1 className="text-3xl font-black text-slate-950 md:text-5xl">{t.title}</h1><p className="mt-4 leading-7 text-slate-600">{t.subtitle}</p></header><section className="mt-6 grid gap-4 md:grid-cols-2"><article className="rounded-[28px] border border-slate-200 bg-white p-6"><p className="text-xs font-black uppercase tracking-wide text-slate-400">{t.support}</p><a href={`mailto:${operator.supportEmail}`} className="mt-3 block text-lg font-black text-rose-700">{operator.supportEmail}</a><p className="mt-3 text-sm text-slate-600">{t.response}</p></article><article className="rounded-[28px] border border-slate-200 bg-white p-6"><p className="text-xs font-black uppercase tracking-wide text-slate-400">{t.legal}</p><p className="mt-3 break-words text-sm font-bold leading-7 text-slate-800">{formatLegalOperator(operator)}</p>{!operator.configured ? <p className="mt-3 text-sm font-semibold text-amber-700">Legal identity is not fully configured for production.</p> : null}</article></section><div className="mt-6 flex flex-wrap gap-3"><Link href="/terms" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Terms</Link><Link href="/privacy" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800">Privacy</Link><Link href="/cookies" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800">Cookies</Link></div></div></main>
}
