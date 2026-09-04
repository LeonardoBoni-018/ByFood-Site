import { ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice } from '../../lib/formatters'

export function CartBar() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const itemCount = useCartStore((s) => s.itemCount)

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 md:hidden z-40 px-4 pb-2 anim-slide-up">
      <div className="bg-dark dark:bg-gray-900 text-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-lg border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount()}
            </span>
          </div>
          <div>
            <span className="font-semibold text-sm block leading-tight">
              {itemCount()} {itemCount() === 1 ? 'item' : 'itens'}
            </span>
            <span className="text-gray-400 text-xs">{formatPrice(total())}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="bg-success text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-success/90 transition-colors active:scale-95"
        >
          Ver Carrinho
        </button>
      </div>
    </div>
  )
}
