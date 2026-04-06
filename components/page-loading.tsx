type PageLoadingProps = {
  title?: boolean
  subtitle?: boolean
  cards?: number
  withSidebar?: boolean
  compact?: boolean
}

function SkeletonBlock({
  className = "",
}: {
  className?: string
}) {
  return <div className={`animate-pulse rounded-2xl bg-zinc-200/70 ${className}`} />
}

export default function PageLoading({
  title = true,
  subtitle = true,
  cards = 3,
  withSidebar = false,
  compact = false,
}: PageLoadingProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {(title || subtitle) && (
          <div className="space-y-3">
            {title && <SkeletonBlock className="h-8 w-48 sm:h-9 sm:w-64" />}
            {subtitle && <SkeletonBlock className="h-4 w-full max-w-xl" />}
          </div>
        )}

        {withSidebar ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {Array.from({ length: cards }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="space-y-4">
                    <SkeletonBlock className="h-6 w-2/3" />
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-5/6" />

                    <div className="flex flex-wrap gap-2 pt-1">
                      <SkeletonBlock className="h-8 w-24 rounded-full" />
                      <SkeletonBlock className="h-8 w-28 rounded-full" />
                      <SkeletonBlock className="h-8 w-20 rounded-full" />
                    </div>

                    {!compact && (
                      <div className="grid gap-3 pt-2 sm:grid-cols-3">
                        <SkeletonBlock className="h-16 w-full" />
                        <SkeletonBlock className="h-16 w-full" />
                        <SkeletonBlock className="h-16 w-full" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="space-y-4">
                  <SkeletonBlock className="h-5 w-32" />
                  <SkeletonBlock className="h-10 w-full" />
                  <SkeletonBlock className="h-10 w-full" />
                  <SkeletonBlock className="h-10 w-full" />
                  <SkeletonBlock className="h-10 w-28" />
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="space-y-3">
                  <SkeletonBlock className="h-5 w-24" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-5/6" />
                  <SkeletonBlock className="h-4 w-2/3" />
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from({ length: cards }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-3">
                      <SkeletonBlock className="h-6 w-2/3" />
                      <SkeletonBlock className="h-4 w-full" />
                      <SkeletonBlock className="h-4 w-4/5" />
                    </div>
                    <SkeletonBlock className="h-10 w-24 shrink-0 rounded-xl" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <SkeletonBlock className="h-8 w-24 rounded-full" />
                    <SkeletonBlock className="h-8 w-32 rounded-full" />
                    <SkeletonBlock className="h-8 w-20 rounded-full" />
                  </div>

                  {!compact && (
                    <div className="grid gap-3 pt-1 sm:grid-cols-3">
                      <SkeletonBlock className="h-16 w-full" />
                      <SkeletonBlock className="h-16 w-full" />
                      <SkeletonBlock className="h-16 w-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}