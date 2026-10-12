import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice } from '../../lib/formatters'

export function CartBar() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const itemCount = useCartStore((s) => s.itemCount)

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-[68px] inset-x-0 md:hidden z-40 px-4 anim-slide-up">
      <button
        onClick={() => navigate('/cart')}
        className="group w-full bg-dark text-background rounded-full pl-5 pr-2 h-14 flex items-center justify-between shadow-[0_12px_30px_-10px_rgba(35,26,19,0.6)] active:scale-[0.98] transition-transform"
      >
        <span className="flex items-baseline gap-2">
          <span key={itemCount()} className="anim-bump font-bold tabular-nums">
            {itemCount()}
          </span>
          <span className="text-sm opacity-80">
            {itemCount() === 1 ? 'item' : 'itens'} · {formatPrice(total())}
          </span>
        </span>
        <span className="flex items-center gap-2 h-10 pl-4 pr-3 rounded-full bg-primary text-white text-sm font-semibold">
          Ver sacola
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </button>
    </div>
  )
}
