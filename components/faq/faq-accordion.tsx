"use client"

import { useState } from "react"

import type {
  FaqCategory,
  FaqItem,
} from "@/lib/faq"

type FaqAccordionProps = {
  categories: FaqCategory[]
}

function QuestionItem({
  item,
  categoryId,
  index,
}: {
  item: FaqItem
  categoryId: string
  index: number
}) {
  const [isOpen, setIsOpen] = useState(false)

  const buttonId = `${categoryId}-question-${index}`
  const panelId = `${categoryId}-answer-${index}`

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((previous) => !previous)}
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-rose-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-600 sm:px-6"
        >
          <span className="text-sm font-semibold leading-6 text-slate-950 sm:text-base">
            {item.question}
          </span>

          <span
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-700 transition duration-200 ${
              isOpen
                ? "rotate-45 border-rose-200 bg-rose-50 text-rose-700"
                : ""
            }`}
          >
            +
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
      >
        <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-sm leading-7 text-slate-600">
            {item.answer}
          </p>
        </div>
      </div>
    </article>
  )
}

export default function FaqAccordion({
  categories,
}: FaqAccordionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(
    categories[0]?.id ?? "",
  )

  const activeCategory =
    categories.find(
      (category) => category.id === activeCategoryId,
    ) ?? categories[0]

  if (!activeCategory) {
    return null
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          <nav
            aria-label="FAQ categories"
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {categories.map((category) => {
              const isActive =
                category.id === activeCategory.id

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setActiveCategoryId(category.id)
                  }
                  className={`min-w-max rounded-2xl px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 lg:min-w-0 ${
                    isActive
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700"
                  }`}
                >
                  <span className="block text-sm font-semibold">
                    {category.title}
                  </span>

                  <span
                    className={`mt-1 hidden text-xs leading-5 lg:block ${
                      isActive
                        ? "text-rose-100"
                        : "text-slate-500"
                    }`}
                  >
                    {category.description}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      <section
        key={activeCategory.id}
        aria-labelledby={`${activeCategory.id}-title`}
      >
        <div className="mb-5">
          <h2
            id={`${activeCategory.id}-title`}
            className="text-2xl font-semibold tracking-tight text-slate-950"
          >
            {activeCategory.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {activeCategory.description}
          </p>
        </div>

        <div className="grid gap-3">
          {activeCategory.items.map((item, index) => (
            <QuestionItem
              key={item.question}
              item={item}
              categoryId={activeCategory.id}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  )
}