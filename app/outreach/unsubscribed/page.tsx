import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { normalizeLocale, type Locale } from "@/lib/i18n"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Email preference updated | Clean Jobs",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{ status?: string }>
}

const copy: Record<Locale, { title: string; ok: string; error: string; back: string }> = {
  sv: { title: "E-postinställningen är uppdaterad", ok: "Adressen kommer inte att få fler företagsinbjudningar från Clean Jobs.", error: "Vi kunde inte uppdatera inställningen från den här länken. Kontakta support om du vill stoppa framtida utskick.", back: "Till Clean Jobs" },
  en: { title: "Email preference updated", ok: "This address will no longer receive company invitations from Clean Jobs.", error: "We could not update the preference from this link. Contact support if you want future outreach to stop.", back: "Back to Clean Jobs" },
  uk: { title: "Налаштування email оновлено", ok: "Ця адреса більше не отримуватиме запрошення для компаній від Clean Jobs.", error: "Не вдалося оновити налаштування за цим посиланням. Зверніться до підтримки, щоб припинити майбутні розсилки.", back: "До Clean Jobs" },
  ru: { title: "Настройка email обновлена", ok: "Этот адрес больше не будет получать приглашения для компаний от Clean Jobs.", error: "Не удалось обновить настройку по этой ссылке. Обратитесь в поддержку, чтобы прекратить будущие рассылки.", back: "В Clean Jobs" },
  pl: { title: "Ustawienie e-mail zostało zaktualizowane", ok: "Ten adres nie będzie już otrzymywać zaproszeń dla firm od Clean Jobs.", error: "Nie udało się zaktualizować ustawienia z tego linku. Skontaktuj się z pomocą, jeśli chcesz zatrzymać przyszłe wiadomości.", back: "Do Clean Jobs" },
}

export default async function OutreachUnsubscribedPage({ searchParams }: PageProps) {
  const params = await searchParams
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.sv
  const ok = params.status === "ok"

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-[32px] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">{t.title}</h1>
          <p className={`mt-5 rounded-2xl p-4 text-sm font-semibold ${ok ? "border border-emerald-200 bg-emerald-50 text-emerald-900" : "border border-amber-200 bg-amber-50 text-amber-900"}`}>
            {ok ? t.ok : t.error}
          </p>
          <Link href="/" className="mt-6 inline-flex text-sm font-bold text-rose-700 hover:underline">
            ← {t.back}
          </Link>
        </section>
      </div>
    </main>
  )
}
