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

  return (
    <div
      className="anim-fade-up flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
      style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
    >
      <div className="w-14 h-14 rounded-xl rounded-bl-[4px] overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {item.menuItem.imageUrl ? (
          <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display italic text-xl text-gray-400">{item.menuItem.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-[15px] leading-tight text-dark truncate">{item.menuItem.name}</h4>
        <p className="text-gray-500 text-sm tabular-nums">{formatPrice(subtotal)}</p>
      </div>
      <div className="flex items-center gap-2">
        <QuantitySelector
          value={item.quantity}
          onChange={(qty) => updateQuantity(item.menuItem.id, qty)}
          compact
        />
        <button
          onClick={() => removeItem(item.menuItem.id)}
          aria-label={`Remover ${item.menuItem.name}`}
          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}
