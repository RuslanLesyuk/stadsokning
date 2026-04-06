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
  signup: string
  login_prompt: string
  login_link: string
}

const copy: Record<Locale, Copy> = {
  uk: {
    title: "Реєстрація",
    subtitle: "Створіть акаунт, щоб публікувати роботи, брати замовлення та спілкуватися в чаті.",
    email: "Email",
    password: "Пароль",
    signup: "Створити акаунт",
    login_prompt: "Вже є акаунт?",
    login_link: "Увійти",
  },
  ru: {
    title: "Регистрация",
    subtitle: "Создайте аккаунт, чтобы публиковать работы, брать заказы и общаться в чате.",
    email: "Email",
    password: "Пароль",
    signup: "Создать аккаунт",
    login_prompt: "Уже есть аккаунт?",
    login_link: "Войти",
  },
  en: {
    title: "Sign up",
    subtitle: "Create an account to post jobs, take jobs, and chat with other users.",
    email: "Email",
    password: "Password",
    signup: "Create account",
    login_prompt: "Already have an account?",
    login_link: "Login",
  },
  sv: {
    title: "Registrera dig",
    subtitle: "Skapa ett konto för att lägga upp jobb, ta jobb och chatta med andra användare.",
    email: "E-post",
    password: "Lösenord",
    signup: "Skapa konto",
    login_prompt: "Har du redan ett konto?",
    login_link: "Logga in",
  },
  pl: {
    title: "Rejestracja",
    subtitle: "Utwórz konto, aby dodawać zlecenia, przyjmować pracę i rozmawiać na czacie.",
    email: "Email",
    password: "Hasło",
    signup: "Utwórz konto",
    login_prompt: "Masz już konto?",
    login_link: "Zaloguj się",
  },
}

export default async function SignupPage() {
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
              {t.signup}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {t.login_prompt}{" "}
            <Link href="/login" className="font-medium text-slate-900 underline">
              {t.login_link}
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}