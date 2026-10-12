import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'
import { getErrorMessage } from '../../lib/errors'
import type { MenuItem } from '../../types'
import { formatPrice } from '../../lib/formatters'
import { updateMenuItem, deleteMenuItem } from '../../api/menu'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface MenuItemRowProps {
  item: MenuItem
  onUpdated?: () => void
}

export function MenuItemRow({ item, onUpdated }: MenuItemRowProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

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
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteMenuItem(item.id)
      setConfirmOpen(false)
      onUpdated?.()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-3 mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="font-display italic text-xl text-gray-400">{item.name.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="font-display font-semibold truncate">{item.name}</div>
          <div className="text-sm text-gray-500 truncate">
            {item.category} · <span className="tabular-nums">{formatPrice(item.price)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={toggle}
          disabled={loading}
          aria-pressed={item.available}
          className={`px-3.5 h-9 rounded-full text-sm font-medium transition-colors ${
            item.available ? 'bg-success text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          {item.available ? 'Ativo' : 'Inativo'}
        </button>
        <button
          onClick={() => navigate(`/loja/cardapio/${item.id}/editar`)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={`Editar ${item.name}`}
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-danger hover:bg-danger/10 transition-colors"
          aria-label={`Remover ${item.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <h3 className="font-display text-xl font-semibold mb-2">Remover do cardápio?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          “{item.name}” deixa de aparecer para os clientes. Pedidos antigos continuam intactos.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>Remover</Button>
        </div>
      </Modal>
    </div>
  )
}
