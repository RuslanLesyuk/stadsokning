import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { normalizeLocale, type Locale } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Privacy Policy | Clean Jobs",
  description: "Privacy Policy for Clean Jobs.",
}

export const dynamic = "force-dynamic"

type PrivacyCopy = {
  title: string
  subtitle: string
  updated: string
  back: string
  sections: {
    title: string
    text: string
  }[]
}

const copy: Record<Locale, PrivacyCopy> = {
  uk: {
    title: "Політика конфіденційності",
    subtitle:
      "Ця політика пояснює, які дані Clean Jobs може обробляти, для чого вони використовуються та які права має користувач.",
    updated: "Оновлено: 16 травня 2026",
    back: "Назад на головну",
    sections: [
      {
        title: "1. Хто відповідає за дані",
        text: "Clean Jobs є сервісом, який обробляє персональні дані користувачів для роботи платформи. Контактні дані власника сервісу мають бути вказані на сайті перед публічним запуском.",
      },
      {
        title: "2. Які дані ми можемо обробляти",
        text: "Ми можемо обробляти email, ім’я, телефон, місто, аватар, логотип компанії, назву компанії, опис профілю, оголошення, повідомлення в чаті, відгуки, статуси робіт, технічні дані та інформацію, необхідну для безпеки сервісу.",
      },
      {
        title: "3. Для чого використовуються дані",
        text: "Дані використовуються для створення акаунта, входу в систему, публікації робіт, прийняття замовлень, чату між сторонами, відгуків, показу профілю, безпеки, підтримки та покращення роботи платформи.",
      },
      {
        title: "4. Правова підстава",
        text: "Обробка може базуватися на виконанні договору з користувачем, законному інтересі для підтримки безпеки та роботи сервісу, згоді користувача або юридичних обов’язках, якщо вони застосовуються.",
      },
      {
        title: "5. Сторонні сервіси",
        text: "Clean Jobs може використовувати сторонні технічні сервіси для хостингу, бази даних, автентифікації, зберігання файлів і аналітики. Такі сервіси обробляють дані лише в межах роботи платформи.",
      },
      {
        title: "6. Зберігання даних",
        text: "Дані зберігаються стільки, скільки потрібно для роботи сервісу, виконання домовленостей, безпеки, вирішення спорів або дотримання закону. Користувач може попросити видалити або змінити свої дані.",
      },
      {
        title: "7. Права користувача",
        text: "Користувач може мати право на доступ до своїх даних, виправлення, видалення, обмеження обробки, перенесення даних або заперечення проти певної обробки. Також можна звернутися до шведського органу захисту даних IMY.",
      },
      {
        title: "8. Безпека",
        text: "Ми застосовуємо технічні та організаційні заходи для захисту акаунтів, повідомлень, файлів і профілів. Однак жоден онлайн-сервіс не може гарантувати абсолютну безпеку.",
      },
      {
        title: "9. Оновлення політики",
        text: "Ми можемо оновлювати цю політику. Нова версія набирає чинності після публікації на сайті.",
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    subtitle:
      "Эта политика объясняет, какие данные Clean Jobs может обрабатывать, зачем они используются и какие права есть у пользователя.",
    updated: "Обновлено: 16 мая 2026",
    back: "Назад на главную",
    sections: [
      {
        title: "1. Кто отвечает за данные",
        text: "Clean Jobs является сервисом, который обрабатывает персональные данные пользователей для работы платформы. Контактные данные владельца сервиса должны быть указаны на сайте перед публичным запуском.",
      },
      {
        title: "2. Какие данные мы можем обрабатывать",
        text: "Мы можем обрабатывать email, имя, телефон, город, аватар, логотип компании, название компании, описание профиля, объявления, сообщения в чате, отзывы, статусы работ, технические данные и информацию, необходимую для безопасности сервиса.",
      },
      {
        title: "3. Для чего используются данные",
        text: "Данные используются для создания аккаунта, входа в систему, публикации работ, принятия заказов, чата между сторонами, отзывов, отображения профиля, безопасности, поддержки и улучшения платформы.",
      },
      {
        title: "4. Правовая основа",
        text: "Обработка может основываться на выполнении договора с пользователем, законном интересе для безопасности и работы сервиса, согласии пользователя или юридических обязанностях, если они применимы.",
      },
      {
        title: "5. Сторонние сервисы",
        text: "Clean Jobs может использовать сторонние технические сервисы для хостинга, базы данных, аутентификации, хранения файлов и аналитики. Такие сервисы обрабатывают данные только в рамках работы платформы.",
      },
      {
        title: "6. Хранение данных",
        text: "Данные хранятся столько, сколько необходимо для работы сервиса, выполнения договоренностей, безопасности, разрешения споров или соблюдения закона. Пользователь может попросить удалить или изменить свои данные.",
      },
      {
        title: "7. Права пользователя",
        text: "Пользователь может иметь право на доступ к своим данным, исправление, удаление, ограничение обработки, перенос данных или возражение против определенной обработки. Также можно обратиться в шведский орган защиты данных IMY.",
      },
      {
        title: "8. Безопасность",
        text: "Мы применяем технические и организационные меры для защиты аккаунтов, сообщений, файлов и профилей. Однако ни один онлайн-сервис не может гарантировать абсолютную безопасность.",
      },
      {
        title: "9. Обновления политики",
        text: "Мы можем обновлять эту политику. Новая версия вступает в силу после публикации на сайте.",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    subtitle:
      "This policy explains what data Clean Jobs may process, why it is used, and what rights users have.",
    updated: "Updated: 16 May 2026",
    back: "Back to home",
    sections: [
      {
        title: "1. Who is responsible for data",
        text: "Clean Jobs is a service that processes user personal data to operate the platform. The service owner’s contact details should be added to the website before public launch.",
      },
      {
        title: "2. Data we may process",
        text: "We may process email, name, phone number, city, avatar, company logo, company name, profile bio, job listings, chat messages, reviews, job statuses, technical data, and information needed to keep the service secure.",
      },
      {
        title: "3. Why we use data",
        text: "Data is used to create accounts, log users in, publish jobs, accept work, enable chat between parties, show reviews and profiles, maintain security, provide support, and improve the platform.",
      },
      {
        title: "4. Legal basis",
        text: "Processing may be based on performance of a contract with the user, legitimate interests for security and service operation, user consent, or legal obligations where applicable.",
      },
      {
        title: "5. Third-party services",
        text: "Clean Jobs may use third-party technical services for hosting, database, authentication, file storage, and analytics. These services process data only as needed to operate the platform.",
      },
      {
        title: "6. Data retention",
        text: "Data is kept for as long as needed to operate the service, fulfil agreements, maintain security, resolve disputes, or comply with law. Users may request deletion or correction of their data.",
      },
      {
        title: "7. User rights",
        text: "Users may have the right to access, correct, delete, restrict processing, export their data, or object to certain processing. Users may also contact the Swedish Authority for Privacy Protection, IMY.",
      },
      {
        title: "8. Security",
        text: "We use technical and organisational measures to protect accounts, messages, files, and profiles. However, no online service can guarantee absolute security.",
      },
      {
        title: "9. Policy updates",
        text: "We may update this policy. The updated version applies after publication on the website.",
      },
    ],
  },
  sv: {
    title: "Integritetspolicy",
    subtitle:
      "Denna policy förklarar vilka uppgifter Clean Jobs kan behandla, varför de används och vilka rättigheter användaren har.",
    updated: "Uppdaterad: 16 maj 2026",
    back: "Tillbaka till startsidan",
    sections: [
      {
        title: "1. Vem ansvarar för uppgifter",
        text: "Clean Jobs är en tjänst som behandlar användares personuppgifter för att driva plattformen. Kontaktuppgifter till tjänstens ägare bör läggas till på webbplatsen före offentlig lansering.",
      },
      {
        title: "2. Uppgifter vi kan behandla",
        text: "Vi kan behandla e-post, namn, telefonnummer, stad, avatar, företagslogotyp, företagsnamn, profilbeskrivning, jobbannonser, chattmeddelanden, recensioner, jobbstatusar, tekniska uppgifter och information som behövs för säkerheten.",
      },
      {
        title: "3. Varför vi använder uppgifter",
        text: "Uppgifter används för att skapa konton, logga in användare, publicera jobb, acceptera uppdrag, möjliggöra chatt, visa recensioner och profiler, upprätthålla säkerhet, ge support och förbättra plattformen.",
      },
      {
        title: "4. Rättslig grund",
        text: "Behandlingen kan baseras på avtal med användaren, berättigat intresse för säkerhet och drift av tjänsten, användarens samtycke eller rättsliga skyldigheter där det är tillämpligt.",
      },
      {
        title: "5. Tredjepartstjänster",
        text: "Clean Jobs kan använda tekniska tredjepartstjänster för hosting, databas, autentisering, fillagring och analys. Dessa tjänster behandlar endast uppgifter som behövs för att driva plattformen.",
      },
      {
        title: "6. Lagring av uppgifter",
        text: "Uppgifter sparas så länge det behövs för att driva tjänsten, uppfylla överenskommelser, upprätthålla säkerhet, lösa tvister eller följa lag. Användare kan begära radering eller rättelse av sina uppgifter.",
      },
      {
        title: "7. Användarens rättigheter",
        text: "Användare kan ha rätt att få tillgång till, rätta, radera, begränsa behandling, exportera sina uppgifter eller invända mot viss behandling. Användare kan också kontakta Integritetsskyddsmyndigheten, IMY.",
      },
      {
        title: "8. Säkerhet",
        text: "Vi använder tekniska och organisatoriska åtgärder för att skydda konton, meddelanden, filer och profiler. Ingen onlinetjänst kan dock garantera absolut säkerhet.",
      },
      {
        title: "9. Uppdateringar",
        text: "Vi kan uppdatera denna policy. Den nya versionen gäller efter publicering på webbplatsen.",
      },
    ],
  },
  pl: {
    title: "Polityka prywatności",
    subtitle:
      "Ta polityka wyjaśnia, jakie dane Clean Jobs może przetwarzać, w jakim celu są używane i jakie prawa ma użytkownik.",
    updated: "Zaktualizowano: 16 maja 2026",
    back: "Wróć na stronę główną",
    sections: [
      {
        title: "1. Kto odpowiada za dane",
        text: "Clean Jobs jest usługą, która przetwarza dane osobowe użytkowników w celu działania platformy. Dane kontaktowe właściciela usługi powinny zostać dodane na stronie przed publicznym uruchomieniem.",
      },
      {
        title: "2. Dane, które możemy przetwarzać",
        text: "Możemy przetwarzać email, imię i nazwisko, telefon, miasto, avatar, logo firmy, nazwę firmy, opis profilu, ogłoszenia, wiadomości na czacie, opinie, statusy prac, dane techniczne i informacje potrzebne do bezpieczeństwa usługi.",
      },
      {
        title: "3. Dlaczego używamy danych",
        text: "Dane są używane do tworzenia kont, logowania, publikowania zleceń, przyjmowania pracy, umożliwienia czatu, wyświetlania opinii i profili, utrzymania bezpieczeństwa, wsparcia i ulepszania platformy.",
      },
      {
        title: "4. Podstawa prawna",
        text: "Przetwarzanie może opierać się na wykonaniu umowy z użytkownikiem, uzasadnionym interesie związanym z bezpieczeństwem i działaniem usługi, zgodzie użytkownika lub obowiązkach prawnych, jeśli mają zastosowanie.",
      },
      {
        title: "5. Usługi zewnętrzne",
        text: "Clean Jobs może korzystać z technicznych usług zewnętrznych do hostingu, bazy danych, uwierzytelniania, przechowywania plików i analityki. Takie usługi przetwarzają dane tylko w zakresie potrzebnym do działania platformy.",
      },
      {
        title: "6. Przechowywanie danych",
        text: "Dane są przechowywane tak długo, jak jest to potrzebne do działania usługi, realizacji ustaleń, bezpieczeństwa, rozwiązywania sporów lub zgodności z prawem. Użytkownik może poprosić o usunięcie lub poprawienie danych.",
      },
      {
        title: "7. Prawa użytkownika",
        text: "Użytkownik może mieć prawo dostępu, poprawienia, usunięcia, ograniczenia przetwarzania, eksportu danych lub sprzeciwu wobec określonego przetwarzania. Można też skontaktować się ze szwedzkim organem ochrony prywatności IMY.",
      },
      {
        title: "8. Bezpieczeństwo",
        text: "Stosujemy środki techniczne i organizacyjne w celu ochrony kont, wiadomości, plików i profili. Żadna usługa online nie może jednak zagwarantować absolutnego bezpieczeństwa.",
      },
      {
        title: "9. Aktualizacje polityki",
        text: "Możemy aktualizować tę politykę. Nowa wersja obowiązuje po publikacji na stronie.",
      },
    ],
  },
}

export default async function PrivacyPage() {
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