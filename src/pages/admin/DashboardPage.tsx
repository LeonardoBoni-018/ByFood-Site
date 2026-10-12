import { useCallback, useEffect, useState } from 'react'
import { fetchStoreOrders } from '../../api/orders'
import type { Order, OrderStatus } from '../../types'
import { OrderStatsBar } from '../../components/order/OrderStatsBar'
import { OrderFilterTabs } from '../../components/order/OrderFilterTabs'
import { OrderCard } from '../../components/order/OrderCard'
import { ErrorState } from '../../components/ui/ErrorState'
import { Skeleton } from '../../components/ui/Skeleton'
import { usePolling } from '../../hooks/usePolling'
import { getErrorMessage } from '../../lib/errors'

const REFRESH_MS = 20_000

export function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const page = await fetchStoreOrders(0, 100)
      setOrders(page.content)
      setError(null)
    } catch (err) {
      // numa atualização em segundo plano mantém a lista atual em vez de apagá-la
      setError(getErrorMessage(err, 'Não foi possível carregar os pedidos.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  // Pedidos novos chegam o dia todo: atualiza sozinho enquanto a aba está aberta
  usePolling(load, REFRESH_MS)

  const filtered = orders.filter((o) => (filter === 'ALL' ? true : o.status === filter))

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-semibold mb-6">Pedidos</h1>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <OrderStatsBar orders={orders} />
          <OrderFilterTabs active={filter} onChange={setFilter} orders={orders} />

          {error && orders.length === 0 ? (
            <ErrorState description={error} onRetry={load} />
          ) : (
            <div>
              {error && <p role="alert" className="text-sm text-danger mb-3">{error}</p>}
              {filtered.map((o) => (
                <OrderCard key={o.id} order={o} onUpdated={load} />
              ))}
              {filtered.length === 0 && <div className="text-center text-gray-500 py-10">Nenhum pedido encontrado</div>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
