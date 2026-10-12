import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { fetchRestaurant, fetchRestaurantMenu } from '../../api/restaurants'
import type { MenuItem, Restaurant } from '../../types'
import { Hero } from '../../components/menu/Hero'
import { CategoryTabs } from '../../components/menu/CategoryTabs'
import { FoodGrid } from '../../components/menu/FoodGrid'
import { CartBar } from '../../components/cart/CartBar'
import { CartSidebar } from '../../components/cart/CartSidebar'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { OrderUnavailable } from '../../components/order/OrderPageState'
import { getErrorMessage, isNotFound } from '../../lib/errors'

/** Página pública de uma loja: apresentação, cardápio por categoria e sacola. */
export function MenuPage() {
  const { slug } = useParams<{ slug: string }>()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      // as duas chamadas são independentes: rodam em paralelo
      const [info, menu] = await Promise.all([fetchRestaurant(slug), fetchRestaurantMenu(slug)])
      setRestaurant(info)
      setItems(menu.content)
      setActiveCategory('Todos')
    } catch (err) {
      if (isNotFound(err)) setNotFound(true)
      else setError(getErrorMessage(err, 'Não foi possível carregar o cardápio.'))
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const categories = useMemo(() => ['Todos', ...new Set(items.map((i) => i.category))], [items])

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Todos') return items
    return items.filter((item) => item.category === activeCategory)
  }, [items, activeCategory])

  const featured = useMemo(() => items.find((i) => i.available && i.imageUrl), [items])

  if (notFound) return <OrderUnavailable notFound error={null} onRetry={load} />

  if (error) {
    return <ErrorState description={error} onRetry={load} />
  }

  const store = restaurant ? { slug: restaurant.slug, name: restaurant.name } : null

  return (
    <>
      {restaurant ? (
        <Hero restaurant={restaurant} featured={featured} />
      ) : (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 space-y-4">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-24 w-full max-w-2xl rounded" />
        </div>
      )}

      <div id="cardapio" className="scroll-mt-16">
        <CategoryTabs categories={categories} active={activeCategory} onSelect={setActiveCategory} />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 lg:grid lg:grid-cols-[1fr_320px] lg:gap-10 lg:items-start">
          <div className="min-w-0">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-dark">
                {activeCategory === 'Todos' ? 'O cardápio da casa' : activeCategory}
              </h2>
              {!loading && (
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

            {!loading && store && <FoodGrid key={activeCategory} items={filteredItems} store={store} />}
          </div>

          <CartSidebar />
        </div>
      </div>

      <CartBar />
    </>
  )
}
