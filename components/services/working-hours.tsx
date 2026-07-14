type WorkingHours = {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

type WorkingHoursProps = {
  hours: WorkingHours | null | undefined
  labels: {
    title: string
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
    closed: string
  }
}

const days: Array<{
  key: keyof WorkingHours
  label: keyof WorkingHoursProps["labels"]
}> = [
  { key: "monday", label: "monday" },
  { key: "tuesday", label: "tuesday" },
  { key: "wednesday", label: "wednesday" },
  { key: "thursday", label: "thursday" },
  { key: "friday", label: "friday" },
  { key: "saturday", label: "saturday" },
  { key: "sunday", label: "sunday" },
]

export default function WorkingHours({
  hours,
  labels,
}: WorkingHoursProps) {
  if (!hours) {
    return null
  }

  const hasHours = days.some((day) => {
    const value = hours[day.key]
    return typeof value === "string" && value.trim().length > 0
  })

  if (!hasHours) {
    return null
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-slate-950">
        {labels.title}
      </h2>

      <div className="mt-6 divide-y divide-slate-100">
        {days.map((day) => {
          const value = hours[day.key]?.trim()

          return (
            <div
              key={day.key}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="font-medium text-slate-700">
                {labels[day.label]}
              </span>

              <span className="text-slate-600">
                {value || labels.closed}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}