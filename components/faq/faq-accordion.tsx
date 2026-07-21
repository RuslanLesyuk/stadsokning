"use client"

import { useEffect, useMemo, useState } from "react"

import type { FaqCategory, FaqItem } from "@/lib/faq"

type FaqAccordionProps = {
  categories: FaqCategory[]
}

type NormalizedItem = {
  id: string
  question: string
  answer: string
}

type NormalizedCategory = {
  id: string
  title: string
  description?: string
  items: NormalizedItem[]
}

function normalizeItem(
  item: FaqItem,
  categoryId: string,
  index: number,
): NormalizedItem {
  const value = item as FaqItem & {
    id?: string
    question?: string
    answer?: string
  }

  return {
    id: String(value.id || `${categoryId}-item-${index}`),
    question: String(value.question || ""),
    answer: String(value.answer || ""),
  }
}

function normalizeCategory(
  category: FaqCategory,
  index: number,
): NormalizedCategory {
  const value = category as FaqCategory & {
    id?: string
    slug?: string
    title?: string
    name?: string
    description?: string
    items?: FaqItem[]
  }

  const id = String(
    value.id || value.slug || `category-${index}`,
  )

  return {
    id,
    title: String(value.title || value.name || ""),
    description: value.description
      ? String(value.description)
      : undefined,
    items: Array.isArray(value.items)
      ? value.items.map((item, itemIndex) =>
          normalizeItem(item, id, itemIndex),
        )
      : [],
  }
}

export function FaqAccordion({
  categories,
}: FaqAccordionProps) {
  const normalizedCategories = useMemo(
    () => categories.map(normalizeCategory),
    [categories],
  )

  const firstCategoryId = normalizedCategories[0]?.id || ""

  const [activeCategoryId, setActiveCategoryId] =
    useState(firstCategoryId)

  const [openItemId, setOpenItemId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const categoryExists = normalizedCategories.some(
      (category) => category.id === activeCategoryId,
    )

    if (!categoryExists) {
      setActiveCategoryId(firstCategoryId)
      setOpenItemId(null)
    }
  }, [
    activeCategoryId,
    firstCategoryId,
    normalizedCategories,
  ])

  const activeCategory =
    normalizedCategories.find(
      (category) => category.id === activeCategoryId,
    ) || normalizedCategories[0]

  function selectCategory(categoryId: string) {
    setActiveCategoryId(categoryId)
    setOpenItemId(null)
  }

  function toggleItem(itemId: string) {
    setOpenItemId((currentId) =>
      currentId === itemId ? null : itemId,
    )
  }

  if (normalizedCategories.length === 0) {
    return null
  }

  return (
    <div className="w-full min-w-0 overflow-hidden">
      {/* Mobile category navigation */}
      <div className="w-full overflow-hidden lg:hidden">
        <div
          className="-mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          <div className="flex min-w-max gap-2">
            {normalizedCategories.map((category) => {
              const isActive =
                category.id === activeCategory?.id

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    selectCategory(category.id)
                  }
                  aria-pressed={isActive}
                  className={
                    isActive
                      ? "inline-flex min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
                      : "inline-flex min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
                  }
                >
                  {category.title}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        {/* Desktop category navigation */}
        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-28 space-y-2 rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
            {normalizedCategories.map((category) => {
              const isActive =
                category.id === activeCategory?.id

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    selectCategory(category.id)
                  }
                  aria-pressed={isActive}
                  className={
                    isActive
                      ? "flex w-full min-w-0 items-center rounded-2xl bg-rose-600 px-4 py-4 text-left text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
                      : "flex w-full min-w-0 items-center rounded-2xl px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
                  }
                >
                  <span className="min-w-0 break-words">
                    {category.title}
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Questions */}
        <section className="w-full min-w-0">
          <div className="min-w-0">
            <h2 className="break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              {activeCategory?.title}
            </h2>

            {activeCategory?.description ? (
              <p className="mt-3 max-w-3xl break-words text-base leading-7 text-slate-600">
                {activeCategory.description}
              </p>
            ) : null}
          </div>

          <div className="mt-7 w-full min-w-0 space-y-4">
            {activeCategory?.items.map((item) => {
              const isOpen = openItemId === item.id
              const questionId = `faq-question-${item.id}`
              const answerId = `faq-answer-${item.id}`

              return (
                <article
                  key={item.id}
                  className="w-full min-w-0 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
                >
                  <h3 className="m-0 w-full min-w-0">
                    <button
                      id={questionId}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      className="flex w-full min-w-0 items-start justify-between gap-3 px-5 py-5 text-left transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-600 sm:items-center sm:gap-5 sm:px-6 sm:py-6"
                    >
                      <span className="min-w-0 flex-1 whitespace-normal break-words text-base font-semibold leading-7 text-slate-950 [overflow-wrap:anywhere] sm:text-lg">
                        {item.question}
                      </span>

                      <span
                        aria-hidden="true"
                        className={
                          isOpen
                            ? "mt-0.5 flex h-9 w-9 shrink-0 rotate-45 items-center justify-center rounded-full bg-rose-600 text-xl font-medium text-white transition-transform duration-200 sm:mt-0"
                            : "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-medium text-slate-700 transition-transform duration-200 sm:mt-0"
                        }
                      >
                        +
                      </span>
                    </button>
                  </h3>

                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    hidden={!isOpen}
                    className="w-full min-w-0"
                  >
                    <div className="border-t border-slate-100 px-5 py-5 sm:px-6 sm:py-6">
                      <p className="max-w-3xl whitespace-pre-line break-words text-sm leading-7 text-slate-600 [overflow-wrap:anywhere] sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}

            {activeCategory?.items.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-sm text-slate-500">
                У цій категорії поки немає питань.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}

export default FaqAccordion