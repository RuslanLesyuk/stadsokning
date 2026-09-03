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
  metadata: { title: string; description: string }
  hero: { eyebrow: string; title: string; description: string; postJob: string; browseJobs: string }
  audience: {
    eyebrow: string
    title: string
    description: string
    client: { title: string; description: string; steps: string[]; button: string }
    worker: { title: string; description: string; steps: string[]; button: string }
    company: { title: string; description: string; steps: string[]; button: string }
  }
  faq: { eyebrow: string; title: string; description: string; categories: FaqCategory[] }
  safety: { eyebrow: string; title: string; description: string; items: string[] }
  contact: { eyebrow: string; title: string; description: string; emailLabel: string; button: string }
}

export const faqPageCopy: Record<Locale, FaqPageCopy> = {
  "sv": {
    "metadata": {
      "title": "Hjälp och vanliga frågor",
      "description": "Aktuell hjälp för Clean Jobs om städjobb, ansökningar, chatt, omdömen, företagsprofiler, leads, kunder och bokningar."
    },
    "hero": {
      "eyebrow": "Clean Jobs hjälpcenter",
      "title": "Vad vill du ha hjälp med?",
      "description": "Välj den väg som passar dig. Innehållet nedan följer hur Clean Jobs fungerar i den aktuella versionen.",
      "postJob": "Jag behöver städning",
      "browseJobs": "Jag söker städjobb"
    },
    "audience": {
      "eyebrow": "Kom igång",
      "title": "Tre sätt att använda Clean Jobs",
      "description": "Börja med det mål som passar dig: hitta städhjälp, hitta städjobb eller hantera ett städföretag.",
      "client": {
        "title": "Jag behöver städning",
        "description": "Skapa ett jobb, jämför ansökningar och välj den utförare du vill anlita.",
        "steps": [
          "Skapa ett konto eller logga in.",
          "Skapa jobbet i den guidade fyrastegsprocessen.",
          "Jämför ansökningar och välj utförare.",
          "Använd chatten och följ jobbet tills det är klart."
        ],
        "button": "Skapa städjobb"
      },
      "worker": {
        "title": "Jag söker städjobb",
        "description": "Se lediga jobb, skicka en ansökan och hantera ett tilldelat jobb.",
        "steps": [
          "Öppna Lediga städjobb.",
          "Ansök med fast pris eller timpris.",
          "Vänta tills kunden väljer utförare.",
          "Om du får jobbet: använd chatten, starta och avsluta jobbet."
        ],
        "button": "Visa lediga jobb"
      },
      "company": {
        "title": "Jag driver städföretag",
        "description": "Hitta företagets profil och använd Företagsytan för det löpande arbetet.",
        "steps": [
          "Hitta företaget i katalogen.",
          "Gör anspråk på profilen om den ännu saknar ägare.",
          "Använd Översikt, Leads, Kunder och Bokningar.",
          "Webbplats, Tjänster och Premium finns under Fler verktyg."
        ],
        "button": "Hitta mitt företag"
      }
    },
    "faq": {
      "eyebrow": "Vanliga frågor",
      "title": "Svar för den aktuella Clean Jobs-versionen",
      "description": "Välj kategori. Instruktionerna är anpassade till de förenklade arbetsflödena.",
      "categories": [
        {
          "id": "account",
          "title": "Konto och Mina ärenden",
          "description": "Inloggning, profil och din personliga arbetsyta.",
          "items": [
            {
              "question": "Behöver jag ett konto för att använda Clean Jobs?",
              "answer": "Du kan bläddra bland offentliga jobb, tjänster och företag utan konto. För att skapa jobb, skicka ansökningar, använda chatt och hantera personliga eller företagsrelaterade funktioner behöver du logga in."
            },
            {
              "question": "Kan jag logga in med Google?",
              "answer": "Ja. Clean Jobs stödjer Google-inloggning samt vanlig inloggning med e-post och lösenord."
            },
            {
              "question": "Var ser jag vad jag behöver göra härnäst?",
              "answer": "Öppna Mina ärenden. Där prioriteras nya ansökningar, olästa meddelanden och aktiva jobb så att du snabbt ser nästa viktiga steg."
            },
            {
              "question": "Vilka språk finns på Clean Jobs?",
              "answer": "Gränssnittet stödjer svenska, engelska, ukrainska, ryska och polska. Företagsuppgifter och användarskapade texter kan vara skrivna på det språk som användaren själv valt."
            }
          ]
        },
        {
          "id": "customer",
          "title": "Jag behöver städning",
          "description": "Skapa jobb, välj utförare, chatta och avsluta jobbet.",
          "items": [
            {
              "question": "Hur skapar jag ett städjobb?",
              "answer": "Välj Jag behöver städning eller öppna Skapa jobb. Formuläret har fyra steg: jobbtyp och titel, plats och objekt, datum/tid och budget samt en egen beskrivning. Därefter publicerar du jobbet."
            },
            {
              "question": "Vad händer efter att jobbet publicerats?",
              "answer": "Jobbet blir tillgängligt för arbetssökande. När ansökningar kommer in visas de på jobbet och Mina ärenden uppmärksammar dig på att kandidater väntar."
            },
            {
              "question": "Hur väljer jag en utförare?",
              "answer": "Öppna jobbet och sektionen Välj utförare. Jämför ansökningarna och välj kandidaten du vill arbeta med genom Välj som utförare."
            },
            {
              "question": "När kan jag använda chatten och lämna omdöme?",
              "answer": "Chatten öppnas efter att en utförare har valts. När jobbet har markerats som klart kan deltagarna lämna omdöme. Efter avslutat eller avbrutet jobb är chatten inte avsedd för nya arbetsmeddelanden."
            },
            {
              "question": "Kan jag hitta ett städföretag i stället för att lägga upp ett jobb?",
              "answer": "Ja. Företagskatalogen låter dig söka och jämföra publicerade städföretag. På företagets profil kan det finnas kontaktuppgifter, offertförfrågan eller onlinebokning beroende på vad företaget har aktiverat."
            }
          ]
        },
        {
          "id": "worker",
          "title": "Jag söker städjobb",
          "description": "Lediga jobb, ansökningar och arbetsstatus.",
          "items": [
            {
              "question": "Var hittar jag lediga städjobb?",
              "answer": "Öppna Lediga städjobb. Huvudlistan visar aktiva jobb och du kan använda filtren för att begränsa resultaten."
            },
            {
              "question": "Hur ansöker jag till ett jobb?",
              "answer": "Öppna jobbet och skicka en ansökan. Du väljer antingen Fast pris eller Timpris. Ytterligare detaljer och ett meddelande kan läggas till när det behövs."
            },
            {
              "question": "Kan jag ange både fast pris och timpris i samma ansökan?",
              "answer": "Nej. Det aktuella ansökningsflödet är gjort för en prismodell per ansökan: fast pris eller timpris."
            },
            {
              "question": "Hur vet jag om jag har fått jobbet?",
              "answer": "När kunden väljer dig visas Du har fått jobbet. Då kan du öppna chatten, starta jobbet när arbetet börjar och markera det som klart när allt är färdigt."
            }
          ]
        },
        {
          "id": "company",
          "title": "Städföretag",
          "description": "Företagsprofil, anspråk, leads, kunder och bokningar.",
          "items": [
            {
              "question": "Mitt företag finns redan på Clean Jobs. Vad gör jag?",
              "answer": "Öppna företagsprofilen i katalogen. Om profilen inte redan har en ägare kan du göra anspråk på företaget och skicka in informationen som behövs för granskning."
            },
            {
              "question": "Vad finns i Företagsytan?",
              "answer": "Huvudmenyn består av Översikt, Leads, Kunder och Bokningar. Översikten visar Nästa steg och prioriterar bland annat nya leads, väntande bokningar och kunduppföljningar."
            },
            {
              "question": "Var hittar jag företagets webbplats, tjänster och Premium?",
              "answer": "De ligger under Fler verktyg i Företagsytan. De finns kvar men ligger utanför den primära dagliga navigeringen."
            },
            {
              "question": "Vad används Leads och Kunder till?",
              "answer": "Leads är kundförfrågningar som företaget kan följa upp och ändra status på. Kunder fungerar som ett enkelt CRM med livscykelsteg, taggar och uppföljningar."
            },
            {
              "question": "Hur fungerar bokningar och företagssida?",
              "answer": "Företag kan använda bokningsinställningar och ta emot bokningsförfrågningar via Clean Jobs. Webbplatsverktyget kan också skapa och publicera en separat företagssida. Vissa webbplatsfunktioner kan vara kopplade till Premium."
            }
          ]
        },
        {
          "id": "trust",
          "title": "Omdömen, priser och säkerhet",
          "description": "Vad plattformen visar och vad du själv bör kontrollera.",
          "items": [
            {
              "question": "Bestämmer Clean Jobs priset på ett jobb?",
              "answer": "Nej. Jobbets budget och ansökningarnas prisförslag kommer från användarna. Företag kan dessutom visa egna prisuppgifter när de har lagt in dem."
            },
            {
              "question": "Betyder Verifierat företag att Clean Jobs garanterar arbetet?",
              "answer": "Nej. Markeringen visar en verifieringsstatus i Clean Jobs men ersätter inte din egen kontroll av omfattning, pris, villkor och andra praktiska detaljer."
            },
            {
              "question": "Vad bör jag kontrollera innan arbetet börjar?",
              "answer": "Kontrollera vad som ska göras, datum, adress, pris eller prismodell och andra viktiga villkor. Använd gärna chatten efter att utföraren har valts så att båda parter har samma information."
            },
            {
              "question": "Hur rapporterar jag ett problem?",
              "answer": "Använd rapportfunktionen där den finns eller kontakta Clean Jobs support via kontaktsidan. Vid akuta eller juridiska problem ska du kontakta rätt myndighet eller räddningstjänst."
            }
          ]
        }
      ]
    },
    "safety": {
      "eyebrow": "Bra att veta",
      "title": "Håll arbetsflödet tydligt",
      "description": "Clean Jobs hjälper parterna att hitta varandra och hålla ordning på processen. Kontrollera alltid de praktiska villkoren för det verkliga arbetet.",
      "items": [
        "Beskriv tydligt vad som ska städas och var jobbet ska utföras.",
        "Bekräfta pris eller prismodell innan arbetet börjar.",
        "Använd chatten efter att en utförare har valts för viktiga arbetsdetaljer.",
        "Kontrollera företags- och kontaktuppgifter som är viktiga för ditt beslut.",
        "Lämna omdöme först efter att jobbet faktiskt är avslutat."
      ]
    },
    "contact": {
      "eyebrow": "Behöver du mer hjälp?",
      "title": "Kontakta Clean Jobs",
      "description": "Om svaret inte finns här kan du kontakta support. Beskriv gärna vilken sida eller vilket jobb problemet gäller.",
      "emailLabel": "E-post",
      "button": "Öppna kontaktsidan"
    }
  },
  "en": {
    "metadata": {
      "title": "Help and frequently asked questions",
      "description": "Current Clean Jobs help about cleaning jobs, applications, chat, reviews, company profiles, leads, customers and bookings."
    },
    "hero": {
      "eyebrow": "Clean Jobs help center",
      "title": "What do you need help with?",
      "description": "Choose the path that fits you. The guidance below reflects the current Clean Jobs workflows.",
      "postJob": "I need cleaning",
      "browseJobs": "I am looking for cleaning work"
    },
    "audience": {
      "eyebrow": "Get started",
      "title": "Three ways to use Clean Jobs",
      "description": "Start with your goal: find cleaning help, find cleaning work, or manage a cleaning company.",
      "client": {
        "title": "I need cleaning",
        "description": "Post a job, compare applications and choose the worker you want to hire.",
        "steps": [
          "Create an account or log in.",
          "Create the job in the guided four-step flow.",
          "Compare applications and choose a worker.",
          "Use chat and follow the job until it is complete."
        ],
        "button": "Post a cleaning job"
      },
      "worker": {
        "title": "I am looking for cleaning work",
        "description": "Browse open jobs, apply and manage an assigned job.",
        "steps": [
          "Open Cleaning jobs.",
          "Apply with a fixed price or hourly rate.",
          "Wait for the customer to choose a worker.",
          "If selected, use chat, start the job and complete it."
        ],
        "button": "Browse open jobs"
      },
      "company": {
        "title": "I run a cleaning company",
        "description": "Find your company profile and use the Company workspace for daily operations.",
        "steps": [
          "Find the company in the directory.",
          "Claim the profile if it does not yet have an owner.",
          "Use Overview, Leads, Customers and Bookings.",
          "Website, Services and Premium are under More tools."
        ],
        "button": "Find my company"
      }
    },
    "faq": {
      "eyebrow": "Frequently asked questions",
      "title": "Answers for the current Clean Jobs version",
      "description": "Choose a category. The instructions match the simplified product workflows.",
      "categories": [
        {
          "id": "account",
          "title": "Account and My activity",
          "description": "Login, profile and your personal workspace.",
          "items": [
            {
              "question": "Do I need an account to use Clean Jobs?",
              "answer": "You can browse public jobs, services and companies without an account. You need to log in to post jobs, apply, use chat, and access personal or company management features."
            },
            {
              "question": "Can I sign in with Google?",
              "answer": "Yes. Clean Jobs supports Google sign-in as well as email and password."
            },
            {
              "question": "Where do I see what I should do next?",
              "answer": "Open My activity. It prioritizes new applications, unread messages and active jobs so the next important step is easy to see."
            },
            {
              "question": "Which languages does Clean Jobs support?",
              "answer": "The interface supports Swedish, English, Ukrainian, Russian and Polish. Company information and user-created text may still be written in the language chosen by the author."
            }
          ]
        },
        {
          "id": "customer",
          "title": "I need cleaning",
          "description": "Post a job, choose a worker, chat and complete the job.",
          "items": [
            {
              "question": "How do I post a cleaning job?",
              "answer": "Choose I need cleaning or open Post job. The form has four steps: job type and title, location and property, date/time and budget, and your own description. Then publish the job."
            },
            {
              "question": "What happens after I publish the job?",
              "answer": "The job becomes available to people looking for work. Applications appear on the job, and My activity highlights that candidates are waiting."
            },
            {
              "question": "How do I choose a worker?",
              "answer": "Open the job and the Choose worker section. Compare applications and select the candidate you want to work with."
            },
            {
              "question": "When can I use chat and leave a review?",
              "answer": "Chat opens after a worker has been selected. After the job is marked complete, participants can leave a review. Completed or cancelled jobs are not intended for new work messages."
            },
            {
              "question": "Can I find a cleaning company instead of posting a job?",
              "answer": "Yes. The company directory lets you search and compare published cleaning companies. A company profile may offer contact details, quote requests or online booking depending on what the company has enabled."
            }
          ]
        },
        {
          "id": "worker",
          "title": "I am looking for cleaning work",
          "description": "Open jobs, applications and job status.",
          "items": [
            {
              "question": "Where do I find open cleaning jobs?",
              "answer": "Open Cleaning jobs. The main list shows active jobs and filters can narrow the results."
            },
            {
              "question": "How do I apply for a job?",
              "answer": "Open the job and send an application. Choose either Fixed price or Hourly rate. Add extra details and a message when needed."
            },
            {
              "question": "Can I enter both a fixed price and an hourly rate in one application?",
              "answer": "No. The current application flow uses one pricing model per application: fixed price or hourly rate."
            },
            {
              "question": "How do I know if I got the job?",
              "answer": "When the customer selects you, the view shows You got the job. You can then open chat, start the job when work begins and mark it complete when finished."
            }
          ]
        },
        {
          "id": "company",
          "title": "Cleaning companies",
          "description": "Company profile, claims, leads, customers and bookings.",
          "items": [
            {
              "question": "My company is already listed on Clean Jobs. What should I do?",
              "answer": "Open the company profile in the directory. If the profile does not already have an owner, use the company claim flow and submit the information requested for review."
            },
            {
              "question": "What is in the Company workspace?",
              "answer": "The primary navigation is Overview, Leads, Customers and Bookings. Overview contains Next steps and prioritizes items such as new leads, pending bookings and customer follow-ups."
            },
            {
              "question": "Where are Website, Services and Premium?",
              "answer": "They are under More tools in the Company workspace. They remain available but are outside the primary day-to-day navigation."
            },
            {
              "question": "What are Leads and Customers used for?",
              "answer": "Leads are customer enquiries that the company can follow up and move through statuses. Customers works as a simple CRM with lifecycle stages, tags and follow-ups."
            },
            {
              "question": "How do bookings and company websites work?",
              "answer": "Companies can use booking settings and receive booking requests through Clean Jobs. The website tool can also create and publish a separate company page. Some website features may require Premium."
            }
          ]
        },
        {
          "id": "trust",
          "title": "Reviews, pricing and safety",
          "description": "What the platform shows and what you should verify yourself.",
          "items": [
            {
              "question": "Does Clean Jobs set the price of a job?",
              "answer": "No. Job budgets and application prices come from users. Companies may also show their own pricing when they have added it."
            },
            {
              "question": "Does a Verified company badge guarantee the work?",
              "answer": "No. The badge represents a verification status inside Clean Jobs, but it does not replace your own checks of scope, price, terms and other practical details."
            },
            {
              "question": "What should I confirm before work starts?",
              "answer": "Confirm the scope, date, address, price or pricing model and other important terms. Use chat after a worker is selected so both parties have the same information."
            },
            {
              "question": "How do I report a problem?",
              "answer": "Use the report option where available or contact Clean Jobs support through the contact page. For emergencies or legal matters, contact the appropriate authority or emergency service."
            }
          ]
        }
      ]
    },
    "safety": {
      "eyebrow": "Good to know",
      "title": "Keep the workflow clear",
      "description": "Clean Jobs helps parties find each other and organize the process. Always verify the practical terms of the real-world work.",
      "items": [
        "Describe clearly what needs cleaning and where the job takes place.",
        "Confirm the price or pricing model before work starts.",
        "Use chat after a worker is selected for important work details.",
        "Check company and contact information that matters to your decision.",
        "Leave a review only after the job is actually complete."
      ]
    },
    "contact": {
      "eyebrow": "Need more help?",
      "title": "Contact Clean Jobs",
      "description": "If the answer is not here, contact support. Include the page or job involved when possible.",
      "emailLabel": "Email",
      "button": "Open contact page"
    }
  },
  "uk": {
    "metadata": {
      "title": "Допомога та поширені запитання",
      "description": "Актуальна допомога Clean Jobs щодо замовлень, заявок, чату, відгуків, профілів компаній, лідів, клієнтів і бронювань."
    },
    "hero": {
      "eyebrow": "Центр допомоги Clean Jobs",
      "title": "З чим вам допомогти?",
      "description": "Оберіть свій сценарій. Інструкції нижче відповідають актуальним процесам Clean Jobs.",
      "postJob": "Мені потрібне прибирання",
      "browseJobs": "Я шукаю роботу"
    },
    "audience": {
      "eyebrow": "Початок роботи",
      "title": "Три способи користуватися Clean Jobs",
      "description": "Оберіть свою мету: знайти прибирання, знайти роботу або керувати клінінговою компанією.",
      "client": {
        "title": "Мені потрібне прибирання",
        "description": "Створіть замовлення, порівняйте заявки та оберіть виконавця.",
        "steps": [
          "Створіть акаунт або увійдіть.",
          "Створіть замовлення у формі з чотирьох кроків.",
          "Порівняйте заявки та оберіть виконавця.",
          "Використовуйте чат і доведіть роботу до завершення."
        ],
        "button": "Створити замовлення"
      },
      "worker": {
        "title": "Я шукаю роботу з прибирання",
        "description": "Переглядайте доступні роботи, подавайте заявки та керуйте отриманою роботою.",
        "steps": [
          "Відкрийте Доступні роботи.",
          "Подайте заявку з фіксованою або погодинною ціною.",
          "Дочекайтеся вибору замовника.",
          "Якщо вас обрали, використовуйте чат, почніть і завершіть роботу."
        ],
        "button": "Переглянути роботи"
      },
      "company": {
        "title": "Я керую клінінговою компанією",
        "description": "Знайдіть профіль компанії та використовуйте Простір компанії для щоденної роботи.",
        "steps": [
          "Знайдіть компанію в каталозі.",
          "Подайте заявку на керування, якщо профіль ще не має власника.",
          "Використовуйте Огляд, Ліди, Клієнти та Бронювання.",
          "Сайт, Послуги та Premium знаходяться у Додаткових інструментах."
        ],
        "button": "Знайти мою компанію"
      }
    },
    "faq": {
      "eyebrow": "Поширені запитання",
      "title": "Відповіді для актуального Clean Jobs",
      "description": "Оберіть категорію. Інструкції відповідають спрощеним робочим процесам.",
      "categories": [
        {
          "id": "account",
          "title": "Акаунт і Мої справи",
          "description": "Вхід, профіль і персональний простір.",
          "items": [
            {
              "question": "Чи потрібен акаунт для Clean Jobs?",
              "answer": "Публічні роботи, послуги та компанії можна переглядати без акаунта. Для створення замовлень, подання заявок, чату та персональних або корпоративних функцій потрібно увійти."
            },
            {
              "question": "Чи можна увійти через Google?",
              "answer": "Так. Clean Jobs підтримує вхід через Google, а також через email і пароль."
            },
            {
              "question": "Де побачити, що мені потрібно зробити далі?",
              "answer": "Відкрийте Мої справи. Там пріоритетно показуються нові заявки, непрочитані повідомлення та активні роботи."
            },
            {
              "question": "Які мови підтримує Clean Jobs?",
              "answer": "Інтерфейс підтримує шведську, англійську, українську, російську та польську. Дані компаній і тексти користувачів можуть бути написані мовою автора."
            }
          ]
        },
        {
          "id": "customer",
          "title": "Мені потрібне прибирання",
          "description": "Створення замовлення, вибір виконавця, чат і завершення.",
          "items": [
            {
              "question": "Як створити замовлення на прибирання?",
              "answer": "Оберіть Мені потрібне прибирання або відкрийте Створити замовлення. Форма має чотири кроки: тип і назва, місце та об’єкт, дата/час і бюджет, а потім власний опис."
            },
            {
              "question": "Що відбувається після публікації?",
              "answer": "Замовлення стає доступним виконавцям. Заявки з’являються на сторінці замовлення, а Мої справи підказують, що є кандидати."
            },
            {
              "question": "Як обрати виконавця?",
              "answer": "Відкрийте замовлення та розділ вибору виконавця. Порівняйте заявки й оберіть кандидата, з яким хочете працювати."
            },
            {
              "question": "Коли доступний чат і відгук?",
              "answer": "Чат відкривається після вибору виконавця. Після позначення роботи завершеною учасники можуть залишити відгук."
            },
            {
              "question": "Чи можна знайти компанію замість створення замовлення?",
              "answer": "Так. У каталозі можна шукати й порівнювати опубліковані клінінгові компанії. На профілі можуть бути контакти, запит ціни або онлайн-бронювання, якщо компанія це активувала."
            }
          ]
        },
        {
          "id": "worker",
          "title": "Я шукаю роботу",
          "description": "Доступні роботи, заявки та статус роботи.",
          "items": [
            {
              "question": "Де шукати доступні роботи?",
              "answer": "Відкрийте Доступні роботи. Основний список показує активні замовлення, а фільтри допомагають звузити результати."
            },
            {
              "question": "Як подати заявку?",
              "answer": "Відкрийте замовлення та надішліть заявку. Оберіть Фіксована ціна або Погодинна ставка. Додаткові деталі й повідомлення можна додати за потреби."
            },
            {
              "question": "Чи можна вказати одночасно фіксовану і погодинну ціну?",
              "answer": "Ні. Поточний процес передбачає одну модель ціни на одну заявку: фіксовану або погодинну."
            },
            {
              "question": "Як зрозуміти, що я отримав роботу?",
              "answer": "Коли замовник обере вас, з’явиться стан Ви отримали роботу. Після цього можна відкрити чат, почати роботу і позначити її завершеною після виконання."
            }
          ]
        },
        {
          "id": "company",
          "title": "Клінінгові компанії",
          "description": "Профіль компанії, заявки на керування, ліди, клієнти та бронювання.",
          "items": [
            {
              "question": "Моя компанія вже є на Clean Jobs. Що робити?",
              "answer": "Відкрийте профіль компанії в каталозі. Якщо він ще не має власника, подайте заявку на керування і надайте інформацію, потрібну для перевірки."
            },
            {
              "question": "Що є у Просторі компанії?",
              "answer": "Основне меню: Огляд, Ліди, Клієнти та Бронювання. На Огляді є Наступні кроки, які пріоритезують нові ліди, очікуючі бронювання та клієнтські follow-up."
            },
            {
              "question": "Де сайт, послуги та Premium?",
              "answer": "Вони знаходяться в розділі Додаткові інструменти. Функції залишилися доступними, але не займають місце в головній щоденній навігації."
            },
            {
              "question": "Для чого Ліди та Клієнти?",
              "answer": "Ліди — це звернення потенційних клієнтів, яким компанія може змінювати статус. Клієнти — простий CRM з етапами, тегами та follow-up."
            },
            {
              "question": "Як працюють бронювання і сайт компанії?",
              "answer": "Компанії можуть налаштовувати бронювання та отримувати запити через Clean Jobs. Інструмент сайту може створити й опублікувати окрему сторінку компанії. Частина можливостей може вимагати Premium."
            }
          ]
        },
        {
          "id": "trust",
          "title": "Відгуки, ціни та безпека",
          "description": "Що показує платформа і що варто перевіряти самостійно.",
          "items": [
            {
              "question": "Clean Jobs встановлює ціну роботи?",
              "answer": "Ні. Бюджет замовлення та цінові пропозиції в заявках задають користувачі. Компанії також можуть показувати власні ціни, якщо вони їх додали."
            },
            {
              "question": "Позначка Перевірена компанія гарантує якість роботи?",
              "answer": "Ні. Вона показує статус перевірки в Clean Jobs, але не замінює вашу власну перевірку умов, ціни, обсягу роботи та інших важливих деталей."
            },
            {
              "question": "Що узгодити перед початком роботи?",
              "answer": "Узгодьте обсяг, дату, адресу, ціну або модель ціни та інші важливі умови. Після вибору виконавця використовуйте чат."
            },
            {
              "question": "Як повідомити про проблему?",
              "answer": "Скористайтеся функцією скарги там, де вона доступна, або зверніться до підтримки через сторінку контактів. Для екстрених чи юридичних питань звертайтеся до відповідних служб або органів."
            }
          ]
        }
      ]
    },
    "safety": {
      "eyebrow": "Важливо знати",
      "title": "Тримайте процес зрозумілим",
      "description": "Clean Jobs допомагає сторонам знайти одна одну та організувати процес. Практичні умови реальної роботи завжди перевіряйте окремо.",
      "items": [
        "Чітко опишіть, що і де потрібно прибрати.",
        "Узгодьте ціну або модель ціни до початку роботи.",
        "Після вибору виконавця використовуйте чат для важливих деталей.",
        "Перевіряйте важливі дані компанії та контакти.",
        "Залишайте відгук лише після фактичного завершення роботи."
      ]
    },
    "contact": {
      "eyebrow": "Потрібна додаткова допомога?",
      "title": "Зв’язатися з Clean Jobs",
      "description": "Якщо відповіді тут немає, напишіть у підтримку. За можливості вкажіть сторінку або замовлення, якого стосується питання.",
      "emailLabel": "Email",
      "button": "Відкрити контакти"
    }
  },
  "ru": {
    "metadata": {
      "title": "Помощь и частые вопросы",
      "description": "Актуальная помощь Clean Jobs по заказам, заявкам, чату, отзывам, профилям компаний, лидам, клиентам и бронированиям."
    },
    "hero": {
      "eyebrow": "Центр помощи Clean Jobs",
      "title": "С чем вам помочь?",
      "description": "Выберите свой сценарий. Инструкции ниже соответствуют актуальным процессам Clean Jobs.",
      "postJob": "Мне нужна уборка",
      "browseJobs": "Я ищу работу"
    },
    "audience": {
      "eyebrow": "Начало работы",
      "title": "Три способа использовать Clean Jobs",
      "description": "Выберите свою цель: найти уборку, найти работу или управлять клининговой компанией.",
      "client": {
        "title": "Мне нужна уборка",
        "description": "Создайте заказ, сравните заявки и выберите исполнителя.",
        "steps": [
          "Создайте аккаунт или войдите.",
          "Создайте заказ в форме из четырех шагов.",
          "Сравните заявки и выберите исполнителя.",
          "Используйте чат и доведите работу до завершения."
        ],
        "button": "Создать заказ"
      },
      "worker": {
        "title": "Я ищу работу по уборке",
        "description": "Просматривайте доступные работы, подавайте заявки и ведите полученную работу.",
        "steps": [
          "Откройте доступные работы.",
          "Подайте заявку с фиксированной или почасовой ценой.",
          "Дождитесь выбора заказчика.",
          "Если вас выбрали, используйте чат, начните и завершите работу."
        ],
        "button": "Посмотреть работы"
      },
      "company": {
        "title": "Я управляю клининговой компанией",
        "description": "Найдите профиль компании и используйте Пространство компании для ежедневной работы.",
        "steps": [
          "Найдите компанию в каталоге.",
          "Подайте заявку на управление, если у профиля еще нет владельца.",
          "Используйте Обзор, Лиды, Клиенты и Бронирования.",
          "Сайт, Услуги и Premium находятся в Дополнительных инструментах."
        ],
        "button": "Найти мою компанию"
      }
    },
    "faq": {
      "eyebrow": "Частые вопросы",
      "title": "Ответы для актуального Clean Jobs",
      "description": "Выберите категорию. Инструкции соответствуют упрощенным рабочим процессам.",
      "categories": [
        {
          "id": "account",
          "title": "Аккаунт и Мои дела",
          "description": "Вход, профиль и личное пространство.",
          "items": [
            {
              "question": "Нужен ли аккаунт для Clean Jobs?",
              "answer": "Публичные работы, услуги и компании можно просматривать без аккаунта. Для создания заказов, подачи заявок, чата и личных или корпоративных функций нужно войти."
            },
            {
              "question": "Можно ли войти через Google?",
              "answer": "Да. Clean Jobs поддерживает вход через Google, а также через email и пароль."
            },
            {
              "question": "Где посмотреть, что мне нужно сделать дальше?",
              "answer": "Откройте Мои дела. Там в приоритете показываются новые заявки, непрочитанные сообщения и активные работы."
            },
            {
              "question": "Какие языки поддерживает Clean Jobs?",
              "answer": "Интерфейс поддерживает шведский, английский, украинский, русский и польский. Данные компаний и пользовательские тексты могут быть написаны на языке автора."
            }
          ]
        },
        {
          "id": "customer",
          "title": "Мне нужна уборка",
          "description": "Создание заказа, выбор исполнителя, чат и завершение.",
          "items": [
            {
              "question": "Как создать заказ на уборку?",
              "answer": "Выберите Мне нужна уборка или откройте Создать заказ. Форма состоит из четырех шагов: тип и название, место и объект, дата/время и бюджет, затем собственное описание."
            },
            {
              "question": "Что происходит после публикации?",
              "answer": "Заказ становится доступен исполнителям. Заявки появляются на странице заказа, а Мои дела подсказывают, что есть кандидаты."
            },
            {
              "question": "Как выбрать исполнителя?",
              "answer": "Откройте заказ и раздел выбора исполнителя. Сравните заявки и выберите кандидата, с которым хотите работать."
            },
            {
              "question": "Когда доступен чат и отзыв?",
              "answer": "Чат открывается после выбора исполнителя. После отметки работы завершенной участники могут оставить отзыв."
            },
            {
              "question": "Можно ли найти компанию вместо создания заказа?",
              "answer": "Да. В каталоге можно искать и сравнивать опубликованные клининговые компании. На профиле могут быть контакты, запрос цены или онлайн-бронирование, если компания это активировала."
            }
          ]
        },
        {
          "id": "worker",
          "title": "Я ищу работу",
          "description": "Доступные работы, заявки и статус работы.",
          "items": [
            {
              "question": "Где искать доступные работы?",
              "answer": "Откройте Доступные работы. Основной список показывает активные заказы, а фильтры помогают сузить результаты."
            },
            {
              "question": "Как подать заявку?",
              "answer": "Откройте заказ и отправьте заявку. Выберите Фиксированная цена или Почасовая ставка. Дополнительные детали и сообщение можно добавить при необходимости."
            },
            {
              "question": "Можно ли указать одновременно фиксированную и почасовую цену?",
              "answer": "Нет. Текущий процесс предполагает одну модель цены на одну заявку: фиксированную или почасовую."
            },
            {
              "question": "Как понять, что я получил работу?",
              "answer": "Когда заказчик выберет вас, появится состояние Вы получили работу. После этого можно открыть чат, начать работу и отметить ее завершенной после выполнения."
            }
          ]
        },
        {
          "id": "company",
          "title": "Клининговые компании",
          "description": "Профиль компании, заявки на управление, лиды, клиенты и бронирования.",
          "items": [
            {
              "question": "Моя компания уже есть на Clean Jobs. Что делать?",
              "answer": "Откройте профиль компании в каталоге. Если у него еще нет владельца, подайте заявку на управление и предоставьте информацию, необходимую для проверки."
            },
            {
              "question": "Что есть в Пространстве компании?",
              "answer": "Основное меню: Обзор, Лиды, Клиенты и Бронирования. На Обзоре есть Следующие шаги, которые выделяют новые лиды, ожидающие бронирования и клиентские follow-up."
            },
            {
              "question": "Где сайт, услуги и Premium?",
              "answer": "Они находятся в разделе Дополнительные инструменты. Функции остаются доступными, но не занимают место в основной ежедневной навигации."
            },
            {
              "question": "Для чего Лиды и Клиенты?",
              "answer": "Лиды — это обращения потенциальных клиентов, которым компания может менять статус. Клиенты — простой CRM с этапами, тегами и follow-up."
            },
            {
              "question": "Как работают бронирования и сайт компании?",
              "answer": "Компании могут настраивать бронирование и получать запросы через Clean Jobs. Инструмент сайта может создать и опубликовать отдельную страницу компании. Часть возможностей может требовать Premium."
            }
          ]
        },
        {
          "id": "trust",
          "title": "Отзывы, цены и безопасность",
          "description": "Что показывает платформа и что стоит проверять самостоятельно.",
          "items": [
            {
              "question": "Clean Jobs устанавливает цену работы?",
              "answer": "Нет. Бюджет заказа и цены в заявках задают пользователи. Компании также могут показывать собственные цены, если они их добавили."
            },
            {
              "question": "Метка Проверенная компания гарантирует качество работы?",
              "answer": "Нет. Она показывает статус проверки в Clean Jobs, но не заменяет вашу собственную проверку условий, цены, объема работы и других важных деталей."
            },
            {
              "question": "Что согласовать перед началом работы?",
              "answer": "Согласуйте объем, дату, адрес, цену или модель цены и другие важные условия. После выбора исполнителя используйте чат."
            },
            {
              "question": "Как сообщить о проблеме?",
              "answer": "Используйте функцию жалобы там, где она доступна, или обратитесь в поддержку через страницу контактов. Для экстренных или юридических вопросов обращайтесь в соответствующие службы или органы."
            }
          ]
        }
      ]
    },
    "safety": {
      "eyebrow": "Важно знать",
      "title": "Держите процесс понятным",
      "description": "Clean Jobs помогает сторонам найти друг друга и организовать процесс. Практические условия реальной работы всегда проверяйте отдельно.",
      "items": [
        "Четко опишите, что и где нужно убрать.",
        "Согласуйте цену или модель цены до начала работы.",
        "После выбора исполнителя используйте чат для важных деталей.",
        "Проверяйте важные данные компании и контакты.",
        "Оставляйте отзыв только после фактического завершения работы."
      ]
    },
    "contact": {
      "eyebrow": "Нужна дополнительная помощь?",
      "title": "Связаться с Clean Jobs",
      "description": "Если ответа здесь нет, напишите в поддержку. По возможности укажите страницу или заказ, которого касается вопрос.",
      "emailLabel": "Email",
      "button": "Открыть контакты"
    }
  },
  "pl": {
    "metadata": {
      "title": "Pomoc i najczęstsze pytania",
      "description": "Aktualna pomoc Clean Jobs dotycząca zleceń, zgłoszeń, czatu, opinii, profili firm, leadów, klientów i rezerwacji."
    },
    "hero": {
      "eyebrow": "Centrum pomocy Clean Jobs",
      "title": "W czym możemy pomóc?",
      "description": "Wybierz swój sposób korzystania z serwisu. Instrukcje poniżej odpowiadają aktualnym procesom Clean Jobs.",
      "postJob": "Potrzebuję sprzątania",
      "browseJobs": "Szukam pracy"
    },
    "audience": {
      "eyebrow": "Zacznij tutaj",
      "title": "Trzy sposoby korzystania z Clean Jobs",
      "description": "Wybierz swój cel: znaleźć pomoc w sprzątaniu, znaleźć pracę albo zarządzać firmą sprzątającą.",
      "client": {
        "title": "Potrzebuję sprzątania",
        "description": "Dodaj zlecenie, porównaj zgłoszenia i wybierz wykonawcę.",
        "steps": [
          "Utwórz konto lub zaloguj się.",
          "Dodaj zlecenie w czteroetapowym formularzu.",
          "Porównaj zgłoszenia i wybierz wykonawcę.",
          "Korzystaj z czatu i prowadź zlecenie do zakończenia."
        ],
        "button": "Dodaj zlecenie"
      },
      "worker": {
        "title": "Szukam pracy przy sprzątaniu",
        "description": "Przeglądaj dostępne prace, wysyłaj zgłoszenia i prowadź otrzymaną pracę.",
        "steps": [
          "Otwórz dostępne zlecenia.",
          "Wyślij zgłoszenie z ceną stałą lub stawką godzinową.",
          "Poczekaj na wybór klienta.",
          "Po wyborze używaj czatu, rozpocznij i zakończ pracę."
        ],
        "button": "Pokaż zlecenia"
      },
      "company": {
        "title": "Prowadzę firmę sprzątającą",
        "description": "Znajdź profil firmy i używaj Przestrzeni firmy do codziennej pracy.",
        "steps": [
          "Znajdź firmę w katalogu.",
          "Zgłoś prawo do zarządzania, jeśli profil nie ma jeszcze właściciela.",
          "Używaj Przeglądu, Leadów, Klientów i Rezerwacji.",
          "Strona WWW, Usługi i Premium są w sekcji Więcej narzędzi."
        ],
        "button": "Znajdź moją firmę"
      }
    },
    "faq": {
      "eyebrow": "Najczęstsze pytania",
      "title": "Odpowiedzi dla aktualnego Clean Jobs",
      "description": "Wybierz kategorię. Instrukcje odpowiadają uproszczonym procesom.",
      "categories": [
        {
          "id": "account",
          "title": "Konto i Moje sprawy",
          "description": "Logowanie, profil i osobista przestrzeń.",
          "items": [
            {
              "question": "Czy potrzebuję konta, aby korzystać z Clean Jobs?",
              "answer": "Publiczne zlecenia, usługi i firmy można przeglądać bez konta. Logowanie jest potrzebne do dodawania zleceń, wysyłania zgłoszeń, czatu oraz funkcji osobistych i firmowych."
            },
            {
              "question": "Czy mogę logować się przez Google?",
              "answer": "Tak. Clean Jobs obsługuje logowanie przez Google oraz przez e-mail i hasło."
            },
            {
              "question": "Gdzie zobaczę, co mam zrobić dalej?",
              "answer": "Otwórz Moje sprawy. W pierwszej kolejności zobaczysz nowe zgłoszenia, nieprzeczytane wiadomości i aktywne prace."
            },
            {
              "question": "Jakie języki obsługuje Clean Jobs?",
              "answer": "Interfejs obsługuje szwedzki, angielski, ukraiński, rosyjski i polski. Dane firm i treści użytkowników mogą być napisane w języku autora."
            }
          ]
        },
        {
          "id": "customer",
          "title": "Potrzebuję sprzątania",
          "description": "Dodawanie zlecenia, wybór wykonawcy, czat i zakończenie.",
          "items": [
            {
              "question": "Jak dodać zlecenie sprzątania?",
              "answer": "Wybierz Potrzebuję sprzątania lub otwórz Dodaj zlecenie. Formularz ma cztery kroki: rodzaj i tytuł, lokalizacja i obiekt, data/czas i budżet oraz własny opis."
            },
            {
              "question": "Co dzieje się po publikacji?",
              "answer": "Zlecenie staje się dostępne dla wykonawców. Zgłoszenia pojawiają się na stronie zlecenia, a Moje sprawy pokazują, że czekają kandydaci."
            },
            {
              "question": "Jak wybrać wykonawcę?",
              "answer": "Otwórz zlecenie i sekcję wyboru wykonawcy. Porównaj zgłoszenia i wybierz osobę, z którą chcesz pracować."
            },
            {
              "question": "Kiedy dostępny jest czat i opinia?",
              "answer": "Czat otwiera się po wybraniu wykonawcy. Po oznaczeniu zlecenia jako zakończonego uczestnicy mogą dodać opinię."
            },
            {
              "question": "Czy mogę znaleźć firmę zamiast dodawać zlecenie?",
              "answer": "Tak. Katalog firm pozwala wyszukiwać i porównywać opublikowane firmy sprzątające. Profil firmy może zawierać kontakt, prośbę o wycenę lub rezerwację online, jeśli firma je włączyła."
            }
          ]
        },
        {
          "id": "worker",
          "title": "Szukam pracy",
          "description": "Dostępne zlecenia, zgłoszenia i status pracy.",
          "items": [
            {
              "question": "Gdzie znajdę dostępne zlecenia?",
              "answer": "Otwórz Dostępne zlecenia. Główna lista pokazuje aktywne prace, a filtry pozwalają zawęzić wyniki."
            },
            {
              "question": "Jak wysłać zgłoszenie?",
              "answer": "Otwórz zlecenie i wyślij zgłoszenie. Wybierz Cena stała albo Stawka godzinowa. Dodatkowe informacje i wiadomość możesz dodać w razie potrzeby."
            },
            {
              "question": "Czy mogę podać jednocześnie cenę stałą i godzinową?",
              "answer": "Nie. Obecny formularz pozwala wybrać jeden model ceny na jedno zgłoszenie: stały albo godzinowy."
            },
            {
              "question": "Skąd wiem, że dostałem pracę?",
              "answer": "Gdy klient Cię wybierze, pojawi się stan Otrzymałeś pracę. Wtedy możesz otworzyć czat, rozpocząć pracę i oznaczyć ją jako zakończoną po wykonaniu."
            }
          ]
        },
        {
          "id": "company",
          "title": "Firmy sprzątające",
          "description": "Profil firmy, zgłoszenie własności, leady, klienci i rezerwacje.",
          "items": [
            {
              "question": "Moja firma jest już w Clean Jobs. Co zrobić?",
              "answer": "Otwórz profil firmy w katalogu. Jeśli profil nie ma jeszcze właściciela, zgłoś prawo do zarządzania i prześlij informacje potrzebne do weryfikacji."
            },
            {
              "question": "Co znajduje się w Przestrzeni firmy?",
              "answer": "Główna nawigacja to Przegląd, Leady, Klienci i Rezerwacje. Przegląd pokazuje Następne kroki z nowymi leadami, oczekującymi rezerwacjami i follow-up klientów."
            },
            {
              "question": "Gdzie są Strona WWW, Usługi i Premium?",
              "answer": "Są pod Więcej narzędzi w Przestrzeni firmy. Nadal są dostępne, ale nie zajmują miejsca w głównej codziennej nawigacji."
            },
            {
              "question": "Do czego służą Leady i Klienci?",
              "answer": "Leady to zapytania potencjalnych klientów, którym firma może zmieniać status. Klienci to prosty CRM z etapami, tagami i follow-up."
            },
            {
              "question": "Jak działają rezerwacje i strona firmy?",
              "answer": "Firmy mogą konfigurować rezerwacje i przyjmować prośby przez Clean Jobs. Narzędzie strony może utworzyć i opublikować osobną stronę firmy. Niektóre funkcje mogą wymagać Premium."
            }
          ]
        },
        {
          "id": "trust",
          "title": "Opinie, ceny i bezpieczeństwo",
          "description": "Co pokazuje platforma i co warto sprawdzić samodzielnie.",
          "items": [
            {
              "question": "Czy Clean Jobs ustala cenę zlecenia?",
              "answer": "Nie. Budżet zlecenia i ceny w zgłoszeniach ustalają użytkownicy. Firmy mogą też pokazywać własne ceny, jeśli je dodały."
            },
            {
              "question": "Czy oznaczenie Zweryfikowana firma gwarantuje jakość pracy?",
              "answer": "Nie. Oznaczenie pokazuje status weryfikacji w Clean Jobs, ale nie zastępuje własnego sprawdzenia zakresu, ceny, warunków i innych ważnych szczegółów."
            },
            {
              "question": "Co ustalić przed rozpoczęciem pracy?",
              "answer": "Ustal zakres, datę, adres, cenę lub model ceny i inne ważne warunki. Po wyborze wykonawcy używaj czatu."
            },
            {
              "question": "Jak zgłosić problem?",
              "answer": "Użyj funkcji zgłoszenia tam, gdzie jest dostępna, lub skontaktuj się z pomocą Clean Jobs przez stronę kontaktową. W sytuacjach nagłych lub prawnych skontaktuj się z odpowiednią służbą lub urzędem."
            }
          ]
        }
      ]
    },
    "safety": {
      "eyebrow": "Warto wiedzieć",
      "title": "Utrzymuj jasny przebieg pracy",
      "description": "Clean Jobs pomaga stronom znaleźć się i uporządkować proces. Praktyczne warunki rzeczywistej pracy zawsze sprawdzaj osobno.",
      "items": [
        "Jasno opisz, co i gdzie ma zostać posprzątane.",
        "Ustal cenę lub model ceny przed rozpoczęciem pracy.",
        "Po wyborze wykonawcy używaj czatu do ważnych szczegółów.",
        "Sprawdź ważne dane firmy i kontakt.",
        "Dodawaj opinię dopiero po faktycznym zakończeniu pracy."
      ]
    },
    "contact": {
      "eyebrow": "Potrzebujesz więcej pomocy?",
      "title": "Skontaktuj się z Clean Jobs",
      "description": "Jeśli nie ma tu odpowiedzi, napisz do pomocy. Jeśli to możliwe, podaj stronę lub zlecenie, którego dotyczy problem.",
      "emailLabel": "E-mail",
      "button": "Otwórz stronę kontaktową"
    }
  }
}

export function getFaqCopy(locale: Locale) {
  return faqPageCopy[locale] || faqPageCopy.sv
}

export function getAllFaqItems(locale: Locale) {
  return getFaqCopy(locale).faq.categories.flatMap((category) => category.items)
}
