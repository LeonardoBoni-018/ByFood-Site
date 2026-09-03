import { MoreHorizontal } from 'lucide-react'
import type { Order } from '../../types'
import { formatPrice } from '../../lib/formatters'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
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

        <div className="text-sm text-gray-600">
          {order.items.slice(0,3).map((it, idx) => (
            <span key={idx} className="inline-block mr-2">{it.itemName}×{it.quantity}</span>
          ))}
          {order.items.length > 3 && <span className="text-gray-400">+{order.items.length - 3} outros</span>}
        </div>
      </div>

      <div className="ml-4">
        <button className="text-gray-500 hover:text-gray-700"><MoreHorizontal /></button>
      </div>
    </div>
  )
}
