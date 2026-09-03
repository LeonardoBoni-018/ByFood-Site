import { useEffect, useState } from 'react'
import { fetchAdminOrders } from '../../api/orders'
import type { Order, OrderStatus } from '../../types'
import { OrderStatsBar } from '../../components/order/OrderStatsBar'
import { OrderFilterTabs } from '../../components/order/OrderFilterTabs'
import { OrderCard } from '../../components/order/OrderCard'

export function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL')

  useEffect(() => {
    fetchAdminOrders(0, 100).then((p) => setOrders(p.content)).catch(() => setOrders([]))
  }, [])

  const filtered = orders.filter((o) => (filter === 'ALL' ? true : o.status === filter))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
      <OrderStatsBar />
      <OrderFilterTabs active={filter} onChange={setFilter} />

      <div>
        {filtered.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
        {filtered.length === 0 && <div className="text-center text-gray-500 py-8">Nenhum pedido encontrado</div>}
      </div>
    </div>
  )
}
