import GalleryViewer from "./gallery-viewer"

type Props = {
  images: string[] | null
  companyName: string
}

export default function Gallery({
  images,
  companyName,
}: Props) {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <GalleryViewer
      images={images}
      companyName={companyName}
    />
  )
}