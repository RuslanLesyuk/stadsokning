import PageSkeleton from "@/components/page-skeleton"

export default function Loading() {
  return (
    <PageSkeleton
      title="Loading create form..."
      description="Preparing the job publishing form."
      cards={2}
    />
  )
}