import { useEffect, useState, useMemo } from 'react'
import { fetchPublicMenu } from '../../api/menu'
import type { MenuItem } from '../../types'
import { CATEGORIES } from '../../lib/constants'
import { CategoryTabs } from '../../components/menu/CategoryTabs'
import { FoodGrid } from '../../components/menu/FoodGrid'
import { CartBar } from '../../components/cart/CartBar'
import { CartSidebar } from '../../components/cart/CartSidebar'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cartOpen, setCartOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.innerWidth >= 1024
    } catch {
      return false
    }
  })

  useEffect(() => {
    loadMenu()
  }, [])

  async function loadMenu() {
    setLoading(true)
    setError(false)
    try {
      const page = await fetchPublicMenu(0, 100)
      setItems(page.content)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Todos') return items
    return items.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    )
  }, [items, activeCategory])

  return (
    <div className="flex min-h-[calc(100vh-52px)]">
      <div className="flex-1 min-w-0 lg:overflow-y-auto">
        <CategoryTabs
          categories={CATEGORIES}
          active={activeCategory}
          onSelect={setActiveCategory}
        />

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-6 py-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`anim-fade-up delay-${(i % 8) + 1} bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800`}
              >
                <Skeleton className="h-44 rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-2/3 rounded-lg" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-16 rounded-lg" />
                    <Skeleton className="h-9 w-28 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <ErrorState onRetry={loadMenu} />}

        {!loading && !error && <FoodGrid items={filteredItems} />}
      </div>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {!cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="hidden lg:flex fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-2xl items-center justify-center shadow-lg hover:bg-primary-hover hover:shadow-xl transition-all duration-200 active:scale-95 z-40"
        >
          🛒
        </button>
      )}

      <CartBar />
    </div>
  )
}
