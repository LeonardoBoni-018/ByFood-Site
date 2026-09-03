import { MoreHorizontal } from 'lucide-react'
import type { Order, OrderStatus } from '../../types'
import { formatPrice } from '../../lib/formatters'
import { useState } from 'react'
import { updateOrderStatus } from '../../api/orders'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../lib/constants'

interface OrderCardProps {
  order: Order
  onUpdated?: () => void
}

const statusOrder: OrderStatus[] = ['RECEIVED', 'PREPARING', 'READY', 'DELIVERED']

export function OrderCard({ order, onUpdated }: OrderCardProps) {
  const [loading, setLoading] = useState(false)

  const handleAdvance = async () => {
    const idx = statusOrder.indexOf(order.status)
    if (idx === -1 || idx === statusOrder.length - 1) return
    const next = statusOrder[idx + 1]
    setLoading(true)
    try {
      await updateOrderStatus(order.id, next)
      onUpdated?.()
    } catch (err) {
      // ignore for now
    } finally {
      setLoading(false)
    }
  }

  const handleSet = async (s: OrderStatus) => {
    setLoading(true)
    try {
      await updateOrderStatus(order.id, s)
      onUpdated?.()
    } catch {}
    finally { setLoading(false) }
  }

  return (
    <div className="bg-surface rounded-2xl p-4 mb-3 flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-bold">#{String(order.id).padStart(4, '0')}</div>
            <div className="text-sm text-gray-500">{order.customerName} · {order.items.length} itens</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{formatPrice(order.total)}</div>
            <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-3">
          {order.items.slice(0,3).map((it, idx) => (
            <span key={idx} className="inline-block mr-2">{it.itemName}×{it.quantity}</span>
          ))}
          {order.items.length > 3 && <span className="text-gray-400">+{order.items.length - 3} outros</span>}
        </div>
      </div>

      <div className="ml-4 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdvance}
            disabled={loading || order.status === 'DELIVERED'}
            className="px-3 py-1 rounded-xl bg-primary text-white text-sm disabled:opacity-50"
          >
            Avançar
          </button>
          <button
            onClick={() => handleSet('CANCELLED')}
            disabled={loading}
            className="px-3 py-1 rounded-xl bg-danger text-white text-sm disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
        <button className="text-gray-500 hover:text-gray-700"><MoreHorizontal /></button>
      </div>
    </div>
  )
}
