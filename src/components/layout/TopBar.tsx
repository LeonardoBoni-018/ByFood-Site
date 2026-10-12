import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, ShoppingBag, LogOut, ClipboardList, LayoutDashboard } from 'lucide-react'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import { useTheme } from '../../contexts/ThemeContext'
import { Logo } from '../ui/Logo'

export function TopBar() {
  const navigate = useNavigate()
  const count = useCartStore((s) => s.itemCount())
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const isStore = user?.role === 'STORE'

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 h-16 bg-background border-b border-gray-200 dark:border-gray-800">
      <div className="h-full max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" aria-label="byFood, página inicial">
          <Logo />
        </Link>

        <div className="flex items-center gap-1.5">
          {!isStore && (
            <Link
              to="/para-lojas"
              className="hidden sm:inline-flex items-center px-3.5 h-10 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Para lojas
            </Link>
          )}

          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {!isStore && (
            <Link
              to="/cart"
              className="relative w-10 h-10 rounded-full bg-dark text-background flex items-center justify-center hover:bg-primary transition-colors"
              aria-label={`Sacola, ${count} itens`}
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
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Menu da conta"
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 font-display font-semibold text-dark hover:border-dark transition-colors"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div
                    role="menu"
                    className="anim-scale-in absolute right-0 mt-2 w-56 z-50 rounded-2xl bg-surface border border-gray-200 dark:border-gray-700 shadow-[0_16px_40px_-16px_rgba(35,26,19,0.4)] py-2 origin-top-right"
                  >
                    <p className="px-4 py-2 text-sm text-gray-500 truncate border-b border-gray-100 dark:border-gray-800 mb-1">
                      {user.name}
                    </p>
                    {isStore ? (
                      <Link role="menuitem" to="/loja/pedidos" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                        <LayoutDashboard size={16} /> Painel da loja
                      </Link>
                    ) : (
                      <Link role="menuitem" to="/pedidos" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                        <ClipboardList size={16} /> Meus pedidos
                      </Link>
                    )}
                    <button role="menuitem" onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-danger hover:bg-gray-100 dark:hover:bg-gray-800">
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/entrar"
              className="inline-flex items-center h-10 px-5 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-semibold hover:border-dark transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
