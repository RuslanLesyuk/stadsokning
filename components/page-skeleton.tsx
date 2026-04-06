type PageSkeletonProps = {
  title?: string
  description?: string
  cards?: number
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-zinc-200/70 ${className}`} />
}

export default function PageSkeleton({
  title = "Loading...",
  description = "Please wait while we load the page.",
  cards = 3,
}: PageSkeletonProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <section className="mb-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div>
            <div className="mb-3">
              <SkeletonBlock className="h-4 w-24" />
            </div>
            <div className="mb-3">
              <SkeletonBlock className="h-10 w-72 max-w-full" />
            </div>
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-full max-w-2xl" />
              <SkeletonBlock className="h-4 w-full max-w-xl" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <SkeletonBlock className="h-11 w-32" />
              <SkeletonBlock className="h-11 w-36" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <SkeletonBlock className="h-28 w-full" />
            <SkeletonBlock className="h-28 w-full" />
            <SkeletonBlock className="h-28 w-full" />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-12">
          <SkeletonBlock className="h-11 lg:col-span-4" />
          <SkeletonBlock className="h-11 lg:col-span-2" />
          <SkeletonBlock className="h-11 lg:col-span-2" />
          <SkeletonBlock className="h-11 lg:col-span-2" />
          <SkeletonBlock className="h-11 lg:col-span-2" />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex gap-2">
                <SkeletonBlock className="h-6 w-20 rounded-full" />
                <SkeletonBlock className="h-6 w-24 rounded-full" />
              </div>

              <SkeletonBlock className="h-7 w-3/4" />
              <div className="mt-3 space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>

              <div className="mt-5 grid gap-3">
                <SkeletonBlock className="h-20 w-full" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <SkeletonBlock className="h-20 w-full" />
                  <SkeletonBlock className="h-20 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}