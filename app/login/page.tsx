import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const nextPath =
    resolvedSearchParams?.next && resolvedSearchParams.next.startsWith("/")
      ? resolvedSearchParams.next
      : "/dashboard"

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const dictionary = getDictionary(locale)

  async function loginAction(formData: FormData) {
    "use server"

    const email = String(formData.get("email") || "").trim()
    const password = String(formData.get("password") || "")
    const next = String(formData.get("next") || "/dashboard")

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`)
    }

    redirect(next.startsWith("/") ? next : "/dashboard")
  }

  return (
    <main className="bg-[#f6f7fb]">
      <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
          <Link href="/" className="text-sm text-black/60 transition hover:text-black">
            {dictionary.auth.backHome}
          </Link>

          <h1 className="mt-5 text-3xl font-semibold text-black">
            {dictionary.auth.loginTitle}
          </h1>

          <p className="mt-2 text-sm text-black/60">
            {dictionary.auth.loginSubtitle}
          </p>

          <form action={loginAction} className="mt-8 space-y-5">
            <input type="hidden" name="next" value={nextPath} />

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                {dictionary.auth.emailLabel}
              </label>
              <input
                name="email"
                type="email"
                required
                className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                {dictionary.auth.passwordLabel}
              </label>
              <input
                name="password"
                type="password"
                required
                className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-black px-5 text-sm font-medium text-white transition hover:opacity-90"
            >
              {dictionary.auth.submitLogin}
            </button>
          </form>

          <p className="mt-6 text-sm text-black/60">
            {dictionary.auth.noAccount}{" "}
            <Link href="/signup" className="font-medium text-black underline underline-offset-4">
              {dictionary.auth.goToSignup}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}