"use client"

import { useEffect, useMemo, useRef } from "react"

type MessageItem = {
  id: string
  content: string | null
  created_at: string
  sender_id: string
  sender_name: string
}

type Props = {
  currentUserId: string
  messages: MessageItem[]
}

function formatMessageTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return new Intl.DateTimeFormat("en-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default function ChatThreadClient({
  currentUserId,
  messages,
}: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const normalizedMessages = useMemo(() => {
    return messages.map((message) => {
      const isOwn = message.sender_id === currentUserId

      return {
        ...message,
        isOwn,
        senderLabel: isOwn ? "You" : message.sender_name || "Them",
      }
    })
  }, [currentUserId, messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [normalizedMessages])

  if (normalizedMessages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
        No messages yet. Start the conversation below.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="space-y-3">
        {normalizedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                message.isOwn
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-zinc-50 text-zinc-900"
              }`}
            >
              <div
                className={`mb-1 flex items-center justify-between gap-3 text-xs ${
                  message.isOwn ? "text-zinc-300" : "text-zinc-500"
                }`}
              >
                <span className="font-semibold">{message.senderLabel}</span>
                <span>{formatMessageTime(message.created_at)}</span>
              </div>

              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                {message.content?.trim() || ""}
              </p>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}