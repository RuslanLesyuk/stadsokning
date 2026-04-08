"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import {
  sendMessageAction,
  type ChatActionState,
} from "@/app/jobs/[id]/chat/actions"
import {
  DEFAULT_LOCALE,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"
import FormSubmitButton from "@/components/form-submit-button"
import LocalizedActionToast from "@/components/localized-action-toast"

type ChatMessageFormProps = {
  jobId: string
  locale?: string
  readOnly?: boolean
  readOnlyTitle?: string
  readOnlyDescription?: string
}

const MAX_MESSAGE_LENGTH = 1000

const initialState: ChatActionState = {
  ok: false,
  error: null,
  success: null,
  resetToken: 0,
}

export default function ChatMessageForm({
  jobId,
  locale = DEFAULT_LOCALE,
  readOnly = false,
  readOnlyTitle,
  readOnlyDescription,
}: ChatMessageFormProps) {
  const resolvedLocale = normalizeLocale(locale)
  const dictionary = getDictionary(resolvedLocale)

  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [text, setText] = useState("")
  const [state, formAction] = useActionState(sendMessageAction, initialState)

  useEffect(() => {
    if (state.ok) {
      setText("")
      formRef.current?.reset()
      textareaRef.current?.focus()
    }
  }, [state.ok, state.resetToken])

  const trimmed = useMemo(() => text.trim(), [text])
  const isTooLong = text.length > MAX_MESSAGE_LENGTH
  const isDisabled = !trimmed || isTooLong || readOnly

  if (readOnly) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-5">
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-5">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 md:text-base">
            {readOnlyTitle || dictionary.chat.newMessage}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {readOnlyDescription ||
              (resolvedLocale === "uk"
                ? "Для цього замовлення нові повідомлення вимкнені. Історія чату збережена тільки для перегляду."
                : resolvedLocale === "ru"
                  ? "Для этого заказа новые сообщения отключены. История чата сохранена только для просмотра."
                  : resolvedLocale === "sv"
                    ? "Nya meddelanden är avstängda för det här jobbet. Chatthistoriken finns kvar endast för visning."
                    : resolvedLocale === "pl"
                      ? "Dla tego zlecenia nowe wiadomości są wyłączone. Historia czatu jest dostępna tylko do podglądu."
                      : "New messages are disabled for this job. The chat history remains available in read-only mode.")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <LocalizedActionToast
        locale={resolvedLocale}
        error={state.error}
        success={state.ok ? "1" : null}
        successKey="sent"
      />

      <form
        ref={formRef}
        action={formAction}
        className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-5"
        onSubmit={(event) => {
          if (isDisabled) {
            event.preventDefault()
          }
        }}
      >
        <input type="hidden" name="jobId" value={jobId} />

        <div className="space-y-3">
          <div>
            <label
              htmlFor="chat-message"
              className="mb-2 block text-sm font-medium text-slate-900"
            >
              {dictionary.chat.newMessage}
            </label>

            <textarea
              ref={textareaRef}
              id="chat-message"
              name="body"
              rows={4}
              maxLength={MAX_MESSAGE_LENGTH}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={dictionary.chat.placeholder}
              className="w-full resize-y rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 active:scale-[0.995]"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {text.length}/{MAX_MESSAGE_LENGTH} {dictionary.chat.maxLength}
            </p>

            <div
              className={
                isDisabled
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              aria-disabled={isDisabled}
            >
              <FormSubmitButton
                locale={resolvedLocale}
                idleLabel={dictionary.chat.send}
                loadingLabel={dictionary.chat.sending}
                className="h-11 px-5"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  )
}