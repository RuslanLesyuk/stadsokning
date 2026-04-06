import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"

type Copy = {
  title: string
  subtitle: string
  email: string
  password: string
  login: string
  signup_prompt: string
  signup_link: string
  email_placeholder: string
  password_placeholder: string
  brand_badge: string
  promo_title: string
  promo_subtitle: string
  feature_jobs_title: string
  feature_jobs_text: string
  feature_chat_title: string
  feature_chat_text: string
}

const copy: Record<Locale, Copy> = {
  uk: {
    title: "Увійти",
    subtitle: "Увійдіть, щоб керувати роботами, чатами та профілем.",
    email: "Email",
    password: "Пароль",
    login: "Увійти",
    signup_prompt: "Ще немає акаунта?",
    signup_link: "Зареєструватися",
    email_placeholder: "Введіть email",
    password_placeholder: "Введіть пароль",
    brand_badge: "Clean Jobs",
    promo_title: "Увійти",
    promo_subtitle: "Увійдіть, щоб керувати роботами, чатами та профілем.",
    feature_jobs_title: "Роботи",
    feature_jobs_text: "Створюйте оголошення та керуйте відгуками.",
    feature_chat_title: "Чат",
    feature_chat_text: "Безпечно спілкуйтеся після призначення виконавця.",
  },
  ru: {
    title: "Войти",
    subtitle: "Войдите, чтобы управлять работами, чатами и профилем.",
    email: "Email",
    password: "Пароль",
    login: "Войти",
    signup_prompt: "Ещё нет аккаунта?",
    signup_link: "Зарегистрироваться",
    email_placeholder: "Введите email",
    password_placeholder: "Введите пароль",
    brand_badge: "Clean Jobs",
    promo_title: "Войти",
    promo_subtitle: "Войдите, чтобы управлять работами, чатами и профилем.",
    feature_jobs_title: "Работы",
    feature_jobs_text: "Создавайте объявления и управляйте откликами.",
    feature_chat_title: "Чат",
    feature_chat_text: "Безопасно общайтесь после назначения исполнителя.",
  },
  en: {
    title: "Login",
    subtitle: "Log in to manage jobs, chats, and your profile.",
    email: "Email",
    password: "Password",
    login: "Login",
    signup_prompt: "Do not have an account yet?",
    signup_link: "Sign up",
    email_placeholder: "Enter your email",
    password_placeholder: "Enter your password",
    brand_badge: "Clean Jobs",
    promo_title: "Login",
    promo_subtitle: "Log in to manage jobs, chats, and your profile.",
    feature_jobs_title: "Jobs",
    feature_jobs_text: "Create listings and manage responses.",
    feature_chat_title: "Chat",
    feature_chat_text: "Message safely after assignment.",
  },
  sv: {
    title: "Logga in",
    subtitle: "Logga in för att hantera jobb, chattar och din profil.",
    email: "E-post",
    password: "Lösenord",
    login: "Logga in",
    signup_prompt: "Har du inget konto än?",
    signup_link: "Registrera dig",
    email_placeholder: "Ange din e-post",
    password_placeholder: "Ange ditt lösenord",
    brand_badge: "Clean Jobs",
    promo_title: "Logga in",
    promo_subtitle: "Logga in för att hantera jobb, chattar och din profil.",
    feature_jobs_title: "Jobb",
    feature_jobs_text: "Skapa annonser och hantera svar.",
    feature_chat_title: "Chatt",
    feature_chat_text: "Meddela säkert efter att jobbet har tilldelats.",
  },
  pl: {
    title: "Zaloguj się",
    subtitle: "Zaloguj się, aby zarządzać zleceniami, czatami i profilem.",
    email: "Email",
    password: "Hasło",
    login: "Zaloguj się",
    signup_prompt: "Nie masz jeszcze konta?",
    signup_link: "Zarejestruj się",
    email_placeholder: "Wpisz email",
    password_placeholder: "Wpisz hasło",
    brand_badge: "Clean Jobs",
    promo_title: "Zaloguj się",
    promo_subtitle: "Zaloguj się, aby zarządzać zleceniami, czatami i profilem.",
    feature_jobs_title: "Zlecenia",
    feature_jobs_text: "Twórz ogłoszenia i zarządzaj odpowiedziami.",
    feature_chat_title: "Czat",
    feature_chat_text: "Pisz bezpiecznie po przydzieleniu zlecenia.",
  },
}

export default async function LoginPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  async function loginAction(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "").trim()

    if (!email || !password) {
      redirect("/login")
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect("/login")
    }

    redirect("/dashboard")
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-6xl items-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid w-full gap-4 lg:grid-cols-2 lg:gap-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {t.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              {t.subtitle}
            </p>

            <form action={loginAction} className="mt-6 space-y-4 sm:mt-8">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t.email}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder={t.email_placeholder}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t.password}
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder={t.password_placeholder}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                {t.login}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              {t.signup_prompt}{" "}
              <Link href="/signup" className="font-medium text-slate-900 underline">
                {t.signup_link}
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm lg:flex lg:flex-col lg:justify-between xl:p-8">
          <div>
            <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              {t.brand_badge}
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 xl:text-3xl">
              {t.promo_title}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 xl:text-base">
              {t.promo_subtitle}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-900">{t.feature_jobs_title}</p>
              <p className="mt-1 text-sm text-slate-600">{t.feature_jobs_text}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-900">{t.feature_chat_title}</p>
              <p className="mt-1 text-sm text-slate-600">{t.feature_chat_text}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}