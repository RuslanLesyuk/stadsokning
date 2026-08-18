import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { normalizeLocale, type Locale } from "@/lib/i18n"
import { formatLegalOperator, getLegalOperator } from "@/lib/legal/config"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Terms of Service | Clean Jobs",
  description: "Terms of Service for Clean Jobs.",
}

type Section = {
  title: string
  text: string
}

type Copy = {
  title: string
  subtitle: string
  updated: string
  back: string
  incomplete: string
  operatorTitle: string
  sections: Section[]
}

const sections: Record<Locale, Section[]> = {
  sv: [
    { title: "1. Om Clean Jobs", text: "Clean Jobs är en digital marknadsplats och programvarutjänst för städjobb, företagsprofiler, offertförfrågningar, bokningar, kundhantering och företagswebbplatser. Om inget annat uttryckligen anges är Clean Jobs inte arbetsgivare, städföretag eller part i avtalet om den faktiska städtjänsten." },
    { title: "2. Konto och behörighet", text: "Du ska lämna korrekta uppgifter, skydda ditt konto och bara agera för företag som du har rätt att företräda. Företagsanspråk kan kräva granskning och bevis. Verifieringsstatus är inte en garanti för kvalitet, kreditvärdighet eller resultat." },
    { title: "3. Jobb, offerter och bokningar", text: "Kunder och utförare ansvarar för att kontrollera omfattning, pris, tid, åtkomst, försäkring, skatt, RUT-villkor och andra villkor för den faktiska tjänsten. Clean Jobs kan tillhandahålla tekniska flöden men garanterar inte att ett jobb, lead eller en bokning leder till avtal eller intäkt." },
    { title: "4. Premium och betalningar", text: "Premium kan erbjudas månads- eller årsvis och debiteras återkommande tills abonnemanget avslutas enligt den plan som visas vid köpet. Betalningar hanteras av Stripe. Uppsägning kan normalt göras via faktureringsportalen och gäller från slutet av den betalda perioden om inte annat anges. Tvingande konsumenträtt, inklusive eventuell ångerrätt, begränsas inte av dessa villkor." },
    { title: "5. Företagswebbplatser och domäner", text: "Företag ansvarar för text, bilder, priser, kontaktuppgifter, domänkonfiguration och andra uppgifter som publiceras via Website-as-a-Service. Premiumfunktioner kan ändras eller kräva ett aktivt abonnemang." },
    { title: "6. Innehåll och förbjuden användning", text: "Det är förbjudet att publicera olagligt, bedrägligt, hotfullt, diskriminerande, integritetskränkande eller vilseledande innehåll, spam, skadlig kod, falska recensioner, obehöriga personuppgifter eller försök att kringgå säkerhet och behörighetskontroller." },
    { title: "7. Moderering och säkerhet", text: "Clean Jobs kan använda automatiska och manuella kontroller för spam, bedrägerier, rapporter och missbruk. Vi kan avvisa, dölja eller ta bort innehåll, begränsa funktioner eller stänga av konton när det behövs för säkerhet, lagkrav eller dessa villkor. Kontakta support om du vill bestrida ett beslut." },
    { title: "8. Recensioner", text: "Recensioner ska vara sakliga, relevanta och baserade på verklig erfarenhet. Manipulation, köpta eller falska recensioner och trakasserier är förbjudna. Clean Jobs kan moderera recensioner som bryter mot reglerna." },
    { title: "9. Immateriella rättigheter", text: "Du behåller rättigheter till innehåll som du äger men ger Clean Jobs den begränsade rätt som behövs för att lagra, visa, tekniskt bearbeta och distribuera innehållet inom tjänsten. Du ansvarar för att du har rätt att publicera materialet." },
    { title: "10. Tillgänglighet och ändringar", text: "Tjänsten kan ändras, underhållas eller tillfälligt vara otillgänglig. Vi kan ändra funktioner och framtida priser. Väsentliga ändringar som påverkar ett aktivt betalt erbjudande hanteras med hänsyn till tillämplig tvingande lag." },
    { title: "11. Ansvar", text: "Clean Jobs ansvarar inte för parternas faktiska städarbete, arbetsmiljö, skador, utebliven betalning eller andra åtaganden mellan användare, utom i den utsträckning ansvar följer av tvingande lag. Användare ansvarar för sina egna skatter, tillstånd och försäkringar." },
    { title: "12. Lag och tvister", text: "Svensk lag tillämpas i den utsträckning det är tillåtet. Tvingande konsumentskyddsregler och behörig konsumenttvistlösning påverkas inte. För support eller klagomål, kontakta Clean Jobs." },
  ],
  en: [
    { title: "1. About Clean Jobs", text: "Clean Jobs is a digital marketplace and software service for cleaning jobs, company profiles, quote requests, bookings, customer management, and company websites. Unless expressly stated otherwise, Clean Jobs is not the employer, cleaning provider, or a party to the contract for the actual cleaning service." },
    { title: "2. Accounts and authority", text: "You must provide accurate information, protect your account, and only act for companies you are authorised to represent. Company claims may require review and evidence. Verification status is not a guarantee of quality, creditworthiness, or outcome." },
    { title: "3. Jobs, quotes, and bookings", text: "Customers and providers are responsible for confirming scope, price, timing, access, insurance, tax, RUT eligibility, and other terms of the actual service. Clean Jobs may provide technical workflows but does not guarantee that a job, lead, or booking results in a contract or revenue." },
    { title: "4. Premium and payments", text: "Premium may be offered monthly or yearly and is billed on a recurring basis until cancelled under the plan shown at purchase. Payments are handled by Stripe. Cancellation can normally be managed through the billing portal and takes effect at the end of the paid period unless stated otherwise. Mandatory consumer rights, including any applicable withdrawal rights, are not limited by these terms." },
    { title: "5. Company websites and domains", text: "Companies are responsible for text, images, prices, contact details, domain configuration, and other information published through Website-as-a-Service. Premium features may change or require an active subscription." },
    { title: "6. Content and prohibited use", text: "You may not publish illegal, fraudulent, threatening, discriminatory, privacy-invasive or misleading content, spam, malware, fake reviews, unauthorised personal data, or attempts to bypass security and access controls." },
    { title: "7. Moderation and security", text: "Clean Jobs may use automated and manual controls for spam, fraud, reports, and abuse. We may reject, hide or remove content, limit functionality, or suspend accounts where necessary for security, legal compliance, or these terms. Contact support if you want to challenge a decision." },
    { title: "8. Reviews", text: "Reviews must be factual, relevant, and based on genuine experience. Manipulation, purchased or fake reviews, and harassment are prohibited. Clean Jobs may moderate reviews that violate the rules." },
    { title: "9. Intellectual property", text: "You retain rights to content you own but grant Clean Jobs the limited rights needed to store, display, technically process, and distribute it within the service. You are responsible for having the right to publish the material." },
    { title: "10. Availability and changes", text: "The service may change, undergo maintenance, or be temporarily unavailable. We may change features and future pricing. Material changes affecting an active paid offer are handled subject to applicable mandatory law." },
    { title: "11. Liability", text: "Clean Jobs is not responsible for the parties' actual cleaning work, workplace safety, damage, non-payment, or other obligations between users, except where liability follows from mandatory law. Users remain responsible for their own taxes, permits, and insurance." },
    { title: "12. Law and disputes", text: "Swedish law applies to the extent permitted. Mandatory consumer protection and competent consumer dispute mechanisms are not affected. Contact Clean Jobs for support or complaints." },
  ],
  uk: [
    { title: "1. Про Clean Jobs", text: "Clean Jobs — це цифровий маркетплейс і програмний сервіс для замовлень на прибирання, профілів компаній, запитів цінових пропозицій, бронювань, роботи з клієнтами та сайтів компаній. Якщо прямо не зазначено інше, Clean Jobs не є роботодавцем, клінінговою компанією чи стороною договору щодо фактичної послуги прибирання." },
    { title: "2. Акаунт і повноваження", text: "Ви повинні надавати правдиві дані, захищати свій акаунт і діяти від імені лише тих компаній, які маєте право представляти. Заявка на володіння компанією може вимагати перевірки та доказів. Статус верифікації не є гарантією якості, платоспроможності чи результату." },
    { title: "3. Роботи, пропозиції та бронювання", text: "Клієнти й виконавці самостійно узгоджують обсяг, ціну, час, доступ, страхування, податки, право на RUT та інші умови фактичної послуги. Clean Jobs надає технічні процеси, але не гарантує, що оголошення, лід або бронювання завершаться договором чи доходом." },
    { title: "4. Premium та оплати", text: "Premium може пропонуватися щомісячно або щорічно та оплачуватися регулярно до скасування відповідно до плану, показаного під час покупки. Платежі обробляє Stripe. Скасування зазвичай доступне через billing-портал і набуває чинності наприкінці оплаченого періоду, якщо не вказано інше. Ці умови не обмежують обов’язкові права споживача, включно з правом на відмову від дистанційного договору, коли воно застосовується." },
    { title: "5. Сайти компаній і домени", text: "Компанії відповідають за тексти, зображення, ціни, контактні дані, налаштування доменів та іншу інформацію, опубліковану через Website-as-a-Service. Premium-функції можуть змінюватися або вимагати активної підписки." },
    { title: "6. Контент і заборонене використання", text: "Заборонено публікувати незаконний, шахрайський, погрозливий, дискримінаційний, такий, що порушує приватність, або оманливий контент, спам, шкідливий код, фальшиві відгуки, персональні дані без правової підстави чи намагатися обходити механізми безпеки та контролю доступу." },
    { title: "7. Модерація та безпека", text: "Clean Jobs може використовувати автоматичні й ручні перевірки для боротьби зі спамом, шахрайством, скаргами та зловживаннями. Ми можемо відхиляти, приховувати або видаляти контент, обмежувати функції чи призупиняти акаунти, якщо це потрібно для безпеки, дотримання закону або цих умов. Для оскарження рішення зверніться до підтримки." },
    { title: "8. Відгуки", text: "Відгуки мають бути правдивими, доречними та ґрунтуватися на реальному досвіді. Маніпуляції, куплені або фальшиві відгуки та переслідування заборонені. Clean Jobs може модерувати відгуки, що порушують правила." },
    { title: "9. Інтелектуальна власність", text: "Ви зберігаєте права на власний контент, але надаєте Clean Jobs обмежені права, необхідні для його зберігання, показу, технічної обробки та поширення в межах сервісу. Ви відповідаєте за наявність права на публікацію матеріалів." },
    { title: "10. Доступність і зміни", text: "Сервіс може змінюватися, проходити технічне обслуговування або тимчасово бути недоступним. Ми можемо змінювати функції та майбутні ціни. Істотні зміни, що впливають на активну платну пропозицію, здійснюються з урахуванням обов’язкового законодавства." },
    { title: "11. Відповідальність", text: "Clean Jobs не відповідає за фактичне виконання прибирання сторонами, умови праці, пошкодження, несплату чи інші зобов’язання між користувачами, крім випадків, коли відповідальність прямо випливає з обов’язкового закону. Користувачі самостійно відповідають за податки, дозволи та страхування." },
    { title: "12. Право та спори", text: "Шведське право застосовується в дозволеному законом обсязі. Обов’язковий захист споживачів і доступні механізми вирішення споживчих спорів цими умовами не обмежуються. Для підтримки чи скарг звертайтеся до Clean Jobs." },
  ],
  ru: [
    { title: "1. О Clean Jobs", text: "Clean Jobs — это цифровой маркетплейс и программный сервис для заказов на уборку, профилей компаний, запросов предложений, бронирований, работы с клиентами и сайтов компаний. Если прямо не указано иное, Clean Jobs не является работодателем, клининговой компанией или стороной договора на фактическую услугу уборки." },
    { title: "2. Аккаунт и полномочия", text: "Вы должны предоставлять достоверные данные, защищать свой аккаунт и действовать только от имени компаний, которые вправе представлять. Заявка на владение компанией может требовать проверки и доказательств. Статус верификации не является гарантией качества, платёжеспособности или результата." },
    { title: "3. Работы, предложения и бронирования", text: "Клиенты и исполнители самостоятельно согласуют объём, цену, время, доступ, страхование, налоги, право на RUT и другие условия фактической услуги. Clean Jobs предоставляет технические процессы, но не гарантирует, что объявление, лид или бронирование приведут к договору или доходу." },
    { title: "4. Premium и платежи", text: "Premium может предлагаться помесячно или ежегодно и оплачиваться регулярно до отмены согласно плану, показанному при покупке. Платежи обрабатывает Stripe. Отмена обычно доступна через billing-портал и вступает в силу в конце оплаченного периода, если не указано иное. Эти условия не ограничивают обязательные права потребителя, включая применимое право отказаться от дистанционного договора." },
    { title: "5. Сайты компаний и домены", text: "Компании отвечают за тексты, изображения, цены, контактные данные, настройку доменов и другую информацию, опубликованную через Website-as-a-Service. Premium-функции могут меняться или требовать активной подписки." },
    { title: "6. Контент и запрещённое использование", text: "Запрещено публиковать незаконный, мошеннический, угрожающий, дискриминационный, нарушающий приватность или вводящий в заблуждение контент, спам, вредоносный код, фальшивые отзывы, персональные данные без законного основания, а также пытаться обходить механизмы безопасности и контроля доступа." },
    { title: "7. Модерация и безопасность", text: "Clean Jobs может использовать автоматические и ручные проверки для борьбы со спамом, мошенничеством, жалобами и злоупотреблениями. Мы можем отклонять, скрывать или удалять контент, ограничивать функции или приостанавливать аккаунты, если это необходимо для безопасности, соблюдения закона или этих условий. Для оспаривания решения обратитесь в поддержку." },
    { title: "8. Отзывы", text: "Отзывы должны быть достоверными, уместными и основанными на реальном опыте. Манипуляции, купленные или фальшивые отзывы и преследование запрещены. Clean Jobs может модерировать отзывы, нарушающие правила." },
    { title: "9. Интеллектуальная собственность", text: "Вы сохраняете права на собственный контент, но предоставляете Clean Jobs ограниченные права, необходимые для его хранения, показа, технической обработки и распространения внутри сервиса. Вы отвечаете за наличие права публиковать материалы." },
    { title: "10. Доступность и изменения", text: "Сервис может изменяться, проходить техническое обслуживание или временно быть недоступным. Мы можем менять функции и будущие цены. Существенные изменения, влияющие на активное платное предложение, осуществляются с учётом обязательного законодательства." },
    { title: "11. Ответственность", text: "Clean Jobs не отвечает за фактическое выполнение уборки сторонами, условия труда, ущерб, неоплату или другие обязательства между пользователями, кроме случаев, когда ответственность прямо следует из обязательного закона. Пользователи самостоятельно отвечают за налоги, разрешения и страхование." },
    { title: "12. Право и споры", text: "Шведское право применяется в допустимом законом объёме. Обязательная защита потребителей и доступные механизмы разрешения потребительских споров этими условиями не ограничиваются. Для поддержки или жалоб обращайтесь в Clean Jobs." },
  ],
  pl: [
    { title: "1. O Clean Jobs", text: "Clean Jobs jest cyfrowym marketplace'em i usługą programową dla zleceń sprzątania, profili firm, zapytań ofertowych, rezerwacji, zarządzania klientami i stron firmowych. O ile wyraźnie nie wskazano inaczej, Clean Jobs nie jest pracodawcą, firmą sprzątającą ani stroną umowy dotyczącej faktycznej usługi sprzątania." },
    { title: "2. Konto i uprawnienia", text: "Musisz podawać prawdziwe dane, chronić swoje konto i działać wyłącznie w imieniu firm, które masz prawo reprezentować. Zgłoszenie własności firmy może wymagać weryfikacji i dowodów. Status weryfikacji nie stanowi gwarancji jakości, wiarygodności kredytowej ani rezultatu." },
    { title: "3. Zlecenia, oferty i rezerwacje", text: "Klienci i wykonawcy sami uzgadniają zakres, cenę, termin, dostęp, ubezpieczenie, podatki, uprawnienie do RUT i pozostałe warunki faktycznej usługi. Clean Jobs zapewnia procesy techniczne, ale nie gwarantuje, że zlecenie, lead lub rezerwacja doprowadzą do zawarcia umowy lub uzyskania przychodu." },
    { title: "4. Premium i płatności", text: "Premium może być oferowany miesięcznie lub rocznie i rozliczany cyklicznie do czasu anulowania zgodnie z planem pokazanym przy zakupie. Płatności obsługuje Stripe. Anulowanie jest zazwyczaj dostępne przez portal rozliczeniowy i obowiązuje od końca opłaconego okresu, o ile nie wskazano inaczej. Niniejsze warunki nie ograniczają bezwzględnie obowiązujących praw konsumenta, w tym prawa odstąpienia od umowy zawartej na odległość, gdy ma ono zastosowanie." },
    { title: "5. Strony firmowe i domeny", text: "Firmy odpowiadają za teksty, zdjęcia, ceny, dane kontaktowe, konfigurację domeny i inne informacje publikowane przez Website-as-a-Service. Funkcje Premium mogą się zmieniać lub wymagać aktywnej subskrypcji." },
    { title: "6. Treści i zakazane użycie", text: "Nie wolno publikować treści nielegalnych, oszukańczych, grożących, dyskryminujących, naruszających prywatność lub wprowadzających w błąd, spamu, złośliwego oprogramowania, fałszywych opinii, danych osobowych bez podstawy prawnej ani próbować omijać zabezpieczeń i kontroli dostępu." },
    { title: "7. Moderacja i bezpieczeństwo", text: "Clean Jobs może stosować automatyczne i ręczne kontrole spamu, oszustw, zgłoszeń i nadużyć. Możemy odrzucać, ukrywać lub usuwać treści, ograniczać funkcje albo zawieszać konta, gdy jest to potrzebne dla bezpieczeństwa, zgodności z prawem lub przestrzegania tych warunków. Aby zakwestionować decyzję, skontaktuj się z pomocą techniczną." },
    { title: "8. Opinie", text: "Opinie muszą być rzeczowe, istotne i oparte na rzeczywistym doświadczeniu. Manipulowanie, kupowane lub fałszywe opinie oraz nękanie są zabronione. Clean Jobs może moderować opinie naruszające zasady." },
    { title: "9. Własność intelektualna", text: "Zachowujesz prawa do własnych treści, ale udzielasz Clean Jobs ograniczonych praw niezbędnych do ich przechowywania, wyświetlania, technicznego przetwarzania i dystrybucji w ramach usługi. Odpowiadasz za posiadanie prawa do publikacji materiałów." },
    { title: "10. Dostępność i zmiany", text: "Usługa może się zmieniać, podlegać pracom technicznym lub czasowo być niedostępna. Możemy zmieniać funkcje i przyszłe ceny. Istotne zmiany dotyczące aktywnej płatnej oferty są dokonywane z uwzględnieniem bezwzględnie obowiązującego prawa." },
    { title: "11. Odpowiedzialność", text: "Clean Jobs nie odpowiada za faktyczne wykonanie sprzątania przez strony, bezpieczeństwo pracy, szkody, brak zapłaty ani inne zobowiązania między użytkownikami, z wyjątkiem zakresu wynikającego z bezwzględnie obowiązującego prawa. Użytkownicy sami odpowiadają za podatki, zezwolenia i ubezpieczenia." },
    { title: "12. Prawo i spory", text: "Prawo szwedzkie ma zastosowanie w dozwolonym zakresie. Bezwzględnie obowiązująca ochrona konsumentów i właściwe mechanizmy rozstrzygania sporów konsumenckich nie są ograniczane przez te warunki. W sprawach wsparcia lub skarg skontaktuj się z Clean Jobs." },
  ],
}

function getCopy(locale: Locale): Copy {
  const shared = {
    sv: {
      title: "Användarvillkor",
      subtitle: "Regler för att använda Clean Jobs och dess betalda och kostnadsfria funktioner.",
      updated: "Uppdaterad: 17 augusti 2026",
      back: "Tillbaka",
      incomplete: "Operatörens fullständiga juridiska identitet måste konfigureras före offentlig produktionslansering.",
      operatorTitle: "13. Tjänsteoperatör",
    },
    en: {
      title: "Terms of Service",
      subtitle: "Rules for using the free and paid Clean Jobs features.",
      updated: "Updated: 17 August 2026",
      back: "Back",
      incomplete: "The operator's complete legal identity must be configured before public production launch.",
      operatorTitle: "13. Service operator",
    },
    uk: {
      title: "Умови користування",
      subtitle: "Правила використання безкоштовних і платних функцій Clean Jobs.",
      updated: "Оновлено: 17 серпня 2026",
      back: "Назад",
      incomplete: "Перед публічним запуском потрібно налаштувати повні юридичні дані оператора.",
      operatorTitle: "13. Оператор сервісу",
    },
    ru: {
      title: "Условия использования",
      subtitle: "Правила использования бесплатных и платных функций Clean Jobs.",
      updated: "Обновлено: 17 августа 2026",
      back: "Назад",
      incomplete: "До публичного запуска необходимо настроить полные юридические данные оператора.",
      operatorTitle: "13. Оператор сервиса",
    },
    pl: {
      title: "Warunki korzystania",
      subtitle: "Zasady korzystania z bezpłatnych i płatnych funkcji Clean Jobs.",
      updated: "Zaktualizowano: 17 sierpnia 2026",
      back: "Wróć",
      incomplete: "Przed publicznym uruchomieniem należy skonfigurować pełne dane prawne operatora.",
      operatorTitle: "13. Operator usługi",
    },
  } satisfies Record<Locale, Omit<Copy, "sections">>

  return {
    ...shared[locale],
    sections: sections[locale],
  }
}

export default async function TermsPage() {
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = getCopy(locale)
  const operator = getLegalOperator()
  const rows = [
    ...t.sections,
    { title: t.operatorTitle, text: formatLegalOperator(operator) },
  ]

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <Link href="/" className="text-sm font-bold text-slate-600 hover:text-rose-700">
          ← {t.back}
        </Link>

        <header className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 md:p-8">
          <p className="text-sm font-bold text-rose-700">{t.updated}</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">{t.title}</h1>
          <p className="mt-4 text-slate-600">{t.subtitle}</p>
          {!operator.configured ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              {t.incomplete}
            </div>
          ) : null}
        </header>

        <section className="mt-6 space-y-4">
          {rows.map((section) => (
            <article key={section.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">{section.title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700 md:text-base">
                {section.text}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
