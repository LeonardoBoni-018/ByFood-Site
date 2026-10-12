import type { MenuItem } from '../../types'
import type { CartStore } from '../../stores/cartStore'
import { FoodCard } from './FoodCard'
import { EmptyState } from '../ui/EmptyState'

interface FoodGridProps {
  items: MenuItem[]
  store: CartStore
}

export function FoodGrid({ items, store }: FoodGridProps) {
  if (items.length === 0) {
    return <EmptyState title="Nenhum item encontrado" description="Nesta categoria ainda não há itens" />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-10">
      {items.map((item, index) => (
        <FoodCard key={item.id} item={item} store={store} index={index} />
      ))}
    </div>
  )
}
