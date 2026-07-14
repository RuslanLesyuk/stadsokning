"use client"

import { useEffect, useState } from "react"

type Props = {
  images: string[]
  companyName: string
}

export default function GalleryViewer({
  images,
  companyName,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    if (selected === null) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelected(null)
      }

      if (event.key === "ArrowLeft") {
        setSelected((current) =>
          current === null
            ? null
            : (current - 1 + images.length) % images.length,
        )
      }

      if (event.key === "ArrowRight") {
        setSelected((current) =>
          current === null
            ? null
            : (current + 1) % images.length,
        )
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selected, images.length])

  if (images.length === 0) {
    return null
  }

  return (
    <>
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-2xl font-bold text-slate-950">
          Gallery
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelected(index)}
              className="group overflow-hidden rounded-2xl"
            >
              <img
                src={image}
                alt={`${companyName} ${index + 1}`}
                loading="lazy"
                className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </section>

      {selected !== null && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setSelected(
                (selected - 1 + images.length) % images.length,
              )
            }}
            className="absolute left-6 text-5xl text-white"
          >
            ‹
          </button>

          <img
            src={images[selected]}
            alt={companyName}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setSelected((selected + 1) % images.length)
            }}
            className="absolute right-6 text-5xl text-white"
          >
            ›
          </button>

          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-6 top-6 text-4xl text-white"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}