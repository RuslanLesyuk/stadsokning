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
  },
  ru: {
    title: "Войти",
    subtitle: "Войдите, чтобы управлять работами, чатами и профилем.",
    email: "Email",
    password: "Пароль",
    login: "Войти",
    signup_prompt: "Ещё нет аккаунта?",
    signup_link: "Зарегистрироваться",
  },
  en: {
    title: "Login",
    subtitle: "Log in to manage jobs, chats, and your profile.",
    email: "Email",
    password: "Password",
    login: "Login",
    signup_prompt: "Do not have an account yet?",
    signup_link: "Sign up",
  },
  sv: {
    title: "Logga in",
    subtitle: "Logga in för att hantera jobb, chattar och din profil.",
    email: "E-post",
    password: "Lösenord",
    login: "Logga in",
    signup_prompt: "Har du inget konto än?",
    signup_link: "Registrera dig",
  },
  pl: {
    title: "Zaloguj się",
    subtitle: "Zaloguj się, aby zarządzać zleceniami, czatami i profilem.",
    email: "Email",
    password: "Hasło",
    login: "Zaloguj się",
    signup_prompt: "Nie masz jeszcze konta?",
    signup_link: "Zarejestruj się",
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

  return (
    <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center px-4 py-8 md:px-6 md:py-12">
      <div className="grid w-full gap-6 lg:grid-cols-2 lg:gap-8">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
            {t.subtitle}
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t.email}
              </label>
              <input
                type="email"
                name="email"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t.password}
              </label>
              <input
                type="password"
                name="password"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90"
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
        </section>
      </div>
    </div>
  )
}