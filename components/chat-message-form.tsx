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
  const isDisabled = !trimmed || text.length > MAX_MESSAGE_LENGTH

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
        className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
      >
        <input type="hidden" name="jobId" value={jobId} />

        <div className="space-y-3">
          <div>
            <label
              htmlFor="chat-message"
              className="mb-2 block text-sm font-medium text-black"
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
              className="w-full resize-y rounded-xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/30"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-black/50">
              {text.length}/{MAX_MESSAGE_LENGTH} {dictionary.chat.maxLength}
            </p>

            <FormSubmitButton
              locale={resolvedLocale}
              idleLabel={dictionary.chat.send}
              loadingLabel={dictionary.chat.sending}
              className="h-11 px-5"
            />
          </div>
        </div>
      </form>
    </>
  )
}