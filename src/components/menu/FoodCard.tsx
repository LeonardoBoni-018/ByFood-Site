import { Plus, Check } from 'lucide-react'
import type { MenuItem } from '../../types'
import { useRef, useState } from 'react'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice } from '../../lib/formatters'

interface FoodCardProps {
  item: MenuItem
  index?: number
}

export function FoodCard({ item, index = 0 }: FoodCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const inCart = useCartStore((s) => s.items.find((i) => i.menuItem.id === item.id)?.quantity ?? 0)
  const [added, setAdded] = useState(false)
  const [imgOk, setImgOk] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleAdd = () => {
    addItem(item, 1)
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1100)
  }

  return (
    <article
      className="anim-fade-up group flex flex-col"
      style={{ animationDelay: `${Math.min(index, 11) * 55}ms` }}
    >
      <div className="relative aspect-[5/4] rounded-[20px] rounded-bl-[6px] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {!imgOk && !imgErr && item.imageUrl && <div className="absolute inset-0 skeleton" />}
        {item.imageUrl && !imgErr ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            onLoad={() => setImgOk(true)}
            onError={() => setImgErr(true)}
            className={`w-full h-full object-cover transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.06] group-hover:-rotate-1 ${
              imgOk ? 'opacity-100' : 'opacity-0'
            } ${!item.available ? 'grayscale' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display text-5xl italic text-gray-300">
            {item.name.charAt(0)}
          </div>
        )}

        {!item.available && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-dark text-background text-[11px] font-semibold tracking-wide">
            Esgotado
          </span>
        )}

        {inCart > 0 && (
          <span
            key={inCart}
            className="anim-pop absolute top-3 right-3 h-7 px-2.5 rounded-full bg-mustard text-[#231a13] text-xs font-bold flex items-center justify-center"
          >
            {inCart}× na sacola
          </span>
        )}

        <button
          onClick={handleAdd}
          disabled={!item.available}
          aria-label={`Adicionar ${item.name} à sacola`}
          className={`absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 active:scale-90 disabled:opacity-40 disabled:hover:scale-100 ${
            added ? 'bg-success' : 'bg-primary hover:bg-primary-hover hover:rotate-90'
          }`}
        >
          {added ? <Check size={20} className="anim-pop" /> : <Plus size={20} />}
        </button>
      </div>

      <div className="pt-4">
        <div className="flex items-baseline gap-2">
          <h3 className="font-display text-[19px] font-semibold leading-snug text-dark">{item.name}</h3>
          <span className="leader" />
          <span className="font-semibold tabular-nums text-dark">{formatPrice(item.price)}</span>
        </div>
        {item.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </article>
  )
}
