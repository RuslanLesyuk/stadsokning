import PageSkeleton from "@/components/page-skeleton"

export default function Loading() {
  return (
    <PageSkeleton
      title="Loading dashboard..."
      description="Preparing your created and taken jobs."
      cards={4}
    />
  )
}