import { useEffect, useState, useMemo, useCallback } from 'react'
import { fetchPublicMenu } from '../../api/menu'
import type { MenuItem } from '../../types'
import { CATEGORIES } from '../../lib/constants'
import { useRestaurantStore } from '../../stores/restaurantStore'
import { Hero } from '../../components/menu/Hero'
import { CategoryTabs } from '../../components/menu/CategoryTabs'
import { FoodGrid } from '../../components/menu/FoodGrid'
import { CartBar } from '../../components/cart/CartBar'
import { CartSidebar } from '../../components/cart/CartSidebar'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'

export function MenuPage() {
  const restaurant = useRestaurantStore((s) => s.restaurant)
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadMenu = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMenu()
  }, [loadMenu])

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Todos') return items
    return items.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase())
  }, [items, activeCategory])

  const featured = useMemo(
    () => items.find((i) => i.available && i.imageUrl && /burger/i.test(i.category)) ?? items.find((i) => i.available && i.imageUrl),
    [items],
  )

  return (
    <>
      <Hero restaurant={restaurant} featured={featured} />

      <div id="cardapio" className="scroll-mt-16">
        <CategoryTabs categories={CATEGORIES} active={activeCategory} onSelect={setActiveCategory} />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 lg:grid lg:grid-cols-[1fr_320px] lg:gap-10 lg:items-start">
          <div className="min-w-0">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-dark">
                {activeCategory === 'Todos' ? 'O cardápio da casa' : activeCategory}
              </h2>
              {!loading && !error && (
                <span className="text-sm text-gray-500 tabular-nums">
                  {filteredItems.length} {filteredItems.length === 1 ? 'opção' : 'opções'}
                </span>
              )}
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="aspect-[5/4] rounded-[20px] rounded-bl-[6px]" />
                    <Skeleton className="h-5 w-3/4 mt-4 rounded" />
                    <Skeleton className="h-4 w-full mt-2 rounded" />
                  </div>
                ))}
              </div>
            )}

            {error && <ErrorState description="Não foi possível carregar o cardápio." onRetry={loadMenu} />}

            {!loading && !error && <FoodGrid key={activeCategory} items={filteredItems} />}
          </div>

          <CartSidebar />
        </div>
      </div>

      <CartBar />
    </>
  )
}
