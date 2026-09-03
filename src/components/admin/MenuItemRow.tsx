import { Edit, Trash } from 'lucide-react'
import type { MenuItem } from '../../types'
import { formatPrice } from '../../lib/formatters'
import { useState } from 'react'
import { updateMenuItem, deleteMenuItem } from '../../api/menu'

interface MenuItemRowProps {
  item: MenuItem
  onUpdated?: () => void
}

export function MenuItemRow({ item, onUpdated }: MenuItemRowProps) {
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      await updateMenuItem(item.id, {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        available: !item.available,
        imageUrl: item.imageUrl,
      })
      onUpdated?.()
    } catch {}
    finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Remover item?')) return
    setLoading(true)
    try {
      await deleteMenuItem(item.id)
      onUpdated?.()
    } catch {}
    finally { setLoading(false) }
  }

  return (
    <div className="bg-surface rounded-2xl p-3 mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <span>🍽️</span>}
        </div>
        <div>
          <div className="font-semibold">{item.name}</div>
          <div className="text-sm text-gray-500">{formatPrice(item.price)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggle} className={`px-3 py-1 rounded-xl text-sm ${item.available ? 'bg-success text-white' : 'bg-gray-100 text-gray-600'}`} disabled={loading}>
          {item.available ? 'Ativo' : 'Inativo'}
        </button>
        <button className="text-gray-500" title="Editar"><Edit size={16} /></button>
        <button onClick={handleDelete} className="text-danger" title="Remover"><Trash size={16} /></button>
      </div>
    </div>
  )
}
