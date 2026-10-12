import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const item = 'block px-4 py-2.5 text-sm hover:bg-white/10'

export function TopBarAdmin() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="bg-dark text-background px-4 h-14 flex items-center justify-between md:hidden relative z-40">
      <span className="text-sm font-semibold tracking-wide">Painel da loja</span>
      <button onClick={() => setOpen(!open)} aria-label="Abrir menu" aria-expanded={open}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="anim-scale-in absolute right-2 top-full mt-1 bg-dark-light border border-white/10 rounded-2xl shadow-xl w-52 py-2 origin-top-right">
            <NavLink to="/loja/pedidos" onClick={() => setOpen(false)} className={item}>Pedidos</NavLink>
            <NavLink to="/loja/cardapio" onClick={() => setOpen(false)} className={item}>Cardápio</NavLink>
            <NavLink to="/loja/configuracoes" onClick={() => setOpen(false)} className={item}>Dados da loja</NavLink>
            <NavLink to="/" onClick={() => setOpen(false)} className={item}>Ver vitrine</NavLink>
            <hr className="border-white/10 my-1" />
            <button
              onClick={() => {
                setOpen(false)
                logout()
                navigate('/')
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-mustard hover:bg-white/10"
            >
              Sair
            </button>
          </div>
        </>
      )}
    </header>
  )
}
