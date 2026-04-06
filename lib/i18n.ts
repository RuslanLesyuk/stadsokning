export const SUPPORTED_LOCALES = ["uk", "ru", "en", "sv", "pl"] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALE_COOKIE_NAME = "clean_jobs_locale"

export type Dictionary = {
  header: {
    jobs: string
    dashboard: string
    createJob: string
    signOut: string
    logIn: string
    signUp: string
    reviews_one: string
    reviews_other: string
  }
  language: {
    label: string
  }
  locales: Record<Locale, string>
  landing: {
    badge: string
    title: string
    subtitle: string
    browseJobs: string
    createJob: string
    card1Title: string
    card1Text: string
    card2Title: string
    card2Text: string
    card3Title: string
    card3Text: string
    sectionTitle: string
    sectionText: string
  }
  auth: {
    loginTitle: string
    loginSubtitle: string
    signupTitle: string
    signupSubtitle: string
    emailLabel: string
    passwordLabel: string
    fullNameLabel: string
    submitLogin: string
    submitSignup: string
    noAccount: string
    haveAccount: string
    goToSignup: string
    goToLogin: string
    backHome: string
  }
  jobs: {
    pageTitle: string
    pageSubtitle: string
    filtersTitle: string
    searchLabel: string
    cityLabel: string
    statusLabel: string
    budgetLabel: string
    clearFilters: string
    noResults: string
    details: string
    createdAt: string
    budget: string
    city: string
    status: string
    author: string
    worker: string
    notAssigned: string
    notSpecified: string
    unknown: string
    backToJobs: string
    description: string
    overview: string
    jobChat: string
    createdBy: string
    assignedTo: string
    timeline: string
    reviews: string
    loginToView: string
    openChat: string
    untitledJob: string
    emptyDescription: string
    address: string
    jobType: string
    propertyType: string
    scheduledDate: string
    scheduledTime: string
    status_new: string
    status_assigned: string
    status_in_progress: string
    status_done: string
    status_cancelled: string
  }
  dashboard: {
    title: string
    welcomeBack: string
    subtitle: string
    createJob: string
    editProfile: string
    createdJobs: string
    assignedJobs: string
    unreadMessages: string
    yourCity: string
    jobsICreated: string
    jobsITake: string
    total: string
    noCreatedJobs: string
    noTakenJobs: string
    worker: string
    author: string
    openJob: string
    openChat: string
    unread: string
    noDescription: string
    notSpecified: string
    unknown: string
    notAssigned: string
  }
  chat: {
    backToJob: string
    title: string
    autoRefresh: string
    every30Seconds: string
    author: string
    worker: string
    unknownUser: string
    cityNotSpecified: string
    messages: string
    message_one: string
    message_other: string
    noMessages: string
    newMessage: string
    placeholder: string
    send: string
    sending: string
    sent: string
    maxLength: string
  }
  profile: {
    title: string
    subtitle: string
    fullName: string
    phone: string
    city: string
    save: string
    saving: string
    rating: string
    reviews: string
    reviews_one: string
    reviews_other: string
    noRating: string
  }
  jobForm: {
    createTitle: string
    createSubtitle: string
    editTitle: string
    editSubtitle: string
    backToDashboard: string
    backToJob: string
    titleLabel: string
    descriptionLabel: string
    cityLabel: string
    addressLabel: string
    budgetLabel: string
    jobTypeLabel: string
    propertyTypeLabel: string
    scheduledDateLabel: string
    scheduledTimeLabel: string
    createButton: string
    updateButton: string
    saving: string
    titlePlaceholder: string
    descriptionPlaceholder: string
    cityPlaceholder: string
    addressPlaceholder: string
    budgetPlaceholder: string
    selectOption: string
    homeCleaning: string
    officeCleaning: string
    apartment: string
    house: string
    office: string
    other: string
  }
}

const dictionaries: Record<Locale, Dictionary> = {
  uk: {
    header: {
      jobs: "Роботи",
      dashboard: "Кабінет",
      createJob: "Створити роботу",
      signOut: "Вийти",
      logIn: "Увійти",
      signUp: "Реєстрація",
      reviews_one: "відгук",
      reviews_other: "відгуків",
    },
    language: { label: "Мова" },
    locales: {
      uk: "Українська",
      ru: "Русский",
      en: "English",
      sv: "Svenska",
      pl: "Polski",
    },
    landing: {
      badge: "Платформа для клінінгу",
      title: "Знайдіть роботу або виконавця для прибирання",
      subtitle:
        "Clean Jobs допомагає швидко знаходити замовлення на прибирання, брати їх у роботу, спілкуватися в чаті та отримувати відгуки.",
      browseJobs: "Переглянути роботи",
      createJob: "Створити роботу",
      card1Title: "Публікуйте замовлення",
      card1Text:
        "Створіть оголошення, вкажіть бюджет, місто та деталі прибирання.",
      card2Title: "Беріть роботи",
      card2Text:
        "Виконавці можуть брати замовлення, змінювати статус та домовлятися в чаті.",
      card3Title: "Будуйте репутацію",
      card3Text:
        "Після завершення роботи обидві сторони можуть залишити відгук і оцінку.",
      sectionTitle: "Все в одному місці",
      sectionText:
        "Оголошення, чат, статуси, історія дій та рейтинги — все вже вбудовано в продукт.",
    },
    auth: {
      loginTitle: "Вхід",
      loginSubtitle: "Увійдіть у свій акаунт Clean Jobs.",
      signupTitle: "Реєстрація",
      signupSubtitle: "Створіть акаунт і почніть користуватися Clean Jobs.",
      emailLabel: "Email",
      passwordLabel: "Пароль",
      fullNameLabel: "Ім’я",
      submitLogin: "Увійти",
      submitSignup: "Створити акаунт",
      noAccount: "Ще немає акаунта?",
      haveAccount: "Вже маєте акаунт?",
      goToSignup: "Зареєструватися",
      goToLogin: "Увійти",
      backHome: "← Назад на головну",
    },
    jobs: {
      pageTitle: "Роботи",
      pageSubtitle: "Знайдіть доступні замовлення на прибирання.",
      filtersTitle: "Фільтри",
      searchLabel: "Пошук",
      cityLabel: "Місто",
      statusLabel: "Статус",
      budgetLabel: "Бюджет",
      clearFilters: "Очистити фільтри",
      noResults: "Нічого не знайдено.",
      details: "Деталі",
      createdAt: "Створено",
      budget: "Бюджет",
      city: "Місто",
      status: "Статус",
      author: "Автор",
      worker: "Виконавець",
      notAssigned: "Не призначено",
      notSpecified: "Не вказано",
      unknown: "Невідомо",
      backToJobs: "← Назад до робіт",
      description: "Опис",
      overview: "Огляд",
      jobChat: "Чат по роботі",
      createdBy: "Створив",
      assignedTo: "Призначений виконавець",
      timeline: "Історія",
      reviews: "Відгуки",
      loginToView: "Увійдіть, щоб переглянути деталі",
      openChat: "Відкрити чат",
      untitledJob: "Робота без назви",
      emptyDescription: "Опис відсутній.",
      address: "Адреса",
      jobType: "Тип роботи",
      propertyType: "Тип об'єкта",
      scheduledDate: "Дата",
      scheduledTime: "Час",
      status_new: "новий",
      status_assigned: "призначено",
      status_in_progress: "в процесі",
      status_done: "виконано",
      status_cancelled: "скасовано",
    },
    dashboard: {
      title: "Кабінет",
      welcomeBack: "З поверненням",
      subtitle: "Керуйте своїми роботами, чатом і непрочитаними повідомленнями.",
      createJob: "Створити роботу",
      editProfile: "Редагувати профіль",
      createdJobs: "Створені роботи",
      assignedJobs: "Взяті роботи",
      unreadMessages: "Непрочитані повідомлення",
      yourCity: "Ваше місто",
      jobsICreated: "Роботи, які я створив",
      jobsITake: "Роботи, які я взяв",
      total: "всього",
      noCreatedJobs: "Ви ще не створили жодної роботи.",
      noTakenJobs: "Ви ще не взяли жодної роботи.",
      worker: "Виконавець",
      author: "Автор",
      openJob: "Відкрити роботу",
      openChat: "Відкрити чат",
      unread: "непрочитаних",
      noDescription: "Опис відсутній",
      notSpecified: "Не вказано",
      unknown: "Невідомо",
      notAssigned: "Не призначено",
    },
    chat: {
      backToJob: "← Назад до роботи",
      title: "Чат по роботі",
      autoRefresh: "Автооновлення",
      every30Seconds: "кожні 30 секунд",
      author: "Автор",
      worker: "Виконавець",
      unknownUser: "Невідомий користувач",
      cityNotSpecified: "Місто не вказано",
      messages: "Повідомлення",
      message_one: "повідомлення",
      message_other: "повідомлень",
      noMessages: "Поки що немає повідомлень.",
      newMessage: "Нове повідомлення",
      placeholder: "Напишіть повідомлення...",
      send: "Надіслати",
      sending: "Надсилання...",
      sent: "Повідомлення надіслано.",
      maxLength: "символів",
    },
    profile: {
      title: "Профіль",
      subtitle: "Оновіть свої дані та перевірте рейтинг.",
      fullName: "Ім’я",
      phone: "Телефон",
      city: "Місто",
      save: "Зберегти",
      saving: "Збереження...",
      rating: "Рейтинг",
      reviews: "Відгуки",
      reviews_one: "відгук",
      reviews_other: "відгуків",
      noRating: "Ще немає рейтингу",
    },
    jobForm: {
      createTitle: "Створити роботу",
      createSubtitle: "Додайте нове замовлення на прибирання.",
      editTitle: "Редагувати роботу",
      editSubtitle: "Оновіть деталі вашого замовлення.",
      backToDashboard: "← Назад до кабінету",
      backToJob: "← Назад до роботи",
      titleLabel: "Назва",
      descriptionLabel: "Опис",
      cityLabel: "Місто",
      addressLabel: "Адреса",
      budgetLabel: "Бюджет",
      jobTypeLabel: "Тип роботи",
      propertyTypeLabel: "Тип об'єкта",
      scheduledDateLabel: "Дата",
      scheduledTimeLabel: "Час",
      createButton: "Створити роботу",
      updateButton: "Зберегти зміни",
      saving: "Збереження...",
      titlePlaceholder: "Наприклад: Прибирання квартири після ремонту",
      descriptionPlaceholder: "Опишіть, що потрібно зробити...",
      cityPlaceholder: "Наприклад: Stockholm",
      addressPlaceholder: "Вкажіть адресу",
      budgetPlaceholder: "Наприклад: 800",
      selectOption: "Оберіть варіант",
      homeCleaning: "Домашнє прибирання",
      officeCleaning: "Офісне прибирання",
      apartment: "Квартира",
      house: "Будинок",
      office: "Офіс",
      other: "Інше",
    },
  },
  ru: {
    header: {
      jobs: "Работы",
      dashboard: "Кабинет",
      createJob: "Создать работу",
      signOut: "Выйти",
      logIn: "Войти",
      signUp: "Регистрация",
      reviews_one: "отзыв",
      reviews_other: "отзывов",
    },
    language: { label: "Язык" },
    locales: {
      uk: "Українська",
      ru: "Русский",
      en: "English",
      sv: "Svenska",
      pl: "Polski",
    },
    landing: {
      badge: "Платформа для клининга",
      title: "Найдите работу или исполнителя для уборки",
      subtitle:
        "Clean Jobs помогает быстро находить заказы на уборку, брать их в работу, общаться в чате и получать отзывы.",
      browseJobs: "Смотреть работы",
      createJob: "Создать работу",
      card1Title: "Публикуйте заказы",
      card1Text:
        "Создайте объявление, укажите бюджет, город и детали уборки.",
      card2Title: "Берите заказы",
      card2Text:
        "Исполнители могут брать заказы, менять статус и договариваться в чате.",
      card3Title: "Стройте репутацию",
      card3Text:
        "После завершения работы обе стороны могут оставить отзыв и оценку.",
      sectionTitle: "Все в одном месте",
      sectionText:
        "Объявления, чат, статусы, история действий и рейтинги — все уже встроено в продукт.",
    },
    auth: {
      loginTitle: "Вход",
      loginSubtitle: "Войдите в свой аккаунт Clean Jobs.",
      signupTitle: "Регистрация",
      signupSubtitle: "Создайте аккаунт и начните пользоваться Clean Jobs.",
      emailLabel: "Email",
      passwordLabel: "Пароль",
      fullNameLabel: "Имя",
      submitLogin: "Войти",
      submitSignup: "Создать аккаунт",
      noAccount: "Еще нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      goToSignup: "Зарегистрироваться",
      goToLogin: "Войти",
      backHome: "← Назад на главную",
    },
    jobs: {
      pageTitle: "Работы",
      pageSubtitle: "Найдите доступные заказы на уборку.",
      filtersTitle: "Фильтры",
      searchLabel: "Поиск",
      cityLabel: "Город",
      statusLabel: "Статус",
      budgetLabel: "Бюджет",
      clearFilters: "Сбросить фильтры",
      noResults: "Ничего не найдено.",
      details: "Подробнее",
      createdAt: "Создано",
      budget: "Бюджет",
      city: "Город",
      status: "Статус",
      author: "Автор",
      worker: "Исполнитель",
      notAssigned: "Не назначен",
      notSpecified: "Не указано",
      unknown: "Неизвестно",
      backToJobs: "← Назад к работам",
      description: "Описание",
      overview: "Обзор",
      jobChat: "Чат по работе",
      createdBy: "Создал",
      assignedTo: "Назначенный исполнитель",
      timeline: "История",
      reviews: "Отзывы",
      loginToView: "Войдите, чтобы посмотреть детали",
      openChat: "Открыть чат",
      untitledJob: "Работа без названия",
      emptyDescription: "Описание отсутствует.",
      address: "Адрес",
      jobType: "Тип работы",
      propertyType: "Тип объекта",
      scheduledDate: "Дата",
      scheduledTime: "Время",
      status_new: "новый",
      status_assigned: "назначено",
      status_in_progress: "в процессе",
      status_done: "выполнено",
      status_cancelled: "отменено",
    },
    dashboard: {
      title: "Кабинет",
      welcomeBack: "С возвращением",
      subtitle:
        "Управляйте своими работами, чатом и непрочитанными сообщениями.",
      createJob: "Создать работу",
      editProfile: "Редактировать профиль",
      createdJobs: "Созданные работы",
      assignedJobs: "Взятые работы",
      unreadMessages: "Непрочитанные сообщения",
      yourCity: "Ваш город",
      jobsICreated: "Работы, которые я создал",
      jobsITake: "Работы, которые я взял",
      total: "всего",
      noCreatedJobs: "Вы еще не создали ни одной работы.",
      noTakenJobs: "Вы еще не взяли ни одной работы.",
      worker: "Исполнитель",
      author: "Автор",
      openJob: "Открыть работу",
      openChat: "Открыть чат",
      unread: "непрочитанных",
      noDescription: "Описание отсутствует",
      notSpecified: "Не указано",
      unknown: "Неизвестно",
      notAssigned: "Не назначен",
    },
    chat: {
      backToJob: "← Назад к работе",
      title: "Чат по работе",
      autoRefresh: "Автообновление",
      every30Seconds: "каждые 30 секунд",
      author: "Автор",
      worker: "Исполнитель",
      unknownUser: "Неизвестный пользователь",
      cityNotSpecified: "Город не указан",
      messages: "Сообщения",
      message_one: "сообщение",
      message_other: "сообщений",
      noMessages: "Сообщений пока нет.",
      newMessage: "Новое сообщение",
      placeholder: "Напишите сообщение...",
      send: "Отправить",
      sending: "Отправка...",
      sent: "Сообщение отправлено.",
      maxLength: "символов",
    },
    profile: {
      title: "Профиль",
      subtitle: "Обновите свои данные и проверьте рейтинг.",
      fullName: "Имя",
      phone: "Телефон",
      city: "Город",
      save: "Сохранить",
      saving: "Сохранение...",
      rating: "Рейтинг",
      reviews: "Отзывы",
      reviews_one: "отзыв",
      reviews_other: "отзывов",
      noRating: "Рейтинга пока нет",
    },
    jobForm: {
      createTitle: "Создать работу",
      createSubtitle: "Добавьте новый заказ на уборку.",
      editTitle: "Редактировать работу",
      editSubtitle: "Обновите детали вашего заказа.",
      backToDashboard: "← Назад в кабинет",
      backToJob: "← Назад к работе",
      titleLabel: "Название",
      descriptionLabel: "Описание",
      cityLabel: "Город",
      addressLabel: "Адрес",
      budgetLabel: "Бюджет",
      jobTypeLabel: "Тип работы",
      propertyTypeLabel: "Тип объекта",
      scheduledDateLabel: "Дата",
      scheduledTimeLabel: "Время",
      createButton: "Создать работу",
      updateButton: "Сохранить изменения",
      saving: "Сохранение...",
      titlePlaceholder: "Например: Уборка квартиры после ремонта",
      descriptionPlaceholder: "Опишите, что нужно сделать...",
      cityPlaceholder: "Например: Stockholm",
      addressPlaceholder: "Укажите адрес",
      budgetPlaceholder: "Например: 800",
      selectOption: "Выберите вариант",
      homeCleaning: "Домашняя уборка",
      officeCleaning: "Уборка офиса",
      apartment: "Квартира",
      house: "Дом",
      office: "Офис",
      other: "Другое",
    },
  },
  en: {
    header: {
      jobs: "Jobs",
      dashboard: "Dashboard",
      createJob: "Create job",
      signOut: "Sign out",
      logIn: "Log in",
      signUp: "Sign up",
      reviews_one: "review",
      reviews_other: "reviews",
    },
    language: { label: "Language" },
    locales: {
      uk: "Українська",
      ru: "Русский",
      en: "English",
      sv: "Svenska",
      pl: "Polski",
    },
    landing: {
      badge: "Cleaning marketplace",
      title: "Find cleaning jobs or hire a worker",
      subtitle:
        "Clean Jobs helps people post cleaning work, take jobs, chat safely, and build trust with reviews.",
      browseJobs: "Browse jobs",
      createJob: "Create job",
      card1Title: "Post jobs",
      card1Text:
        "Create a listing with budget, city, and cleaning details in a few steps.",
      card2Title: "Take jobs",
      card2Text:
        "Workers can accept jobs, update statuses, and coordinate through chat.",
      card3Title: "Build trust",
      card3Text:
        "When a job is done, both sides can leave a review and rating.",
      sectionTitle: "Everything in one place",
      sectionText:
        "Jobs, chat, statuses, activity history, and ratings are already built into the product.",
    },
    auth: {
      loginTitle: "Log in",
      loginSubtitle: "Sign in to your Clean Jobs account.",
      signupTitle: "Sign up",
      signupSubtitle: "Create an account and start using Clean Jobs.",
      emailLabel: "Email",
      passwordLabel: "Password",
      fullNameLabel: "Full name",
      submitLogin: "Log in",
      submitSignup: "Create account",
      noAccount: "Don’t have an account?",
      haveAccount: "Already have an account?",
      goToSignup: "Sign up",
      goToLogin: "Log in",
      backHome: "← Back to home",
    },
    jobs: {
      pageTitle: "Jobs",
      pageSubtitle: "Find available cleaning jobs.",
      filtersTitle: "Filters",
      searchLabel: "Search",
      cityLabel: "City",
      statusLabel: "Status",
      budgetLabel: "Budget",
      clearFilters: "Clear filters",
      noResults: "No jobs found.",
      details: "Details",
      createdAt: "Created",
      budget: "Budget",
      city: "City",
      status: "Status",
      author: "Author",
      worker: "Worker",
      notAssigned: "Not assigned",
      notSpecified: "Not specified",
      unknown: "Unknown",
      backToJobs: "← Back to jobs",
      description: "Description",
      overview: "Overview",
      jobChat: "Job chat",
      createdBy: "Created by",
      assignedTo: "Assigned worker",
      timeline: "Timeline",
      reviews: "Reviews",
      loginToView: "Log in to view details",
      openChat: "Open chat",
      untitledJob: "Untitled job",
      emptyDescription: "No description provided.",
      address: "Address",
      jobType: "Job type",
      propertyType: "Property type",
      scheduledDate: "Scheduled date",
      scheduledTime: "Scheduled time",
      status_new: "new",
      status_assigned: "assigned",
      status_in_progress: "in progress",
      status_done: "done",
      status_cancelled: "cancelled",
    },
    dashboard: {
      title: "Dashboard",
      welcomeBack: "Welcome back",
      subtitle: "Manage your jobs, chat, and unread messages.",
      createJob: "Create job",
      editProfile: "Edit profile",
      createdJobs: "Created jobs",
      assignedJobs: "Assigned jobs",
      unreadMessages: "Unread messages",
      yourCity: "Your city",
      jobsICreated: "Jobs I created",
      jobsITake: "Jobs I take",
      total: "total",
      noCreatedJobs: "You have not created any jobs yet.",
      noTakenJobs: "You have not taken any jobs yet.",
      worker: "Worker",
      author: "Author",
      openJob: "Open job",
      openChat: "Open chat",
      unread: "unread",
      noDescription: "No description",
      notSpecified: "Not specified",
      unknown: "Unknown",
      notAssigned: "Not assigned",
    },
    chat: {
      backToJob: "← Back to job",
      title: "Job chat",
      autoRefresh: "Auto refresh",
      every30Seconds: "every 30 seconds",
      author: "Author",
      worker: "Worker",
      unknownUser: "Unknown user",
      cityNotSpecified: "City not specified",
      messages: "Messages",
      message_one: "message",
      message_other: "messages",
      noMessages: "No messages yet.",
      newMessage: "New message",
      placeholder: "Write your message...",
      send: "Send",
      sending: "Sending...",
      sent: "Message sent.",
      maxLength: "characters",
    },
    profile: {
      title: "Profile",
      subtitle: "Update your details and check your rating.",
      fullName: "Full name",
      phone: "Phone",
      city: "City",
      save: "Save",
      saving: "Saving...",
      rating: "Rating",
      reviews: "Reviews",
      reviews_one: "review",
      reviews_other: "reviews",
      noRating: "No rating yet",
    },
    jobForm: {
      createTitle: "Create job",
      createSubtitle: "Add a new cleaning job.",
      editTitle: "Edit job",
      editSubtitle: "Update your job details.",
      backToDashboard: "← Back to dashboard",
      backToJob: "← Back to job",
      titleLabel: "Title",
      descriptionLabel: "Description",
      cityLabel: "City",
      addressLabel: "Address",
      budgetLabel: "Budget",
      jobTypeLabel: "Job type",
      propertyTypeLabel: "Property type",
      scheduledDateLabel: "Scheduled date",
      scheduledTimeLabel: "Scheduled time",
      createButton: "Create job",
      updateButton: "Save changes",
      saving: "Saving...",
      titlePlaceholder: "For example: Apartment cleaning after renovation",
      descriptionPlaceholder: "Describe what needs to be done...",
      cityPlaceholder: "For example: Stockholm",
      addressPlaceholder: "Enter address",
      budgetPlaceholder: "For example: 800",
      selectOption: "Select an option",
      homeCleaning: "Home cleaning",
      officeCleaning: "Office cleaning",
      apartment: "Apartment",
      house: "House",
      office: "Office",
      other: "Other",
    },
  },
  sv: {
    header: {
      jobs: "Jobb",
      dashboard: "Dashboard",
      createJob: "Skapa jobb",
      signOut: "Logga ut",
      logIn: "Logga in",
      signUp: "Registrera dig",
      reviews_one: "recension",
      reviews_other: "recensioner",
    },
    language: { label: "Språk" },
    locales: {
      uk: "Українська",
      ru: "Русский",
      en: "English",
      sv: "Svenska",
      pl: "Polski",
    },
    landing: {
      badge: "Plattform för städjobb",
      title: "Hitta städjobb eller anlita en städare",
      subtitle:
        "Clean Jobs hjälper dig att lägga upp jobb, ta uppdrag, chatta och bygga förtroende med recensioner.",
      browseJobs: "Visa jobb",
      createJob: "Skapa jobb",
      card1Title: "Lägg upp jobb",
      card1Text:
        "Skapa en annons med budget, stad och detaljer om städningen.",
      card2Title: "Ta uppdrag",
      card2Text:
        "Arbetare kan ta jobb, uppdatera status och kommunicera i chatten.",
      card3Title: "Bygg förtroende",
      card3Text:
        "När jobbet är klart kan båda sidor lämna betyg och recension.",
      sectionTitle: "Allt på ett ställe",
      sectionText:
        "Jobb, chatt, statusar, aktivitetshistorik och betyg finns redan i produkten.",
    },
    auth: {
      loginTitle: "Logga in",
      loginSubtitle: "Logga in på ditt Clean Jobs-konto.",
      signupTitle: "Registrera dig",
      signupSubtitle: "Skapa ett konto och börja använda Clean Jobs.",
      emailLabel: "E-post",
      passwordLabel: "Lösenord",
      fullNameLabel: "Namn",
      submitLogin: "Logga in",
      submitSignup: "Skapa konto",
      noAccount: "Har du inget konto?",
      haveAccount: "Har du redan ett konto?",
      goToSignup: "Registrera dig",
      goToLogin: "Logga in",
      backHome: "← Till startsidan",
    },
    jobs: {
      pageTitle: "Jobb",
      pageSubtitle: "Hitta tillgängliga städjobb.",
      filtersTitle: "Filter",
      searchLabel: "Sök",
      cityLabel: "Stad",
      statusLabel: "Status",
      budgetLabel: "Budget",
      clearFilters: "Rensa filter",
      noResults: "Inga jobb hittades.",
      details: "Detaljer",
      createdAt: "Skapad",
      budget: "Budget",
      city: "Stad",
      status: "Status",
      author: "Skapare",
      worker: "Arbetare",
      notAssigned: "Inte tilldelad",
      notSpecified: "Inte angivet",
      unknown: "Okänd",
      backToJobs: "← Tillbaka till jobb",
      description: "Beskrivning",
      overview: "Översikt",
      jobChat: "Jobbchatt",
      createdBy: "Skapad av",
      assignedTo: "Tilldelad arbetare",
      timeline: "Tidslinje",
      reviews: "Recensioner",
      loginToView: "Logga in för att se detaljer",
      openChat: "Öppna chatt",
      untitledJob: "Namnlöst jobb",
      emptyDescription: "Ingen beskrivning angiven.",
      address: "Adress",
      jobType: "Jobbtyp",
      propertyType: "Boendetyp",
      scheduledDate: "Datum",
      scheduledTime: "Tid",
      status_new: "ny",
      status_assigned: "tilldelad",
      status_in_progress: "pågår",
      status_done: "klar",
      status_cancelled: "avbruten",
    },
    dashboard: {
      title: "Dashboard",
      welcomeBack: "Välkommen tillbaka",
      subtitle: "Hantera dina jobb, chattar och olästa meddelanden.",
      createJob: "Skapa jobb",
      editProfile: "Redigera profil",
      createdJobs: "Skapade jobb",
      assignedJobs: "Tilldelade jobb",
      unreadMessages: "Olästa meddelanden",
      yourCity: "Din stad",
      jobsICreated: "Jobb jag skapade",
      jobsITake: "Jobb jag tar",
      total: "totalt",
      noCreatedJobs: "Du har inte skapat några jobb ännu.",
      noTakenJobs: "Du har inte tagit några jobb ännu.",
      worker: "Arbetare",
      author: "Skapare",
      openJob: "Öppna jobb",
      openChat: "Öppna chatt",
      unread: "olästa",
      noDescription: "Ingen beskrivning",
      notSpecified: "Inte angivet",
      unknown: "Okänd",
      notAssigned: "Inte tilldelad",
    },
    chat: {
      backToJob: "← Tillbaka till jobb",
      title: "Jobbchatt",
      autoRefresh: "Auto-uppdatering",
      every30Seconds: "var 30:e sekund",
      author: "Skapare",
      worker: "Arbetare",
      unknownUser: "Okänd användare",
      cityNotSpecified: "Stad ej angiven",
      messages: "Meddelanden",
      message_one: "meddelande",
      message_other: "meddelanden",
      noMessages: "Inga meddelanden ännu.",
      newMessage: "Nytt meddelande",
      placeholder: "Skriv ditt meddelande...",
      send: "Skicka",
      sending: "Skickar...",
      sent: "Meddelandet skickades.",
      maxLength: "tecken",
    },
    profile: {
      title: "Profil",
      subtitle: "Uppdatera dina uppgifter och kontrollera ditt betyg.",
      fullName: "Namn",
      phone: "Telefon",
      city: "Stad",
      save: "Spara",
      saving: "Sparar...",
      rating: "Betyg",
      reviews: "Recensioner",
      reviews_one: "recension",
      reviews_other: "recensioner",
      noRating: "Inget betyg ännu",
    },
    jobForm: {
      createTitle: "Skapa jobb",
      createSubtitle: "Lägg till ett nytt städjobb.",
      editTitle: "Redigera jobb",
      editSubtitle: "Uppdatera jobbets detaljer.",
      backToDashboard: "← Tillbaka till dashboard",
      backToJob: "← Tillbaka till jobb",
      titleLabel: "Titel",
      descriptionLabel: "Beskrivning",
      cityLabel: "Stad",
      addressLabel: "Adress",
      budgetLabel: "Budget",
      jobTypeLabel: "Jobbtyp",
      propertyTypeLabel: "Boendetyp",
      scheduledDateLabel: "Datum",
      scheduledTimeLabel: "Tid",
      createButton: "Skapa jobb",
      updateButton: "Spara ändringar",
      saving: "Sparar...",
      titlePlaceholder: "Till exempel: Lägenhetsstädning efter renovering",
      descriptionPlaceholder: "Beskriv vad som behöver göras...",
      cityPlaceholder: "Till exempel: Stockholm",
      addressPlaceholder: "Ange adress",
      budgetPlaceholder: "Till exempel: 800",
      selectOption: "Välj ett alternativ",
      homeCleaning: "Hemstädning",
      officeCleaning: "Kontorsstädning",
      apartment: "Lägenhet",
      house: "Hus",
      office: "Kontor",
      other: "Annat",
    },
  },
  pl: {
    header: {
      jobs: "Oferty",
      dashboard: "Panel",
      createJob: "Dodaj ofertę",
      signOut: "Wyloguj się",
      logIn: "Zaloguj się",
      signUp: "Rejestracja",
      reviews_one: "opinia",
      reviews_other: "opinii",
    },
    language: { label: "Język" },
    locales: {
      uk: "Українська",
      ru: "Русский",
      en: "English",
      sv: "Svenska",
      pl: "Polski",
    },
    landing: {
      badge: "Platforma do sprzątania",
      title: "Znajdź zlecenie sprzątania albo wykonawcę",
      subtitle:
        "Clean Jobs pomaga szybko publikować zlecenia, brać je do realizacji, rozmawiać na czacie i budować zaufanie dzięki opiniom.",
      browseJobs: "Przeglądaj oferty",
      createJob: "Dodaj ofertę",
      card1Title: "Dodawaj zlecenia",
      card1Text:
        "Utwórz ogłoszenie, podaj budżet, miasto i szczegóły sprzątania.",
      card2Title: "Bierz zlecenia",
      card2Text:
        "Wykonawcy mogą brać zlecenia, zmieniać status i ustalać szczegóły na czacie.",
      card3Title: "Buduj reputację",
      card3Text:
        "Po zakończeniu pracy obie strony mogą wystawić opinię i ocenę.",
      sectionTitle: "Wszystko w jednym miejscu",
      sectionText:
        "Oferty, czat, statusy, historia działań i oceny są już wbudowane w produkt.",
    },
    auth: {
      loginTitle: "Zaloguj się",
      loginSubtitle: "Zaloguj się do swojego konta Clean Jobs.",
      signupTitle: "Rejestracja",
      signupSubtitle: "Załóż konto i zacznij korzystać z Clean Jobs.",
      emailLabel: "Email",
      passwordLabel: "Hasło",
      fullNameLabel: "Imię i nazwisko",
      submitLogin: "Zaloguj się",
      submitSignup: "Utwórz konto",
      noAccount: "Nie masz konta?",
      haveAccount: "Masz już konto?",
      goToSignup: "Zarejestruj się",
      goToLogin: "Zaloguj się",
      backHome: "← Wróć na stronę główną",
    },
    jobs: {
      pageTitle: "Oferty",
      pageSubtitle: "Znajdź dostępne zlecenia sprzątania.",
      filtersTitle: "Filtry",
      searchLabel: "Szukaj",
      cityLabel: "Miasto",
      statusLabel: "Status",
      budgetLabel: "Budżet",
      clearFilters: "Wyczyść filtry",
      noResults: "Nie znaleziono ofert.",
      details: "Szczegóły",
      createdAt: "Dodano",
      budget: "Budżet",
      city: "Miasto",
      status: "Status",
      author: "Autor",
      worker: "Wykonawca",
      notAssigned: "Nieprzydzielono",
      notSpecified: "Nie podano",
      unknown: "Nieznany",
      backToJobs: "← Powrót do ofert",
      description: "Opis",
      overview: "Przegląd",
      jobChat: "Czat oferty",
      createdBy: "Dodał",
      assignedTo: "Przydzielony wykonawca",
      timeline: "Historia",
      reviews: "Opinie",
      loginToView: "Zaloguj się, aby zobaczyć szczegóły",
      openChat: "Otwórz czat",
      untitledJob: "Oferta bez tytułu",
      emptyDescription: "Brak opisu.",
      address: "Adres",
      jobType: "Typ pracy",
      propertyType: "Typ nieruchomości",
      scheduledDate: "Data",
      scheduledTime: "Godzina",
      status_new: "nowe",
      status_assigned: "przydzielone",
      status_in_progress: "w trakcie",
      status_done: "zakończone",
      status_cancelled: "anulowane",
    },
    dashboard: {
      title: "Panel",
      welcomeBack: "Witamy ponownie",
      subtitle:
        "Zarządzaj swoimi ofertami, czatem i nieprzeczytanymi wiadomościami.",
      createJob: "Dodaj ofertę",
      editProfile: "Edytuj profil",
      createdJobs: "Dodane oferty",
      assignedJobs: "Przyjęte oferty",
      unreadMessages: "Nieprzeczytane wiadomości",
      yourCity: "Twoje miasto",
      jobsICreated: "Oferty, które dodałem",
      jobsITake: "Oferty, które przyjąłem",
      total: "łącznie",
      noCreatedJobs: "Nie dodałeś jeszcze żadnej oferty.",
      noTakenJobs: "Nie przyjąłeś jeszcze żadnej oferty.",
      worker: "Wykonawca",
      author: "Autor",
      openJob: "Otwórz ofertę",
      openChat: "Otwórz czat",
      unread: "nieprzeczytanych",
      noDescription: "Brak opisu",
      notSpecified: "Nie podano",
      unknown: "Nieznany",
      notAssigned: "Nieprzydzielono",
    },
    chat: {
      backToJob: "← Powrót do oferty",
      title: "Czat oferty",
      autoRefresh: "Auto odświeżanie",
      every30Seconds: "co 30 sekund",
      author: "Autor",
      worker: "Wykonawca",
      unknownUser: "Nieznany użytkownik",
      cityNotSpecified: "Nie podano miasta",
      messages: "Wiadomości",
      message_one: "wiadomość",
      message_other: "wiadomości",
      noMessages: "Brak wiadomości.",
      newMessage: "Nowa wiadomość",
      placeholder: "Napisz wiadomość...",
      send: "Wyślij",
      sending: "Wysyłanie...",
      sent: "Wiadomość wysłana.",
      maxLength: "znaków",
    },
    profile: {
      title: "Profil",
      subtitle: "Zaktualizuj swoje dane i sprawdź ocenę.",
      fullName: "Imię i nazwisko",
      phone: "Telefon",
      city: "Miasto",
      save: "Zapisz",
      saving: "Zapisywanie...",
      rating: "Ocena",
      reviews: "Opinie",
      reviews_one: "opinia",
      reviews_other: "opinii",
      noRating: "Brak oceny",
    },
    jobForm: {
      createTitle: "Dodaj ofertę",
      createSubtitle: "Dodaj nowe zlecenie sprzątania.",
      editTitle: "Edytuj ofertę",
      editSubtitle: "Zaktualizuj szczegóły oferty.",
      backToDashboard: "← Powrót do panelu",
      backToJob: "← Powrót do oferty",
      titleLabel: "Tytuł",
      descriptionLabel: "Opis",
      cityLabel: "Miasto",
      addressLabel: "Adres",
      budgetLabel: "Budżet",
      jobTypeLabel: "Typ pracy",
      propertyTypeLabel: "Typ nieruchomości",
      scheduledDateLabel: "Data",
      scheduledTimeLabel: "Godzina",
      createButton: "Dodaj ofertę",
      updateButton: "Zapisz zmiany",
      saving: "Zapisywanie...",
      titlePlaceholder: "Na przykład: Sprzątanie mieszkania po remoncie",
      descriptionPlaceholder: "Opisz, co trzeba zrobić...",
      cityPlaceholder: "Na przykład: Stockholm",
      addressPlaceholder: "Wpisz adres",
      budgetPlaceholder: "Na przykład: 800",
      selectOption: "Wybierz opcję",
      homeCleaning: "Sprzątanie domu",
      officeCleaning: "Sprzątanie biura",
      apartment: "Mieszkanie",
      house: "Dom",
      office: "Biuro",
      other: "Inne",
    },
  },
}

export function isSupportedLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE
  const normalized = value.toLowerCase().trim()
  if (isSupportedLocale(normalized)) return normalized
  const short = normalized.split("-")[0]
  if (isSupportedLocale(short)) return short
  return DEFAULT_LOCALE
}

export function getPreferredLocale(
  acceptLanguageHeader: string | null | undefined,
): Locale {
  if (!acceptLanguageHeader) return DEFAULT_LOCALE

  const candidates = acceptLanguageHeader
    .split(",")
    .map((item) => item.split(";")[0]?.trim())
    .filter(Boolean)

  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate)
    if (isSupportedLocale(locale)) return locale
  }

  return DEFAULT_LOCALE
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE]
}

export function getReviewWord(locale: Locale, count: number) {
  const dictionary = getDictionary(locale)
  return count === 1
    ? dictionary.header.reviews_one
    : dictionary.header.reviews_other
}

export function getProfileReviewWord(locale: Locale, count: number) {
  const dictionary = getDictionary(locale)
  return count === 1
    ? dictionary.profile.reviews_one
    : dictionary.profile.reviews_other
}

export function getJobStatusLabel(
  locale: Locale,
  status: string | null | undefined,
) {
  const dictionary = getDictionary(locale)

  switch (status) {
    case "new":
      return dictionary.jobs.status_new
    case "assigned":
      return dictionary.jobs.status_assigned
    case "in_progress":
      return dictionary.jobs.status_in_progress
    case "done":
      return dictionary.jobs.status_done
    case "cancelled":
      return dictionary.jobs.status_cancelled
    default:
      return dictionary.jobs.unknown
  }
}

export function getMessageWord(locale: Locale, count: number) {
  const dictionary = getDictionary(locale)
  return count === 1
    ? dictionary.chat.message_one
    : dictionary.chat.message_other
}