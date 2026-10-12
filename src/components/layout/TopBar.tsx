import { Link } from 'react-router-dom'
import { MessageCircle, Sun, Moon, ShoppingBag } from 'lucide-react'
import { useRestaurantStore } from '../../stores/restaurantStore'
import { useCartStore } from '../../stores/cartStore'
import { useTheme } from '../../contexts/ThemeContext'
import { Logo } from '../ui/Logo'

export function TopBar() {
  const restaurant = useRestaurantStore((s) => s.restaurant)
  const count = useCartStore((s) => s.itemCount())
  const { theme, toggle } = useTheme()
  const digitsOnly = restaurant?.whatsappNumber?.replace(/\D/g, '') ?? ''

  return (
    <header className="sticky top-0 z-40 h-16 bg-background border-b border-gray-200 dark:border-gray-800">
      <div className="h-full max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" aria-label="byFood, página inicial">
          <Logo />
        </Link>

        <div className="flex items-center gap-1.5">
          {digitsOnly && (
            <a
              href={`https://wa.me/${digitsOnly}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 h-10 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <MessageCircle size={17} />
              Falar com a casa
            </a>
          )}
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link
            to="/cart"
            className="relative w-10 h-10 rounded-full bg-dark text-background flex items-center justify-center hover:bg-primary transition-colors"
            aria-label={`Carrinho, ${count} itens`}
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span
                key={count}
                className="anim-bump absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-mustard text-[#231a13] text-[11px] font-bold flex items-center justify-center"
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
