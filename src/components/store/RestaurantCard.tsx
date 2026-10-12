import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock } from 'lucide-react'
import { useState } from 'react'
import type { RestaurantSummary } from '../../types'

interface RestaurantCardProps {
  restaurant: RestaurantSummary
  index?: number
}

export function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  const [imgOk, setImgOk] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  return (
    <Link
      to={`/lojas/${restaurant.slug}`}
      className="anim-fade-up group flex flex-col"
      style={{ animationDelay: `${Math.min(index, 11) * 55}ms` }}
    >
      <div className="relative aspect-[4/3] rounded-[20px] rounded-br-[6px] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {restaurant.imageUrl && !imgErr ? (
          <>
            {!imgOk && <div className="absolute inset-0 skeleton" />}
            <img
              src={restaurant.imageUrl}
              alt=""
              loading="lazy"
              onLoad={() => setImgOk(true)}
              onError={() => setImgErr(true)}
              className={`w-full h-full object-cover transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.06] ${
                imgOk ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-light">
            <span className="font-display italic text-6xl text-primary">{restaurant.name.charAt(0)}</span>
          </div>
        )}

        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface text-dark text-[11px] font-semibold tracking-wide">
          {restaurant.cuisine}
        </span>

        <span className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-dark text-background flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:rotate-45">
          <ArrowUpRight size={20} />
        </span>
      </div>

      <div className="pt-4">
        <h3 className="font-display text-[20px] font-semibold leading-snug text-dark group-hover:text-primary transition-colors">
          {restaurant.name}
        </h3>
        {restaurant.description && (
          <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
            {restaurant.description}
          </p>
        )}
        {restaurant.openingHours && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={12} /> {restaurant.openingHours}
          </p>
        )}
      </div>
    </Link>
  )
}
