import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { normalizeLocale, type Locale } from "@/lib/i18n"
import { formatLegalOperator, getLegalOperator } from "@/lib/legal/config"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Privacy Policy | Clean Jobs",
  description: "Privacy Policy for Clean Jobs.",
  robots: { index: true, follow: true },
}

type Copy = {
  title: string
  subtitle: string
  updated: string
  back: string
  incomplete: string
  sections: (operator: string) => Array<{ title: string; text: string }>
}

const copy: Record<Locale, Copy> = {
  sv: {
    title: "Integritetspolicy",
    subtitle: "Så behandlar Clean Jobs personuppgifter för marknadsplatsen, företagsprofiler, offerter, bokningar, CRM, betalningar och säkerhet.",
    updated: "Uppdaterad: 17 augusti 2026",
    back: "Tillbaka till startsidan",
    incomplete: "Operatörens juridiska namn, organisationsnummer och postadress måste konfigureras innan offentlig produktionslansering.",
    sections: (operator) => [
      { title: "1. Personuppgiftsansvarig", text: `Personuppgiftsansvarig för Clean Jobs är: ${operator}. Kontakta oss via den angivna integritetsadressen för frågor om personuppgifter.` },
      { title: "2. Uppgifter vi behandlar", text: "Vi kan behandla konto- och kontaktuppgifter, profil- och företagsuppgifter, jobbannonser, ansökningar, chatt, recensioner, offertförfrågningar, bokningar, kund- och CRM-anteckningar, filer som du laddar upp, BankID-verifieringsstatus när funktionen är aktiverad, samt fakturerings- och prenumerationsidentifierare. Kortuppgifter hanteras av Stripe och lagras inte av Clean Jobs." },
      { title: "3. Var uppgifterna kommer från", text: "Uppgifter kommer från dig, andra användare i samband med en beställning eller bokning, samt från offentligt tillgängliga företagswebbplatser och importerade företagsregister när Clean Jobs bygger sin företagskatalog och genomför relevant B2B-kontakt." },
      { title: "4. Ändamål och rättslig grund", text: "Vi behandlar uppgifter för att skapa och administrera konton, genomföra avtal, förmedla jobb, offerter och bokningar, tillhandahålla företagswebbplatser och Premium, hantera betalningar, support och tvister samt förebygga bedrägerier och missbruk. Behandlingen grundas beroende på situation på avtal, rättslig skyldighet, berättigat intresse eller samtycke när samtycke krävs." },
      { title: "5. Företagskontakt och outreach", text: "För företagskontakt kan Clean Jobs behandla offentligt publicerade yrkesmässiga kontaktuppgifter när det finns en tillämplig rättslig grund. Elektronisk marknadsföring skickas endast när den är tillåten enligt tillämpliga marknadsföringsregler. När intresseavvägning används enligt GDPR görs en bedömning av det berättigade intresset, och mottagaren kan alltid invända mot direktmarknadsföring. Varje utskick innehåller en enkel avregistreringsmöjlighet och en giltig kontaktadress. Vid invändning behåller vi en minimal spärrpost för e-postadressen för att förhindra framtida utskick." },
      { title: "6. Mottagare och leverantörer", text: "Uppgifter kan delas med den kund eller det företag som behöver dem för en förfrågan, bokning eller ett uppdrag. Tekniska leverantörer kan omfatta Supabase för databas, autentisering och lagring, Vercel för hosting/analytics, Stripe för betalningar, Resend för e-post, Google för OAuth och den konfigurerade BankID/OIDC-leverantören när BankID används." },
      { title: "7. Överföringar utanför EU/EES", text: "Vissa leverantörer kan behandla uppgifter utanför EU/EES. När en sådan överföring sker använder vi tillämpliga skyddsmekanismer, exempelvis beslut om adekvat skyddsnivå eller standardavtalsklausuler, beroende på leverantör och behandling." },
      { title: "8. Lagring", text: "Uppgifter sparas så länge de behövs för det aktuella kontot, avtalet, bokningen, säkerheten, bokförings- eller andra rättsliga skyldigheter, eller för att hantera tvister. Därefter raderas eller anonymiseras de när det inte längre finns ett giltigt behov." },
      { title: "9. Automatiska säkerhetskontroller", text: "Clean Jobs använder tekniska regler för att upptäcka spam, misstänkta annonser och missbruk. Sådana kontroller används för plattformssäkerhet och kan stoppa eller flagga innehåll. Kontakta support om du anser att en säkerhetskontroll har blivit fel." },
      { title: "10. Dina rättigheter", text: "Beroende på behandlingen kan du ha rätt till tillgång, rättelse, radering, begränsning, dataportabilitet och invändning samt rätt att återkalla samtycke när samtycke används. Du har också rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY)." },
      { title: "11. Säkerhet och incidenter", text: "Vi använder åtkomstkontroller, Row Level Security, serverbaserad behörighetskontroll, privata lagringsytor för verifieringsunderlag, signerade betalningswebhooks och andra tekniska och organisatoriska skydd. Ingen internetbaserad tjänst kan garantera absolut säkerhet." },
      { title: "12. Ändringar", text: "Vi kan uppdatera policyn när tjänsten eller lagkrav förändras. Den aktuella versionen och uppdateringsdatumet publiceras på denna sida." },
    ],
  },
  en: {
    title: "Privacy Policy",
    subtitle: "How Clean Jobs processes personal data for the marketplace, company profiles, quotes, bookings, CRM, payments, and security.",
    updated: "Updated: 17 August 2026",
    back: "Back to home",
    incomplete: "The operator's legal name, organisation number, and postal address must be configured before a public production launch.",
    sections: (operator) => [
      { title: "1. Data controller", text: `The data controller for Clean Jobs is: ${operator}. Contact the listed privacy email for questions about personal data.` },
      { title: "2. Data we process", text: "We may process account and contact details, profile and company data, job listings, applications, chat, reviews, quote requests, bookings, customer/CRM notes, uploaded files, BankID verification status when enabled, and billing/subscription identifiers. Payment card data is handled by Stripe and is not stored by Clean Jobs." },
      { title: "3. Sources of data", text: "Data comes from you, other users involved in an order or booking, and publicly available company websites or imported business registers when Clean Jobs builds its company directory and performs relevant B2B outreach." },
      { title: "4. Purposes and lawful bases", text: "We process data to create and administer accounts, perform contracts, facilitate jobs, quotes and bookings, provide company websites and Premium, process payments, provide support, resolve disputes, and prevent fraud or abuse. Depending on the activity, the lawful basis is contract, legal obligation, legitimate interests, or consent where consent is required." },
      { title: "5. Business outreach", text: "For business contact, Clean Jobs may process publicly published professional contact details where an applicable lawful basis exists. Electronic marketing is sent only where permitted by applicable marketing rules. Where legitimate interests are relied on under the GDPR, we assess those interests and the recipient may always object to direct marketing. Each marketing email includes a simple unsubscribe option and a valid contact address. If you object, we keep a minimal suppression record for the email address to prevent future outreach." },
      { title: "6. Recipients and processors", text: "Data may be shared with the customer or company that needs it for a quote, booking, or job. Technical providers may include Supabase for database/auth/storage, Vercel for hosting/analytics, Stripe for payments, Resend for email, Google for OAuth, and the configured BankID/OIDC provider when BankID is used." },
      { title: "7. International transfers", text: "Some providers may process data outside the EU/EEA. Where such transfers occur, we use applicable safeguards such as adequacy decisions or standard contractual clauses, depending on the provider and processing." },
      { title: "8. Retention", text: "Data is retained for as long as necessary for the relevant account, contract, booking, security, accounting or other legal obligations, or dispute handling. It is then deleted or anonymised when there is no longer a valid need." },
      { title: "9. Automated security checks", text: "Clean Jobs uses technical rules to detect spam, suspicious listings, and abuse. These checks protect the platform and may stop or flag content. Contact support if you believe a security control made an error." },
      { title: "10. Your rights", text: "Depending on the processing, you may have rights of access, correction, deletion, restriction, portability, and objection, and the right to withdraw consent where consent is used. You may also complain to the Swedish Authority for Privacy Protection (IMY)." },
      { title: "11. Security and incidents", text: "We use access controls, Row Level Security, server-side authorization, private storage for claim evidence, signed payment webhooks, and other technical and organisational safeguards. No internet service can guarantee absolute security." },
      { title: "12. Changes", text: "We may update this policy when the service or legal requirements change. The current version and update date are published on this page." },
    ],
  },
  uk: {
    title: "Політика конфіденційності",
    subtitle: "Як Clean Jobs обробляє персональні дані для маркетплейсу, профілів компаній, заявок, бронювань, CRM, оплат і безпеки.",
    updated: "Оновлено: 17 серпня 2026",
    back: "Назад на головну",
    incomplete: "Перед публічним production-запуском потрібно вказати юридичну назву оператора, організаційний номер і поштову адресу.",
    sections: (operator) => [
      { title: "1. Контролер даних", text: `Контролером персональних даних Clean Jobs є: ${operator}. З питань персональних даних звертайтеся на вказаний privacy email.` },
      { title: "2. Які дані ми обробляємо", text: "Можемо обробляти дані акаунта і контакти, профілі та дані компаній, оголошення, заявки, чат, відгуки, запити пропозицій, бронювання, CRM-нотатки, завантажені файли, статус BankID-верифікації коли функція активна, а також billing/subscription identifiers. Дані банківської картки обробляє Stripe; Clean Jobs їх не зберігає." },
      { title: "3. Джерела даних", text: "Дані надходять від вас, інших сторін замовлення або бронювання, а також з публічних сайтів компаній чи імпортованих бізнес-реєстрів для каталогу та релевантного B2B outreach." },
      { title: "4. Цілі та правові підстави", text: "Дані потрібні для акаунтів, виконання договорів, робіт, заявок і бронювань, сайтів компаній, Premium, оплат, підтримки, спорів і запобігання шахрайству. Залежно від операції підставою є договір, юридичний обов’язок, законний інтерес або згода, коли вона потрібна." },
      { title: "5. B2B outreach", text: "Для контакту з компаніями Clean Jobs може обробляти публічно опубліковані професійні контактні дані, якщо для цього є належна правова підстава. Електронний маркетинг надсилається лише тоді, коли це дозволено застосовними правилами маркетингу. Якщо за GDPR використовується законний інтерес, ми оцінюємо такий інтерес, а одержувач завжди може заперечити проти прямого маркетингу. Кожен маркетинговий лист містить просту можливість відписки та дійсну контактну адресу. Після заперечення ми зберігаємо мінімальний запис блокування email, щоб запобігти майбутнім розсилкам." },
      { title: "6. Одержувачі та провайдери", text: "Дані можуть передаватися клієнту або компанії, яким вони потрібні для заявки, бронювання чи роботи. Технічні провайдери можуть включати Supabase, Vercel, Stripe, Resend, Google OAuth та налаштованого BankID/OIDC-провайдера." },
      { title: "7. Передача за межі ЄС/ЄЕЗ", text: "Деякі провайдери можуть обробляти дані за межами ЄС/ЄЕЗ. У таких випадках застосовуються відповідні механізми захисту, наприклад рішення про належний рівень захисту або стандартні договірні положення." },
      { title: "8. Зберігання", text: "Дані зберігаються стільки, скільки потрібно для акаунта, договору, бронювання, безпеки, бухгалтерських чи інших юридичних обов’язків або спорів, після чого видаляються чи анонімізуються." },
      { title: "9. Автоматичні перевірки безпеки", text: "Clean Jobs використовує технічні правила для виявлення спаму, підозрілих оголошень і зловживань. Вони можуть заблокувати або позначити контент. Якщо перевірка спрацювала помилково, зверніться до підтримки." },
      { title: "10. Ваші права", text: "Залежно від обробки ви можете мати право на доступ, виправлення, видалення, обмеження, переносимість, заперечення та відкликання згоди. Також можна подати скаргу до шведського органу IMY." },
      { title: "11. Безпека", text: "Ми використовуємо контроль доступу, Row Level Security, серверну авторизацію, приватне сховище доказів claim, підписані payment webhooks та інші технічні й організаційні заходи." },
      { title: "12. Зміни", text: "Політика може оновлюватися при змінах сервісу або вимог законодавства. Поточна версія та дата публікуються тут." },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    subtitle: "Как Clean Jobs обрабатывает персональные данные для маркетплейса, профилей компаний, заявок, бронирований, CRM, оплат и безопасности.",
    updated: "Обновлено: 17 августа 2026",
    back: "Назад на главную",
    incomplete: "До публичного production-запуска необходимо указать юридическое название оператора, организационный номер и почтовый адрес.",
    sections: (operator) => [
      { title: "1. Контролёр данных", text: `Контролёром персональных данных Clean Jobs является: ${operator}. По вопросам персональных данных используйте указанный privacy email.` },
      { title: "2. Какие данные мы обрабатываем", text: "Мы можем обрабатывать данные аккаунта и контакты, профили и данные компаний, объявления, заявки, чат, отзывы, запросы предложений, бронирования, CRM-заметки, загруженные файлы, статус BankID-верификации при активной функции и billing/subscription identifiers. Данные банковской карты обрабатывает Stripe; Clean Jobs их не хранит." },
      { title: "3. Источники данных", text: "Данные поступают от вас, других сторон заказа или бронирования, а также с публичных сайтов компаний или импортированных бизнес-реестров для каталога и релевантного B2B outreach." },
      { title: "4. Цели и правовые основания", text: "Данные нужны для аккаунтов, договоров, работ, заявок и бронирований, сайтов компаний, Premium, оплат, поддержки, споров и предотвращения мошенничества. Основанием в зависимости от операции служит договор, юридическая обязанность, законный интерес или согласие, когда оно требуется." },
      { title: "5. B2B outreach", text: "Для контакта с компаниями Clean Jobs может обрабатывать публично опубликованные профессиональные контактные данные, если существует применимое правовое основание. Электронный маркетинг отправляется только тогда, когда это разрешено применимыми правилами маркетинга. Если по GDPR используется законный интерес, мы оцениваем такой интерес, а получатель всегда может возразить против прямого маркетинга. Каждое маркетинговое письмо содержит простой способ отписки и действительный контактный адрес. После возражения мы сохраняем минимальную запись блокировки email, чтобы предотвратить будущие рассылки." },
      { title: "6. Получатели и провайдеры", text: "Данные могут передаваться клиенту или компании, которым они нужны для заявки, бронирования или работы. Технические провайдеры могут включать Supabase, Vercel, Stripe, Resend, Google OAuth и настроенного BankID/OIDC-провайдера." },
      { title: "7. Передачи вне ЕС/ЕЭЗ", text: "Некоторые провайдеры могут обрабатывать данные вне ЕС/ЕЭЗ. В таких случаях используются применимые защитные механизмы, например решения об адекватности или стандартные договорные положения." },
      { title: "8. Хранение", text: "Данные хранятся столько, сколько необходимо для аккаунта, договора, бронирования, безопасности, бухгалтерских или иных юридических обязанностей либо споров, после чего удаляются или анонимизируются." },
      { title: "9. Автоматические проверки безопасности", text: "Clean Jobs использует технические правила для выявления спама, подозрительных объявлений и злоупотреблений. Они могут блокировать или отмечать контент. При ошибке проверки обратитесь в поддержку." },
      { title: "10. Ваши права", text: "В зависимости от обработки у вас могут быть права на доступ, исправление, удаление, ограничение, переносимость, возражение и отзыв согласия. Жалобу также можно подать в шведский орган IMY." },
      { title: "11. Безопасность", text: "Мы используем контроль доступа, Row Level Security, серверную авторизацию, приватное хранилище доказательств claim, подписанные payment webhooks и другие технические и организационные меры." },
      { title: "12. Изменения", text: "Политика может обновляться при изменении сервиса или законодательства. Текущая версия и дата публикуются здесь." },
    ],
  },
  pl: {
    title: "Polityka prywatności",
    subtitle: "Jak Clean Jobs przetwarza dane osobowe dla marketplace, profili firm, zapytań, rezerwacji, CRM, płatności i bezpieczeństwa.",
    updated: "Zaktualizowano: 17 sierpnia 2026",
    back: "Wróć na stronę główną",
    incomplete: "Przed publicznym uruchomieniem produkcyjnym należy skonfigurować nazwę prawną operatora, numer organizacyjny i adres pocztowy.",
    sections: (operator) => [
      { title: "1. Administrator danych", text: `Administratorem danych Clean Jobs jest: ${operator}. W sprawach dotyczących danych osobowych skontaktuj się przez podany adres privacy email.` },
      { title: "2. Dane, które przetwarzamy", text: "Możemy przetwarzać dane konta i kontaktowe, profile i dane firm, ogłoszenia, aplikacje, czat, opinie, zapytania ofertowe, rezerwacje, notatki CRM, przesłane pliki, status weryfikacji BankID gdy funkcja jest aktywna oraz identyfikatory rozliczeń/subskrypcji. Dane kart przetwarza Stripe i nie są przechowywane przez Clean Jobs." },
      { title: "3. Źródła danych", text: "Dane pochodzą od Ciebie, innych stron zlecenia lub rezerwacji oraz z publicznych stron firm lub importowanych rejestrów biznesowych dla katalogu i odpowiedniego kontaktu B2B." },
      { title: "4. Cele i podstawy prawne", text: "Przetwarzamy dane dla kont, realizacji umów, zleceń, zapytań i rezerwacji, stron firmowych, Premium, płatności, wsparcia, sporów i zapobiegania nadużyciom. Podstawą zależnie od operacji jest umowa, obowiązek prawny, uzasadniony interes lub zgoda, gdy jest wymagana." },
      { title: "5. Kontakt B2B", text: "W ramach kontaktu biznesowego Clean Jobs może przetwarzać publicznie dostępne zawodowe dane kontaktowe, jeśli istnieje odpowiednia podstawa prawna. Marketing elektroniczny jest wysyłany tylko wtedy, gdy pozwalają na to właściwe przepisy marketingowe. Gdy podstawą w rozumieniu GDPR jest uzasadniony interes, oceniamy ten interes, a odbiorca zawsze może wnieść sprzeciw wobec marketingu bezpośredniego. Każda wiadomość marketingowa zawiera prostą możliwość rezygnacji oraz ważny adres kontaktowy. Po sprzeciwie zachowujemy minimalny wpis blokujący adres e-mail, aby zapobiec przyszłym wysyłkom." },
      { title: "6. Odbiorcy i dostawcy", text: "Dane mogą być udostępniane klientowi lub firmie, która potrzebuje ich do zapytania, rezerwacji lub zlecenia. Dostawcy techniczni mogą obejmować Supabase, Vercel, Stripe, Resend, Google OAuth oraz skonfigurowanego dostawcę BankID/OIDC." },
      { title: "7. Transfery poza UE/EOG", text: "Niektórzy dostawcy mogą przetwarzać dane poza UE/EOG. Gdy dochodzi do transferu, stosujemy odpowiednie zabezpieczenia, np. decyzje o adekwatności lub standardowe klauzule umowne." },
      { title: "8. Retencja", text: "Dane są przechowywane tak długo, jak jest to potrzebne dla konta, umowy, rezerwacji, bezpieczeństwa, księgowości lub innych obowiązków prawnych albo sporów, a następnie usuwane lub anonimizowane." },
      { title: "9. Automatyczne kontrole bezpieczeństwa", text: "Clean Jobs używa reguł technicznych do wykrywania spamu, podejrzanych ogłoszeń i nadużyć. Kontrole mogą blokować lub oznaczać treść. W razie błędu skontaktuj się ze wsparciem." },
      { title: "10. Twoje prawa", text: "W zależności od przetwarzania możesz mieć prawo dostępu, sprostowania, usunięcia, ograniczenia, przenoszenia, sprzeciwu i wycofania zgody. Możesz także złożyć skargę do szwedzkiego organu IMY." },
      { title: "11. Bezpieczeństwo", text: "Stosujemy kontrolę dostępu, Row Level Security, autoryzację po stronie serwera, prywatne przechowywanie dowodów claim, podpisane payment webhooks oraz inne środki techniczne i organizacyjne." },
      { title: "12. Zmiany", text: "Polityka może być aktualizowana wraz ze zmianami usługi lub prawa. Aktualna wersja i data są publikowane na tej stronie." },
    ],
  },
}

export default async function PrivacyPage() {
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en
  const operator = getLegalOperator()
  const sections = t.sections(formatLegalOperator(operator))

  return <main className="min-h-screen bg-[#fafafa]"><div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
    <Link href="/" className="text-sm font-bold text-slate-600 hover:text-rose-700">← {t.back}</Link>
    <header className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 md:p-8"><p className="text-sm font-bold text-rose-700">{t.updated}</p><h1 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">{t.title}</h1><p className="mt-4 leading-7 text-slate-600">{t.subtitle}</p></header>
    {!operator.configured ? <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{t.incomplete}</div> : null}
    <section className="mt-6 space-y-4">{sections.map((section) => <article key={section.title} className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6"><h2 className="text-lg font-black text-slate-950">{section.title}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 md:text-base">{section.text}</p></article>)}</section>
    <div className="mt-6 flex gap-3"><Link href="/terms" className="font-bold text-rose-700">Terms</Link><Link href="/cookies" className="font-bold text-rose-700">Cookies</Link></div>
  </div></main>
}
