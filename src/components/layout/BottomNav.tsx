import { Home, ShoppingCart, ClipboardList, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useCartStore } from '../../stores/cartStore'

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/cart', icon: ShoppingCart, label: 'Carrinho' },
  { to: '/orders', icon: ClipboardList, label: 'Pedidos' },
  { to: '/profile', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  const itemCount = useCartStore((s) => s.itemCount)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50 md:hidden">
      <div className="flex justify-around py-2 px-2">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors duration-150 ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`
            }
          >
            <div className="relative">
              <Icon size={21} strokeWidth={2} />
              {label === 'Carrinho' && itemCount() > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-primary text-white text-[9px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center">
                  {itemCount()}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
