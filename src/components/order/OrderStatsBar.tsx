import { useEffect, useState } from 'react'
import { fetchAdminOrders } from '../../api/orders'
import type { Order } from '../../types'

export function OrderStatsBar() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchAdminOrders(0, 100).then((p) => setOrders(p.content)).catch(() => setOrders([]))
  }, [])

  const total = orders.reduce((s, o) => s + o.total, 0)
  const count = orders.length
  const pending = orders.filter((o) => o.status === 'RECEIVED').length

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-surface rounded-2xl p-4">
        <div className="text-sm text-gray-500">Pedidos</div>
        <div className="text-xl font-bold">{count}</div>
      </div>
      <div className="bg-surface rounded-2xl p-4">
        <div className="text-sm text-gray-500">Receita</div>
        <div className="text-xl font-bold">R$ {total.toFixed(2)}</div>
      </div>
      <div className="bg-surface rounded-2xl p-4">
        <div className="text-sm text-gray-500">Pendentes</div>
        <div className="text-xl font-bold">{pending}</div>
      </div>
    </div>
  )
}
