import { NavLink } from 'react-router-dom'
import { ListChecks, Settings, Menu, LogOut } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

export function Sidebar() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="h-full flex flex-col p-6 bg-surface">
      <div className="mb-8">
        <h1 className="font-bold text-lg">Bistrô byFood</h1>
        <p className="text-sm text-gray-500">Painel Admin</p>
      </div>

      <nav className="space-y-2 flex-1">
        <NavLink to="/admin/orders" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 font-semibold' : 'text-gray-600'}`}>
          <ListChecks size={16} /> Pedidos
        </NavLink>
        <NavLink to="/admin/menu" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 font-semibold' : 'text-gray-600'}`}>
          <Menu size={16} /> Cardápio
        </NavLink>
        <NavLink to="/admin/config" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-primary/10 font-semibold' : 'text-gray-600'}`}>
          <Settings size={16} /> Configurações
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <LogOut size={16} /> Sair
      </button>
    </div>
  )
}
