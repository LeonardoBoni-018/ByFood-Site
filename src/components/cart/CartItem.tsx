import { X } from 'lucide-react'
import type { CartItem as CartItemType } from '../../types'
import { QuantitySelector } from '../ui/QuantitySelector'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice } from '../../lib/formatters'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = item.menuItem.price * item.quantity

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
        <span className="text-xl">🍔</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-dark truncate">{item.menuItem.name}</h4>
        <p className="text-primary font-bold text-sm">{formatPrice(item.menuItem.price)}</p>
      </div>
      <QuantitySelector
        value={item.quantity}
        onChange={(qty) => updateQuantity(item.menuItem.id, qty)}
      />
      <div className="text-right shrink-0">
        <p className="font-bold text-sm text-dark">{formatPrice(subtotal)}</p>
        <button
          onClick={() => removeItem(item.menuItem.id)}
          className="text-gray-400 hover:text-danger mt-1"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}