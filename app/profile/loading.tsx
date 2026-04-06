import PageSkeleton from "@/components/page-skeleton"

export default function Loading() {
  return (
    <PageSkeleton
      title="Loading profile..."
      description="Preparing your account and activity overview."
      cards={2}
    />
  )
}