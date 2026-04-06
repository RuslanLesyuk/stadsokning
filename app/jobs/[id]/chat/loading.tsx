import PageSkeleton from "@/components/page-skeleton"

export default function Loading() {
  return (
    <PageSkeleton
      title="Loading chat..."
      description="Preparing the conversation for this job."
      cards={2}
    />
  )
}