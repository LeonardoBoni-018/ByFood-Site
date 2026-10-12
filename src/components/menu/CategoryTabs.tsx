import { useLayoutEffect, useRef, useState } from 'react'

interface CategoryTabsProps {
  categories: readonly string[]
  active: string
  onSelect: (category: string) => void
}

export function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [bar, setBar] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-cat="${active}"]`)
    if (el) {
      setBar({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [active, categories])

  return (
    <div className="sticky top-16 z-30 bg-background border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div ref={listRef} role="tablist" className="relative flex gap-7 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => {
            const isActive = active === cat
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                data-cat={cat}
                onClick={() => onSelect(cat)}
                className={`py-4 text-[15px] whitespace-nowrap transition-colors duration-200 ${
                  isActive ? 'font-semibold text-dark' : 'text-gray-500 hover:text-dark'
                }`}
              >
                {cat}
              </button>
            )
          })}
          <span
            aria-hidden
            className="absolute bottom-0 h-[3px] rounded-t-full bg-primary transition-[left,width] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ left: bar.left, width: bar.width }}
          />
        </div>
      </div>
    </div>
  )
}
