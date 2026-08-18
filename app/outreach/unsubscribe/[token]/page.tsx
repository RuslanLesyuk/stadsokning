import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { confirmOutreachUnsubscribeAction } from "@/app/outreach/unsubscribe/actions"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { createAdminClient } from "@/lib/supabase-admin"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Email preferences | Clean Jobs",
  robots: { index: false, follow: false },
}

type PageProps = {
  params: Promise<{ token: string }>
}

type Copy = {
  eyebrow: string
  title: string
  text: string
  confirm: string
  already: string
  invalid: string
  back: string
}

const copy: Record<Locale, Copy> = {
  sv: {
    eyebrow: "E-postinställningar",
    title: "Stoppa företagsinbjudningar",
    text: "Bekräfta att den här e-postadressen inte längre ska få företagsinbjudningar från Clean Jobs. Vi behåller en minimal spärrpost för att respektera valet även vid framtida importer.",
    confirm: "Avregistrera e-postadressen",
    already: "Den här e-postadressen är redan avregistrerad från framtida företagsinbjudningar.",
    invalid: "Länken är ogiltig eller har gått ut.",
    back: "Till Clean Jobs",
  },
  en: {
    eyebrow: "Email preferences",
    title: "Stop company invitations",
    text: "Confirm that this email address should no longer receive company invitations from Clean Jobs. We keep a minimal suppression record so the choice is respected after future imports.",
    confirm: "Unsubscribe this email",
    already: "This email address is already unsubscribed from future company invitations.",
    invalid: "This link is invalid or no longer available.",
    back: "Back to Clean Jobs",
  },
  uk: {
    eyebrow: "Налаштування email",
    title: "Припинити запрошення для компаній",
    text: "Підтвердьте, що ця email-адреса більше не повинна отримувати запрошення для компаній від Clean Jobs. Ми зберігаємо мінімальний запис блокування, щоб враховувати цей вибір і після майбутніх імпортів.",
    confirm: "Відписати цю email-адресу",
    already: "Ця email-адреса вже відписана від майбутніх запрошень для компаній.",
    invalid: "Посилання недійсне або більше не доступне.",
    back: "До Clean Jobs",
  },
  ru: {
    eyebrow: "Настройки email",
    title: "Прекратить приглашения для компаний",
    text: "Подтвердите, что этот email больше не должен получать приглашения для компаний от Clean Jobs. Мы сохраняем минимальную запись блокировки, чтобы учитывать выбор и после будущих импортов.",
    confirm: "Отписать этот email",
    already: "Этот email уже отписан от будущих приглашений для компаний.",
    invalid: "Ссылка недействительна или больше недоступна.",
    back: "В Clean Jobs",
  },
  pl: {
    eyebrow: "Ustawienia e-mail",
    title: "Zatrzymaj zaproszenia dla firm",
    text: "Potwierdź, że ten adres e-mail nie powinien już otrzymywać zaproszeń dla firm od Clean Jobs. Zachowujemy minimalny wpis blokujący, aby respektować ten wybór także po przyszłych importach.",
    confirm: "Wypisz ten adres e-mail",
    already: "Ten adres e-mail jest już wypisany z przyszłych zaproszeń dla firm.",
    invalid: "Ten link jest nieprawidłowy lub nie jest już dostępny.",
    back: "Do Clean Jobs",
  },
}

function maskEmail(value: string) {
  const [local, domain] = value.split("@")
  if (!local || !domain) return "••••••"
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}${"•".repeat(Math.max(3, local.length - visible.length))}@${domain}`
}

export default async function OutreachUnsubscribePage({ params }: PageProps) {
  const { token } = await params
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.sv

  const admin = createAdminClient()
  const { data: preference } = await admin
    .from("outreach_email_preferences")
    .select("email_normalized, opted_out_at")
    .eq("unsubscribe_token", token)
    .maybeSingle()

  const valid = Boolean(preference?.email_normalized)
  const alreadyOptedOut = Boolean(preference?.opted_out_at)

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">{t.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{t.title}</h1>

          {!valid ? (
            <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              {t.invalid}
            </p>
          ) : alreadyOptedOut ? (
            <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
              {t.already}
            </p>
          ) : (
            <>
              <p className="mt-5 text-sm leading-7 text-slate-600">{t.text}</p>
              <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800">
                {maskEmail(preference!.email_normalized)}
              </p>
              <form action={confirmOutreachUnsubscribeAction} className="mt-6">
                <input type="hidden" name="token" value={token} />
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black text-white hover:bg-slate-800"
                >
                  {t.confirm}
                </button>
              </form>
            </>
          )}

          <Link href="/" className="mt-6 inline-flex text-sm font-bold text-rose-700 hover:underline">
            ← {t.back}
          </Link>
        </section>
      </div>
    </main>
  )
}
