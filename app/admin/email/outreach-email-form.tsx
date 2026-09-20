"use client"

import { useActionState, useEffect, useMemo, useState } from "react"

import {
  sendManualOutreachAction,
  type ManualOutreachState,
} from "@/app/admin/email/actions"

const DEFAULT_SUBJECT = "Få fler städuppdrag med Clean Jobs"

const DEFAULT_MESSAGE = `Hej!

Jag såg er annons om städning och vill därför tipsa om Clean Jobs.

Clean Jobs är en svensk plattform där privatpersoner och företag kan publicera städuppdrag och hitta städföretag i hela Sverige.

Ni kan registrera ert företag kostnadsfritt och synas för kunder som aktivt söker städtjänster.

Läs mer på https://cleansjob.com

Vänliga hälsningar,
Clean Jobs`

function formatDate(value?: string | null) {
  if (!value) return "—"

  try {
    return new Intl.DateTimeFormat("sv-SE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

const INITIAL_STATE: ManualOutreachState = {
  status: "idle",
  message: "",
}

export default function OutreachEmailForm() {
  const [state, formAction, pending] = useActionState(
    sendManualOutreachAction,
    INITIAL_STATE,
  )

  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState(DEFAULT_SUBJECT)
  const [message, setMessage] = useState(DEFAULT_MESSAGE)

  useEffect(() => {
    if (state.status === "success") {
      setEmail("")
    }
  }, [state.status, state.message])

  const previewParagraphs = useMemo(
    () => message.split(/\n{2,}/).filter(Boolean),
    [message],
  )

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
      <form
        action={formAction}
        className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-7"
      >
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">To *</span>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="info@stadfirma.se"
              autoComplete="email"
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Subject *</span>
            <input
              type="text"
              name="subject"
              required
              maxLength={180}
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Message *</span>
            <textarea
              name="message"
              required
              minLength={20}
              maxLength={8000}
              rows={15}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setSubject(DEFAULT_SUBJECT)
                setMessage(DEFAULT_MESSAGE)
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Reset template
            </button>

            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send email"}
            </button>
          </div>

          {state.status === "duplicate" ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <div className="font-bold">⚠️ Already contacted</div>
              <p className="mt-1">{state.message}</p>
              <div className="mt-3 text-xs leading-5 text-amber-800">
                Last send: {formatDate(state.previousSentAt)}
                <br />
                {state.previousSubject || "Previous Clean Jobs email"}
                {state.previousSource === "company_invite" ? " · company invite" : ""}
              </div>

              <button
                type="submit"
                name="forceSend"
                value="true"
                disabled={pending}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-amber-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-800 disabled:opacity-60"
              >
                Send anyway
              </button>
            </div>
          ) : null}

          {state.status === "success" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              ✅ {state.message}
            </div>
          ) : null}

          {state.status === "error" ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {state.message}
            </div>
          ) : null}
        </div>
      </form>

      <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-6">
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Preview
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-rose-200 bg-rose-50 px-6 py-5">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-rose-700">
              Clean Jobs
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Sveriges marknadsplats för städtjänster
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="mb-5 border-b border-slate-100 pb-4">
              <div className="text-xs font-semibold uppercase text-slate-400">Subject</div>
              <div className="mt-1 text-sm font-bold text-slate-900">
                {subject || "—"}
              </div>
            </div>

            <div className="space-y-4 text-sm leading-6 text-slate-700">
              {previewParagraphs.length > 0 ? (
                previewParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 20)}-${index}`} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-slate-400">Your message preview will appear here.</p>
              )}
            </div>

            <div className="mt-7 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
              The real email automatically includes the Clean Jobs unsubscribe link and support contact.
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
