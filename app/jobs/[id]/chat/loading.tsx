function SkeletonBlock({
  className = "",
}: {
  className?: string
}) {
  return <div className={`animate-pulse rounded-2xl bg-zinc-200/70 ${className}`} />
}

export default function JobChatLoading() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-3">
          <SkeletonBlock className="h-7 w-56" />
          <SkeletonBlock className="h-4 w-72 max-w-full" />
        </div>
      </div>

      <div className="flex-1 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => {
            const mine = index % 2 === 0

            return (
              <div
                key={index}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] space-y-2 sm:max-w-[70%] ${
                    mine ? "items-end" : "items-start"
                  }`}
                >
                  <SkeletonBlock
                    className={`h-4 ${mine ? "ml-auto w-20" : "w-24"}`}
                  />
                  <SkeletonBlock
                    className={`h-20 ${
                      mine ? "w-56 rounded-[22px_22px_8px_22px]" : "w-64 rounded-[22px_22px_22px_8px]"
                    }`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-end gap-3">
          <SkeletonBlock className="h-12 flex-1 rounded-2xl" />
          <SkeletonBlock className="h-12 w-28 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}