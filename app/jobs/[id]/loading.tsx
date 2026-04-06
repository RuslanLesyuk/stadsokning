function SkeletonBlock({
  className = "",
}: {
  className?: string
}) {
  return <div className={`animate-pulse rounded-2xl bg-zinc-200/70 ${className}`} />
}

export default function JobDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="h-8 w-24 rounded-full" />
                <SkeletonBlock className="h-8 w-28 rounded-full" />
              </div>

              <SkeletonBlock className="h-9 w-2/3" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-11/12" />
              <SkeletonBlock className="h-4 w-4/5" />

              <div className="grid gap-3 pt-2 sm:grid-cols-2 xl:grid-cols-3">
                <SkeletonBlock className="h-20 w-full" />
                <SkeletonBlock className="h-20 w-full" />
                <SkeletonBlock className="h-20 w-full" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-32" />
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-2xl border border-zinc-100 p-3"
                >
                  <SkeletonBlock className="mt-1 h-3 w-3 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-40" />
                    <SkeletonBlock className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-28" />
              <SkeletonBlock className="h-11 w-full rounded-xl" />
              <SkeletonBlock className="h-11 w-full rounded-xl" />
              <SkeletonBlock className="h-11 w-32 rounded-xl" />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-3">
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}