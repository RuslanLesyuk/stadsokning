import type { Locale } from "@/lib/i18n"

export type FaqItem = {
  question: string
  answer: string
}

export type FaqCategory = {
  id: string
  title: string
  description: string
  items: FaqItem[]
}

export type FaqPageCopy = {
  metadata: {
    title: string
    description: string
  }

  hero: {
    eyebrow: string
    title: string
    description: string
    postJob: string
    browseJobs: string
  }

  audience: {
    eyebrow: string
    title: string
    description: string

    client: {
      title: string
      description: string
      steps: string[]
      button: string
    }

    worker: {
      title: string
      description: string
      steps: string[]
      button: string
    }

    company: {
      title: string
      description: string
      steps: string[]
      button: string
    }
  }

  faq: {
    eyebrow: string
    title: string
    description: string
    categories: FaqCategory[]
  }

  safety: {
    eyebrow: string
    title: string
    description: string
    items: string[]
  }

  contact: {
    eyebrow: string
    title: string
    description: string
    emailLabel: string
    button: string
  }
}

export const faqPageCopy: Record<Locale, FaqPageCopy> = {
  sv: {
    metadata: {
      title: "Hjälp och vanliga frågor",
      description:
        "Lär dig hur Clean Jobs fungerar. Hitta svar om städjobb, ansökningar, chatt, recensioner, företagstjänster och säkerhet.",
    },

    hero: {
      eyebrow: "Clean Jobs hjälpcenter",
      title: "Hur kan vi hjälpa dig?",
      description:
        "Här hittar du instruktioner och svar om hur du publicerar ett jobb, söker städjobb, väljer en utförare och använder Clean Jobs.",
      postJob: "Publicera ett jobb",
      browseJobs: "Visa lediga jobb",
    },

    audience: {
      eyebrow: "Kom igång",
      title: "Välj hur du vill använda Clean Jobs",
      description:
        "Clean Jobs är skapat för kunder, arbetssökande och städföretag i Sverige.",

      client: {
        title: "Jag söker en städare",
        description:
          "Publicera ett uppdrag, jämför ansökningar och välj den person som passar bäst.",
        steps: [
          "Skapa ett konto eller logga in.",
          "Publicera ett städuppdrag med datum, plats och information.",
          "Ta emot och jämför ansökningar från arbetare.",
          "Godkänn en ansökan och använd den privata chatten.",
          "Markera jobbet som klart och lämna en recension.",
        ],
        button: "Publicera ett jobb",
      },

      worker: {
        title: "Jag söker städjobb",
        description:
          "Bläddra bland lediga jobb, skicka en ansökan och bygg upp ditt omdöme.",
        steps: [
          "Skapa ett konto och fyll i din profil.",
          "Öppna listan över tillgängliga städjobb.",
          "Skicka en ansökan med pris och ett kort meddelande.",
          "Vänta tills kunden väljer en utförare.",
          "Genomför jobbet och be om en recension.",
        ],
        button: "Hitta städjobb",
      },

      company: {
        title: "Jag representerar ett företag",
        description:
          "Visa företagets tjänster, hitta nya kunder och publicera lediga jobb.",
        steps: [
          "Registrera ett konto för företagets representant.",
          "Skapa eller gör anspråk på företagets profilsida.",
          "Lägg till tjänster, arbetsområden och kontaktinformation.",
          "Publicera uppdrag eller lediga jobb.",
          "Samla recensioner och bygg förtroende.",
        ],
        button: "Lägg till tjänster",
      },
    },

    faq: {
      eyebrow: "Vanliga frågor",
      title: "Svar på de vanligaste frågorna",
      description:
        "Öppna en kategori och välj den fråga som bäst beskriver vad du behöver hjälp med.",

      categories: [
        {
          id: "account",
          title: "Konto och profil",
          description:
            "Registrering, inloggning, profiluppgifter och språk.",
          items: [
            {
              question: "Hur skapar jag ett konto?",
              answer:
                "Öppna registreringssidan och ange din e-postadress och ditt lösenord. Du kan också använda Google-inloggning om det alternativet visas. Efter registreringen kan du fylla i ditt namn, telefonnummer, stad och profilinformation.",
            },
            {
              question: "Kan jag använda Clean Jobs utan ett konto?",
              answer:
                "Du kan läsa offentliga sidor och se viss information utan att vara inloggad. För att publicera jobb, skicka ansökningar, chatta, lämna recensioner eller skapa företagstjänster behöver du ett konto.",
            },
            {
              question: "Hur ändrar jag mina profiluppgifter?",
              answer:
                "Logga in och öppna din profil eller dashboard. Där kan du ändra namn, telefonnummer, stad, profilbild och annan tillgänglig information. Din inloggningsadress kan vara låst av säkerhetsskäl.",
            },
            {
              question: "Hur ändrar jag språk?",
              answer:
                "Använd språkväljaren i sidhuvudet. Clean Jobs finns på svenska, engelska, ukrainska, ryska och polska. Ditt val sparas i webbläsaren.",
            },
          ],
        },

        {
          id: "clients",
          title: "För kunder",
          description:
            "Publicera uppdrag, ta emot ansökningar och välj utförare.",
          items: [
            {
              question: "Hur publicerar jag ett städuppdrag?",
              answer:
                "Logga in och välj alternativet för att publicera ett jobb. Fyll i rubrik, beskrivning, adress eller stad, datum, tid, budget och annan relevant information. Kontrollera uppgifterna innan du publicerar.",
            },
            {
              question: "Vad händer efter att jag publicerat ett jobb?",
              answer:
                "Jobbet visas för tillgängliga arbetare. Intresserade personer kan skicka en ansökan med sitt pris och ett meddelande. Du kan sedan jämföra profiler, recensioner och erbjudanden.",
            },
            {
              question: "Hur väljer jag en utförare?",
              answer:
                "Öppna ditt jobb och gå till listan över ansökningar. Granska varje kandidats pris, profil, meddelande och recensioner. När du har bestämt dig godkänner du den valda ansökan.",
            },
            {
              question: "Kan flera personer ansöka till samma jobb?",
              answer:
                "Ja. Flera arbetare kan skicka ansökningar så länge jobbet är öppet. Kunden väljer sedan en av kandidaterna.",
            },
            {
              question: "Kan jag redigera eller ta bort ett jobb?",
              answer:
                "Jobbets ägare kan redigera eller ta bort jobbet när dessa alternativ är tillgängliga. Ett jobb som redan har en godkänd utförare eller pågående aktivitet kan omfattas av begränsningar.",
            },
          ],
        },

        {
          id: "workers",
          title: "För arbetare",
          description:
            "Hitta jobb, skicka ansökningar och hantera arbetets status.",
          items: [
            {
              question: "Hur hittar jag lediga städjobb?",
              answer:
                "Öppna sidan med jobb och använd tillgängliga filter för plats, typ av städning och andra kriterier. Öppna ett jobb för att läsa den fullständiga beskrivningen.",
            },
            {
              question: "Hur skickar jag en ansökan?",
              answer:
                "Öppna ett tillgängligt jobb och välj alternativet för att ansöka. Ange ditt pris och skriv ett kort, tydligt meddelande om din erfarenhet och tillgänglighet.",
            },
            {
              question: "Kan jag ansöka flera gånger till samma jobb?",
              answer:
                "Nej. Normalt kan varje användare bara ha en aktiv ansökan per jobb. Det förhindrar dubbletter och gör ansökningslistan tydligare för kunden.",
            },
            {
              question: "Hur vet jag om kunden har valt mig?",
              answer:
                "När kunden godkänner din ansökan ändras jobbets status och du får en avisering. Därefter blir den privata chatten tillgänglig för dig och kunden.",
            },
            {
              question: "När ska jag markera att arbetet har börjat?",
              answer:
                "Markera arbetet som påbörjat när du faktiskt har börjat genomföra uppdraget. Använd inte denna status innan du och kunden har kommit överens om detaljerna.",
            },
          ],
        },

        {
          id: "chat",
          title: "Chatt och aviseringar",
          description:
            "Privata meddelanden, olästa meddelanden och systemaviseringar.",
          items: [
            {
              question: "När öppnas chatten?",
              answer:
                "Chatten öppnas när kunden har godkänt en ansökan. Innan en utförare har valts kan deltagarna normalt inte starta en privat jobbchatt.",
            },
            {
              question: "Vem kan läsa meddelandena?",
              answer:
                "Jobbchatten är avsedd för kunden och den godkända utföraren. Andra sökande ska inte ha tillgång till den privata konversationen.",
            },
            {
              question: "Varför ser jag ett oläst meddelande?",
              answer:
                "Ett meddelande räknas som oläst tills du öppnar den aktuella chatten. Räknaren uppdateras när meddelandet markeras som läst.",
            },
            {
              question: "Vilka aviseringar kan jag få?",
              answer:
                "Du kan få aviseringar om nya meddelanden, ansökningar, ändrad jobbstatus, godkända ansökningar och mottagna recensioner. Tillgängliga aviseringar kan förändras när plattformen utvecklas.",
            },
          ],
        },

        {
          id: "completion",
          title: "Slutfört arbete och recensioner",
          description:
            "Slutför jobbet och lämna omdömen efter samarbetet.",
          items: [
            {
              question: "Hur avslutas ett jobb?",
              answer:
                "När arbetet är klart använder den behöriga deltagaren knappen för att avsluta jobbet. Statusen uppdateras och jobbet flyttas till historiken när processen är färdig.",
            },
            {
              question: "Vem kan lämna en recension?",
              answer:
                "De användare som deltog i det avslutade jobbet kan lämna en recension när recensionsfunktionen är tillgänglig för deras roll.",
            },
            {
              question: "Kan jag ändra en recension?",
              answer:
                "Tillgängliga möjligheter beror på den aktuella versionen av recensionssystemet. Om redigering inte erbjuds kan du kontakta supporten vid ett tydligt fel eller missbruk.",
            },
            {
              question: "Varför är recensioner viktiga?",
              answer:
                "Recensioner hjälper kunder att välja pålitliga utförare och hjälper arbetare och företag att bygga ett starkt rykte på plattformen.",
            },
          ],
        },

        {
          id: "companies",
          title: "Företag och tjänster",
          description:
            "Företagsprofiler, tjänster, verifiering och synlighet.",
          items: [
            {
              question: "Hur lägger jag till mitt städföretag?",
              answer:
                "Skapa ett konto och öppna sidan för att lägga till tjänster eller företag. Fyll i företagsnamn, stad, beskrivning, kontaktuppgifter, priser, tjänstetyper och arbetsområden.",
            },
            {
              question: "Vad betyder verifierad?",
              answer:
                "En verifierad markering visar att Clean Jobs har genomfört en viss kontroll av profilen eller företaget. Markeringen är en förtroendesignal men ersätter inte användarens egen kontroll.",
            },
            {
              question: "Hur gör jag anspråk på en befintlig företagssida?",
              answer:
                "Öppna företagssidan och använd alternativet för att göra anspråk på profilen. Du behöver vara inloggad och skicka en begäran som administratören kan granska.",
            },
            {
              question: "Kan ett företag publicera jobb?",
              answer:
                "Ja. Företag kan använda plattformen för att hitta arbetare, publicera uppdrag och samtidigt visa sina tjänster för potentiella kunder.",
            },
            {
              question: "Hur fungerar Premium?",
              answer:
                "Premium kan ge extra synlighet eller andra fördelar beroende på den aktuella planen. Exakta funktioner och priser visas på Premium-sidan innan betalning.",
            },
          ],
        },

        {
          id: "security",
          title: "Säkerhet och betalning",
          description:
            "Ansvar, betalningar, identitetskontroll och rapportering.",
          items: [
            {
              question: "Hanterar Clean Jobs betalningen för städjobbet?",
              answer:
                "Om inget annat uttryckligen anges kommer kunden och utföraren själva överens om betalning och villkor. Clean Jobs ska inte betraktas som betalningsförmedlare för själva städarbetet.",
            },
            {
              question: "Ska jag betala i förskott?",
              answer:
                "Var försiktig med förskottsbetalningar till personer du inte känner. Kom överens om pris, omfattning, betalningsmetod och tidpunkt innan arbetet börjar.",
            },
            {
              question: "Vad ska jag göra vid misstänkt beteende?",
              answer:
                "Avsluta kommunikationen, spara relevant information och kontakta supporten. Dela inte lösenord, BankID-koder eller andra känsliga uppgifter med andra användare.",
            },
            {
              question: "Kommer Clean Jobs att använda BankID?",
              answer:
                "BankID kan i framtiden användas för identitetsverifiering och ökat förtroende. Du ska aldrig lämna ut BankID-koder eller godkänna en begäran som du inte själv har startat.",
            },
          ],
        },
      ],
    },

    safety: {
      eyebrow: "Säkerhet",
      title: "Använd Clean Jobs på ett säkert sätt",
      description:
        "Kontrollera alltid uppgifter och kom överens om tydliga villkor innan ett arbete börjar.",
      items: [
        "Dela aldrig lösenord, BankID-koder eller känsliga personuppgifter.",
        "Var försiktig med förskottsbetalningar till okända personer.",
        "Använd jobbchatten för att hålla viktig kommunikation samlad.",
        "Kontrollera profil, recensioner och kontaktuppgifter.",
        "Kom överens om pris, omfattning och betalningsmetod i förväg.",
        "Kontakta supporten om du upptäcker bedrägeri eller missbruk.",
      ],
    },

    contact: {
      eyebrow: "Support",
      title: "Behöver du fortfarande hjälp?",
      description:
        "Kontakta Clean Jobs support och beskriv problemet så tydligt som möjligt.",
      emailLabel: "E-post till support",
      button: "Kontakta supporten",
    },
  },

  en: {
    metadata: {
      title: "Help and Frequently Asked Questions",
      description:
        "Learn how Clean Jobs works. Find answers about cleaning jobs, applications, chat, reviews, company services and safety.",
    },

    hero: {
      eyebrow: "Clean Jobs Help Center",
      title: "How can we help?",
      description:
        "Find clear instructions on publishing a job, applying for cleaning work, selecting a worker and using Clean Jobs.",
      postJob: "Post a job",
      browseJobs: "Browse jobs",
    },

    audience: {
      eyebrow: "Getting started",
      title: "Choose how you want to use Clean Jobs",
      description:
        "Clean Jobs is built for clients, workers and cleaning companies across Sweden.",

      client: {
        title: "I am looking for a cleaner",
        description:
          "Post a cleaning request, compare applications and select the most suitable worker.",
        steps: [
          "Create an account or sign in.",
          "Post a cleaning job with its date, location and requirements.",
          "Receive and compare worker applications.",
          "Accept one application and use the private chat.",
          "Complete the job and leave a review.",
        ],
        button: "Post a job",
      },

      worker: {
        title: "I am looking for cleaning work",
        description:
          "Browse available jobs, submit applications and build your reputation.",
        steps: [
          "Create an account and complete your profile.",
          "Open the list of available cleaning jobs.",
          "Submit an application with your price and message.",
          "Wait for the client to select a worker.",
          "Complete the work and receive a review.",
        ],
        button: "Find cleaning jobs",
      },

      company: {
        title: "I represent a company",
        description:
          "Present your services, reach clients and publish job opportunities.",
        steps: [
          "Register an account for a company representative.",
          "Create or claim the company profile.",
          "Add services, service areas and contact details.",
          "Publish cleaning requests or job opportunities.",
          "Collect reviews and build trust.",
        ],
        button: "Add company services",
      },
    },

    faq: {
      eyebrow: "Frequently asked questions",
      title: "Answers to common questions",
      description:
        "Open a category and select the question that best matches what you need help with.",

      categories: [
        {
          id: "account",
          title: "Account and profile",
          description:
            "Registration, login, profile information and language.",
          items: [
            {
              question: "How do I create an account?",
              answer:
                "Open the registration page and enter your email address and password. You may also use Google sign-in when available. After registration, complete your name, phone number, city and profile details.",
            },
            {
              question: "Can I use Clean Jobs without an account?",
              answer:
                "You can browse public pages and view some information without signing in. An account is required to post jobs, apply, chat, leave reviews or add company services.",
            },
            {
              question: "How do I change my profile details?",
              answer:
                "Sign in and open your profile or dashboard. You can update your name, phone number, city, profile image and other available information. Your login email may remain locked for security.",
            },
            {
              question: "How do I change the language?",
              answer:
                "Use the language selector in the site header. Clean Jobs supports Swedish, English, Ukrainian, Russian and Polish. Your selection is saved in your browser.",
            },
          ],
        },

        {
          id: "clients",
          title: "For clients",
          description:
            "Publish requests, receive applications and choose a worker.",
          items: [
            {
              question: "How do I post a cleaning job?",
              answer:
                "Sign in and select the option to post a job. Add the title, description, location, date, time, budget and relevant requirements. Review the details before publishing.",
            },
            {
              question: "What happens after I post a job?",
              answer:
                "The job becomes visible to available workers. Interested workers can submit an application with their price and message. You can then compare profiles, reviews and offers.",
            },
            {
              question: "How do I choose a worker?",
              answer:
                "Open your job and review the applications. Compare each applicant's price, message, profile and reviews. Accept the application of the person you want to hire.",
            },
            {
              question: "Can several workers apply for the same job?",
              answer:
                "Yes. Multiple workers can apply while the job is open. The client then selects one applicant.",
            },
            {
              question: "Can I edit or delete a job?",
              answer:
                "The job owner can edit or delete the job when those controls are available. Restrictions may apply after a worker has been accepted or work activity has started.",
            },
          ],
        },

        {
          id: "workers",
          title: "For workers",
          description:
            "Find jobs, send applications and manage the work status.",
          items: [
            {
              question: "How do I find available cleaning jobs?",
              answer:
                "Open the jobs page and use available filters for location, cleaning type and other criteria. Open a job to read its complete description.",
            },
            {
              question: "How do I submit an application?",
              answer:
                "Open an available job and choose the application option. Enter your proposed price and write a short, clear message about your experience and availability.",
            },
            {
              question: "Can I apply several times to the same job?",
              answer:
                "No. A user can normally have only one active application per job. This prevents duplicates and keeps the application list clear.",
            },
            {
              question: "How do I know whether the client selected me?",
              answer:
                "When the client accepts your application, the job status changes and you receive a notification. The private chat then becomes available to you and the client.",
            },
            {
              question: "When should I mark the work as started?",
              answer:
                "Mark the work as started when you have actually begun the assignment. Do not use this status before you and the client have agreed on the details.",
            },
          ],
        },

        {
          id: "chat",
          title: "Chat and notifications",
          description:
            "Private messages, unread messages and system notifications.",
          items: [
            {
              question: "When does the chat become available?",
              answer:
                "The private chat becomes available after the client accepts an application. Before a worker is selected, applicants normally cannot open a private job chat.",
            },
            {
              question: "Who can read the messages?",
              answer:
                "The job chat is intended for the client and the accepted worker. Other applicants should not have access to that private conversation.",
            },
            {
              question: "Why do I see an unread message?",
              answer:
                "A message remains unread until you open the relevant chat. The unread counter updates when the message is marked as read.",
            },
            {
              question: "Which notifications can I receive?",
              answer:
                "Notifications may include new messages, applications, job status changes, accepted applications and received reviews. Available notification types may expand as the platform develops.",
            },
          ],
        },

        {
          id: "completion",
          title: "Completed work and reviews",
          description:
            "Complete jobs and leave feedback after the collaboration.",
          items: [
            {
              question: "How is a job completed?",
              answer:
                "When the work is finished, the authorized participant uses the completion button. The status updates and the job moves to history when the process is complete.",
            },
            {
              question: "Who can leave a review?",
              answer:
                "Users who participated in the completed job can leave a review when the review option is available for their role.",
            },
            {
              question: "Can I edit a review?",
              answer:
                "Available options depend on the current review system. When editing is unavailable, contact support if the review contains a clear error or violates the platform rules.",
            },
            {
              question: "Why are reviews important?",
              answer:
                "Reviews help clients select reliable workers and allow workers and companies to build a trusted reputation.",
            },
          ],
        },

        {
          id: "companies",
          title: "Companies and services",
          description:
            "Company profiles, services, verification and visibility.",
          items: [
            {
              question: "How do I add my cleaning company?",
              answer:
                "Create an account and open the page for adding services or a company. Enter the company name, city, description, contact details, prices, service types and service areas.",
            },
            {
              question: "What does verified mean?",
              answer:
                "A verified badge indicates that Clean Jobs has performed a level of profile or company review. It is a trust signal but does not replace the user's own checks.",
            },
            {
              question: "How do I claim an existing company page?",
              answer:
                "Open the company page and use the claim option. You must be signed in and submit a request that an administrator can review.",
            },
            {
              question: "Can a company publish jobs?",
              answer:
                "Yes. Companies can use the platform to find workers, publish assignments and present their services to potential clients.",
            },
            {
              question: "How does Premium work?",
              answer:
                "Premium may provide additional visibility or other benefits depending on the current plan. Exact features and pricing are displayed on the Premium page before payment.",
            },
          ],
        },

        {
          id: "security",
          title: "Safety and payments",
          description:
            "Responsibility, payment arrangements, identity and reporting.",
          items: [
            {
              question: "Does Clean Jobs process payment for cleaning work?",
              answer:
                "Unless explicitly stated otherwise, the client and worker agree directly on payment and working terms. Clean Jobs should not be treated as the payment processor for the cleaning assignment itself.",
            },
            {
              question: "Should I pay in advance?",
              answer:
                "Be careful with advance payments to people you do not know. Agree on the price, scope, payment method and payment timing before work begins.",
            },
            {
              question: "What should I do about suspicious behaviour?",
              answer:
                "Stop communicating, preserve relevant information and contact support. Never share passwords, BankID codes or other sensitive information with another user.",
            },
            {
              question: "Will Clean Jobs use BankID?",
              answer:
                "BankID may be used for identity verification and additional trust in the future. Never share BankID codes or approve a request that you did not personally initiate.",
            },
          ],
        },
      ],
    },

    safety: {
      eyebrow: "Safety",
      title: "Use Clean Jobs safely",
      description:
        "Always verify important information and agree on clear terms before work begins.",
      items: [
        "Never share passwords, BankID codes or sensitive personal information.",
        "Be careful with advance payments to unknown people.",
        "Use the job chat to keep important communication together.",
        "Review profiles, ratings and contact information.",
        "Agree on price, scope and payment method in advance.",
        "Contact support if you notice fraud, abuse or suspicious behaviour.",
      ],
    },

    contact: {
      eyebrow: "Support",
      title: "Still need help?",
      description:
        "Contact Clean Jobs support and describe the problem as clearly as possible.",
      emailLabel: "Email support",
      button: "Contact support",
    },
  },

  uk: {
    metadata: {
      title: "Допомога та поширені запитання",
      description:
        "Дізнайтеся, як працює Clean Jobs. Відповіді про замовлення, заявки, чат, відгуки, компанії та безпеку.",
    },

    hero: {
      eyebrow: "Центр допомоги Clean Jobs",
      title: "Як ми можемо допомогти?",
      description:
        "Тут ви знайдете інструкції щодо публікації замовлень, пошуку роботи, вибору виконавця та користування Clean Jobs.",
      postJob: "Опублікувати замовлення",
      browseJobs: "Переглянути роботи",
    },

    audience: {
      eyebrow: "Початок роботи",
      title: "Оберіть, як ви хочете використовувати Clean Jobs",
      description:
        "Clean Jobs створено для замовників, виконавців і клінінгових компаній у Швеції.",

      client: {
        title: "Я шукаю виконавця",
        description:
          "Опублікуйте замовлення, порівняйте заявки та оберіть відповідного виконавця.",
        steps: [
          "Створіть акаунт або увійдіть.",
          "Опублікуйте замовлення із датою, місцем та описом.",
          "Отримайте та порівняйте заявки виконавців.",
          "Схваліть одну заявку та відкрийте приватний чат.",
          "Завершіть роботу й залиште відгук.",
        ],
        button: "Опублікувати замовлення",
      },

      worker: {
        title: "Я шукаю роботу",
        description:
          "Переглядайте доступні замовлення, подавайте заявки та формуйте свій рейтинг.",
        steps: [
          "Створіть акаунт і заповніть профіль.",
          "Відкрийте список доступних замовлень.",
          "Подайте заявку зі своєю ціною та повідомленням.",
          "Дочекайтеся вибору замовника.",
          "Виконайте роботу й отримайте відгук.",
        ],
        button: "Знайти роботу",
      },

      company: {
        title: "Я представляю компанію",
        description:
          "Показуйте послуги компанії, знаходьте клієнтів і публікуйте вакансії.",
        steps: [
          "Зареєструйте акаунт представника компанії.",
          "Створіть або підтвердьте сторінку компанії.",
          "Додайте послуги, міста й контактну інформацію.",
          "Публікуйте замовлення або вакансії.",
          "Збирайте відгуки та підвищуйте довіру.",
        ],
        button: "Додати послуги",
      },
    },

    faq: {
      eyebrow: "Поширені запитання",
      title: "Відповіді на основні запитання",
      description:
        "Відкрийте потрібну категорію та знайдіть відповідь на своє запитання.",

      categories: [
        {
          id: "account",
          title: "Акаунт і профіль",
          description:
            "Реєстрація, вхід, інформація профілю та мова.",
          items: [
            {
              question: "Як створити акаунт?",
              answer:
                "Відкрийте сторінку реєстрації та вкажіть електронну адресу й пароль. Також можна використати вхід через Google, якщо він доступний. Після реєстрації заповніть ім’я, номер телефону, місто та інформацію профілю.",
            },
            {
              question: "Чи можна користуватися Clean Jobs без акаунта?",
              answer:
                "Без входу можна переглядати публічні сторінки та частину інформації. Акаунт потрібен для публікації замовлень, подання заявок, чату, відгуків і додавання послуг компанії.",
            },
            {
              question: "Як змінити дані профілю?",
              answer:
                "Увійдіть і відкрийте профіль або особистий кабінет. Там можна змінити ім’я, телефон, місто, фотографію та інші доступні дані. Електронна адреса для входу може бути заблокована для редагування.",
            },
            {
              question: "Як змінити мову?",
              answer:
                "Скористайтеся перемикачем мови у верхній частині сайту. Доступні шведська, англійська, українська, російська та польська мови. Вибір зберігається у браузері.",
            },
          ],
        },

        {
          id: "clients",
          title: "Для замовників",
          description:
            "Публікація замовлень, отримання заявок і вибір виконавця.",
          items: [
            {
              question: "Як опублікувати замовлення?",
              answer:
                "Увійдіть і виберіть створення нового замовлення. Вкажіть назву, опис, місто або адресу, дату, час, бюджет та інші важливі умови. Перевірте інформацію перед публікацією.",
            },
            {
              question: "Що відбувається після публікації?",
              answer:
                "Замовлення стає доступним виконавцям. Зацікавлені користувачі можуть надіслати заявку зі своєю ціною та повідомленням. Ви зможете порівняти профілі, відгуки та пропозиції.",
            },
            {
              question: "Як обрати виконавця?",
              answer:
                "Відкрийте своє замовлення та перегляньте список заявок. Порівняйте ціну, повідомлення, профіль і відгуки кожного кандидата. Потім схваліть заявку обраного виконавця.",
            },
            {
              question: "Чи можуть кілька людей подати заявку?",
              answer:
                "Так. Поки замовлення відкрите, кілька виконавців можуть подати свої пропозиції. Замовник самостійно обирає одного кандидата.",
            },
            {
              question: "Чи можна редагувати або видалити замовлення?",
              answer:
                "Власник замовлення може редагувати або видаляти його, коли відповідні кнопки доступні. Після вибору виконавця або початку роботи можуть діяти обмеження.",
            },
          ],
        },

        {
          id: "workers",
          title: "Для виконавців",
          description:
            "Пошук роботи, заявки та керування статусом роботи.",
          items: [
            {
              question: "Як знайти доступні замовлення?",
              answer:
                "Відкрийте сторінку з роботами та скористайтеся доступними фільтрами за містом, типом прибирання й іншими параметрами. Відкрийте замовлення, щоб прочитати повний опис.",
            },
            {
              question: "Як подати заявку?",
              answer:
                "Відкрийте доступне замовлення та натисніть кнопку подання заявки. Вкажіть свою ціну й напишіть коротке повідомлення про досвід і доступність.",
            },
            {
              question: "Чи можна подати кілька заявок на одне замовлення?",
              answer:
                "Ні. Зазвичай один користувач може мати лише одну активну заявку на конкретне замовлення. Це запобігає дублюванню.",
            },
            {
              question: "Як дізнатися, що замовник обрав мене?",
              answer:
                "Після схвалення заявки зміниться статус замовлення, а ви отримаєте сповіщення. Після цього стане доступним приватний чат із замовником.",
            },
            {
              question: "Коли потрібно натискати «Почати роботу»?",
              answer:
                "Позначайте роботу як розпочату тільки тоді, коли ви фактично почали виконання. Не змінюйте статус до узгодження всіх деталей із замовником.",
            },
          ],
        },

        {
          id: "chat",
          title: "Чат і сповіщення",
          description:
            "Приватні повідомлення, непрочитані повідомлення та системні події.",
          items: [
            {
              question: "Коли відкривається чат?",
              answer:
                "Приватний чат відкривається після того, як замовник схвалить одну із заявок. До вибору виконавця кандидати зазвичай не мають доступу до чату замовлення.",
            },
            {
              question: "Хто може читати повідомлення?",
              answer:
                "Чат замовлення призначений для замовника та схваленого виконавця. Інші кандидати не повинні мати доступу до приватної розмови.",
            },
            {
              question: "Чому я бачу непрочитане повідомлення?",
              answer:
                "Повідомлення залишається непрочитаним, поки ви не відкриєте відповідний чат. Після прочитання лічильник оновлюється.",
            },
            {
              question: "Які сповіщення надсилає сайт?",
              answer:
                "Ви можете отримувати сповіщення про нові повідомлення, заявки, зміну статусу, схвалення заявки та нові відгуки. Список сповіщень може розширюватися.",
            },
          ],
        },

        {
          id: "completion",
          title: "Завершення роботи та відгуки",
          description:
            "Завершення замовлення та оцінювання співпраці.",
          items: [
            {
              question: "Як завершити замовлення?",
              answer:
                "Після завершення прибирання уповноважений учасник натискає кнопку завершення роботи. Статус оновлюється, а замовлення переходить до історії.",
            },
            {
              question: "Хто може залишити відгук?",
              answer:
                "Відгук можуть залишити користувачі, які брали участь у завершеному замовленні, коли форма відгуку доступна для їхньої ролі.",
            },
            {
              question: "Чи можна змінити відгук?",
              answer:
                "Можливості залежать від поточної версії системи відгуків. Якщо редагування недоступне, зверніться до підтримки у випадку очевидної помилки або порушення.",
            },
            {
              question: "Навіщо потрібні відгуки?",
              answer:
                "Відгуки допомагають замовникам обирати надійних виконавців, а працівникам і компаніям — формувати репутацію.",
            },
          ],
        },

        {
          id: "companies",
          title: "Компанії та послуги",
          description:
            "Профілі компаній, послуги, підтвердження та видимість.",
          items: [
            {
              question: "Як додати клінінгову компанію?",
              answer:
                "Створіть акаунт і відкрийте сторінку додавання послуг або компанії. Вкажіть назву, місто, опис, контакти, ціни, типи послуг і територію роботи.",
            },
            {
              question: "Що означає позначка підтвердження?",
              answer:
                "Позначка підтвердження означає, що Clean Jobs провів певну перевірку профілю або компанії. Це додатковий сигнал довіри, але він не замінює власну перевірку користувача.",
            },
            {
              question: "Як підтвердити право на сторінку компанії?",
              answer:
                "Відкрийте сторінку компанії та скористайтеся функцією подання запиту на володіння. Потрібно увійти в акаунт і надіслати заявку адміністратору.",
            },
            {
              question: "Чи може компанія публікувати вакансії?",
              answer:
                "Так. Компанія може використовувати платформу для пошуку працівників, публікації замовлень і реклами своїх послуг.",
            },
            {
              question: "Як працює Premium?",
              answer:
                "Premium може надавати додаткову видимість або інші переваги відповідно до чинного тарифу. Точні функції та ціна показуються перед оплатою.",
            },
          ],
        },

        {
          id: "security",
          title: "Безпека та оплата",
          description:
            "Відповідальність, оплата, ідентифікація та скарги.",
          items: [
            {
              question: "Чи проводить Clean Jobs оплату за прибирання?",
              answer:
                "Якщо окремо не зазначено інше, замовник і виконавець самостійно узгоджують оплату та умови роботи. Clean Jobs не потрібно сприймати як платіжного посередника за саме прибирання.",
            },
            {
              question: "Чи варто платити наперед?",
              answer:
                "Обережно ставтеся до передоплати незнайомим людям. Заздалегідь узгодьте ціну, обсяг роботи, спосіб і момент оплати.",
            },
            {
              question: "Що робити у випадку підозрілої поведінки?",
              answer:
                "Припиніть спілкування, збережіть важливу інформацію та зверніться до підтримки. Не передавайте паролі, коди BankID або інші конфіденційні дані.",
            },
            {
              question: "Чи використовуватиме Clean Jobs BankID?",
              answer:
                "BankID у майбутньому може використовуватися для підтвердження особи та підвищення довіри. Нікому не повідомляйте коди BankID і не підтверджуйте запит, який ви самі не ініціювали.",
            },
          ],
        },
      ],
    },

    safety: {
      eyebrow: "Безпека",
      title: "Користуйтеся Clean Jobs безпечно",
      description:
        "Завжди перевіряйте важливу інформацію та узгоджуйте чіткі умови до початку роботи.",
      items: [
        "Нікому не передавайте паролі, коди BankID або конфіденційні дані.",
        "Обережно ставтеся до передоплати незнайомим користувачам.",
        "Використовуйте чат замовлення для важливого листування.",
        "Перевіряйте профіль, рейтинг, відгуки та контакти.",
        "Заздалегідь узгоджуйте ціну, обсяг роботи й спосіб оплати.",
        "Звертайтеся до підтримки у випадку шахрайства або порушень.",
      ],
    },

    contact: {
      eyebrow: "Підтримка",
      title: "Все ще потрібна допомога?",
      description:
        "Зверніться до підтримки Clean Jobs і якомога точніше опишіть проблему.",
      emailLabel: "Написати підтримці",
      button: "Зв’язатися з підтримкою",
    },
  },

  ru: {
    metadata: {
      title: "Помощь и часто задаваемые вопросы",
      description:
        "Узнайте, как работает Clean Jobs. Ответы о заказах, заявках, чате, отзывах, компаниях и безопасности.",
    },

    hero: {
      eyebrow: "Центр помощи Clean Jobs",
      title: "Как мы можем помочь?",
      description:
        "Здесь находятся инструкции по публикации заказов, поиску работы, выбору исполнителя и использованию Clean Jobs.",
      postJob: "Опубликовать заказ",
      browseJobs: "Посмотреть работы",
    },

    audience: {
      eyebrow: "Начало работы",
      title: "Выберите, как вы хотите использовать Clean Jobs",
      description:
        "Clean Jobs создан для заказчиков, исполнителей и клининговых компаний в Швеции.",

      client: {
        title: "Я ищу исполнителя",
        description:
          "Опубликуйте заказ, сравните заявки и выберите подходящего исполнителя.",
        steps: [
          "Создайте аккаунт или войдите.",
          "Опубликуйте заказ с датой, местом и описанием.",
          "Получите и сравните заявки исполнителей.",
          "Одобрите одну заявку и откройте приватный чат.",
          "Завершите работу и оставьте отзыв.",
        ],
        button: "Опубликовать заказ",
      },

      worker: {
        title: "Я ищу работу",
        description:
          "Просматривайте доступные заказы, подавайте заявки и формируйте рейтинг.",
        steps: [
          "Создайте аккаунт и заполните профиль.",
          "Откройте список доступных заказов.",
          "Подайте заявку со своей ценой и сообщением.",
          "Дождитесь выбора заказчика.",
          "Выполните работу и получите отзыв.",
        ],
        button: "Найти работу",
      },

      company: {
        title: "Я представляю компанию",
        description:
          "Показывайте услуги компании, находите клиентов и публикуйте вакансии.",
        steps: [
          "Зарегистрируйте аккаунт представителя компании.",
          "Создайте или подтвердите страницу компании.",
          "Добавьте услуги, города и контактные данные.",
          "Публикуйте заказы или вакансии.",
          "Собирайте отзывы и повышайте доверие.",
        ],
        button: "Добавить услуги",
      },
    },

    faq: {
      eyebrow: "Часто задаваемые вопросы",
      title: "Ответы на основные вопросы",
      description:
        "Откройте нужную категорию и найдите ответ на свой вопрос.",

      categories: [
        {
          id: "account",
          title: "Аккаунт и профиль",
          description:
            "Регистрация, вход, профиль и выбор языка.",
          items: [
            {
              question: "Как создать аккаунт?",
              answer:
                "Откройте страницу регистрации и укажите электронную почту и пароль. Также можно использовать вход через Google, если он доступен. После регистрации заполните имя, телефон, город и профиль.",
            },
            {
              question: "Можно ли пользоваться Clean Jobs без аккаунта?",
              answer:
                "Без входа можно просматривать публичные страницы и часть информации. Аккаунт необходим для публикации заказов, подачи заявок, чата, отзывов и добавления услуг компании.",
            },
            {
              question: "Как изменить данные профиля?",
              answer:
                "Войдите и откройте профиль или личный кабинет. Там можно изменить имя, телефон, город, фотографию и другие доступные данные. Электронный адрес входа может быть заблокирован для редактирования.",
            },
            {
              question: "Как изменить язык?",
              answer:
                "Используйте переключатель языка в верхней части сайта. Доступны шведский, английский, украинский, русский и польский языки. Выбор сохраняется в браузере.",
            },
          ],
        },

        {
          id: "clients",
          title: "Для заказчиков",
          description:
            "Публикация заказов, получение заявок и выбор исполнителя.",
          items: [
            {
              question: "Как опубликовать заказ?",
              answer:
                "Войдите и выберите создание нового заказа. Укажите название, описание, город или адрес, дату, время, бюджет и другие важные условия. Проверьте информацию перед публикацией.",
            },
            {
              question: "Что происходит после публикации?",
              answer:
                "Заказ становится доступен исполнителям. Заинтересованные пользователи могут отправить заявку со своей ценой и сообщением. Вы сможете сравнить профили, отзывы и предложения.",
            },
            {
              question: "Как выбрать исполнителя?",
              answer:
                "Откройте свой заказ и просмотрите заявки. Сравните цену, сообщение, профиль и отзывы кандидатов. Затем одобрите заявку выбранного исполнителя.",
            },
            {
              question: "Могут ли несколько людей подать заявку?",
              answer:
                "Да. Пока заказ открыт, несколько исполнителей могут отправлять предложения. Заказчик самостоятельно выбирает одного кандидата.",
            },
            {
              question: "Можно ли редактировать или удалить заказ?",
              answer:
                "Владелец заказа может редактировать или удалить его, когда соответствующие действия доступны. После выбора исполнителя или начала работы могут действовать ограничения.",
            },
          ],
        },

        {
          id: "workers",
          title: "Для исполнителей",
          description:
            "Поиск работы, заявки и управление статусом.",
          items: [
            {
              question: "Как найти доступные заказы?",
              answer:
                "Откройте страницу работ и используйте фильтры по городу, типу уборки и другим параметрам. Откройте заказ, чтобы прочитать полное описание.",
            },
            {
              question: "Как подать заявку?",
              answer:
                "Откройте доступный заказ и нажмите кнопку подачи заявки. Укажите свою цену и напишите короткое сообщение об опыте и доступности.",
            },
            {
              question: "Можно ли подать несколько заявок на один заказ?",
              answer:
                "Нет. Обычно пользователь может иметь только одну активную заявку на конкретный заказ. Это предотвращает дублирование.",
            },
            {
              question: "Как узнать, что заказчик выбрал меня?",
              answer:
                "После одобрения заявки изменится статус заказа, и вы получите уведомление. После этого станет доступен приватный чат с заказчиком.",
            },
            {
              question: "Когда нажимать «Начать работу»?",
              answer:
                "Отмечайте работу начатой только тогда, когда фактически приступили к выполнению. Не меняйте статус до согласования деталей с заказчиком.",
            },
          ],
        },

        {
          id: "chat",
          title: "Чат и уведомления",
          description:
            "Приватные сообщения, непрочитанные сообщения и события системы.",
          items: [
            {
              question: "Когда открывается чат?",
              answer:
                "Приватный чат открывается после того, как заказчик одобрит одну заявку. До выбора исполнителя кандидаты обычно не имеют доступа к чату заказа.",
            },
            {
              question: "Кто может читать сообщения?",
              answer:
                "Чат заказа предназначен для заказчика и одобренного исполнителя. Другие кандидаты не должны иметь доступа к приватному разговору.",
            },
            {
              question: "Почему я вижу непрочитанное сообщение?",
              answer:
                "Сообщение остаётся непрочитанным, пока вы не откроете соответствующий чат. После прочтения счётчик обновляется.",
            },
            {
              question: "Какие уведомления отправляет сайт?",
              answer:
                "Уведомления могут приходить о новых сообщениях, заявках, изменении статуса, одобрении заявки и новых отзывах. Список уведомлений может расширяться.",
            },
          ],
        },

        {
          id: "completion",
          title: "Завершение работы и отзывы",
          description:
            "Завершение заказа и оценка сотрудничества.",
          items: [
            {
              question: "Как завершить заказ?",
              answer:
                "После окончания уборки уполномоченный участник нажимает кнопку завершения работы. Статус обновляется, а заказ переходит в историю.",
            },
            {
              question: "Кто может оставить отзыв?",
              answer:
                "Отзыв могут оставить пользователи, участвовавшие в завершённом заказе, когда форма отзыва доступна для их роли.",
            },
            {
              question: "Можно ли изменить отзыв?",
              answer:
                "Возможности зависят от текущей версии системы отзывов. Если редактирование недоступно, обратитесь в поддержку при явной ошибке или нарушении.",
            },
            {
              question: "Почему отзывы важны?",
              answer:
                "Отзывы помогают заказчикам выбирать надёжных исполнителей, а работникам и компаниям — формировать репутацию.",
            },
          ],
        },

        {
          id: "companies",
          title: "Компании и услуги",
          description:
            "Профили компаний, услуги, подтверждение и видимость.",
          items: [
            {
              question: "Как добавить клининговую компанию?",
              answer:
                "Создайте аккаунт и откройте страницу добавления услуг или компании. Укажите название, город, описание, контакты, цены, типы услуг и территорию работы.",
            },
            {
              question: "Что означает отметка подтверждения?",
              answer:
                "Отметка подтверждения означает, что Clean Jobs провёл определённую проверку профиля или компании. Это дополнительный сигнал доверия, но не замена собственной проверки.",
            },
            {
              question: "Как подтвердить право на страницу компании?",
              answer:
                "Откройте страницу компании и используйте функцию подачи запроса на владение. Необходимо войти в аккаунт и отправить запрос администратору.",
            },
            {
              question: "Может ли компания публиковать вакансии?",
              answer:
                "Да. Компания может использовать платформу для поиска работников, публикации заказов и продвижения своих услуг.",
            },
            {
              question: "Как работает Premium?",
              answer:
                "Premium может предоставлять дополнительную видимость или другие преимущества в соответствии с текущим тарифом. Точные функции и цена показываются перед оплатой.",
            },
          ],
        },

        {
          id: "security",
          title: "Безопасность и оплата",
          description:
            "Ответственность, платежи, идентификация и жалобы.",
          items: [
            {
              question: "Проводит ли Clean Jobs оплату за уборку?",
              answer:
                "Если отдельно не указано другое, заказчик и исполнитель самостоятельно согласовывают оплату и условия работы. Clean Jobs не следует считать платёжным посредником за саму уборку.",
            },
            {
              question: "Стоит ли платить заранее?",
              answer:
                "Осторожно относитесь к предоплате незнакомым людям. Заранее согласуйте цену, объём работы, способ и момент оплаты.",
            },
            {
              question: "Что делать при подозрительном поведении?",
              answer:
                "Прекратите общение, сохраните важную информацию и обратитесь в поддержку. Не передавайте пароли, коды BankID или другие конфиденциальные данные.",
            },
            {
              question: "Будет ли Clean Jobs использовать BankID?",
              answer:
                "BankID в будущем может использоваться для подтверждения личности и повышения доверия. Никому не сообщайте коды BankID и не подтверждайте запросы, которые вы не инициировали.",
            },
          ],
        },
      ],
    },

    safety: {
      eyebrow: "Безопасность",
      title: "Используйте Clean Jobs безопасно",
      description:
        "Проверяйте важную информацию и согласовывайте условия до начала работы.",
      items: [
        "Никому не передавайте пароли, коды BankID и конфиденциальные данные.",
        "Осторожно относитесь к предоплате незнакомым пользователям.",
        "Используйте чат заказа для важной переписки.",
        "Проверяйте профиль, рейтинг, отзывы и контакты.",
        "Заранее согласуйте цену, объём работы и способ оплаты.",
        "Обращайтесь в поддержку при мошенничестве или нарушениях.",
      ],
    },

    contact: {
      eyebrow: "Поддержка",
      title: "Всё ещё нужна помощь?",
      description:
        "Обратитесь в поддержку Clean Jobs и подробно опишите проблему.",
      emailLabel: "Написать в поддержку",
      button: "Связаться с поддержкой",
    },
  },

  pl: {
    metadata: {
      title: "Pomoc i często zadawane pytania",
      description:
        "Dowiedz się, jak działa Clean Jobs. Odpowiedzi dotyczące zleceń, zgłoszeń, czatu, opinii, firm i bezpieczeństwa.",
    },

    hero: {
      eyebrow: "Centrum pomocy Clean Jobs",
      title: "Jak możemy pomóc?",
      description:
        "Znajdziesz tutaj instrukcje dotyczące publikowania zleceń, szukania pracy, wyboru wykonawcy i korzystania z Clean Jobs.",
      postJob: "Opublikuj zlecenie",
      browseJobs: "Przeglądaj zlecenia",
    },

    audience: {
      eyebrow: "Pierwsze kroki",
      title: "Wybierz, jak chcesz korzystać z Clean Jobs",
      description:
        "Clean Jobs jest przeznaczony dla klientów, wykonawców i firm sprzątających w Szwecji.",

      client: {
        title: "Szukam wykonawcy",
        description:
          "Opublikuj zlecenie, porównaj zgłoszenia i wybierz odpowiedniego wykonawcę.",
        steps: [
          "Utwórz konto lub zaloguj się.",
          "Opublikuj zlecenie z datą, miejscem i opisem.",
          "Otrzymuj i porównuj zgłoszenia wykonawców.",
          "Zaakceptuj jedno zgłoszenie i otwórz prywatny czat.",
          "Zakończ pracę i dodaj opinię.",
        ],
        button: "Opublikuj zlecenie",
      },

      worker: {
        title: "Szukam pracy",
        description:
          "Przeglądaj dostępne zlecenia, wysyłaj zgłoszenia i buduj reputację.",
        steps: [
          "Utwórz konto i uzupełnij profil.",
          "Otwórz listę dostępnych zleceń.",
          "Wyślij zgłoszenie z ceną i wiadomością.",
          "Poczekaj na wybór klienta.",
          "Wykonaj pracę i otrzymaj opinię.",
        ],
        button: "Znajdź pracę",
      },

      company: {
        title: "Reprezentuję firmę",
        description:
          "Prezentuj usługi firmy, zdobywaj klientów i publikuj oferty pracy.",
        steps: [
          "Zarejestruj konto przedstawiciela firmy.",
          "Utwórz lub przejmij profil firmy.",
          "Dodaj usługi, obszary działania i dane kontaktowe.",
          "Publikuj zlecenia lub oferty pracy.",
          "Zbieraj opinie i buduj zaufanie.",
        ],
        button: "Dodaj usługi",
      },
    },

    faq: {
      eyebrow: "Często zadawane pytania",
      title: "Odpowiedzi na najczęstsze pytania",
      description:
        "Otwórz odpowiednią kategorię i wybierz pytanie odpowiadające Twojemu problemowi.",

      categories: [
        {
          id: "account",
          title: "Konto i profil",
          description:
            "Rejestracja, logowanie, dane profilu i język.",
          items: [
            {
              question: "Jak utworzyć konto?",
              answer:
                "Otwórz stronę rejestracji i podaj adres e-mail oraz hasło. Możesz również użyć logowania Google, jeśli ta opcja jest dostępna. Następnie uzupełnij imię, telefon, miasto i profil.",
            },
            {
              question: "Czy można korzystać z Clean Jobs bez konta?",
              answer:
                "Bez logowania można przeglądać publiczne strony i część informacji. Konto jest wymagane do publikowania zleceń, wysyłania zgłoszeń, czatu, opinii i dodawania usług firmy.",
            },
            {
              question: "Jak zmienić dane profilu?",
              answer:
                "Zaloguj się i otwórz profil lub panel użytkownika. Możesz tam zmienić imię, telefon, miasto, zdjęcie i inne dostępne dane. Adres logowania może pozostać zablokowany.",
            },
            {
              question: "Jak zmienić język?",
              answer:
                "Użyj przełącznika języka w nagłówku strony. Dostępne są języki szwedzki, angielski, ukraiński, rosyjski i polski. Wybór jest zapisywany w przeglądarce.",
            },
          ],
        },

        {
          id: "clients",
          title: "Dla klientów",
          description:
            "Publikowanie zleceń, otrzymywanie zgłoszeń i wybór wykonawcy.",
          items: [
            {
              question: "Jak opublikować zlecenie?",
              answer:
                "Zaloguj się i wybierz opcję utworzenia zlecenia. Podaj tytuł, opis, miasto lub adres, datę, godzinę, budżet i ważne wymagania. Sprawdź dane przed publikacją.",
            },
            {
              question: "Co dzieje się po opublikowaniu zlecenia?",
              answer:
                "Zlecenie jest widoczne dla wykonawców. Zainteresowane osoby mogą wysłać zgłoszenie z ceną i wiadomością. Następnie możesz porównać profile, opinie i oferty.",
            },
            {
              question: "Jak wybrać wykonawcę?",
              answer:
                "Otwórz własne zlecenie i przejrzyj zgłoszenia. Porównaj cenę, wiadomość, profil i opinie każdego kandydata. Następnie zaakceptuj wybrane zgłoszenie.",
            },
            {
              question: "Czy kilka osób może zgłosić się do jednego zlecenia?",
              answer:
                "Tak. Dopóki zlecenie jest otwarte, wielu wykonawców może przesłać swoje oferty. Klient wybiera jednego kandydata.",
            },
            {
              question: "Czy można edytować lub usunąć zlecenie?",
              answer:
                "Właściciel zlecenia może je edytować lub usunąć, kiedy odpowiednie działania są dostępne. Po wyborze wykonawcy lub rozpoczęciu pracy mogą obowiązywać ograniczenia.",
            },
          ],
        },

        {
          id: "workers",
          title: "Dla wykonawców",
          description:
            "Szukanie pracy, wysyłanie zgłoszeń i zarządzanie statusem.",
          items: [
            {
              question: "Jak znaleźć dostępne zlecenia?",
              answer:
                "Otwórz stronę zleceń i użyj filtrów dotyczących miasta, rodzaju sprzątania i innych kryteriów. Otwórz zlecenie, aby przeczytać pełny opis.",
            },
            {
              question: "Jak wysłać zgłoszenie?",
              answer:
                "Otwórz dostępne zlecenie i wybierz opcję zgłoszenia. Podaj proponowaną cenę i napisz krótką wiadomość o doświadczeniu oraz dostępności.",
            },
            {
              question: "Czy można wysłać kilka zgłoszeń do tego samego zlecenia?",
              answer:
                "Nie. Użytkownik może zazwyczaj posiadać tylko jedno aktywne zgłoszenie do konkretnego zlecenia. Zapobiega to duplikatom.",
            },
            {
              question: "Skąd wiem, że klient mnie wybrał?",
              answer:
                "Po zaakceptowaniu zgłoszenia zmieni się status zlecenia i otrzymasz powiadomienie. Wtedy zostanie udostępniony prywatny czat.",
            },
            {
              question: "Kiedy należy oznaczyć rozpoczęcie pracy?",
              answer:
                "Oznacz rozpoczęcie dopiero wtedy, gdy faktycznie zaczynasz wykonywać zlecenie. Najpierw uzgodnij wszystkie szczegóły z klientem.",
            },
          ],
        },

        {
          id: "chat",
          title: "Czat i powiadomienia",
          description:
            "Prywatne wiadomości, nieprzeczytane wiadomości i zdarzenia systemowe.",
          items: [
            {
              question: "Kiedy otwiera się czat?",
              answer:
                "Prywatny czat jest dostępny po zaakceptowaniu jednego zgłoszenia przez klienta. Przed wyborem wykonawcy pozostali kandydaci zwykle nie mają dostępu do czatu.",
            },
            {
              question: "Kto może czytać wiadomości?",
              answer:
                "Czat zlecenia jest przeznaczony dla klienta i zaakceptowanego wykonawcy. Inni kandydaci nie powinni mieć dostępu do prywatnej rozmowy.",
            },
            {
              question: "Dlaczego widzę nieprzeczytaną wiadomość?",
              answer:
                "Wiadomość pozostaje nieprzeczytana do momentu otwarcia odpowiedniego czatu. Po przeczytaniu licznik jest aktualizowany.",
            },
            {
              question: "Jakie powiadomienia mogę otrzymywać?",
              answer:
                "Powiadomienia mogą dotyczyć nowych wiadomości, zgłoszeń, zmian statusu, zaakceptowanych zgłoszeń i nowych opinii. Lista może być rozwijana.",
            },
          ],
        },

        {
          id: "completion",
          title: "Zakończenie pracy i opinie",
          description:
            "Zamykanie zleceń i ocenianie współpracy.",
          items: [
            {
              question: "Jak zakończyć zlecenie?",
              answer:
                "Po ukończeniu sprzątania uprawniony uczestnik używa przycisku zakończenia pracy. Status jest aktualizowany, a zlecenie przechodzi do historii.",
            },
            {
              question: "Kto może dodać opinię?",
              answer:
                "Opinię mogą pozostawić użytkownicy, którzy uczestniczyli w zakończonym zleceniu, gdy formularz opinii jest dostępny dla ich roli.",
            },
            {
              question: "Czy można zmienić opinię?",
              answer:
                "Dostępne opcje zależą od aktualnego systemu opinii. Gdy edycja nie jest dostępna, skontaktuj się z pomocą w przypadku oczywistego błędu lub naruszenia.",
            },
            {
              question: "Dlaczego opinie są ważne?",
              answer:
                "Opinie pomagają klientom wybierać wiarygodnych wykonawców, a pracownikom i firmom budować reputację.",
            },
          ],
        },

        {
          id: "companies",
          title: "Firmy i usługi",
          description:
            "Profile firm, usługi, weryfikacja i widoczność.",
          items: [
            {
              question: "Jak dodać firmę sprzątającą?",
              answer:
                "Utwórz konto i otwórz stronę dodawania usług lub firmy. Podaj nazwę, miasto, opis, dane kontaktowe, ceny, typy usług i obszary działania.",
            },
            {
              question: "Co oznacza status zweryfikowany?",
              answer:
                "Oznaczenie weryfikacji informuje, że Clean Jobs przeprowadził określone sprawdzenie profilu lub firmy. Jest to sygnał zaufania, ale nie zastępuje własnej weryfikacji.",
            },
            {
              question: "Jak przejąć istniejący profil firmy?",
              answer:
                "Otwórz stronę firmy i użyj opcji zgłoszenia prawa do profilu. Musisz być zalogowany i wysłać wniosek do sprawdzenia przez administratora.",
            },
            {
              question: "Czy firma może publikować oferty pracy?",
              answer:
                "Tak. Firma może używać platformy do szukania pracowników, publikowania zleceń i promowania swoich usług.",
            },
            {
              question: "Jak działa Premium?",
              answer:
                "Premium może zapewniać dodatkową widoczność lub inne korzyści zależnie od aktualnego planu. Dokładne funkcje i cena są wyświetlane przed płatnością.",
            },
          ],
        },

        {
          id: "security",
          title: "Bezpieczeństwo i płatności",
          description:
            "Odpowiedzialność, płatności, tożsamość i zgłoszenia.",
          items: [
            {
              question: "Czy Clean Jobs obsługuje płatność za sprzątanie?",
              answer:
                "O ile nie wskazano inaczej, klient i wykonawca samodzielnie uzgadniają płatność i warunki. Clean Jobs nie należy traktować jako pośrednika płatności za samo zlecenie.",
            },
            {
              question: "Czy należy płacić z góry?",
              answer:
                "Zachowaj ostrożność przy płatnościach z góry dla nieznanych osób. Przed rozpoczęciem uzgodnij cenę, zakres, sposób i termin płatności.",
            },
            {
              question: "Co zrobić w przypadku podejrzanego zachowania?",
              answer:
                "Przerwij komunikację, zachowaj ważne informacje i skontaktuj się z pomocą. Nie udostępniaj haseł, kodów BankID ani innych poufnych danych.",
            },
            {
              question: "Czy Clean Jobs będzie używać BankID?",
              answer:
                "BankID może w przyszłości służyć do weryfikacji tożsamości i zwiększenia zaufania. Nie udostępniaj kodów BankID i nie zatwierdzaj żądań, których sam nie rozpocząłeś.",
            },
          ],
        },
      ],
    },

    safety: {
      eyebrow: "Bezpieczeństwo",
      title: "Korzystaj z Clean Jobs bezpiecznie",
      description:
        "Sprawdzaj ważne informacje i ustalaj jasne warunki przed rozpoczęciem pracy.",
      items: [
        "Nie udostępniaj haseł, kodów BankID ani poufnych danych.",
        "Zachowaj ostrożność przy płatnościach z góry.",
        "Używaj czatu zlecenia do ważnej komunikacji.",
        "Sprawdzaj profil, oceny, opinie i dane kontaktowe.",
        "Ustal wcześniej cenę, zakres i sposób płatności.",
        "Skontaktuj się z pomocą w przypadku oszustwa lub naruszenia.",
      ],
    },

    contact: {
      eyebrow: "Pomoc",
      title: "Nadal potrzebujesz pomocy?",
      description:
        "Skontaktuj się z pomocą Clean Jobs i dokładnie opisz problem.",
      emailLabel: "Napisz do pomocy",
      button: "Skontaktuj się z pomocą",
    },
  },
}

export function getFaqCopy(locale: Locale): FaqPageCopy {
  return faqPageCopy[locale] ?? faqPageCopy.en
}

export function getAllFaqItems(locale: Locale): FaqItem[] {
  return getFaqCopy(locale).faq.categories.flatMap(
    (category) => category.items,
  )
}