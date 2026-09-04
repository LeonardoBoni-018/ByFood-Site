import { X } from 'lucide-react'
import type { CartItem as CartItemType } from '../../types'
import { QuantitySelector } from '../ui/QuantitySelector'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice } from '../../lib/formatters'

interface CartItemProps {
  item: CartItemType
  index?: number
}

export function CartItem({ item, index = 0 }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = item.menuItem.price * item.quantity

  const emojis: Record<string, string> = {
    Pizzas: '🍕', Burgers: '🍔', Bebidas: '🥤', Sobremesas: '🍰',
  }

  return (
    <div className={`anim-fade-up delay-${(index % 4) + 1} flex items-center gap-3 py-3 px-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}>
      <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0 bg-gray-100 dark:bg-gray-800">
        {item.menuItem.imageUrl ? (
          <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">{emojis[item.menuItem.category] || '🍽️'}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">{item.menuItem.name}</h4>
        <p className="text-primary font-semibold text-sm">{formatPrice(item.menuItem.price)}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <QuantitySelector
          value={item.quantity}
          onChange={(qty) => updateQuantity(item.menuItem.id, qty)}
          compact
        />
        <div className="flex items-center gap-2">
          <p className="font-semibold text-xs text-gray-700 dark:text-gray-300">{formatPrice(subtotal)}</p>
          <button
            onClick={() => removeItem(item.menuItem.id)}
            className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <X size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}
