export const SUPPORTED_LOCALES = ["uk", "ru", "en", "sv", "pl"] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "sv"
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
    bankid_success
    bankid_failed
    company_logo
    logo
    verified_on
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
  services: {
  pageTitle: string
  pageSubtitle: string
  addService: string
  providers: string
  availableProfiles: string
  viewService: string
  fromPrice: string
  perHour: string
  verified: string
  serviceProvider: string

  myServicesTitle: string
  myServicesSubtitle: string
  addServiceProfile: string
  noServicesYet: string
  createFirstService: string

  editServiceTitle: string
  editServiceSubtitle: string

  companyName: string
  companyLogo: string
  logoHelp: string
  description: string
  city: string
  phone: string
  email: string
  website: string
  hourlyRate: string
  minimumOrder: string
  rutAvailable: string
  languages: string
  serviceTypes: string
  serviceAreas: string

  saveChanges: string
  saving: string

  contactInformation: string
  serviceDetails: string
  minimumOrderHours: string
  yes: string
  no: string

  allServices: string
  relatedServices: string
  backToServices: string
visitWebsite: string
call: string
priceFrom: string

cityLabel: string
websiteLabel: string

pending: string

hours: string

serviceAreasTitle: string
languagesTitle: string
servicesTitle: string
}
companies: {
  pageTitle: string
  pageSubtitle: string
  badge: string
  browseByCity: string
  browseByCityText: string
  findJobs: string
  addCompany: string
  listedCompanies: string
  availableCompanies: string
  verified: string
  viewCompany: string
  fallbackDescription: string
  findServicesTitle: string
  findServicesText: string
  areYouCompanyTitle: string
  areYouCompanyText: string
  companyNotFound: string
verifiedCompany: string
phone: string
email: string
website: string
visitWebsite: string
relatedCompanies: string
findCleaningJobs: string
}
common: {
  back: string
  backToDashboard: string
  save: string
  saving: string
  delete: string
  deleting: string
  edit: string
  open: string
  view: string
  cancel: string
  confirm: string
  yes: string
  no: string
  pending: string
  verified: string
  loading: string
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
      bankid_success: "✓ BankID успішно підтверджено.",
bankid_failed: "Помилка перевірки BankID",
company_logo: "Логотип компанії",
logo: "Логотип",
verified_on: "Підтверджено",
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
    services: {
  pageTitle: "Знайти клінінгові послуги у Швеції",
  pageSubtitle: "Порівнюйте клінінгові компанії, райони роботи, ціни та контакти.",
  addService: "Додати послугу",
  providers: "Постачальники клінінгових послуг",
  availableProfiles: "профілів послуг доступно",
  viewService: "Переглянути послугу",
  fromPrice: "Від",
  perHour: "SEK/год",
  verified: "Перевірено",
  serviceProvider: "Постачальник клінінгових послуг",
  myServicesTitle: "Мої клінінгові послуги",
  myServicesSubtitle: "Керуйте своїми публічними профілями послуг на Clean Jobs.",
  addServiceProfile: "Додати профіль послуги",
  noServicesYet: "Профілів послуг ще немає",
  createFirstService: "Створити першу послугу",
  editServiceTitle: "Редагувати профіль послуги",
  editServiceSubtitle: "Оновіть свій публічний профіль клінінгової послуги.",
  companyName: "Назва компанії",
  companyLogo: "Логотип компанії",
  logoHelp: "JPG, PNG або WEBP. Максимум 5MB.",
  description: "Опис",
  city: "Місто",
  phone: "Телефон",
  email: "Email",
  website: "Сайт",
  hourlyRate: "Ціна від SEK/год",
  minimumOrder: "Мінімальне замовлення в годинах",
  rutAvailable: "RUT доступний",
  languages: "Мови",
  serviceTypes: "Типи послуг",
  serviceAreas: "Райони роботи",
  saveChanges: "Зберегти зміни",
  saving: "Збереження...",
  contactInformation: "Контактна інформація",
  serviceDetails: "Деталі послуги",
  minimumOrderHours: "Мінімальне замовлення",
  yes: "Так",
  no: "Ні",
  allServices: "Усі послуги",
  relatedServices: "Схожі послуги",
  backToServices: "Усі послуги",
visitWebsite: "Відкрити сайт",
call: "Подзвонити",
priceFrom: "Ціна від",

cityLabel: "Місто",
websiteLabel: "Сайт",

pending: "Очікує",

hours: "годин",

serviceAreasTitle: "Райони роботи",
languagesTitle: "Мови",
servicesTitle: "Послуги",
  
},
companies: {
  pageTitle: "Клінінгові компанії Стокгольма",
  pageSubtitle:
    "Знайдіть клінінгові компанії у Стокгольмі для прибирання квартир, офісів, переїздів та регулярного прибирання.",
  badge: "Каталог клінінгових компаній",
  browseByCity: "Пошук по містах",
  browseByCityText:
    "Знайдіть клінінгові компанії у Стокгольмі та навколишніх муніципалітетах.",
  findJobs: "Знайти роботу",
  addCompany: "Додати компанію",
  listedCompanies: "Компанії в каталозі",
  availableCompanies: "клінінгових компаній доступно",
  verified: "Перевірено",
  viewCompany: "Переглянути компанію",
  fallbackDescription: "Клінінгова компанія на Clean Jobs.",
  findServicesTitle: "Знайти клінінгові послуги у Стокгольмі",
  findServicesText:
    "У Стокгольмі працює багато клінінгових компаній для квартир, будинків, офісів та переїздів.",
  areYouCompanyTitle: "У вас клінінгова компанія?",
  areYouCompanyText:
    "Створіть профіль на Clean Jobs, щоб клієнтам було легше вас знайти.",
    companyNotFound: "Компанію не знайдено",
verifiedCompany: "Перевірена компанія",
phone: "Телефон",
email: "Email",
website: "Сайт",
visitWebsite: "Відкрити сайт",
relatedCompanies: "Схожі компанії",
findCleaningJobs: "Знайти роботу з прибирання",
},
common: {
  back: "Назад",
  backToDashboard: "До панелі",
  save: "Зберегти",
  saving: "Збереження...",
  delete: "Видалити",
  deleting: "Видалення...",
  edit: "Редагувати",
  open: "Відкрити",
  view: "Переглянути",
  cancel: "Скасувати",
  confirm: "Підтвердити",
  yes: "Так",
  no: "Ні",
  pending: "Очікує",
  verified: "Перевірено",
  loading: "Завантаження...",
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
      bankid_success: "✓ BankID успешно подтвержден.",
bankid_failed: "Ошибка проверки BankID",
company_logo: "Логотип компании",
logo: "Логотип",
verified_on: "Подтверждено",
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
    services: {
  pageTitle: "Найти клининговые услуги в Швеции",
  pageSubtitle: "Сравнивайте клининговые компании, районы обслуживания, цены и контакты.",
  addService: "Добавить услугу",
  providers: "Поставщики клининговых услуг",
  availableProfiles: "профилей услуг доступно",
  viewService: "Открыть услугу",
  fromPrice: "От",
  perHour: "SEK/час",
  verified: "Проверено",
  serviceProvider: "Поставщик клининговых услуг",
  myServicesTitle: "Мои клининговые услуги",
  myServicesSubtitle: "Управляйте своими публичными профилями услуг в Clean Jobs.",
  addServiceProfile: "Добавить профиль услуги",
  noServicesYet: "Профилей услуг пока нет",
  createFirstService: "Создать первую услугу",
  editServiceTitle: "Редактировать профиль услуги",
  editServiceSubtitle: "Обновите свой публичный профиль клининговой услуги.",
  companyName: "Название компании",
  companyLogo: "Логотип компании",
  logoHelp: "JPG, PNG или WEBP. Максимум 5MB.",
  description: "Описание",
  city: "Город",
  phone: "Телефон",
  email: "Email",
  website: "Сайт",
  hourlyRate: "Цена от SEK/час",
  minimumOrder: "Минимальный заказ (часы)",
  rutAvailable: "RUT доступен",
  languages: "Языки",
  serviceTypes: "Типы услуг",
  serviceAreas: "Районы обслуживания",
  saveChanges: "Сохранить изменения",
  saving: "Сохранение...",
  contactInformation: "Контактная информация",
  serviceDetails: "Детали услуги",
  minimumOrderHours: "Минимальный заказ",
  yes: "Да",
  no: "Нет",
  allServices: "Все услуги",
  relatedServices: "Похожие услуги",
  backToServices: "Все услуги",
visitWebsite: "Открыть сайт",
call: "Позвонить",
priceFrom: "Цена от",

cityLabel: "Город",
websiteLabel: "Сайт",

pending: "Ожидает",

hours: "часов",

serviceAreasTitle: "Районы обслуживания",
languagesTitle: "Языки",
servicesTitle: "Услуги",
},
companies: {
  pageTitle: "Клининговые компании Стокгольма",
  pageSubtitle:
    "Найдите клининговые компании в Стокгольме для уборки квартир, офисов, переездов и регулярной уборки.",
  badge: "Каталог клининговых компаний",
  browseByCity: "Поиск по городам",
  browseByCityText:
    "Найдите клининговые компании в Стокгольме и ближайших муниципалитетах.",
  findJobs: "Найти работу",
  addCompany: "Добавить компанию",
  listedCompanies: "Компании в каталоге",
  availableCompanies: "клининговых компаний доступно",
  verified: "Проверено",
  viewCompany: "Открыть компанию",
  fallbackDescription: "Клининговая компания на Clean Jobs.",
  findServicesTitle: "Найти клининговые услуги в Стокгольме",
  findServicesText:
    "В Стокгольме работает множество клининговых компаний для квартир, домов, офисов и переездов.",
  areYouCompanyTitle: "У вас клининговая компания?",
  areYouCompanyText:
    "Создайте профиль на Clean Jobs, чтобы клиентам было проще вас найти.",
    companyNotFound: "Компания не найдена",
verifiedCompany: "Проверенная компания",
phone: "Телефон",
email: "Email",
website: "Сайт",
visitWebsite: "Открыть сайт",
relatedCompanies: "Похожие компании",
findCleaningJobs: "Найти работу по уборке",
},
common: {
  back: "Назад",
  backToDashboard: "К панели",
  save: "Сохранить",
  saving: "Сохранение...",
  delete: "Удалить",
  deleting: "Удаление...",
  edit: "Редактировать",
  open: "Открыть",
  view: "Просмотреть",
  cancel: "Отмена",
  confirm: "Подтвердить",
  yes: "Да",
  no: "Нет",
  pending: "Ожидает",
  verified: "Проверено",
  loading: "Загрузка...",
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
      bankid_success: "✓ BankID verification completed successfully.",
bankid_failed: "BankID verification failed",
company_logo: "Company logo",
logo: "Logo",
verified_on: "Verified on",
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
    services: {
  pageTitle: "Find Cleaning Services in Sweden",
  pageSubtitle:
    "Compare cleaning companies, service areas, prices and contact details.",
  addService: "Add Service",
  providers: "Cleaning Service Providers",
  availableProfiles: "service profiles available",
  viewService: "View Service",
  fromPrice: "From",
  perHour: "SEK/hour",
  verified: "Verified",
  serviceProvider: "Cleaning service provider",

  myServicesTitle: "My Cleaning Services",
  myServicesSubtitle:
    "Manage your public cleaning service profiles on Clean Jobs.",
  addServiceProfile: "Add Service Profile",
  noServicesYet: "No service profiles yet",
  createFirstService: "Create Your First Service",

  editServiceTitle: "Edit Service Profile",
  editServiceSubtitle: "Update your public cleaning service profile.",

  companyName: "Company Name",
  companyLogo: "Company logo",
  logoHelp: "JPG, PNG or WEBP. Maximum 5MB.",
  description: "Description",
  city: "City",
  phone: "Phone",
  email: "Email",
  website: "Website",
  hourlyRate: "Price From SEK/Hour",
  minimumOrder: "Minimum Order Hours",
  rutAvailable: "RUT Available",
  languages: "Languages",
  serviceTypes: "Service Types",
  serviceAreas: "Service Areas",

  saveChanges: "Save Changes",
  saving: "Saving...",

  contactInformation: "Contact Information",
  serviceDetails: "Service Details",
  minimumOrderHours: "Minimum Order",
  yes: "Yes",
  no: "No",

  allServices: "All Services",
  relatedServices: "Related Services",
  backToServices: "All Services",
visitWebsite: "Visit Website",
call: "Call",
priceFrom: "Price From",

cityLabel: "City",
websiteLabel: "Website",

pending: "Pending",

hours: "hours",

serviceAreasTitle: "Service Areas",
languagesTitle: "Languages",
servicesTitle: "Services",

},
companies: {
  pageTitle: "Cleaning Companies in Stockholm",
  pageSubtitle:
    "Find cleaning companies in Stockholm for home cleaning, office cleaning, moving cleaning and regular cleaning services.",
  badge: "Cleaning company directory",
  browseByCity: "Browse companies by city",
  browseByCityText: "Find cleaning companies in Stockholm and surrounding municipalities.",
  findJobs: "Find cleaning jobs",
  addCompany: "Add your company",
  listedCompanies: "Listed companies",
  availableCompanies: "cleaning companies available",
  verified: "Verified",
  viewCompany: "View company",
  fallbackDescription: "Cleaning company listed on Clean Jobs.",
  findServicesTitle: "Find cleaning services in Stockholm",
  findServicesText:
    "Stockholm has many cleaning companies offering services for apartments, houses, offices and moving.",
  areYouCompanyTitle: "Are you a cleaning company?",
  areYouCompanyText:
    "Create a profile on Clean Jobs to make your company easier to find.",
    companyNotFound: "Company Not Found",
verifiedCompany: "Verified Company",
phone: "Phone",
email: "Email",
website: "Website",
visitWebsite: "Visit Website",
relatedCompanies: "Related Companies",
findCleaningJobs: "Find Cleaning Jobs",
},
common: {
  back: "Back",
  backToDashboard: "Back to dashboard",
  save: "Save",
  saving: "Saving...",
  delete: "Delete",
  deleting: "Deleting...",
  edit: "Edit",
  open: "Open",
  view: "View",
  cancel: "Cancel",
  confirm: "Confirm",
  yes: "Yes",
  no: "No",
  pending: "Pending",
  verified: "Verified",
  loading: "Loading...",
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
      bankid_success: "✓ BankID-verifiering slutförd.",
bankid_failed: "BankID-verifiering misslyckades",
company_logo: "Företagslogotyp",
logo: "Logotyp",
verified_on: "Verifierad den",
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
    services: {
  pageTitle: "Hitta städtjänster i Sverige",
  pageSubtitle: "Jämför städföretag, serviceområden, priser och kontaktuppgifter.",
  addService: "Lägg till tjänst",
  providers: "Leverantörer av städtjänster",
  availableProfiles: "tjänsteprofiler tillgängliga",
  viewService: "Visa tjänst",
  fromPrice: "Från",
  perHour: "SEK/timme",
  verified: "Verifierad",
  serviceProvider: "Leverantör av städtjänster",
  myServicesTitle: "Mina städtjänster",
  myServicesSubtitle: "Hantera dina offentliga städprofiler på Clean Jobs.",
  addServiceProfile: "Lägg till tjänsteprofil",
  noServicesYet: "Inga tjänsteprofiler ännu",
  createFirstService: "Skapa din första tjänst",
  editServiceTitle: "Redigera tjänsteprofil",
  editServiceSubtitle: "Uppdatera din offentliga städprofil.",
  companyName: "Företagsnamn",
  companyLogo: "Företagslogotyp",
  logoHelp: "JPG, PNG eller WEBP. Max 5MB.",
  description: "Beskrivning",
  city: "Stad",
  phone: "Telefon",
  email: "E-post",
  website: "Webbplats",
  hourlyRate: "Pris från SEK/timme",
  minimumOrder: "Minsta beställning i timmar",
  rutAvailable: "RUT tillgängligt",
  languages: "Språk",
  serviceTypes: "Tjänstetyper",
  serviceAreas: "Serviceområden",
  saveChanges: "Spara ändringar",
  saving: "Sparar...",
  contactInformation: "Kontaktinformation",
  serviceDetails: "Tjänstedetaljer",
  minimumOrderHours: "Minsta beställning",
  yes: "Ja",
  no: "Nej",
  allServices: "Alla tjänster",
  relatedServices: "Relaterade tjänster",
  backToServices: "Alla tjänster",
visitWebsite: "Besök webbplats",
call: "Ring",
priceFrom: "Pris från",

cityLabel: "Stad",
websiteLabel: "Webbplats",

pending: "Väntar",

hours: "timmar",

serviceAreasTitle: "Serviceområden",
languagesTitle: "Språk",
servicesTitle: "Tjänster",
},
companies: {
  pageTitle: "Städföretag i Stockholm",
  pageSubtitle:
    "Hitta städföretag i Stockholm för hemstädning, kontorsstädning, flyttstädning och regelbunden städservice.",
  badge: "Katalog över städföretag",
  browseByCity: "Bläddra efter stad",
  browseByCityText:
    "Hitta städföretag i Stockholm och närliggande kommuner.",
  findJobs: "Hitta städjobb",
  addCompany: "Lägg till ditt företag",
  listedCompanies: "Registrerade företag",
  availableCompanies: "städföretag tillgängliga",
  verified: "Verifierad",
  viewCompany: "Visa företag",
  fallbackDescription: "Städföretag listat på Clean Jobs.",
  findServicesTitle: "Hitta städtjänster i Stockholm",
  findServicesText:
    "Stockholm har många städföretag som erbjuder tjänster för lägenheter, hus, kontor och flyttstädning.",
  areYouCompanyTitle: "Driver du ett städföretag?",
  areYouCompanyText:
    "Skapa en profil på Clean Jobs så blir ditt företag lättare att hitta.",
    companyNotFound: "Företaget hittades inte",
verifiedCompany: "Verifierat företag",
phone: "Telefon",
email: "E-post",
website: "Webbplats",
visitWebsite: "Besök webbplats",
relatedCompanies: "Relaterade företag",
findCleaningJobs: "Hitta städjobb",
},
common: {
  back: "Tillbaka",
  backToDashboard: "Till dashboard",
  save: "Spara",
  saving: "Sparar...",
  delete: "Radera",
  deleting: "Raderar...",
  edit: "Redigera",
  open: "Öppna",
  view: "Visa",
  cancel: "Avbryt",
  confirm: "Bekräfta",
  yes: "Ja",
  no: "Nej",
  pending: "Väntar",
  verified: "Verifierad",
  loading: "Laddar...",
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
      bankid_success: "✓ BankID został pomyślnie zweryfikowany.",
bankid_failed: "Weryfikacja BankID nie powiodła się",
company_logo: "Logo firmy",
logo: "Logo",
verified_on: "Zweryfikowano",
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
    services: {
  pageTitle: "Znajdź usługi sprzątania w Szwecji",
  pageSubtitle: "Porównuj firmy sprzątające, obszary działania, ceny i dane kontaktowe.",
  addService: "Dodaj usługę",
  providers: "Dostawcy usług sprzątania",
  availableProfiles: "dostępnych profili usług",
  viewService: "Zobacz usługę",
  fromPrice: "Od",
  perHour: "SEK/godz.",
  verified: "Zweryfikowano",
  serviceProvider: "Dostawca usług sprzątania",
  myServicesTitle: "Moje usługi sprzątania",
  myServicesSubtitle: "Zarządzaj publicznymi profilami usług w Clean Jobs.",
  addServiceProfile: "Dodaj profil usługi",
  noServicesYet: "Brak profili usług",
  createFirstService: "Utwórz pierwszą usługę",
  editServiceTitle: "Edytuj profil usługi",
  editServiceSubtitle: "Zaktualizuj publiczny profil usługi sprzątania.",
  companyName: "Nazwa firmy",
  companyLogo: "Logo firmy",
  logoHelp: "JPG, PNG lub WEBP. Maksymalnie 5MB.",
  description: "Opis",
  city: "Miasto",
  phone: "Telefon",
  email: "Email",
  website: "Strona internetowa",
  hourlyRate: "Cena od SEK/godz.",
  minimumOrder: "Minimalne zamówienie (godziny)",
  rutAvailable: "RUT dostępny",
  languages: "Języki",
  serviceTypes: "Rodzaje usług",
  serviceAreas: "Obszary działania",
  saveChanges: "Zapisz zmiany",
  saving: "Zapisywanie...",
  contactInformation: "Informacje kontaktowe",
  serviceDetails: "Szczegóły usługi",
  minimumOrderHours: "Minimalne zamówienie",
  yes: "Tak",
  no: "Nie",
  allServices: "Wszystkie usługi",
  relatedServices: "Podobne usługi",
  backToServices: "Wszystkie usługi",
visitWebsite: "Odwiedź stronę",
call: "Zadzwoń",
priceFrom: "Cena od",

cityLabel: "Miasto",
websiteLabel: "Strona",

pending: "Oczekujące",

hours: "godzin",

serviceAreasTitle: "Obszary działania",
languagesTitle: "Języki",
servicesTitle: "Usługi",
},
companies: {
  pageTitle: "Firmy sprzątające w Sztokholmie",
  pageSubtitle:
    "Znajdź firmy sprzątające w Sztokholmie do sprzątania mieszkań, biur, przeprowadzek i regularnych usług.",
  badge: "Katalog firm sprzątających",
  browseByCity: "Przeglądaj według miasta",
  browseByCityText:
    "Znajdź firmy sprzątające w Sztokholmie i okolicznych gminach.",
  findJobs: "Znajdź pracę",
  addCompany: "Dodaj firmę",
  listedCompanies: "Firmy w katalogu",
  availableCompanies: "firm sprzątających dostępnych",
  verified: "Zweryfikowana",
  viewCompany: "Zobacz firmę",
  fallbackDescription: "Firma sprzątająca w katalogu Clean Jobs.",
  findServicesTitle: "Znajdź usługi sprzątające w Sztokholmie",
  findServicesText:
    "W Sztokholmie działa wiele firm sprzątających dla mieszkań, domów, biur i przeprowadzek.",
  areYouCompanyTitle: "Prowadzisz firmę sprzątającą?",
  areYouCompanyText:
    "Utwórz profil w Clean Jobs, aby klienci łatwiej mogli Cię znaleźć.",
  companyNotFound: "Nie znaleziono firmy",
  verifiedCompany: "Zweryfikowana firma",
  phone: "Telefon",
  email: "Email",
  website: "Strona",
  visitWebsite: "Odwiedź stronę",
  relatedCompanies: "Podobne firmy",
  findCleaningJobs: "Znajdź pracę przy sprzątaniu",
},
common: {
  back: "Powrót",
  backToDashboard: "Do panelu",
  save: "Zapisz",
  saving: "Zapisywanie...",
  delete: "Usuń",
  deleting: "Usuwanie...",
  edit: "Edytuj",
  open: "Otwórz",
  view: "Zobacz",
  cancel: "Anuluj",
  confirm: "Potwierdź",
  yes: "Tak",
  no: "Nie",
  pending: "Oczekuje",
  verified: "Zweryfikowano",
  loading: "Ładowanie...",
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
    .map((item) => item.split(";")[0]?.trim().toLowerCase())
    .filter((item): item is string => Boolean(item))

  for (const candidate of candidates) {
    if (isSupportedLocale(candidate)) return candidate

    const short = candidate.split("-")[0]
    if (short && isSupportedLocale(short)) return short
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
