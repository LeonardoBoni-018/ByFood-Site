import { NavLink } from 'react-router-dom'
import { Home, ListChecks, Settings, Menu } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="h-full p-6 bg-surface">
      <div className="mb-8">
        <h1 className="font-bold text-lg">Bistrô byFood</h1>
        <p className="text-sm text-gray-500">Painel Admin</p>
      </div>

      <nav className="space-y-2">
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
    </div>
  )
}
