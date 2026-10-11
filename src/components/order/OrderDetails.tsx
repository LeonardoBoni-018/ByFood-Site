import { User, Phone, MapPin } from 'lucide-react'
import type { Order } from '../../types'
import { formatPrice } from '../../lib/formatters'

export function OrderItemsCard({ order }: { order: Order }) {
  return (
    <div className="bg-surface rounded-2xl p-4 mb-4 text-left">
      <h2 className="font-semibold text-sm text-gray-500 mb-2">Itens do Pedido</h2>
      {order.items.map((item, i) => (
        <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
          <span className="text-sm">
            {item.itemName} <span className="text-gray-400">× {item.quantity}</span>
          </span>
          <span className="text-sm font-semibold">{formatPrice(item.unitPrice * item.quantity)}</span>
        </div>
      ))}
      <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
        <span className="font-bold">Total</span>
        <span className="font-bold text-lg">{formatPrice(order.total)}</span>
      </div>
    </div>
  )
}

export function CustomerCard({ order }: { order: Order }) {
  return (
    <div className="bg-surface rounded-2xl p-4 mb-6 text-left space-y-1">
      <h2 className="font-semibold text-sm text-gray-500 mb-2">Dados do Cliente</h2>
      <p className="text-sm flex items-center gap-2"><User size={14} aria-hidden /> {order.customerName}</p>
      <p className="text-sm flex items-center gap-2"><Phone size={14} aria-hidden /> {order.customerPhone}</p>
      <p className="text-sm flex items-center gap-2"><MapPin size={14} aria-hidden /> {order.customerAddress}</p>
    </div>
  )
}
