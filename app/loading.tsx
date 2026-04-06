import PageSkeleton from "@/components/page-skeleton"

export default function Loading() {
  return (
    <PageSkeleton
      title="Loading page..."
      description="Preparing the latest Clean Jobs data."
      cards={3}
    />
  )
}