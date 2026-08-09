import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { Input, Select, Textarea } from "@/components/ui/field"
import {
  COMPANY_SITE_LOCALES,
  type CompanySiteCompany,
  type CompanySiteLocale,
  type CompanySiteRow,
} from "@/lib/company-sites/types"
import {
  DEFAULT_SECTION_SETTINGS,
  normalizeContent,
  normalizeEnabledLocales,
  normalizeSectionSettings,
  normalizeSeoSettings,
  normalizeSocialLinks,
  slugifySite,
} from "@/lib/company-sites/utils"
import { normalizeLocale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"
import { saveCompanyWebsiteAction } from "./actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    saved?: string
    published?: string
    unpublished?: string
    error?: string
  }>
}

type EditorCopy = {
  back: string
  eyebrow: string
  title: string
  subtitle: string
  status: string
  draft: string
  published: string
  openSite: string
  preview: string
  saved: string
  publishedMessage: string
  unpublishedMessage: string
  error: string
  identity: string
  siteSlug: string
  siteSlugHelp: string
  template: string
  modern: string
  minimal: string
  elegant: string
  primaryColor: string
  secondaryColor: string
  languages: string
  defaultLanguage: string
  enabledLanguages: string
  content: string
  contentHelp: string
  heroTitle: string
  heroSubtitle: string
  aboutTitle: string
  aboutText: string
  ctaTitle: string
  ctaText: string
  sections: string
  sectionsHelp: string
  services: string
  pricing: string
  about: string
  gallery: string
  reviews: string
  areas: string
  hours: string
  faq: string
  contact: string
  social: string
  facebook: string
  instagram: string
  linkedin: string
  tiktok: string
  seo: string
  seoHelp: string
  seoTitle: string
  seoDescription: string
  domain: string
  customDomain: string
  domainHelp: string
  domainStatus: string
  save: string
  savePreview: string
  publish: string
  unpublish: string
}

const editorCopy: Record<CompanySiteLocale, EditorCopy> = {
  sv: {
    back: "Företagswebbplatser",
    eyebrow: "Website-as-a-Service",
    title: "Företagets webbplats",
    subtitle: "Bygg och publicera en fristående företagswebbplats med data från Clean Jobs-profilen.",
    status: "Status",
    draft: "Utkast",
    published: "Publicerad",
    openSite: "Öppna webbplats",
    preview: "Förhandsvisning",
    saved: "Webbplatsinställningarna har sparats.",
    publishedMessage: "Webbplatsen är publicerad.",
    unpublishedMessage: "Webbplatsen är nu ett utkast.",
    error: "Webbplatsen kunde inte sparas. Kontrollera slug, domän och fält.",
    identity: "Design och adress",
    siteSlug: "Webbadress på Clean Jobs",
    siteSlugHelp: "Publiceras som cleansjob.com/site/din-adress.",
    template: "Mall",
    modern: "Modern",
    minimal: "Minimal",
    elegant: "Elegant",
    primaryColor: "Primär färg",
    secondaryColor: "Sekundär färg",
    languages: "Språk",
    defaultLanguage: "Standardspråk",
    enabledLanguages: "Aktiverade språk",
    content: "Marknadsföringstext",
    contentHelp: "Fyll i det viktigaste på svenska först. Tomma fält använder automatiskt företagsprofilen.",
    heroTitle: "Hero-rubrik",
    heroSubtitle: "Hero-text",
    aboutTitle: "Rubrik om företaget",
    aboutText: "Om företaget",
    ctaTitle: "CTA-rubrik",
    ctaText: "CTA-text",
    sections: "Sektioner",
    sectionsHelp: "Välj vilka delar som ska synas på webbplatsen.",
    services: "Tjänster",
    pricing: "Priser",
    about: "Om oss",
    gallery: "Galleri",
    reviews: "Omdömen",
    areas: "Serviceområden",
    hours: "Öppettider",
    faq: "FAQ",
    contact: "Kontakt",
    social: "Sociala medier",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    seo: "SEO",
    seoHelp: "Unika titlar och beskrivningar per språk. Lämna tomt för automatiska värden.",
    seoTitle: "SEO-titel",
    seoDescription: "Meta-beskrivning",
    domain: "Egen domän",
    customDomain: "Domän",
    domainHelp: "MVP sparar domänen och förbereder DNS-flödet. Automatisk Vercel/DNS-verifiering kommer senare.",
    domainStatus: "Domänstatus",
    save: "Spara",
    savePreview: "Spara och förhandsvisa",
    publish: "Publicera webbplats",
    unpublish: "Avpublicera",
  },
  en: {
    back: "Company websites",
    eyebrow: "Website-as-a-Service",
    title: "Company website",
    subtitle: "Build and publish a standalone company website powered by the Clean Jobs company profile.",
    status: "Status",
    draft: "Draft",
    published: "Published",
    openSite: "Open website",
    preview: "Preview",
    saved: "Website settings have been saved.",
    publishedMessage: "The website is published.",
    unpublishedMessage: "The website is now a draft.",
    error: "The website could not be saved. Check the slug, domain and fields.",
    identity: "Design and address",
    siteSlug: "Clean Jobs website address",
    siteSlugHelp: "Published as cleansjob.com/site/your-address.",
    template: "Template",
    modern: "Modern",
    minimal: "Minimal",
    elegant: "Elegant",
    primaryColor: "Primary color",
    secondaryColor: "Secondary color",
    languages: "Languages",
    defaultLanguage: "Default language",
    enabledLanguages: "Enabled languages",
    content: "Marketing copy",
    contentHelp: "Complete Swedish first. Empty fields automatically fall back to company profile data.",
    heroTitle: "Hero title",
    heroSubtitle: "Hero text",
    aboutTitle: "About heading",
    aboutText: "About text",
    ctaTitle: "CTA heading",
    ctaText: "CTA text",
    sections: "Sections",
    sectionsHelp: "Choose which parts are visible on the website.",
    services: "Services",
    pricing: "Pricing",
    about: "About",
    gallery: "Gallery",
    reviews: "Reviews",
    areas: "Service areas",
    hours: "Opening hours",
    faq: "FAQ",
    contact: "Contact",
    social: "Social media",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    seo: "SEO",
    seoHelp: "Unique title and description per language. Leave blank for automatic values.",
    seoTitle: "SEO title",
    seoDescription: "Meta description",
    domain: "Custom domain",
    customDomain: "Domain",
    domainHelp: "The MVP stores the domain and prepares the DNS flow. Automated Vercel/DNS verification comes later.",
    domainStatus: "Domain status",
    save: "Save",
    savePreview: "Save and preview",
    publish: "Publish website",
    unpublish: "Unpublish",
  },
  uk: {
    back: "Сайти компаній",
    eyebrow: "Website-as-a-Service",
    title: "Сайт компанії",
    subtitle: "Створіть і опублікуйте окремий сайт компанії на основі даних профілю Clean Jobs.",
    status: "Статус",
    draft: "Чернетка",
    published: "Опубліковано",
    openSite: "Відкрити сайт",
    preview: "Попередній перегляд",
    saved: "Налаштування сайту збережено.",
    publishedMessage: "Сайт опубліковано.",
    unpublishedMessage: "Сайт переведено в чернетку.",
    error: "Не вдалося зберегти сайт. Перевірте slug, домен і поля.",
    identity: "Дизайн і адреса",
    siteSlug: "Адреса сайту в Clean Jobs",
    siteSlugHelp: "Публікується як cleansjob.com/site/ваша-адреса.",
    template: "Шаблон",
    modern: "Modern",
    minimal: "Minimal",
    elegant: "Elegant",
    primaryColor: "Основний колір",
    secondaryColor: "Другий колір",
    languages: "Мови",
    defaultLanguage: "Мова за замовчуванням",
    enabledLanguages: "Активні мови",
    content: "Маркетинговий контент",
    contentHelp: "Спочатку заповніть шведську. Порожні поля автоматично беруть дані з профілю компанії.",
    heroTitle: "Заголовок Hero",
    heroSubtitle: "Текст Hero",
    aboutTitle: "Заголовок Про нас",
    aboutText: "Текст Про нас",
    ctaTitle: "Заголовок CTA",
    ctaText: "Текст CTA",
    sections: "Секції",
    sectionsHelp: "Оберіть, які блоки показувати на сайті.",
    services: "Послуги",
    pricing: "Ціни",
    about: "Про нас",
    gallery: "Галерея",
    reviews: "Відгуки",
    areas: "Райони роботи",
    hours: "Графік",
    faq: "FAQ",
    contact: "Контакти",
    social: "Соціальні мережі",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    seo: "SEO",
    seoHelp: "Окремі title та description для кожної мови. Порожні поля генеруються автоматично.",
    seoTitle: "SEO title",
    seoDescription: "Meta description",
    domain: "Власний домен",
    customDomain: "Домен",
    domainHelp: "MVP зберігає домен і готує DNS-процес. Автоматична перевірка Vercel/DNS буде наступним розширенням.",
    domainStatus: "Статус домену",
    save: "Зберегти",
    savePreview: "Зберегти й переглянути",
    publish: "Опублікувати сайт",
    unpublish: "Зняти з публікації",
  },
  ru: {
    back: "Сайты компаний",
    eyebrow: "Website-as-a-Service",
    title: "Сайт компании",
    subtitle: "Создайте и опубликуйте отдельный сайт компании на основе профиля Clean Jobs.",
    status: "Статус",
    draft: "Черновик",
    published: "Опубликовано",
    openSite: "Открыть сайт",
    preview: "Предпросмотр",
    saved: "Настройки сайта сохранены.",
    publishedMessage: "Сайт опубликован.",
    unpublishedMessage: "Сайт переведен в черновик.",
    error: "Не удалось сохранить сайт. Проверьте slug, домен и поля.",
    identity: "Дизайн и адрес",
    siteSlug: "Адрес сайта в Clean Jobs",
    siteSlugHelp: "Публикуется как cleansjob.com/site/ваш-адрес.",
    template: "Шаблон",
    modern: "Modern",
    minimal: "Minimal",
    elegant: "Elegant",
    primaryColor: "Основной цвет",
    secondaryColor: "Второй цвет",
    languages: "Языки",
    defaultLanguage: "Язык по умолчанию",
    enabledLanguages: "Активные языки",
    content: "Маркетинговый контент",
    contentHelp: "Сначала заполните шведский. Пустые поля берут данные из профиля компании.",
    heroTitle: "Hero заголовок",
    heroSubtitle: "Hero текст",
    aboutTitle: "Заголовок О нас",
    aboutText: "Текст О нас",
    ctaTitle: "CTA заголовок",
    ctaText: "CTA текст",
    sections: "Секции",
    sectionsHelp: "Выберите блоки, которые должны отображаться на сайте.",
    services: "Услуги",
    pricing: "Цены",
    about: "О нас",
    gallery: "Галерея",
    reviews: "Отзывы",
    areas: "Районы работы",
    hours: "График",
    faq: "FAQ",
    contact: "Контакты",
    social: "Социальные сети",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    seo: "SEO",
    seoHelp: "Отдельные title и description для каждого языка. Пустые значения генерируются автоматически.",
    seoTitle: "SEO title",
    seoDescription: "Meta description",
    domain: "Свой домен",
    customDomain: "Домен",
    domainHelp: "MVP сохраняет домен и готовит DNS-процесс. Автоматическая проверка Vercel/DNS будет позже.",
    domainStatus: "Статус домена",
    save: "Сохранить",
    savePreview: "Сохранить и посмотреть",
    publish: "Опубликовать сайт",
    unpublish: "Снять с публикации",
  },
  pl: {
    back: "Strony firm",
    eyebrow: "Website-as-a-Service",
    title: "Strona firmy",
    subtitle: "Zbuduj i opublikuj niezależną stronę firmy na podstawie profilu Clean Jobs.",
    status: "Status",
    draft: "Szkic",
    published: "Opublikowana",
    openSite: "Otwórz stronę",
    preview: "Podgląd",
    saved: "Ustawienia strony zostały zapisane.",
    publishedMessage: "Strona została opublikowana.",
    unpublishedMessage: "Strona jest teraz szkicem.",
    error: "Nie udało się zapisać strony. Sprawdź slug, domenę i pola.",
    identity: "Projekt i adres",
    siteSlug: "Adres strony w Clean Jobs",
    siteSlugHelp: "Publikowana jako cleansjob.com/site/twoj-adres.",
    template: "Szablon",
    modern: "Modern",
    minimal: "Minimal",
    elegant: "Elegant",
    primaryColor: "Kolor główny",
    secondaryColor: "Kolor dodatkowy",
    languages: "Języki",
    defaultLanguage: "Język domyślny",
    enabledLanguages: "Aktywne języki",
    content: "Treści marketingowe",
    contentHelp: "Najpierw uzupełnij szwedzki. Puste pola korzystają z danych profilu firmy.",
    heroTitle: "Nagłówek Hero",
    heroSubtitle: "Tekst Hero",
    aboutTitle: "Nagłówek O nas",
    aboutText: "Tekst O nas",
    ctaTitle: "Nagłówek CTA",
    ctaText: "Tekst CTA",
    sections: "Sekcje",
    sectionsHelp: "Wybierz elementy widoczne na stronie.",
    services: "Usługi",
    pricing: "Ceny",
    about: "O nas",
    gallery: "Galeria",
    reviews: "Opinie",
    areas: "Obszary działania",
    hours: "Godziny otwarcia",
    faq: "FAQ",
    contact: "Kontakt",
    social: "Media społecznościowe",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    seo: "SEO",
    seoHelp: "Osobny title i description dla każdego języka. Puste wartości są generowane automatycznie.",
    seoTitle: "SEO title",
    seoDescription: "Meta description",
    domain: "Własna domena",
    customDomain: "Domena",
    domainHelp: "MVP zapisuje domenę i przygotowuje proces DNS. Automatyczna weryfikacja Vercel/DNS będzie później.",
    domainStatus: "Status domeny",
    save: "Zapisz",
    savePreview: "Zapisz i podejrzyj",
    publish: "Opublikuj stronę",
    unpublish: "Cofnij publikację",
  },
}

function localeName(locale: CompanySiteLocale) {
  return {
    sv: "Svenska",
    en: "English",
    uk: "Українська",
    ru: "Русский",
    pl: "Polski",
  }[locale]
}

function errorMessage(code: string | undefined, fallback: string) {
  if (!code) return fallback
  if (code === "invalid-slug") return `${fallback} Invalid website slug.`
  if (code === "invalid-domain") return `${fallback} Invalid custom domain.`
  if (code === "slug-or-domain-taken") return `${fallback} This slug or domain is already in use.`
  return fallback
}

export default async function CompanyWebsiteEditorPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const query = await searchParams
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get("clean_jobs_locale")?.value,
  ) as CompanySiteLocale
  const t = editorCopy[locale] || editorCopy.sv

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/dashboard/companies/${id}/website`)
  }

  const [{ data: companyData }, { data: siteData }] = await Promise.all([
    supabase
      .from("companies")
      .select(
        "id, name, slug, city, address, postal_code, organization_number, founded_year, website, phone, email, description, logo_url, cover_url, gallery_urls, service_types, service_areas, languages, hourly_rate, minimum_order, rut_available, working_hours, faq, verified, owner_id, updated_at",
      )
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle(),
    supabase.from("company_sites").select("*").eq("company_id", id).maybeSingle(),
  ])

  const company = companyData as CompanySiteCompany | null
  if (!company) redirect("/dashboard/company-claims")

  const site = siteData as CompanySiteRow | null
  const defaultLocale = site?.default_locale || "sv"
  const enabledLocales = normalizeEnabledLocales(
    site?.enabled_locales,
    defaultLocale,
  )
  const content = normalizeContent(site?.content)
  const sections = site
    ? normalizeSectionSettings(site.section_settings)
    : { ...DEFAULT_SECTION_SETTINGS }
  const social = normalizeSocialLinks(site?.social_links)
  const seo = normalizeSeoSettings(site?.seo_settings)
  const siteSlug = site?.site_slug || slugifySite(company.name)
  const isPublished = site?.status === "published"

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/websites"
            className="text-sm font-semibold text-slate-500 hover:text-rose-600"
          >
            ← {t.back}
          </Link>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">
                {t.eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                {company.name}: {t.title}
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">{t.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-black ${
                  isPublished
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {t.status}: {isPublished ? t.published : t.draft}
              </span>
              {site ? (
                <Link
                  href={`/dashboard/companies/${company.id}/website/preview`}
                  className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
                >
                  {t.preview}
                </Link>
              ) : null}
              {isPublished && site ? (
                <Link
                  href={`/site/${site.site_slug}`}
                  target="_blank"
                  className="inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-rose-600"
                >
                  {t.openSite}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {query.saved === "true" ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">
            {query.published === "true"
              ? t.publishedMessage
              : query.unpublished === "true"
                ? t.unpublishedMessage
                : t.saved}
          </div>
        ) : null}
        {query.error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-800">
            {errorMessage(query.error, t.error)}
          </div>
        ) : null}

        <form action={saveCompanyWebsiteAction} className="space-y-8">
          <input type="hidden" name="company_id" value={company.id} />

          <EditorSection title={t.identity}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  id="site_slug"
                  name="site_slug"
                  required
                  label={t.siteSlug}
                  defaultValue={siteSlug}
                />
                <p className="mt-2 text-xs text-slate-500">
                  {t.siteSlugHelp} <strong>cleansjob.com/site/{siteSlug || "..."}</strong>
                </p>
              </div>

              <Select
                id="template"
                name="template"
                label={t.template}
                defaultValue={site?.template || "modern"}
              >
                <option value="modern">{t.modern}</option>
                <option value="minimal">{t.minimal}</option>
                <option value="elegant">{t.elegant}</option>
              </Select>

              <div />

              <ColorField
                id="primary_color"
                name="primary_color"
                label={t.primaryColor}
                defaultValue={site?.primary_color || "#e11d48"}
              />
              <ColorField
                id="secondary_color"
                name="secondary_color"
                label={t.secondaryColor}
                defaultValue={site?.secondary_color || "#0f172a"}
              />
            </div>
          </EditorSection>

          <EditorSection title={t.languages}>
            <div className="grid gap-6 md:grid-cols-2">
              <Select
                id="default_locale"
                name="default_locale"
                label={t.defaultLanguage}
                defaultValue={defaultLocale}
              >
                {COMPANY_SITE_LOCALES.map((item) => (
                  <option key={item} value={item}>
                    {localeName(item)}
                  </option>
                ))}
              </Select>

              <div>
                <p className="text-sm font-bold text-slate-900">{t.enabledLanguages}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {COMPANY_SITE_LOCALES.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
                    >
                      <input
                        type="checkbox"
                        name={`enabled_locale_${item}`}
                        defaultChecked={enabledLocales.includes(item)}
                        className="h-4 w-4"
                      />
                      {localeName(item)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </EditorSection>

          <EditorSection title={t.content} description={t.contentHelp}>
            <div className="space-y-4">
              {COMPANY_SITE_LOCALES.map((item) => {
                const localized = content[item] || {}
                return (
                  <details
                    key={item}
                    open={item === defaultLocale}
                    className="rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <summary className="cursor-pointer px-5 py-4 font-black text-slate-900">
                      {localeName(item)}
                    </summary>
                    <div className="grid gap-5 border-t border-slate-200 p-5 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <Input
                          id={`${item}_hero_title`}
                          name={`${item}_hero_title`}
                          label={t.heroTitle}
                          defaultValue={localized.hero_title || ""}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Textarea
                          id={`${item}_hero_subtitle`}
                          name={`${item}_hero_subtitle`}
                          rows={3}
                          label={t.heroSubtitle}
                          defaultValue={localized.hero_subtitle || ""}
                        />
                      </div>
                      <Input
                        id={`${item}_about_title`}
                        name={`${item}_about_title`}
                        label={t.aboutTitle}
                        defaultValue={localized.about_title || ""}
                      />
                      <Input
                        id={`${item}_cta_title`}
                        name={`${item}_cta_title`}
                        label={t.ctaTitle}
                        defaultValue={localized.cta_title || ""}
                      />
                      <div className="md:col-span-2">
                        <Textarea
                          id={`${item}_about_text`}
                          name={`${item}_about_text`}
                          rows={6}
                          label={t.aboutText}
                          defaultValue={localized.about_text || ""}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Textarea
                          id={`${item}_cta_text`}
                          name={`${item}_cta_text`}
                          rows={3}
                          label={t.ctaText}
                          defaultValue={localized.cta_text || ""}
                        />
                      </div>
                    </div>
                  </details>
                )
              })}
            </div>
          </EditorSection>

          <EditorSection title={t.sections} description={t.sectionsHelp}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["services", t.services],
                  ["pricing", t.pricing],
                  ["about", t.about],
                  ["gallery", t.gallery],
                  ["reviews", t.reviews],
                  ["areas", t.areas],
                  ["hours", t.hours],
                  ["faq", t.faq],
                  ["contact", t.contact],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold"
                >
                  <input
                    type="checkbox"
                    name={`section_${key}`}
                    defaultChecked={sections[key]}
                    className="h-4 w-4"
                  />
                  {label}
                </label>
              ))}
            </div>
          </EditorSection>

          <EditorSection title={t.social}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input id="social_facebook" name="social_facebook" type="url" label={t.facebook} defaultValue={social.facebook || ""} />
              <Input id="social_instagram" name="social_instagram" type="url" label={t.instagram} defaultValue={social.instagram || ""} />
              <Input id="social_linkedin" name="social_linkedin" type="url" label={t.linkedin} defaultValue={social.linkedin || ""} />
              <Input id="social_tiktok" name="social_tiktok" type="url" label={t.tiktok} defaultValue={social.tiktok || ""} />
            </div>
          </EditorSection>

          <EditorSection title={t.seo} description={t.seoHelp}>
            <div className="space-y-4">
              {COMPANY_SITE_LOCALES.map((item) => (
                <details key={item} className="rounded-2xl border border-slate-200 bg-slate-50">
                  <summary className="cursor-pointer px-5 py-4 font-black text-slate-900">
                    {localeName(item)} SEO
                  </summary>
                  <div className="grid gap-5 border-t border-slate-200 p-5">
                    <Input
                      id={`${item}_seo_title`}
                      name={`${item}_seo_title`}
                      label={t.seoTitle}
                      defaultValue={seo[item]?.title || ""}
                    />
                    <Textarea
                      id={`${item}_seo_description`}
                      name={`${item}_seo_description`}
                      rows={3}
                      label={t.seoDescription}
                      defaultValue={seo[item]?.description || ""}
                    />
                  </div>
                </details>
              ))}
            </div>
          </EditorSection>

          <EditorSection title={t.domain} description={t.domainHelp}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                id="custom_domain"
                name="custom_domain"
                label={t.customDomain}
                placeholder="example.se"
                defaultValue={site?.custom_domain || ""}
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{t.domainStatus}</p>
                <div className="mt-2 flex min-h-12 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700">
                  {site?.domain_status || "not_configured"}
                </div>
              </div>
            </div>
          </EditorSection>

          <div className="sticky bottom-4 z-30 flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <button
              type="submit"
              name="intent"
              value="save"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-900 hover:bg-slate-50"
            >
              {t.save}
            </button>
            <button
              type="submit"
              name="intent"
              value="preview"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
            >
              {t.savePreview}
            </button>
            {isPublished ? (
              <button
                type="submit"
                name="intent"
                value="unpublish"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-white hover:bg-amber-600"
              >
                {t.unpublish}
              </button>
            ) : (
              <button
                type="submit"
                name="intent"
                value="publish"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white hover:bg-rose-700"
              >
                {t.publish}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}

function EditorSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  )
}

function ColorField({
  id,
  name,
  label,
  defaultValue,
}: {
  id: string
  name: string
  label: string
  defaultValue: string
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-slate-900">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-300 bg-white p-2">
        <input
          id={id}
          name={name}
          type="color"
          defaultValue={defaultValue}
          className="h-10 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
        />
        <span className="text-sm font-mono text-slate-500">{defaultValue}</span>
      </div>
    </div>
  )
}
