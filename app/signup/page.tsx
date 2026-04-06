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
  email_placeholder: string
  password_placeholder: string
  brand_badge: string
  promo_title: string
  promo_subtitle: string
  feature_profile_title: string
  feature_profile_text: string
  feature_work_title: string
  feature_work_text: string
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
    email_placeholder: "Введіть email",
    password_placeholder: "Створіть пароль",
    brand_badge: "Clean Jobs",
    promo_title: "Реєстрація",
    promo_subtitle: "Створіть акаунт, щоб публікувати роботи, брати замовлення та спілкуватися в чаті.",
    feature_profile_title: "Профіль",
    feature_profile_text: "Керуйте профілем, рейтингом та активністю.",
    feature_work_title: "Робота",
    feature_work_text: "Публікуйте оголошення або беріть доступні замовлення.",
  },
  ru: {
    title: "Регистрация",
    subtitle: "Создайте аккаунт, чтобы публиковать работы, брать заказы и общаться в чате.",
    email: "Email",
    password: "Пароль",
    signup: "Создать аккаунт",
    login_prompt: "Уже есть аккаунт?",
    login_link: "Войти",
    email_placeholder: "Введите email",
    password_placeholder: "Создайте пароль",
    brand_badge: "Clean Jobs",
    promo_title: "Регистрация",
    promo_subtitle: "Создайте аккаунт, чтобы публиковать работы, брать заказы и общаться в чате.",
    feature_profile_title: "Профиль",
    feature_profile_text: "Управляйте профилем, рейтингом и активностью.",
    feature_work_title: "Работа",
    feature_work_text: "Публикуйте объявления или берите доступные заказы.",
  },
  en: {
    title: "Sign up",
    subtitle: "Create an account to post jobs, take jobs, and chat with other users.",
    email: "Email",
    password: "Password",
    signup: "Create account",
    login_prompt: "Already have an account?",
    login_link: "Login",
    email_placeholder: "Enter your email",
    password_placeholder: "Create a password",
    brand_badge: "Clean Jobs",
    promo_title: "Sign up",
    promo_subtitle: "Create an account to post jobs, take jobs, and chat with other users.",
    feature_profile_title: "Profile",
    feature_profile_text: "Manage your profile, rating, and activity.",
    feature_work_title: "Work",
    feature_work_text: "Post jobs or take available orders.",
  },
  sv: {
    title: "Registrera dig",
    subtitle: "Skapa ett konto för att lägga upp jobb, ta jobb och chatta med andra användare.",
    email: "E-post",
    password: "Lösenord",
    signup: "Skapa konto",
    login_prompt: "Har du redan ett konto?",
    login_link: "Logga in",
    email_placeholder: "Ange din e-post",
    password_placeholder: "Skapa ett lösenord",
    brand_badge: "Clean Jobs",
    promo_title: "Registrera dig",
    promo_subtitle: "Skapa ett konto för att lägga upp jobb, ta jobb och chatta med andra användare.",
    feature_profile_title: "Profil",
    feature_profile_text: "Hantera din profil, ditt betyg och din aktivitet.",
    feature_work_title: "Arbete",
    feature_work_text: "Publicera jobb eller ta tillgängliga uppdrag.",
  },
  pl: {
    title: "Rejestracja",
    subtitle: "Utwórz konto, aby dodawać zlecenia, przyjmować pracę i rozmawiać na czacie.",
    email: "Email",
    password: "Hasło",
    signup: "Utwórz konto",
    login_prompt: "Masz już konto?",
    login_link: "Zaloguj się",
    email_placeholder: "Wpisz email",
    password_placeholder: "Utwórz hasło",
    brand_badge: "Clean Jobs",
    promo_title: "Rejestracja",
    promo_subtitle: "Utwórz konto, aby dodawać zlecenia, przyjmować pracę i rozmawiać na czacie.",
    feature_profile_title: "Profil",
    feature_profile_text: "Zarządzaj profilem, oceną i aktywnością.",
    feature_work_title: "Praca",
    feature_work_text: "Dodawaj zlecenia lub przyjmuj dostępne oferty.",
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

  async function signupAction(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "").trim()

    if (!email || !password) {
      redirect("/signup")
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      redirect("/signup")
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

            <form action={signupAction} className="mt-6 space-y-4 sm:mt-8">
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
                  autoComplete="new-password"
                  placeholder={t.password_placeholder}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                />
              </div>

              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
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
          </div>
        </section>

        <section className="order-1 rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm sm:p-6 md:p-8 lg:order-2">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {t.brand_badge}
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                {t.promo_title}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                {t.promo_subtitle}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-900">{t.feature_profile_title}</p>
                <p className="mt-1 text-sm text-slate-600">{t.feature_profile_text}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-medium text-slate-900">{t.feature_work_title}</p>
                <p className="mt-1 text-sm text-slate-600">{t.feature_work_text}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}