import type { Order } from '../../types'
import { formatPrice } from '../../lib/formatters'

/** Resumo calculado a partir da lista já carregada pela página (sem nova chamada à API). */
export function OrderStatsBar({ orders }: { orders: Order[] }) {
  const active = orders.filter((o) => o.status !== 'CANCELLED')
  const revenue = active.reduce((s, o) => s + o.total, 0)
  const pending = orders.filter((o) => o.status === 'RECEIVED').length

  const stats = [
    { label: 'Pedidos', value: String(orders.length) },
    { label: 'Receita', value: formatPrice(revenue) },
    { label: 'Aguardando', value: String(pending), highlight: pending > 0 },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-sm text-gray-500">{s.label}</div>
          <div className={`font-display text-2xl font-semibold tabular-nums ${s.highlight ? 'text-primary' : ''}`}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}
