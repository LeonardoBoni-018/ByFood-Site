import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ExternalLink, ListChecks, LogOut, Settings, UtensilsCrossed } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useMyStore } from '../../hooks/useMyStore'
import { Logo } from '../ui/Logo'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] transition-colors ${
    isActive ? 'bg-dark text-background font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`

export function Sidebar() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const store = useMyStore()

  return (
    <div className="h-full flex flex-col p-6">
      <Link to="/" className="mb-8 inline-block" aria-label="Ver vitrine">
        <Logo size={32} />
      </Link>

      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-500">Painel da loja</p>
        <h1 className="font-display text-xl font-semibold leading-tight truncate" title={store?.name}>
          {store?.name ?? '...'}
        </h1>
        {store && (
          <Link
            to={`/lojas/${store.slug}`}
            target="_blank"
            className="mt-1 inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
          >
            Ver minha loja <ExternalLink size={13} />
          </Link>
        )}
      </div>

      <nav className="space-y-1 flex-1">
        <NavLink to="/loja/pedidos" className={linkClass}>
          <ListChecks size={18} /> Pedidos
        </NavLink>
        <NavLink to="/loja/cardapio" className={linkClass}>
          <UtensilsCrossed size={18} /> Cardápio
        </NavLink>
        <NavLink to="/loja/configuracoes" className={linkClass}>
          <Settings size={18} /> Dados da loja
        </NavLink>
      </nav>

      <button
        onClick={() => {
          logout()
          navigate('/')
        }}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <LogOut size={18} /> Sair
      </button>
    </div>
  )
}
