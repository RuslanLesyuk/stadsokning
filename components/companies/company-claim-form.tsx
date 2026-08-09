"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import {
  submitCompanyClaim,
  type CompanyClaimFormState,
} from "@/app/companies/[slug]/claim/actions"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"

type CompanyClaimFormProps = {
  companyId: string
  companySlug: string
  companyName: string
  locale: Locale
  defaultEmail: string
  defaultPhone?: string
  defaultMessage?: string
  claimId?: string
  existingEvidenceCount?: number
  mode?: "new" | "resubmit"
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
  evidenceLabel: string
  evidenceHelp: string
  evidenceExisting: string
  submit: string
  resubmit: string
  submitting: string
  privacy: string
}

const dictionaries: Record<Locale, Dictionary> = {
  sv: {
    emailLabel: "Företagets e-postadress",
    emailPlaceholder: "kontakt@foretag.se",
    emailHelp: "Använd helst en e-postadress med företagets domän.",
    phoneLabel: "Företagets telefonnummer",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Din koppling till företaget",
    messagePlaceholder:
      "Beskriv din roll i företaget och hur vi kan verifiera att du representerar det.",
    messageHelp: "Minst 20 och högst 2 000 tecken.",
    evidenceLabel: "Verifieringsunderlag",
    evidenceHelp:
      "Valfritt men rekommenderat. Bifoga upp till 5 PDF-, JPG-, PNG- eller WebP-filer, max 8 MB per fil. Exempel: registreringsbevis, arbetsgivarintyg eller annan dokumentation som visar din koppling till företaget.",
    evidenceExisting: "Redan bifogade filer",
    submit: "Skicka begäran",
    resubmit: "Skicka komplettering",
    submitting: "Skickar...",
    privacy:
      "Uppgifterna och dokumenten används endast för att granska din begäran.",
  },
  en: {
    emailLabel: "Business email",
    emailPlaceholder: "contact@company.com",
    emailHelp: "Preferably use an email address on the company domain.",
    phoneLabel: "Business phone",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Your connection to the company",
    messagePlaceholder:
      "Describe your role and how we can verify that you represent this company.",
    messageHelp: "Minimum 20 and maximum 2,000 characters.",
    evidenceLabel: "Verification evidence",
    evidenceHelp:
      "Optional but recommended. Attach up to 5 PDF, JPG, PNG or WebP files, maximum 8 MB each. For example: company registration, employment documentation or other proof of your connection to the company.",
    evidenceExisting: "Files already attached",
    submit: "Submit claim request",
    resubmit: "Submit additional information",
    submitting: "Submitting...",
    privacy:
      "These details and documents are used only to review your claim request.",
  },
  uk: {
    emailLabel: "Робоча електронна адреса",
    emailPlaceholder: "contact@company.se",
    emailHelp: "Бажано використовувати адресу на домені компанії.",
    phoneLabel: "Робочий номер телефону",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Ваш зв’язок із компанією",
    messagePlaceholder:
      "Опишіть свою роль і як ми можемо перевірити, що ви представляєте цю компанію.",
    messageHelp: "Від 20 до 2 000 символів.",
    evidenceLabel: "Документи для підтвердження",
    evidenceHelp:
      "Необов’язково, але рекомендовано. До 5 файлів PDF, JPG, PNG або WebP, максимум 8 МБ кожен. Наприклад: реєстраційні документи компанії, підтвердження працевлаштування або інший доказ зв’язку з компанією.",
    evidenceExisting: "Уже додані файли",
    submit: "Надіслати заявку",
    resubmit: "Надіслати доповнення",
    submitting: "Надсилання...",
    privacy:
      "Ці дані та документи використовуються лише для перевірки заявки.",
  },
  ru: {
    emailLabel: "Рабочая электронная почта",
    emailPlaceholder: "contact@company.se",
    emailHelp: "Желательно использовать адрес на домене компании.",
    phoneLabel: "Рабочий номер телефона",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Ваша связь с компанией",
    messagePlaceholder:
      "Опишите свою роль и как мы можем проверить, что вы представляете эту компанию.",
    messageHelp: "От 20 до 2 000 символов.",
    evidenceLabel: "Документы для подтверждения",
    evidenceHelp:
      "Необязательно, но рекомендуется. До 5 файлов PDF, JPG, PNG или WebP, максимум 8 МБ каждый. Например: регистрационные документы, подтверждение трудоустройства или другой документ, подтверждающий связь с компанией.",
    evidenceExisting: "Уже прикрепленные файлы",
    submit: "Отправить заявку",
    resubmit: "Отправить дополнение",
    submitting: "Отправка...",
    privacy:
      "Эти данные и документы используются только для проверки заявки.",
  },
  pl: {
    emailLabel: "Firmowy adres e-mail",
    emailPlaceholder: "kontakt@firma.se",
    emailHelp: "Najlepiej użyć adresu w domenie firmowej.",
    phoneLabel: "Firmowy numer telefonu",
    phonePlaceholder: "+46 70 123 45 67",
    messageLabel: "Twój związek z firmą",
    messagePlaceholder:
      "Opisz swoją rolę i sposób, w jaki możemy potwierdzić, że reprezentujesz tę firmę.",
    messageHelp: "Od 20 do 2 000 znaków.",
    evidenceLabel: "Dokumenty weryfikacyjne",
    evidenceHelp:
      "Opcjonalne, ale zalecane. Do 5 plików PDF, JPG, PNG lub WebP, maksymalnie 8 MB każdy. Na przykład: dokument rejestracyjny firmy, dokument potwierdzający zatrudnienie lub inny dowód związku z firmą.",
    evidenceExisting: "Już załączone pliki",
    submit: "Wyślij zgłoszenie",
    resubmit: "Wyślij uzupełnienie",
    submitting: "Wysyłanie...",
    privacy:
      "Dane i dokumenty są używane wyłącznie do rozpatrzenia zgłoszenia.",
  },
}

const initialState: CompanyClaimFormState = {
  status: "idle",
  message: "",
}

function SubmitButton({
  dictionary,
  mode,
}: {
  dictionary: Dictionary
  mode: "new" | "resubmit"
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
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 animate-spin">
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
      ) : mode === "resubmit" ? (
        dictionary.resubmit
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
  defaultPhone = "",
  defaultMessage = "",
  claimId,
  existingEvidenceCount = 0,
  mode = "new",
}: CompanyClaimFormProps) {
  const dictionary = dictionaries[locale] ?? dictionaries.sv
  const [state, formAction] = useActionState(submitCompanyClaim, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="companySlug" value={companySlug} />
      <input type="hidden" name="locale" value={locale} />
      {claimId ? <input type="hidden" name="claimId" value={claimId} /> : null}

      <div>
        <label htmlFor="businessEmail" className="mb-2 block text-sm font-bold text-slate-900">
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
            state.fieldErrors?.businessEmail ? "business-email-error" : "business-email-help"
          }
          className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
        {state.fieldErrors?.businessEmail ? (
          <p id="business-email-error" className="mt-2 text-sm font-medium text-red-600">
            {state.fieldErrors.businessEmail}
          </p>
        ) : (
          <p id="business-email-help" className="mt-2 text-sm text-slate-500">
            {dictionary.emailHelp}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="businessPhone" className="mb-2 block text-sm font-bold text-slate-900">
          {dictionary.phoneLabel}
        </label>
        <input
          id="businessPhone"
          name="businessPhone"
          type="tel"
          required
          defaultValue={defaultPhone}
          placeholder={dictionary.phonePlaceholder}
          aria-invalid={Boolean(state.fieldErrors?.businessPhone)}
          aria-describedby={state.fieldErrors?.businessPhone ? "business-phone-error" : undefined}
          className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
        {state.fieldErrors?.businessPhone ? (
          <p id="business-phone-error" className="mt-2 text-sm font-medium text-red-600">
            {state.fieldErrors.businessPhone}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-bold text-slate-900">
          {dictionary.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={7}
          defaultValue={defaultMessage}
          placeholder={dictionary.messagePlaceholder}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={
            state.fieldErrors?.message ? "claim-message-error" : "claim-message-help"
          }
          className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
        {state.fieldErrors?.message ? (
          <p id="claim-message-error" className="mt-2 text-sm font-medium text-red-600">
            {state.fieldErrors.message}
          </p>
        ) : (
          <p id="claim-message-help" className="mt-2 text-sm text-slate-500">
            {dictionary.messageHelp}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="evidence" className="mb-2 block text-sm font-bold text-slate-900">
          {dictionary.evidenceLabel}
        </label>
        <input
          id="evidence"
          name="evidence"
          type="file"
          multiple
          accept="application/pdf,image/jpeg,image/png,image/webp"
          aria-invalid={Boolean(state.fieldErrors?.evidence)}
          className="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-bold file:text-slate-800 hover:file:bg-emerald-50"
        />

        {existingEvidenceCount > 0 ? (
          <p className="mt-2 text-sm font-semibold text-emerald-700">
            {dictionary.evidenceExisting}: {existingEvidenceCount}/5
          </p>
        ) : null}

        {state.fieldErrors?.evidence ? (
          <p className="mt-2 text-sm font-medium text-red-600">{state.fieldErrors.evidence}</p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-slate-500">{dictionary.evidenceHelp}</p>
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
        <SubmitButton dictionary={dictionary} mode={mode} />
        <p className="mt-3 text-center text-xs leading-5 text-slate-500">{dictionary.privacy}</p>
      </div>

      <p className="sr-only">{companyName}</p>
    </form>
  )
}
