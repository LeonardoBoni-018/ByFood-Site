import { MessageCircle, MapPin, Clock, Sun, Moon } from 'lucide-react'
import { useRestaurantStore } from '../../stores/restaurantStore'
import { useTheme } from '../../contexts/ThemeContext'

export function TopBar() {
  const restaurant = useRestaurantStore((s) => s.restaurant)
  const digitsOnly = restaurant?.whatsappNumber?.replace(/\D/g, '') ?? ''
  const { theme, toggle } = useTheme()

  return (
    <header className="bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {restaurant?.name?.charAt(0) ?? 'B'}
          </span>
        </div>
        <div>
          <h1 className="font-bold text-sm leading-tight text-gray-900 dark:text-white">
            {restaurant?.name ?? 'Bistrô byFood'}
          </h1>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {restaurant?.openingHours ?? '11h-23h'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {restaurant?.address?.split(',').pop()?.trim() ?? 'São Paulo'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Alternar tema"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        {digitsOnly && (
          <a
            href={`https://wa.me/${digitsOnly}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-success rounded-xl flex items-center justify-center hover:bg-success/90 transition-colors"
          >
            <MessageCircle size={18} className="text-white" />
          </a>
        )}
      </div>
    </header>
  )
}
