import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { normalizeLocale, type Locale } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Terms of Service | Clean Jobs",
  description: "Terms of Service for Clean Jobs.",
}

export const dynamic = "force-dynamic"

type TermsCopy = {
  title: string
  subtitle: string
  updated: string
  back: string
  sections: {
    title: string
    text: string
  }[]
}

const copy: Record<Locale, TermsCopy> = {
  uk: {
    title: "Умови користування",
    subtitle:
      "Ці умови описують правила використання Clean Jobs — платформи для пошуку клінінгових робіт і виконавців.",
    updated: "Оновлено: 16 травня 2026",
    back: "Назад на головну",
    sections: [
      {
        title: "1. Про сервіс",
        text: "Clean Jobs — це маркетплейс, який допомагає клієнтам публікувати замовлення на прибирання, а виконавцям знаходити роботу. Ми не є роботодавцем, агентством зайнятості або стороною конкретної домовленості між клієнтом і виконавцем.",
      },
      {
        title: "2. Акаунт користувача",
        text: "Щоб створювати замовлення, брати роботу, писати в чаті або залишати відгуки, користувач має створити акаунт і надати актуальну інформацію. Ви відповідаєте за безпеку свого акаунта та за дії, виконані через нього.",
      },
      {
        title: "3. Оголошення та виконання робіт",
        text: "Користувачі повинні публікувати правдиву інформацію про роботу, бюджет, місто, адресу, дату та умови. Виконавець самостійно вирішує, чи брати замовлення. Усі домовленості щодо оплати, часу та деталей роботи узгоджуються між сторонами.",
      },
      {
        title: "4. Заборонене використання",
        text: "Заборонено публікувати незаконний, шахрайський, образливий або небезпечний контент, видавати себе за іншу особу, спамити, намагатися обійти систему безпеки або використовувати платформу не за призначенням.",
      },
      {
        title: "5. Відгуки та репутація",
        text: "Відгуки мають бути чесними, релевантними та базуватися на реальному досвіді. Clean Jobs може приховати або видалити контент, який порушує правила платформи.",
      },
      {
        title: "6. Доступність сервісу",
        text: "Ми прагнемо підтримувати стабільну роботу сервісу, але не гарантуємо, що сайт завжди буде доступний без перерв, помилок або технічних обмежень.",
      },
      {
        title: "7. Зміни умов",
        text: "Ми можемо оновлювати ці умови. Нова версія набирає чинності після публікації на сайті. Якщо ви продовжуєте користуватися Clean Jobs, це означає, що ви погоджуєтеся з оновленими умовами.",
      },
      {
        title: "8. Контакт",
        text: "Якщо у вас є питання щодо цих умов, зв’яжіться з нами через контактну інформацію, вказану на сайті.",
      },
    ],
  },
  ru: {
    title: "Условия использования",
    subtitle:
      "Эти условия описывают правила использования Clean Jobs — платформы для поиска клининговых работ и исполнителей.",
    updated: "Обновлено: 16 мая 2026",
    back: "Назад на главную",
    sections: [
      {
        title: "1. О сервисе",
        text: "Clean Jobs — это маркетплейс, который помогает клиентам публиковать заказы на уборку, а исполнителям находить работу. Мы не являемся работодателем, кадровым агентством или стороной конкретной договоренности между клиентом и исполнителем.",
      },
      {
        title: "2. Аккаунт пользователя",
        text: "Чтобы создавать заказы, брать работу, писать в чате или оставлять отзывы, пользователь должен создать аккаунт и предоставить актуальную информацию. Вы отвечаете за безопасность своего аккаунта и действия, выполненные через него.",
      },
      {
        title: "3. Объявления и выполнение работ",
        text: "Пользователи должны публиковать правдивую информацию о работе, бюджете, городе, адресе, дате и условиях. Исполнитель самостоятельно решает, брать ли заказ. Все договоренности по оплате, времени и деталям работы согласуются между сторонами.",
      },
      {
        title: "4. Запрещенное использование",
        text: "Запрещено публиковать незаконный, мошеннический, оскорбительный или опасный контент, выдавать себя за другого человека, спамить, обходить защиту сервиса или использовать платформу не по назначению.",
      },
      {
        title: "5. Отзывы и репутация",
        text: "Отзывы должны быть честными, релевантными и основанными на реальном опыте. Clean Jobs может скрыть или удалить контент, который нарушает правила платформы.",
      },
      {
        title: "6. Доступность сервиса",
        text: "Мы стремимся поддерживать стабильную работу сервиса, но не гарантируем, что сайт всегда будет доступен без перерывов, ошибок или технических ограничений.",
      },
      {
        title: "7. Изменения условий",
        text: "Мы можем обновлять эти условия. Новая версия вступает в силу после публикации на сайте. Если вы продолжаете пользоваться Clean Jobs, это означает согласие с обновленными условиями.",
      },
      {
        title: "8. Контакт",
        text: "Если у вас есть вопросы по этим условиям, свяжитесь с нами через контактную информацию, указанную на сайте.",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    subtitle:
      "These terms describe the rules for using Clean Jobs, a platform for finding cleaning jobs and cleaners.",
    updated: "Updated: 16 May 2026",
    back: "Back to home",
    sections: [
      {
        title: "1. About the service",
        text: "Clean Jobs is a marketplace that helps clients post cleaning jobs and workers find cleaning work. We are not an employer, employment agency, or party to the specific agreement between a client and a worker.",
      },
      {
        title: "2. User account",
        text: "To post jobs, take work, use chat, or leave reviews, users need to create an account and provide accurate information. You are responsible for keeping your account secure and for actions made through it.",
      },
      {
        title: "3. Listings and work",
        text: "Users must provide truthful information about the job, budget, city, address, date, and conditions. Workers decide independently whether to accept a job. Payment, timing, and work details are agreed directly between the parties.",
      },
      {
        title: "4. Prohibited use",
        text: "You may not post illegal, fraudulent, abusive, or dangerous content, impersonate another person, spam, try to bypass platform security, or use the service for unintended purposes.",
      },
      {
        title: "5. Reviews and reputation",
        text: "Reviews should be honest, relevant, and based on real experience. Clean Jobs may hide or remove content that violates platform rules.",
      },
      {
        title: "6. Service availability",
        text: "We aim to keep the service stable, but we do not guarantee that the website will always be available without interruptions, errors, or technical limitations.",
      },
      {
        title: "7. Changes to terms",
        text: "We may update these terms. The updated version applies after publication on the website. Continued use of Clean Jobs means you accept the updated terms.",
      },
      {
        title: "8. Contact",
        text: "If you have questions about these terms, contact us using the contact information provided on the website.",
      },
    ],
  },
  sv: {
    title: "Användarvillkor",
    subtitle:
      "Dessa villkor beskriver reglerna för att använda Clean Jobs, en plattform för städjobb och städare.",
    updated: "Uppdaterad: 16 maj 2026",
    back: "Tillbaka till startsidan",
    sections: [
      {
        title: "1. Om tjänsten",
        text: "Clean Jobs är en marknadsplats som hjälper kunder att lägga upp städjobb och arbetare att hitta uppdrag. Vi är inte arbetsgivare, bemanningsföretag eller part i den specifika överenskommelsen mellan kund och arbetare.",
      },
      {
        title: "2. Användarkonto",
        text: "För att lägga upp jobb, ta uppdrag, använda chatten eller lämna recensioner behöver användaren skapa ett konto och lämna korrekt information. Du ansvarar för säkerheten på ditt konto och för åtgärder som görs via kontot.",
      },
      {
        title: "3. Annonser och arbete",
        text: "Användare ska lämna sanningsenlig information om jobbet, budgeten, staden, adressen, datumet och villkoren. Arbetaren avgör själv om ett uppdrag ska accepteras. Betalning, tid och arbetsdetaljer avtalas direkt mellan parterna.",
      },
      {
        title: "4. Förbjuden användning",
        text: "Det är förbjudet att publicera olagligt, bedrägligt, kränkande eller farligt innehåll, utge sig för att vara någon annan, skicka spam, kringgå plattformens säkerhet eller använda tjänsten för fel syfte.",
      },
      {
        title: "5. Recensioner och rykte",
        text: "Recensioner ska vara ärliga, relevanta och baserade på verklig erfarenhet. Clean Jobs kan dölja eller ta bort innehåll som bryter mot plattformens regler.",
      },
      {
        title: "6. Tillgänglighet",
        text: "Vi strävar efter att hålla tjänsten stabil, men garanterar inte att webbplatsen alltid är tillgänglig utan avbrott, fel eller tekniska begränsningar.",
      },
      {
        title: "7. Ändringar av villkor",
        text: "Vi kan uppdatera dessa villkor. Den nya versionen gäller efter publicering på webbplatsen. Fortsatt användning av Clean Jobs innebär att du accepterar de uppdaterade villkoren.",
      },
      {
        title: "8. Kontakt",
        text: "Om du har frågor om dessa villkor kan du kontakta oss via kontaktinformationen på webbplatsen.",
      },
    ],
  },
  pl: {
    title: "Warunki korzystania",
    subtitle:
      "Te warunki opisują zasady korzystania z Clean Jobs, platformy do zleceń sprzątania i wyszukiwania wykonawców.",
    updated: "Zaktualizowano: 16 maja 2026",
    back: "Wróć na stronę główną",
    sections: [
      {
        title: "1. O usłudze",
        text: "Clean Jobs to marketplace, który pomaga klientom publikować zlecenia sprzątania, a pracownikom znajdować pracę. Nie jesteśmy pracodawcą, agencją pracy ani stroną konkretnej umowy między klientem a wykonawcą.",
      },
      {
        title: "2. Konto użytkownika",
        text: "Aby dodawać zlecenia, przyjmować pracę, korzystać z czatu lub dodawać opinie, użytkownik musi utworzyć konto i podać aktualne informacje. Odpowiadasz za bezpieczeństwo konta i działania wykonane przez konto.",
      },
      {
        title: "3. Ogłoszenia i realizacja pracy",
        text: "Użytkownicy muszą podawać prawdziwe informacje o pracy, budżecie, mieście, adresie, dacie i warunkach. Wykonawca sam decyduje, czy przyjąć zlecenie. Płatność, termin i szczegóły pracy ustalają bezpośrednio strony.",
      },
      {
        title: "4. Zakazane użycie",
        text: "Zabronione jest publikowanie treści nielegalnych, oszukańczych, obraźliwych lub niebezpiecznych, podszywanie się pod inną osobę, spamowanie, obchodzenie zabezpieczeń platformy lub używanie serwisu niezgodnie z przeznaczeniem.",
      },
      {
        title: "5. Opinie i reputacja",
        text: "Opinie powinny być uczciwe, trafne i oparte na rzeczywistym doświadczeniu. Clean Jobs może ukryć lub usunąć treści naruszające zasady platformy.",
      },
      {
        title: "6. Dostępność usługi",
        text: "Staramy się utrzymywać stabilne działanie usługi, ale nie gwarantujemy, że strona zawsze będzie dostępna bez przerw, błędów lub ograniczeń technicznych.",
      },
      {
        title: "7. Zmiany warunków",
        text: "Możemy aktualizować te warunki. Nowa wersja obowiązuje po publikacji na stronie. Dalsze korzystanie z Clean Jobs oznacza akceptację zaktualizowanych warunków.",
      },
      {
        title: "8. Kontakt",
        text: "Jeśli masz pytania dotyczące tych warunków, skontaktuj się z nami przez dane kontaktowe podane na stronie.",
      },
    ],
  },
}

export default async function TermsPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">
        <Link
          href="/"
          prefetch={false}
          className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97]"
        >
          {t.back}
        </Link>

        <section className="mt-6 rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-rose-50/40 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <p className="text-sm font-medium text-rose-700">{t.updated}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg">{t.subtitle}</p>
        </section>

        <section className="mt-6 space-y-4">
          {t.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6"
            >
              <h2 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                {section.text}
              </p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}