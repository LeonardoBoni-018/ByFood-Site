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
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around py-2">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`
            }
          >
            <div className="relative">
              <Icon size={22} />
              {label === 'Carrinho' && itemCount() > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount()}
                </span>
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}