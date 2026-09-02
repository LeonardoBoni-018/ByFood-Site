import { MessageCircle } from 'lucide-react'
import { useRestaurantStore } from '../../stores/restaurantStore'

export function TopBar() {
  const restaurant = useRestaurantStore((s) => s.restaurant)
  const digitsOnly = restaurant?.whatsappNumber?.replace(/\D/g, '') ?? ''

  return (
    <header className="bg-primary text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-primary font-bold text-lg">
            {restaurant?.name?.charAt(0) ?? 'B'}
          </span>
        </div>
        <div>
          <h1 className="font-bold text-sm leading-tight">
            {restaurant?.name ?? 'Bistrô byFood'}
          </h1>
          <p className="text-xs text-white/80">
            {restaurant?.openingHours ?? '11h-23h'}
          </p>
        </div>
      </div>
      <a
        href={`https://wa.me/${digitsOnly}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-success rounded-full flex items-center justify-center"
      >
        <MessageCircle size={20} className="text-white" />
      </a>
    </header>
  )
}