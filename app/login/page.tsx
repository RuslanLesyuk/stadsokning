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
      <div className="grid w-full gap-4 md:gap-6 lg:grid-cols-2 lg:gap-8">
        <section className="order-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8 lg:order-1">
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

        <section className="order-1 rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm sm:p-6 md:p-8 lg:order-2">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                Clean Jobs
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                {t.title}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                {t.subtitle}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-900">Jobs</p>
                <p className="mt-1 text-sm text-slate-600">
                  Create listings and manage responses.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-900">Chat</p>
                <p className="mt-1 text-sm text-slate-600">
                  Message safely after assignment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}