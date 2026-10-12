import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyOrders } from '../../api/orders'
import type { Order } from '../../types'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../lib/constants'
import { formatPrice } from '../../lib/formatters'
import { getErrorMessage } from '../../lib/errors'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'

const PAGE_SIZE = 10

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (pageToLoad: number) => {
    const append = pageToLoad > 0
    if (append) setLoadingMore(true)
    else setLoading(true)
    setError(null)
    try {
      const result = await fetchMyOrders(pageToLoad, PAGE_SIZE)
      setOrders((prev) => (append ? [...prev, ...result.content] : result.content))
      setPage(result.page.number)
      setTotalPages(result.page.totalPages)
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar seus pedidos.'))
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(0)
  }, [load])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-4xl font-semibold text-dark mb-8">Meus pedidos</h1>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState description={error} onRetry={() => load(0)} />}

      {!loading && !error && orders.length === 0 && (
        <EmptyState title="Você ainda não fez pedidos" description="Os pedidos feitos com a sua conta aparecem aqui." />
      )}

      {!loading && !error && orders.length > 0 && (
        <ul className="space-y-4">
          {orders.map((order, i) => (
            <li key={order.id} className="anim-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <Link
                to={`/order/${order.trackingCode}`}
                className="group block bg-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-semibold text-dark truncate">{order.restaurantName}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      {' · '}
                      {order.items.reduce((n, it) => n + it.quantity, 0)} itens
                    </p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <p className="mt-4 font-semibold tabular-nums text-dark">{formatPrice(order.total)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {page + 1 < totalPages && (
        <div className="mt-8 text-center">
          <button
            onClick={() => load(page + 1)}
            disabled={loadingMore}
            className="h-12 px-8 rounded-full border border-gray-300 dark:border-gray-700 font-medium hover:border-dark transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'Carregando...' : 'Ver pedidos anteriores'}
          </button>
        </div>
      )}
    </div>
  )
}
