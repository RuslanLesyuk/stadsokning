import PageSkeleton from "@/components/page-skeleton"

export default function Loading() {
  return (
    <PageSkeleton
      title="Loading job details..."
      description="Preparing the full job information."
      cards={2}
    />
  )
}