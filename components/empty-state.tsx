import Link from "next/link"

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  secondaryActionLabel?: string
  secondaryActionHref?: string
  icon?: React.ReactNode
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  secondaryActionLabel,
  secondaryActionHref,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-6 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-2xl">
          {icon ?? "✨"}
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
            {description}
          </p>
        ) : null}

        {(actionLabel && actionHref) || (secondaryActionLabel && secondaryActionHref) ? (
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            {actionLabel && actionHref ? (
              <Link
                href={actionHref}
                prefetch={false}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 sm:w-auto"
              >
                {actionLabel}
              </Link>
            ) : null}

            {secondaryActionLabel && secondaryActionHref ? (
              <Link
                href={secondaryActionHref}
                prefetch={false}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 sm:w-auto"
              >
                {secondaryActionLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}