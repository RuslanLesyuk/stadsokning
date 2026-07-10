"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import {
  initialCompanyClaimFormState,
  submitCompanyClaim,
} from "@/app/companies/[slug]/claim/actions"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"

type CompanyClaimFormProps = {
  companyId: string
  companySlug: string
  companyName: string
  locale: Locale
  defaultEmail: string
}

type Dictionary = {
  emailLabel: string
  emailPlaceholder: string
  emailHelp: string
  phoneLabel: string
  phonePlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  messageHelp: string
  submit: string
  submitting: string
  privacy: string
}

const dictionaries: Record<Locale, Dictionary> = {
  sv: {
    emailLabel: "Företagets e-postadress",
    emailPlaceholder: "kontakt@foretag.se",
    emailHelp:
      "Använd helst en e-postadress med företagets domän.",
    phoneLabel: "Företagets telefonnummer",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Din koppling till företaget",
    messagePlaceholder:
      "Beskriv din roll i företaget och hur vi kan verifiera att du representerar det.",
    messageHelp: "Minst 20 och högst 2 000 tecken.",
    submit: "Skicka begäran",
    submitting: "Skickar...",
    privacy:
      "Uppgifterna används endast för att granska din begäran.",
  },

  en: {
    emailLabel: "Business email",
    emailPlaceholder: "contact@company.com",
    emailHelp:
      "Preferably use an email address on the company domain.",
    phoneLabel: "Business phone",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Your connection to the company",
    messagePlaceholder:
      "Describe your role and how we can verify that you represent this company.",
    messageHelp: "Minimum 20 and maximum 2,000 characters.",
    submit: "Submit claim request",
    submitting: "Submitting...",
    privacy:
      "These details are used only to review your claim request.",
  },

  uk: {
    emailLabel: "Робоча електронна адреса",
    emailPlaceholder: "contact@company.se",
    emailHelp:
      "Бажано використовувати адресу на домені компанії.",
    phoneLabel: "Робочий номер телефону",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Ваш зв’язок із компанією",
    messagePlaceholder:
      "Опишіть свою роль і як ми можемо перевірити, що ви представляєте цю компанію.",
    messageHelp: "Від 20 до 2 000 символів.",
    submit: "Надіслати заявку",
    submitting: "Надсилання...",
    privacy:
      "Ці дані використовуються лише для перевірки заявки.",
  },

  ru: {
    emailLabel: "Рабочая электронная почта",
    emailPlaceholder: "contact@company.se",
    emailHelp:
      "Желательно использовать адрес на домене компании.",
    phoneLabel: "Рабочий номер телефона",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Ваша связь с компанией",
    messagePlaceholder:
      "Опишите свою роль и как мы можем проверить, что вы представляете эту компанию.",
    messageHelp: "От 20 до 2 000 символов.",
    submit: "Отправить заявку",
    submitting: "Отправка...",
    privacy:
      "Эти данные используются только для проверки заявки.",
  },

  pl: {
    emailLabel: "Firmowy adres e-mail",
    emailPlaceholder: "kontakt@firma.se",
    emailHelp:
      "Najlepiej użyć adresu w domenie firmowej.",
    phoneLabel: "Firmowy numer telefonu",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Twój związek z firmą",
    messagePlaceholder:
      "Opisz swoją rolę i sposób, w jaki możemy potwierdzić, że reprezentujesz tę firmę.",
    messageHelp: "Od 20 do 2 000 znaków.",
    submit: "Wyślij zgłoszenie",
    submitting: "Wysyłanie...",
    privacy:
      "Dane są używane wyłącznie do rozpatrzenia zgłoszenia.",
  },
}

function SubmitButton({
  dictionary,
}: {
  dictionary: Dictionary
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 animate-spin"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />

            <path
              d="M21 12a9 9 0 0 0-9-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {dictionary.submitting}
        </>
      ) : (
        dictionary.submit
      )}
    </button>
  )
}

export function CompanyClaimForm({
  companyId,
  companySlug,
  companyName,
  locale,
  defaultEmail,
}: CompanyClaimFormProps) {
  const dictionary = dictionaries[locale] ?? dictionaries.sv

  const [state, formAction] = useActionState(
    submitCompanyClaim,
    initialCompanyClaimFormState,
  )

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="companySlug" value={companySlug} />

      <div>
        <label
          htmlFor="businessEmail"
          className="mb-2 block text-sm font-bold text-slate-900"
        >
          {dictionary.emailLabel}
        </label>

        <input
          id="businessEmail"
          name="businessEmail"
          type="email"
          required
          defaultValue={defaultEmail}
          placeholder={dictionary.emailPlaceholder}
          aria-invalid={Boolean(state.fieldErrors?.businessEmail)}
          aria-describedby={
            state.fieldErrors?.businessEmail
              ? "business-email-error"
              : "business-email-help"
          }
          className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />

        {state.fieldErrors?.businessEmail ? (
          <p
            id="business-email-error"
            className="mt-2 text-sm font-medium text-red-600"
          >
            {state.fieldErrors.businessEmail}
          </p>
        ) : (
          <p
            id="business-email-help"
            className="mt-2 text-sm text-slate-500"
          >
            {dictionary.emailHelp}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="businessPhone"
          className="mb-2 block text-sm font-bold text-slate-900"
        >
          {dictionary.phoneLabel}
        </label>

        <input
          id="businessPhone"
          name="businessPhone"
          type="tel"
          required
          placeholder={dictionary.phonePlaceholder}
          aria-invalid={Boolean(state.fieldErrors?.businessPhone)}
          aria-describedby={
            state.fieldErrors?.businessPhone
              ? "business-phone-error"
              : undefined
          }
          className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />

        {state.fieldErrors?.businessPhone ? (
          <p
            id="business-phone-error"
            className="mt-2 text-sm font-medium text-red-600"
          >
            {state.fieldErrors.businessPhone}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-bold text-slate-900"
        >
          {dictionary.messageLabel}
        </label>

        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={7}
          placeholder={dictionary.messagePlaceholder}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={
            state.fieldErrors?.message
              ? "claim-message-error"
              : "claim-message-help"
          }
          className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />

        {state.fieldErrors?.message ? (
          <p
            id="claim-message-error"
            className="mt-2 text-sm font-medium text-red-600"
          >
            {state.fieldErrors.message}
          </p>
        ) : (
          <p
            id="claim-message-help"
            className="mt-2 text-sm text-slate-500"
          >
            {dictionary.messageHelp}
          </p>
        )}
      </div>

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {state.message}
        </div>
      ) : null}

      <div>
        <SubmitButton dictionary={dictionary} />

        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
          {dictionary.privacy}
        </p>
      </div>

      <p className="sr-only">{companyName}</p>
    </form>
  )
}