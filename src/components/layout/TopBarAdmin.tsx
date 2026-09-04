import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

export function TopBarAdmin() {
  const [open, setOpen] = useState(false)
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="bg-dark text-white px-4 py-3 flex items-center justify-between md:hidden relative z-40">
      <span className="font-bold text-sm">Painel Admin</span>
      <button onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full bg-dark-light border border-white/10 rounded-xl shadow-xl w-48 py-2">
            <NavLink to="/admin/orders" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-white/10">
              Pedidos
            </NavLink>
            <NavLink to="/admin/menu" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-white/10">
              Cardápio
            </NavLink>
            <hr className="border-white/10 my-1" />
            <button onClick={() => { setOpen(false); logout() }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger hover:bg-white/10">
              Sair
            </button>
          </div>
        </>
      )}
    </header>
  )
}
