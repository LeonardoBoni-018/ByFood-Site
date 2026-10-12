import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '../../stores/cartStore'
import { CartItem } from './CartItem'
import { formatPrice } from '../../lib/formatters'

/** Sacola fixa na lateral (apenas telas largas); no mobile a barra inferior leva ao carrinho. */
export function CartSidebar() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const itemCount = useCartStore((s) => s.itemCount)
  const clearCart = useCartStore((s) => s.clearCart)

  return (
    <aside
      aria-label="Sua sacola"
      className="hidden lg:flex flex-col sticky top-36 max-h-[calc(100vh-10rem)] rounded-[22px] bg-surface border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-semibold text-dark">Sua sacola</h2>
        <span className="text-sm text-gray-500 tabular-nums">
          {itemCount()} {itemCount() === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 min-h-[120px]">
        {items.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <ShoppingBag size={30} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Toque no + de um prato para começar.</p>
          </div>
        ) : (
          items.map((item, index) => <CartItem key={item.menuItem.id} item={item} index={index} />)
        )}
      </div>

      {items.length > 0 && (
        <div className="px-6 pt-4 pb-6 border-t border-dashed border-gray-300 dark:border-gray-700">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Total</span>
            <span key={total()} className="anim-pop font-display text-2xl font-semibold tabular-nums text-dark">
              {formatPrice(total())}
            </span>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="group w-full h-12 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
          >
            Fechar pedido
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-3 text-sm text-gray-500 hover:text-danger flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 size={14} />
            Esvaziar sacola
          </button>
        </div>
      )}
    </aside>
  )
}
