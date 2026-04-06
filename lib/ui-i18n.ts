import { DEFAULT_LOCALE, type Locale, normalizeLocale } from "@/lib/i18n"

export type UiDictionary = {
  common: {
    save: string
    saving: string
    create: string
    creating: string
    update: string
    updating: string
    send: string
    sending: string
    cancel: string
    back: string
    edit: string
    delete: string
    loading: string
    retry: string
    open: string
    close: string
    search: string
    apply: string
    clear: string
  }
  feedback: {
    saved: string
    created: string
    updated: string
    deleted: string
    sent: string
  }
  errors: {
    unauthorized: string
    forbidden: string
    notFound: string
    generic: string
    required: string
    invalidEmail: string
    invalidPassword: string
    invalidBudget: string
    tooFast: string
    duplicate: string
    messageEmpty: string
    messageTooLong: string
    failedToSendMessage: string
    failedToSaveProfile: string
    failedToCreateJob: string
    failedToUpdateJob: string
  }
  landing: {
    hero_title: string
    hero_description: string
    find_jobs: string
    post_job: string

    trust_fast_title: string
    trust_fast_desc: string
    trust_safe_title: string
    trust_safe_desc: string
    trust_simple_title: string
    trust_simple_desc: string

    how_title: string
    step1_title: string
    step1_desc: string
    step2_title: string
    step2_desc: string
    step3_title: string
    step3_desc: string

    seo_title: string
    seo_description: string

    cta_title: string
    create_account: string
    browse_jobs: string
  }
}

const uiDictionaries: Record<Locale, UiDictionary> = {
  uk: {
    common: {
      save: "Зберегти",
      saving: "Збереження...",
      create: "Створити",
      creating: "Створення...",
      update: "Оновити",
      updating: "Оновлення...",
      send: "Надіслати",
      sending: "Надсилання...",
      cancel: "Скасувати",
      back: "Назад",
      edit: "Редагувати",
      delete: "Видалити",
      loading: "Завантаження...",
      retry: "Спробувати ще раз",
      open: "Відкрити",
      close: "Закрити",
      search: "Пошук",
      apply: "Застосувати",
      clear: "Очистити",
    },
    feedback: {
      saved: "Успішно збережено.",
      created: "Успішно створено.",
      updated: "Успішно оновлено.",
      deleted: "Успішно видалено.",
      sent: "Успішно надіслано.",
    },
    errors: {
      unauthorized: "Потрібно увійти в акаунт.",
      forbidden: "У вас немає доступу до цієї дії.",
      notFound: "Нічого не знайдено.",
      generic: "Щось пішло не так.",
      required: "Заповніть обов’язкові поля.",
      invalidEmail: "Невірний email.",
      invalidPassword: "Невірний пароль.",
      invalidBudget: "Невірний бюджет.",
      tooFast: "Занадто швидко. Спробуйте ще раз трохи пізніше.",
      duplicate: "Схоже, це дубльована дія.",
      messageEmpty: "Повідомлення не може бути порожнім.",
      messageTooLong: "Повідомлення занадто довге.",
      failedToSendMessage: "Не вдалося надіслати повідомлення.",
      failedToSaveProfile: "Не вдалося зберегти профіль.",
      failedToCreateJob: "Не вдалося створити роботу.",
      failedToUpdateJob: "Не вдалося оновити роботу.",
    },
    landing: {
      hero_title: "Знаходьте клінінгову роботу або наймайте прибиральників швидко",
      hero_description:
        "Clean Jobs з’єднує клієнтів і працівників у вашому місті. Опублікуйте замовлення або знайдіть роботу за кілька хвилин.",
      find_jobs: "Знайти роботу",
      post_job: "Створити замовлення",

      trust_fast_title: "Швидкий пошук",
      trust_fast_desc: "Знайдіть працівника або роботу за лічені хвилини.",
      trust_safe_title: "Безпечно та надійно",
      trust_safe_desc: "Рейтинги та відгуки після кожного виконаного замовлення.",
      trust_simple_title: "Простий процес",
      trust_simple_desc: "Створити → призначити → чат → завершити.",

      how_title: "Як це працює",
      step1_title: "1. Створіть замовлення",
      step1_desc: "Опишіть задачу з прибирання та вкажіть бюджет.",
      step2_title: "2. Знайдіть виконавця",
      step2_desc: "Працівник швидко бере ваше замовлення.",
      step3_title: "3. Спілкуйтесь і завершуйте",
      step3_desc: "Обговоріть деталі в чаті та позначте роботу завершеною.",

      seo_title: "Платформа для пошуку роботи та прибиральників",
      seo_description:
        "Clean Jobs — це сучасна платформа, де клієнти можуть наймати прибиральників, а працівники — знаходити клінінгову роботу. Для прибирання квартир, офісів або глибокого прибирання — усе в одному місці.",
      cta_title: "Готові почати?",
      create_account: "Створити акаунт",
      browse_jobs: "Переглянути замовлення",
    },
  },

  ru: {
    common: {
      save: "Сохранить",
      saving: "Сохранение...",
      create: "Создать",
      creating: "Создание...",
      update: "Обновить",
      updating: "Обновление...",
      send: "Отправить",
      sending: "Отправка...",
      cancel: "Отмена",
      back: "Назад",
      edit: "Редактировать",
      delete: "Удалить",
      loading: "Загрузка...",
      retry: "Попробовать снова",
      open: "Открыть",
      close: "Закрыть",
      search: "Поиск",
      apply: "Применить",
      clear: "Очистить",
    },
    feedback: {
      saved: "Успешно сохранено.",
      created: "Успешно создано.",
      updated: "Успешно обновлено.",
      deleted: "Успешно удалено.",
      sent: "Успешно отправлено.",
    },
    errors: {
      unauthorized: "Нужно войти в аккаунт.",
      forbidden: "У вас нет доступа к этому действию.",
      notFound: "Ничего не найдено.",
      generic: "Что-то пошло не так.",
      required: "Заполните обязательные поля.",
      invalidEmail: "Неверный email.",
      invalidPassword: "Неверный пароль.",
      invalidBudget: "Неверный бюджет.",
      tooFast: "Слишком быстро. Попробуйте чуть позже.",
      duplicate: "Похоже, это повторное действие.",
      messageEmpty: "Сообщение не может быть пустым.",
      messageTooLong: "Сообщение слишком длинное.",
      failedToSendMessage: "Не удалось отправить сообщение.",
      failedToSaveProfile: "Не удалось сохранить профиль.",
      failedToCreateJob: "Не удалось создать работу.",
      failedToUpdateJob: "Не удалось обновить работу.",
    },
    landing: {
      hero_title: "Находите клининговую работу или нанимайте уборщиков быстро",
      hero_description:
        "Clean Jobs соединяет клиентов и работников в вашем городе. Разместите заказ или найдите работу за несколько минут.",
      find_jobs: "Найти работу",
      post_job: "Разместить заказ",

      trust_fast_title: "Быстрый поиск",
      trust_fast_desc: "Найдите работника или работу за считанные минуты.",
      trust_safe_title: "Безопасно и надежно",
      trust_safe_desc: "Рейтинги и отзывы после каждого выполненного заказа.",
      trust_simple_title: "Простой процесс",
      trust_simple_desc: "Создать → назначить → чат → завершить.",

      how_title: "Как это работает",
      step1_title: "1. Разместите заказ",
      step1_desc: "Опишите задачу по уборке и укажите бюджет.",
      step2_title: "2. Найдите исполнителя",
      step2_desc: "Работник быстро берет ваш заказ.",
      step3_title: "3. Общайтесь и завершайте",
      step3_desc: "Обсудите детали в чате и отметьте работу завершенной.",

      seo_title: "Платформа для поиска работы и уборщиков",
      seo_description:
        "Clean Jobs — современная платформа, где клиенты могут нанимать уборщиков, а работники — находить клининговую работу. Для уборки дома, офиса или глубокой уборки — всё в одном месте.",
      cta_title: "Готовы начать?",
      create_account: "Создать аккаунт",
      browse_jobs: "Смотреть заказы",
    },
  },

  en: {
    common: {
      save: "Save",
      saving: "Saving...",
      create: "Create",
      creating: "Creating...",
      update: "Update",
      updating: "Updating...",
      send: "Send",
      sending: "Sending...",
      cancel: "Cancel",
      back: "Back",
      edit: "Edit",
      delete: "Delete",
      loading: "Loading...",
      retry: "Try again",
      open: "Open",
      close: "Close",
      search: "Search",
      apply: "Apply",
      clear: "Clear",
    },
    feedback: {
      saved: "Saved successfully.",
      created: "Created successfully.",
      updated: "Updated successfully.",
      deleted: "Deleted successfully.",
      sent: "Sent successfully.",
    },
    errors: {
      unauthorized: "You need to log in first.",
      forbidden: "You do not have access to this action.",
      notFound: "Nothing was found.",
      generic: "Something went wrong.",
      required: "Please fill in the required fields.",
      invalidEmail: "Invalid email.",
      invalidPassword: "Invalid password.",
      invalidBudget: "Invalid budget.",
      tooFast: "Too fast. Please try again shortly.",
      duplicate: "This looks like a duplicate action.",
      messageEmpty: "Message cannot be empty.",
      messageTooLong: "Message is too long.",
      failedToSendMessage: "Failed to send message.",
      failedToSaveProfile: "Failed to save profile.",
      failedToCreateJob: "Failed to create job.",
      failedToUpdateJob: "Failed to update job.",
    },
    landing: {
      hero_title: "Find cleaning jobs or hire cleaners fast",
      hero_description:
        "Clean Jobs connects clients and cleaners in your city. Post a job or find work in minutes.",
      find_jobs: "Find jobs",
      post_job: "Post a job",

      trust_fast_title: "Fast hiring",
      trust_fast_desc: "Find a cleaner or job within minutes.",
      trust_safe_title: "Safe & trusted",
      trust_safe_desc: "Ratings and reviews after every job.",
      trust_simple_title: "Simple process",
      trust_simple_desc: "Post → assign → chat → complete.",

      how_title: "How it works",
      step1_title: "1. Post a job",
      step1_desc: "Describe your cleaning task and budget.",
      step2_title: "2. Get a worker",
      step2_desc: "A cleaner takes your job instantly.",
      step3_title: "3. Chat & complete",
      step3_desc: "Communicate and mark job as done.",

      seo_title: "Cleaning jobs marketplace",
      seo_description:
        "Clean Jobs is a modern platform where clients can hire cleaners and workers can find cleaning jobs. Whether you need home cleaning, office cleaning, or deep cleaning services, the platform helps you connect quickly and safely.",
      cta_title: "Ready to start?",
      create_account: "Create account",
      browse_jobs: "Browse jobs",
    },
  },

  sv: {
    common: {
      save: "Spara",
      saving: "Sparar...",
      create: "Skapa",
      creating: "Skapar...",
      update: "Uppdatera",
      updating: "Uppdaterar...",
      send: "Skicka",
      sending: "Skickar...",
      cancel: "Avbryt",
      back: "Tillbaka",
      edit: "Redigera",
      delete: "Ta bort",
      loading: "Laddar...",
      retry: "Försök igen",
      open: "Öppna",
      close: "Stäng",
      search: "Sök",
      apply: "Använd",
      clear: "Rensa",
    },
    feedback: {
      saved: "Sparat.",
      created: "Skapat.",
      updated: "Uppdaterat.",
      deleted: "Borttaget.",
      sent: "Skickat.",
    },
    errors: {
      unauthorized: "Du måste logga in först.",
      forbidden: "Du har inte tillgång till den här åtgärden.",
      notFound: "Ingenting hittades.",
      generic: "Något gick fel.",
      required: "Fyll i obligatoriska fält.",
      invalidEmail: "Ogiltig e-postadress.",
      invalidPassword: "Ogiltigt lösenord.",
      invalidBudget: "Ogiltig budget.",
      tooFast: "För snabbt. Försök igen om en stund.",
      duplicate: "Det här verkar vara en dubblett.",
      messageEmpty: "Meddelandet kan inte vara tomt.",
      messageTooLong: "Meddelandet är för långt.",
      failedToSendMessage: "Det gick inte att skicka meddelandet.",
      failedToSaveProfile: "Det gick inte att spara profilen.",
      failedToCreateJob: "Det gick inte att skapa jobbet.",
      failedToUpdateJob: "Det gick inte att uppdatera jobbet.",
    },
    landing: {
      hero_title: "Hitta städjobb eller anlita städare snabbt",
      hero_description:
        "Clean Jobs kopplar ihop kunder och städare i din stad. Lägg upp ett jobb eller hitta arbete på några minuter.",
      find_jobs: "Hitta jobb",
      post_job: "Lägg upp jobb",

      trust_fast_title: "Snabb matchning",
      trust_fast_desc: "Hitta en städare eller ett jobb inom några minuter.",
      trust_safe_title: "Tryggt och pålitligt",
      trust_safe_desc: "Betyg och recensioner efter varje slutfört jobb.",
      trust_simple_title: "Enkel process",
      trust_simple_desc: "Skapa → tilldela → chatta → slutför.",

      how_title: "Så fungerar det",
      step1_title: "1. Lägg upp ett jobb",
      step1_desc: "Beskriv städuppgiften och ange budget.",
      step2_title: "2. Hitta en arbetare",
      step2_desc: "En städare kan ta jobbet direkt.",
      step3_title: "3. Chatta och slutför",
      step3_desc: "Kommunicera i chatten och markera jobbet som klart.",

      seo_title: "Marknadsplats för städjobb",
      seo_description:
        "Clean Jobs är en modern plattform där kunder kan anlita städare och arbetare kan hitta städjobb. Oavsett om det gäller hemstädning, kontorsstädning eller storstädning hjälper plattformen dig att komma igång snabbt och tryggt.",
      cta_title: "Redo att börja?",
      create_account: "Skapa konto",
      browse_jobs: "Visa jobb",
    },
  },

  pl: {
    common: {
      save: "Zapisz",
      saving: "Zapisywanie...",
      create: "Utwórz",
      creating: "Tworzenie...",
      update: "Aktualizuj",
      updating: "Aktualizowanie...",
      send: "Wyślij",
      sending: "Wysyłanie...",
      cancel: "Anuluj",
      back: "Wróć",
      edit: "Edytuj",
      delete: "Usuń",
      loading: "Ładowanie...",
      retry: "Spróbuj ponownie",
      open: "Otwórz",
      close: "Zamknij",
      search: "Szukaj",
      apply: "Zastosuj",
      clear: "Wyczyść",
    },
    feedback: {
      saved: "Zapisano.",
      created: "Utworzono.",
      updated: "Zaktualizowano.",
      deleted: "Usunięto.",
      sent: "Wysłano.",
    },
    errors: {
      unauthorized: "Musisz się zalogować.",
      forbidden: "Nie masz dostępu do tej akcji.",
      notFound: "Nic nie znaleziono.",
      generic: "Coś poszło nie tak.",
      required: "Wypełnij wymagane pola.",
      invalidEmail: "Nieprawidłowy email.",
      invalidPassword: "Nieprawidłowe hasło.",
      invalidBudget: "Nieprawidłowy budżet.",
      tooFast: "Za szybko. Spróbuj ponownie za chwilę.",
      duplicate: "To wygląda na zduplikowaną akcję.",
      messageEmpty: "Wiadomość nie może być pusta.",
      messageTooLong: "Wiadomość jest za długa.",
      failedToSendMessage: "Nie udało się wysłać wiadomości.",
      failedToSaveProfile: "Nie udało się zapisać profilu.",
      failedToCreateJob: "Nie udało się utworzyć oferty.",
      failedToUpdateJob: "Nie udało się zaktualizować oferty.",
    },
    landing: {
      hero_title: "Znajdź pracę przy sprzątaniu lub zatrudnij sprzątacza szybko",
      hero_description:
        "Clean Jobs łączy klientów i pracowników w Twoim mieście. Dodaj zlecenie lub znajdź pracę w kilka minut.",
      find_jobs: "Znajdź pracę",
      post_job: "Dodaj zlecenie",

      trust_fast_title: "Szybkie dopasowanie",
      trust_fast_desc: "Znajdź pracownika lub pracę w kilka minut.",
      trust_safe_title: "Bezpiecznie i pewnie",
      trust_safe_desc: "Oceny i opinie po każdym zakończonym zleceniu.",
      trust_simple_title: "Prosty proces",
      trust_simple_desc: "Dodaj → przypisz → czat → zakończ.",

      how_title: "Jak to działa",
      step1_title: "1. Dodaj zlecenie",
      step1_desc: "Opisz zadanie sprzątania i podaj budżet.",
      step2_title: "2. Znajdź wykonawcę",
      step2_desc: "Pracownik może szybko przyjąć Twoje zlecenie.",
      step3_title: "3. Rozmawiaj i zakończ",
      step3_desc: "Ustal szczegóły na czacie i oznacz pracę jako zakończoną.",

      seo_title: "Platforma ogłoszeń dla sprzątania",
      seo_description:
        "Clean Jobs to nowoczesna platforma, na której klienci mogą zatrudniać sprzątaczy, a pracownicy znajdować pracę przy sprzątaniu. Niezależnie od tego, czy chodzi o sprzątanie domu, biura czy gruntowne sprzątanie, platforma pomaga połączyć się szybko i bezpiecznie.",
      cta_title: "Gotowy, aby zacząć?",
      create_account: "Utwórz konto",
      browse_jobs: "Przeglądaj zlecenia",
    },
  },
}

export function getUiDictionary(locale?: string | Locale) {
  const resolvedLocale = normalizeLocale(locale || DEFAULT_LOCALE)
  return uiDictionaries[resolvedLocale] || uiDictionaries[DEFAULT_LOCALE]
}