import { getStatusLabel } from "@/lib/utils"

export default function JobStatusBadge({
  status,
}: {
  status: string | null
}) {
  const map: Record<string, string> = {
    new: "bg-green-100 text-green-700",
    assigned: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-blue-100 text-blue-700",
    done: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  }

  const cls = map[status || "new"] || "bg-gray-100 text-gray-700"

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${cls}`}>
      {getStatusLabel(status)}
    </span>
  )
}