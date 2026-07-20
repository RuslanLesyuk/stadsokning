import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import NotificationsCenter, {
  type NotificationItem,
} from "@/components/notifications-center"
import {
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"

type NotificationsPageCopy = {
  metadataTitle: string
  metadataDescription: string
  eyebrow: string
  title: string
  description: string
  total: string
  unreadCount: string
  markAllRead: string
  markingAll: string
  markRead: string
  opening: string
  openJob: string
  read: string
  unread: string
  emptyTitle: string
  emptyText: string
  browseJobs: string
}

const copy: Record<Locale, NotificationsPageCopy> = {
  uk: {
    metadataTitle: "Повідомлення | Clean Jobs",
    metadataDescription:
      "Переглядайте заявки, оновлення робіт та інші повідомлення Clean Jobs.",
    eyebrow: "Центр повідомлень",
    title: "Повідомлення",
    description:
      "Тут зібрані заявки, рішення замовників, повідомлення чату та інші важливі оновлення.",
    total: "Усього",
    unreadCount: "Непрочитані",
    markAllRead: "Позначити все прочитаним",
    markingAll: "Оновлення...",
    markRead: "Позначити прочитаним",
    opening: "Відкриваємо...",
    openJob: "Відкрити роботу",
    read: "Прочитано",
    unread: "Нове",
    emptyTitle: "Повідомлень поки немає",
    emptyText:
      "Нові заявки, рішення щодо робіт та інші важливі оновлення з’являться тут.",
    browseJobs: "Переглянути роботи",
  },
  ru: {
    metadataTitle: "Уведомления | Clean Jobs",
    metadataDescription:
      "Просматривайте заявки, обновления работ и другие уведомления Clean Jobs.",
    eyebrow: "Центр уведомлений",
    title: "Уведомления",
    description:
      "Здесь собраны заявки, решения заказчиков, сообщения чата и другие важные обновления.",
    total: "Всего",
    unreadCount: "Непрочитанные",
    markAllRead: "Отметить все прочитанными",
    markingAll: "Обновление...",
    markRead: "Отметить прочитанным",
    opening: "Открываем...",
    openJob: "Открыть работу",
    read: "Прочитано",
    unread: "Новое",
    emptyTitle: "Уведомлений пока нет",
    emptyText:
      "Новые заявки, решения по работам и другие важные обновления появятся здесь.",
    browseJobs: "Посмотреть работы",
  },
  en: {
    metadataTitle: "Notifications | Clean Jobs",
    metadataDescription:
      "View applications, job updates and other Clean Jobs notifications.",
    eyebrow: "Notification centre",
    title: "Notifications",
    description:
      "Applications, hiring decisions, chat messages and other important updates appear here.",
    total: "Total",
    unreadCount: "Unread",
    markAllRead: "Mark all as read",
    markingAll: "Updating...",
    markRead: "Mark as read",
    opening: "Opening...",
    openJob: "Open job",
    read: "Read",
    unread: "New",
    emptyTitle: "No notifications yet",
    emptyText:
      "New applications, job decisions and other important updates will appear here.",
    browseJobs: "Browse jobs",
  },
  sv: {
    metadataTitle: "Aviseringar | Clean Jobs",
    metadataDescription:
      "Visa ansökningar, jobbuppdateringar och andra aviseringar från Clean Jobs.",
    eyebrow: "Aviseringscenter",
    title: "Aviseringar",
    description:
      "Ansökningar, beslut, chattmeddelanden och andra viktiga uppdateringar visas här.",
    total: "Totalt",
    unreadCount: "Olästa",
    markAllRead: "Markera alla som lästa",
    markingAll: "Uppdaterar...",
    markRead: "Markera som läst",
    opening: "Öppnar...",
    openJob: "Öppna jobbet",
    read: "Läst",
    unread: "Ny",
    emptyTitle: "Inga aviseringar ännu",
    emptyText:
      "Nya ansökningar, beslut och andra viktiga uppdateringar kommer att visas här.",
    browseJobs: "Visa jobb",
  },
  pl: {
    metadataTitle: "Powiadomienia | Clean Jobs",
    metadataDescription:
      "Zobacz zgłoszenia, aktualizacje zleceń i inne powiadomienia Clean Jobs.",
    eyebrow: "Centrum powiadomień",
    title: "Powiadomienia",
    description:
      "Tutaj pojawią się zgłoszenia, decyzje klientów, wiadomości i inne ważne aktualizacje.",
    total: "Łącznie",
    unreadCount: "Nieprzeczytane",
    markAllRead: "Oznacz wszystkie jako przeczytane",
    markingAll: "Aktualizowanie...",
    markRead: "Oznacz jako przeczytane",
    opening: "Otwieranie...",
    openJob: "Otwórz zlecenie",
    read: "Przeczytane",
    unread: "Nowe",
    emptyTitle: "Brak powiadomień",
    emptyText:
      "Nowe zgłoszenia, decyzje dotyczące zleceń i inne ważne aktualizacje pojawią się tutaj.",
    browseJobs: "Przeglądaj zlecenia",
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()

  const locale = normalizeLocale(
    cookieStore.get("clean_jobs_locale")?.value,
  ) as Locale

  const t = copy[locale] || copy.en

  return {
    title: t.metadataTitle,
    description: t.metadataDescription,
    alternates: {
      canonical: "https://cleansjob.com/notifications",
    },
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function NotificationsPage() {
  const cookieStore = await cookies()

  const locale = normalizeLocale(
    cookieStore.get("clean_jobs_locale")?.value,
  ) as Locale

  const t = copy[locale] || copy.en

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/notifications")
  }

  const { data, error } = await supabase
    .from("notifications")
    .select(`
      id,
      type,
      title,
      message,
      is_read,
      job_id,
      application_id,
      created_at
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(100)

  if (error) {
    console.error("Load notifications error:", error)
  }

  const notifications = (data ?? []) as NotificationItem[]

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length

  return (
    <main className="min-h-[calc(100vh-76px)] bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-600">
            {t.eyebrow}
          </p>

          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {t.title}
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                {t.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">
                  {t.total}
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-950">
                  {notifications.length}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <p className="text-xs font-medium text-rose-700">
                  {t.unreadCount}
                </p>

                <p className="mt-0.5 text-xl font-bold text-rose-700">
                  {unreadCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <NotificationsCenter
          notifications={notifications}
          locale={locale}
          copy={{
            markAllRead: t.markAllRead,
            markingAll: t.markingAll,
            markRead: t.markRead,
            opening: t.opening,
            openJob: t.openJob,
            read: t.read,
            unread: t.unread,
            emptyTitle: t.emptyTitle,
            emptyText: t.emptyText,
            browseJobs: t.browseJobs,
          }}
        />
      </section>
    </main>
  )
}