import PageSkeleton from "@/components/page-skeleton"

export default function Loading() {
  return (
    <PageSkeleton
      title="Loading edit form..."
      description="Preparing the job editing form."
      cards={2}
    />
  )
}