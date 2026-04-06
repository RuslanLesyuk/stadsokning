import PageSkeleton from "@/components/page-skeleton"

export default function Loading() {
  return (
    <PageSkeleton
      title="Loading jobs..."
      description="Fetching marketplace listings and filters."
      cards={6}
    />
  )
}