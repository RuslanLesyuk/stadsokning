import type { BookingLocale } from "./types"

export type BookingCopy = {
  bookCleaning: string
  bookingFormTitle: string
  bookingFormText: string
  name: string
  email: string
  phone: string
  service: string
  chooseService: string
  address: string
  postalCode: string
  city: string
  frequency: string
  one_time: string
  weekly: string
  biweekly: string
  monthly: string
  date: string
  time: string
  duration: string
  hours: string
  rut: string
  notes: string
  notesPlaceholder: string
  submitBooking: string
  submittingBooking: string
  bookingSent: string
  bookingSentText: string
  bookingConfirmed: string
  bookingConfirmedText: string
  sendAnother: string
  validation: string
  unavailable: string
  outsideHours: string
  bookingDisabled: string
  tooSoon: string
  tooFar: string
  recurringDisabled: string
  genericError: string
  dashboardTitle: string
  companyDashboardTitle: string
  bookings: string
  companyBookings: string
  bookingSettings: string
  pending: string
  confirmed: string
  in_progress: string
  completed: string
  declined: string
  cancelled: string
  upcoming: string
  customer: string
  company: string
  status: string
  source: string
  price: string
  estimatedPrice: string
  agreedPrice: string
  payment: string
  details: string
  schedule: string
  occurrences: string
  timeline: string
  back: string
  open: string
  confirm: string
  decline: string
  cancel: string
  start: string
  complete: string
  cancellationReason: string
  savePrice: string
  noBookings: string
  noCompanyBookings: string
  settingsEnabled: string
  settingsRecurring: string
  settingsMinNotice: string
  settingsMaxDays: string
  settingsDuration: string
  settingsBuffer: string
  settingsAutoConfirm: string
  settingsTimezone: string
  saveSettings: string
  settingsSaved: string
  convertLead: string
  createFromLead: string
  source_company_profile: string
  source_company_site: string
  source_lead_conversion: string
  source_manual: string
  source_admin: string
}

export const bookingCopy: Record<BookingLocale, BookingCopy> = {
  sv: {
    bookCleaning: "Boka städning",
    bookingFormTitle: "Boka städning",
    bookingFormText: "Skicka en bokningsförfrågan med datum, tid och adress. Företaget bekräftar bokningen innan den blir definitiv.",
    name: "Namn", email: "E-post", phone: "Telefon", service: "Tjänst", chooseService: "Välj tjänst", address: "Adress", postalCode: "Postnummer", city: "Ort", frequency: "Frekvens",
    one_time: "Engångsbokning", weekly: "Varje vecka", biweekly: "Varannan vecka", monthly: "Varje månad", date: "Startdatum", time: "Önskad tid", duration: "Beräknad längd", hours: "timmar", rut: "Jag vill använda RUT-avdrag om tjänsten omfattas", notes: "Kommentar", notesPlaceholder: "Portkod, bostadens storlek eller annan information som företaget behöver.", submitBooking: "Skicka bokningsförfrågan", submittingBooking: "Skickar...", bookingSent: "Bokningsförfrågan skickad", bookingSentText: "Företaget har fått din bokningsförfrågan och kan nu bekräfta tiden.", bookingConfirmed: "Bokning bekräftad", bookingConfirmedText: "Bokningen bekräftades automatiskt och finns nu i ditt bokningsflöde.", sendAnother: "Skicka en ny bokning", validation: "Kontrollera de markerade fälten.", unavailable: "Den valda tiden är inte längre tillgänglig.", outsideHours: "Tiden ligger utanför företagets öppettider.", bookingDisabled: "Företaget tar inte emot onlinebokningar just nu.", tooSoon: "Bokningen ligger för nära i tiden.", tooFar: "Datumet ligger utanför företagets bokningshorisont.", recurringDisabled: "Företaget tar endast emot engångsbokningar online.", genericError: "Bokningen kunde inte skapas. Försök igen.",
    dashboardTitle: "Mina bokningar", companyDashboardTitle: "Företagsbokningar", bookings: "Bokningar", companyBookings: "Företagsbokningar", bookingSettings: "Bokningsinställningar", pending: "Väntar", confirmed: "Bekräftad", in_progress: "Pågår", completed: "Klar", declined: "Avböjd", cancelled: "Avbokad", upcoming: "Kommande", customer: "Kund", company: "Företag", status: "Status", source: "Källa", price: "Pris", estimatedPrice: "Beräknat pris", agreedPrice: "Överenskommet pris", payment: "Betalning", details: "Detaljer", schedule: "Schema", occurrences: "Tillfällen", timeline: "Aktivitet", back: "Tillbaka", open: "Öppna", confirm: "Bekräfta", decline: "Avböj", cancel: "Avboka", start: "Starta", complete: "Markera klar", cancellationReason: "Orsak", savePrice: "Spara pris", noBookings: "Du har inga bokningar ännu.", noCompanyBookings: "Företaget har inga bokningar ännu.", settingsEnabled: "Aktivera onlinebokning", settingsRecurring: "Tillåt återkommande bokningar", settingsMinNotice: "Minsta framförhållning, timmar", settingsMaxDays: "Hur långt fram kunder kan boka, dagar", settingsDuration: "Standardlängd, minuter", settingsBuffer: "Buffert mellan bekräftade bokningar, minuter", settingsAutoConfirm: "Bekräfta automatiskt om tiden är ledig", settingsTimezone: "Tidszon", saveSettings: "Spara inställningar", settingsSaved: "Inställningarna har sparats.", convertLead: "Skapa bokning", createFromLead: "Skapa bokning från lead", source_company_profile: "Företagsprofil", source_company_site: "Företagswebbplats", source_lead_conversion: "Lead-konvertering", source_manual: "Manuell", source_admin: "Admin",
  },
  en: {
    bookCleaning: "Book cleaning", bookingFormTitle: "Book cleaning", bookingFormText: "Send a booking request with date, time and address. The company confirms the booking before it becomes final.", name: "Name", email: "Email", phone: "Phone", service: "Service", chooseService: "Choose service", address: "Address", postalCode: "Postal code", city: "City", frequency: "Frequency", one_time: "One-time", weekly: "Every week", biweekly: "Every 2 weeks", monthly: "Every month", date: "Start date", time: "Preferred time", duration: "Estimated duration", hours: "hours", rut: "I want to use the RUT deduction if the service qualifies", notes: "Notes", notesPlaceholder: "Door code, property size or other information the company needs.", submitBooking: "Send booking request", submittingBooking: "Sending...", bookingSent: "Booking request sent", bookingSentText: "The company received your booking request and can now confirm the time.", bookingConfirmed: "Booking confirmed", bookingConfirmedText: "The booking was automatically confirmed and is now in your booking flow.", sendAnother: "Send another booking", validation: "Check the highlighted fields.", unavailable: "The selected time is no longer available.", outsideHours: "The selected time is outside the company's opening hours.", bookingDisabled: "The company is not accepting online bookings right now.", tooSoon: "The booking is too close in time.", tooFar: "The date is outside the company's booking horizon.", recurringDisabled: "The company currently accepts one-time bookings only.", genericError: "The booking could not be created. Please try again.", dashboardTitle: "My bookings", companyDashboardTitle: "Company bookings", bookings: "Bookings", companyBookings: "Company bookings", bookingSettings: "Booking settings", pending: "Pending", confirmed: "Confirmed", in_progress: "In progress", completed: "Completed", declined: "Declined", cancelled: "Cancelled", upcoming: "Upcoming", customer: "Customer", company: "Company", status: "Status", source: "Source", price: "Price", estimatedPrice: "Estimated price", agreedPrice: "Agreed price", payment: "Payment", details: "Details", schedule: "Schedule", occurrences: "Occurrences", timeline: "Activity", back: "Back", open: "Open", confirm: "Confirm", decline: "Decline", cancel: "Cancel", start: "Start", complete: "Complete", cancellationReason: "Reason", savePrice: "Save price", noBookings: "You do not have any bookings yet.", noCompanyBookings: "The company does not have any bookings yet.", settingsEnabled: "Enable online booking", settingsRecurring: "Allow recurring bookings", settingsMinNotice: "Minimum notice, hours", settingsMaxDays: "How far ahead customers can book, days", settingsDuration: "Default duration, minutes", settingsBuffer: "Buffer between confirmed bookings, minutes", settingsAutoConfirm: "Auto-confirm when the time is free", settingsTimezone: "Timezone", saveSettings: "Save settings", settingsSaved: "Settings saved.", convertLead: "Create booking", createFromLead: "Create booking from lead", source_company_profile: "Company profile", source_company_site: "Company website", source_lead_conversion: "Lead conversion", source_manual: "Manual", source_admin: "Admin",
  },
  uk: {
    bookCleaning: "Забронювати прибирання", bookingFormTitle: "Забронювати прибирання", bookingFormText: "Надішліть запит із датою, часом та адресою. Компанія підтвердить бронювання перед остаточним погодженням.", name: "Ім’я", email: "Email", phone: "Телефон", service: "Послуга", chooseService: "Оберіть послугу", address: "Адреса", postalCode: "Поштовий індекс", city: "Місто", frequency: "Повторення", one_time: "Одноразово", weekly: "Щотижня", biweekly: "Кожні 2 тижні", monthly: "Щомісяця", date: "Дата початку", time: "Бажаний час", duration: "Орієнтовна тривалість", hours: "год", rut: "Хочу використати RUT-avdrag, якщо послуга підпадає під нього", notes: "Коментар", notesPlaceholder: "Код дверей, площа житла або інша інформація для компанії.", submitBooking: "Надіслати запит на бронювання", submittingBooking: "Надсилання...", bookingSent: "Запит на бронювання надіслано", bookingSentText: "Компанія отримала запит і тепер може підтвердити час.", bookingConfirmed: "Бронювання підтверджено", bookingConfirmedText: "Бронювання підтверджено автоматично й додано до ваших бронювань.", sendAnother: "Створити ще одне бронювання", validation: "Перевірте виділені поля.", unavailable: "Обраний час уже недоступний.", outsideHours: "Обраний час поза графіком роботи компанії.", bookingDisabled: "Компанія зараз не приймає онлайн-бронювання.", tooSoon: "До бронювання залишилося замало часу.", tooFar: "Дата виходить за доступний період бронювання.", recurringDisabled: "Компанія зараз приймає лише одноразові онлайн-бронювання.", genericError: "Не вдалося створити бронювання. Спробуйте ще раз.", dashboardTitle: "Мої бронювання", companyDashboardTitle: "Бронювання компанії", bookings: "Бронювання", companyBookings: "Бронювання компанії", bookingSettings: "Налаштування бронювань", pending: "Очікує", confirmed: "Підтверджено", in_progress: "В процесі", completed: "Завершено", declined: "Відхилено", cancelled: "Скасовано", upcoming: "Майбутні", customer: "Клієнт", company: "Компанія", status: "Статус", source: "Джерело", price: "Ціна", estimatedPrice: "Орієнтовна ціна", agreedPrice: "Погоджена ціна", payment: "Оплата", details: "Деталі", schedule: "Розклад", occurrences: "Прибирання", timeline: "Активність", back: "Назад", open: "Відкрити", confirm: "Підтвердити", decline: "Відхилити", cancel: "Скасувати", start: "Почати", complete: "Завершити", cancellationReason: "Причина", savePrice: "Зберегти ціну", noBookings: "У вас ще немає бронювань.", noCompanyBookings: "У компанії ще немає бронювань.", settingsEnabled: "Увімкнути онлайн-бронювання", settingsRecurring: "Дозволити регулярні бронювання", settingsMinNotice: "Мінімальний час до бронювання, годин", settingsMaxDays: "На скільки днів наперед можна бронювати", settingsDuration: "Стандартна тривалість, хвилин", settingsBuffer: "Буфер між підтвердженими бронюваннями, хвилин", settingsAutoConfirm: "Автоматично підтверджувати вільний час", settingsTimezone: "Часовий пояс", saveSettings: "Зберегти налаштування", settingsSaved: "Налаштування збережено.", convertLead: "Створити бронювання", createFromLead: "Створити бронювання з ліда", source_company_profile: "Профіль компанії", source_company_site: "Сайт компанії", source_lead_conversion: "Конверсія ліда", source_manual: "Вручну", source_admin: "Адмін",
  },
  ru: {
    bookCleaning: "Забронировать уборку", bookingFormTitle: "Забронировать уборку", bookingFormText: "Отправьте запрос с датой, временем и адресом. Компания подтвердит бронирование до окончательного согласования.", name: "Имя", email: "Email", phone: "Телефон", service: "Услуга", chooseService: "Выберите услугу", address: "Адрес", postalCode: "Почтовый индекс", city: "Город", frequency: "Повторение", one_time: "Одноразово", weekly: "Еженедельно", biweekly: "Каждые 2 недели", monthly: "Ежемесячно", date: "Дата начала", time: "Желаемое время", duration: "Ориентировочная длительность", hours: "ч", rut: "Хочу использовать RUT-avdrag, если услуга подходит", notes: "Комментарий", notesPlaceholder: "Код двери, площадь жилья или другая информация для компании.", submitBooking: "Отправить запрос на бронирование", submittingBooking: "Отправка...", bookingSent: "Запрос на бронирование отправлен", bookingSentText: "Компания получила запрос и теперь может подтвердить время.", bookingConfirmed: "Бронирование подтверждено", bookingConfirmedText: "Бронирование подтверждено автоматически и добавлено в ваши бронирования.", sendAnother: "Создать еще одно бронирование", validation: "Проверьте выделенные поля.", unavailable: "Выбранное время уже недоступно.", outsideHours: "Выбранное время вне графика работы компании.", bookingDisabled: "Компания сейчас не принимает онлайн-бронирования.", tooSoon: "До бронирования осталось слишком мало времени.", tooFar: "Дата выходит за доступный период бронирования.", recurringDisabled: "Компания сейчас принимает только одноразовые онлайн-бронирования.", genericError: "Не удалось создать бронирование. Попробуйте еще раз.", dashboardTitle: "Мои бронирования", companyDashboardTitle: "Бронирования компании", bookings: "Бронирования", companyBookings: "Бронирования компании", bookingSettings: "Настройки бронирований", pending: "Ожидает", confirmed: "Подтверждено", in_progress: "В процессе", completed: "Завершено", declined: "Отклонено", cancelled: "Отменено", upcoming: "Предстоящие", customer: "Клиент", company: "Компания", status: "Статус", source: "Источник", price: "Цена", estimatedPrice: "Ориентировочная цена", agreedPrice: "Согласованная цена", payment: "Оплата", details: "Детали", schedule: "Расписание", occurrences: "Уборки", timeline: "Активность", back: "Назад", open: "Открыть", confirm: "Подтвердить", decline: "Отклонить", cancel: "Отменить", start: "Начать", complete: "Завершить", cancellationReason: "Причина", savePrice: "Сохранить цену", noBookings: "У вас пока нет бронирований.", noCompanyBookings: "У компании пока нет бронирований.", settingsEnabled: "Включить онлайн-бронирование", settingsRecurring: "Разрешить регулярные бронирования", settingsMinNotice: "Минимальное время до бронирования, часов", settingsMaxDays: "На сколько дней вперед можно бронировать", settingsDuration: "Стандартная длительность, минут", settingsBuffer: "Буфер между подтвержденными бронированиями, минут", settingsAutoConfirm: "Автоматически подтверждать свободное время", settingsTimezone: "Часовой пояс", saveSettings: "Сохранить настройки", settingsSaved: "Настройки сохранены.", convertLead: "Создать бронирование", createFromLead: "Создать бронирование из лида", source_company_profile: "Профиль компании", source_company_site: "Сайт компании", source_lead_conversion: "Конверсия лида", source_manual: "Вручную", source_admin: "Админ",
  },
  pl: {
    bookCleaning: "Zarezerwuj sprzątanie", bookingFormTitle: "Zarezerwuj sprzątanie", bookingFormText: "Wyślij prośbę o rezerwację z datą, godziną i adresem. Firma potwierdzi termin przed ostateczną rezerwacją.", name: "Imię", email: "Email", phone: "Telefon", service: "Usługa", chooseService: "Wybierz usługę", address: "Adres", postalCode: "Kod pocztowy", city: "Miasto", frequency: "Częstotliwość", one_time: "Jednorazowo", weekly: "Co tydzień", biweekly: "Co 2 tygodnie", monthly: "Co miesiąc", date: "Data rozpoczęcia", time: "Preferowana godzina", duration: "Szacowany czas", hours: "godz.", rut: "Chcę skorzystać z ulgi RUT, jeśli usługa się kwalifikuje", notes: "Uwagi", notesPlaceholder: "Kod do drzwi, metraż lub inne informacje potrzebne firmie.", submitBooking: "Wyślij prośbę o rezerwację", submittingBooking: "Wysyłanie...", bookingSent: "Prośba o rezerwację wysłana", bookingSentText: "Firma otrzymała prośbę i może teraz potwierdzić termin.", bookingConfirmed: "Rezerwacja potwierdzona", bookingConfirmedText: "Rezerwacja została automatycznie potwierdzona i dodana do Twoich rezerwacji.", sendAnother: "Utwórz kolejną rezerwację", validation: "Sprawdź zaznaczone pola.", unavailable: "Wybrany termin nie jest już dostępny.", outsideHours: "Wybrana godzina jest poza godzinami pracy firmy.", bookingDisabled: "Firma obecnie nie przyjmuje rezerwacji online.", tooSoon: "Do rezerwacji pozostało zbyt mało czasu.", tooFar: "Data wykracza poza dostępny okres rezerwacji.", recurringDisabled: "Firma obecnie przyjmuje tylko rezerwacje jednorazowe.", genericError: "Nie udało się utworzyć rezerwacji. Spróbuj ponownie.", dashboardTitle: "Moje rezerwacje", companyDashboardTitle: "Rezerwacje firmy", bookings: "Rezerwacje", companyBookings: "Rezerwacje firmy", bookingSettings: "Ustawienia rezerwacji", pending: "Oczekuje", confirmed: "Potwierdzona", in_progress: "W trakcie", completed: "Zakończona", declined: "Odrzucona", cancelled: "Anulowana", upcoming: "Nadchodzące", customer: "Klient", company: "Firma", status: "Status", source: "Źródło", price: "Cena", estimatedPrice: "Szacowana cena", agreedPrice: "Uzgodniona cena", payment: "Płatność", details: "Szczegóły", schedule: "Harmonogram", occurrences: "Terminy", timeline: "Aktywność", back: "Wstecz", open: "Otwórz", confirm: "Potwierdź", decline: "Odrzuć", cancel: "Anuluj", start: "Rozpocznij", complete: "Zakończ", cancellationReason: "Powód", savePrice: "Zapisz cenę", noBookings: "Nie masz jeszcze rezerwacji.", noCompanyBookings: "Firma nie ma jeszcze rezerwacji.", settingsEnabled: "Włącz rezerwacje online", settingsRecurring: "Zezwalaj na rezerwacje cykliczne", settingsMinNotice: "Minimalne wyprzedzenie, godziny", settingsMaxDays: "Ile dni naprzód można rezerwować", settingsDuration: "Domyślny czas, minuty", settingsBuffer: "Bufor między potwierdzonymi rezerwacjami, minuty", settingsAutoConfirm: "Automatycznie potwierdzaj wolny termin", settingsTimezone: "Strefa czasowa", saveSettings: "Zapisz ustawienia", settingsSaved: "Ustawienia zapisane.", convertLead: "Utwórz rezerwację", createFromLead: "Utwórz rezerwację z leada", source_company_profile: "Profil firmy", source_company_site: "Strona firmy", source_lead_conversion: "Konwersja leada", source_manual: "Ręcznie", source_admin: "Admin",
  },
}
