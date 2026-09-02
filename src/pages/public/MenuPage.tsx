import { useEffect, useState, useMemo } from 'react'
// import { useRestaurantStore } from '../../stores/restaurantStore'
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
  const [cartOpen, setCartOpen] = useState(false)

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
    <div className="flex">
      <div className="flex-1">
        <CategoryTabs
          categories={CATEGORIES}
          active={activeCategory}
          onSelect={setActiveCategory}
        />

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                <Skeleton className="h-40 rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <ErrorState onRetry={loadMenu} />}

        {!loading && !error && <FoodGrid items={filteredItems} />}
      </div>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Desktop: botão para abrir carrinho no canto */}
      <button
        onClick={() => setCartOpen(true)}
        className="hidden lg:flex fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full items-center justify-center shadow-lg hover:bg-primary-dark transition-colors z-40"
      >
        🛒
      </button>

      <CartBar />
    </div>
  )
}