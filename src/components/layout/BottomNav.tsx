import { Home, ShoppingBag, ClipboardList, LogIn, LayoutDashboard } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'

export function BottomNav() {
  const count = useCartStore((s) => s.itemCount())
  const user = useAuthStore((s) => s.user)

  const items = [
    { to: '/', icon: Home, label: 'Lojas', end: true },
    { to: '/cart', icon: ShoppingBag, label: 'Sacola', end: false },
    user?.role === 'STORE'
      ? { to: '/loja/pedidos', icon: LayoutDashboard, label: 'Painel', end: false }
      : user
        ? { to: '/pedidos', icon: ClipboardList, label: 'Pedidos', end: false }
        : { to: '/entrar', icon: LogIn, label: 'Entrar', end: false },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-surface border-t border-gray-200 dark:border-gray-800 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-3">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute top-0 h-[3px] rounded-b-full bg-primary transition-all duration-300 ${
                    isActive ? 'w-8 opacity-100' : 'w-0 opacity-0'
                  }`}
                />
                <span className="relative">
                  <Icon size={21} strokeWidth={isActive ? 2.4 : 1.9} />
                  {to === '/cart' && count > 0 && (
                    <span
                      key={count}
                      className="anim-bump absolute -top-1.5 -right-2.5 bg-mustard text-[#231a13] text-[10px] font-bold rounded-full min-w-[17px] h-[17px] px-1 flex items-center justify-center"
                    >
                      {count}
                    </span>
                  )}
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
