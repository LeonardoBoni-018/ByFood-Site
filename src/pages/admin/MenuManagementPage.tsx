import { useEffect, useState } from 'react'
import { fetchAdminMenu } from '../../api/menu'
import type { MenuItem } from '../../types'
import { MenuItemRow } from '../../components/admin/MenuItemRow'
import { useNavigate } from 'react-router-dom'

export function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([])

  const load = () => fetchAdminMenu(0, 100).then((p) => setItems(p.content)).catch(() => setItems([]))

  useEffect(() => { load() }, [])

  const navigate = useNavigate()

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Cardápio</h1>
        <button onClick={() => navigate('/admin/menu/new')} className="px-4 py-2 rounded-xl bg-primary text-white">Adicionar Item</button>
      </div>

      <div>
        {items.map((it) => (
          <MenuItemRow key={it.id} item={it} onUpdated={load} />
        ))}
        {items.length === 0 && <div className="text-center text-gray-500 py-8">Nenhum item encontrado</div>}
      </div>
    </div>
  )
}
