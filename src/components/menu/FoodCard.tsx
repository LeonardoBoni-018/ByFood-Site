import { Plus, Check } from 'lucide-react'
import type { MenuItem } from '../../types'
import { useState } from 'react'
import { useCartStore } from '../../stores/cartStore'
import { formatPrice } from '../../lib/formatters'
import { QuantitySelector } from '../ui/QuantitySelector'

interface FoodCardProps {
  item: MenuItem
  index?: number
}

export function FoodCard({ item, index = 0 }: FoodCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [imgOk, setImgOk] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const handleAdd = () => {
    addItem(item, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
    setQty(1)
  }

  const delay = index < 8 ? `delay-${(index % 8) + 1}` : ''

  const emojis: Record<string, string> = {
    Pizzas: '🍕', Burgers: '🍔', Bebidas: '🥤', Sobremesas: '🍰',
  }

  return (
    <div className={`anim-fade-up ${delay} bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-md dark:hover:shadow-none dark:hover:border-gray-700 transition-all duration-200 group`}>
      <div className="relative h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {!imgOk && !imgErr && <div className="absolute inset-0 skeleton" />}

        {item.imageUrl && !imgErr ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            onLoad={() => setImgOk(true)}
            onError={() => setImgErr(true)}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imgOk ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
              {emojis[item.category] || '🍽️'}
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
            item.available
              ? 'bg-success/90 text-white'
              : 'bg-gray-400/90 text-white'
          }`}>
            {item.available ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-[15px] leading-snug mb-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-3 mt-auto">
          <span className="font-bold text-primary text-lg">
            {formatPrice(item.price)}
          </span>

          <div className="flex items-center gap-2">
            <QuantitySelector value={qty} onChange={setQty} />
            <button
              onClick={handleAdd}
              disabled={!item.available}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
                added
                  ? 'bg-success text-white'
                  : 'bg-primary text-white hover:bg-primary-hover'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {added ? (
                <>
                  <Check size={15} className="anim-pop" />
                  OK
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Adicionar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
