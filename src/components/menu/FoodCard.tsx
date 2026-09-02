import { Plus } from 'lucide-react'
import type { MenuItem } from '../../types'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice } from '../../lib/formatters'

interface FoodCardProps {
  item: MenuItem
}

export function FoodCard({ item }: FoodCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-4xl">🍔</span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-dark text-base mb-1">{item.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-1">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-lg">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() => addItem(item)}
            className="flex items-center gap-1 border-2 border-primary text-primary px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}