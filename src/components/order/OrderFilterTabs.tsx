import type { Order, OrderStatus } from '../../types'
import { ORDER_STATUS_LABELS } from '../../lib/constants'

interface OrderFilterTabsProps {
  active: OrderStatus | 'ALL'
  onChange: (s: OrderStatus | 'ALL') => void
  orders: Order[]
}

const TABS: (OrderStatus | 'ALL')[] = ['ALL', 'RECEIVED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']

export function OrderFilterTabs({ active, onChange, orders }: OrderFilterTabsProps) {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide -mx-1 px-1">
      {TABS.map((t) => {
        const count = t === 'ALL' ? orders.length : orders.filter((o) => o.status === t).length
        const isActive = active === t
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            aria-pressed={isActive}
            className={`shrink-0 h-10 px-4 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-dark text-background'
                : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-dark'
            }`}
          >
            {t === 'ALL' ? 'Todos' : ORDER_STATUS_LABELS[t]}
            <span className="ml-1.5 tabular-nums opacity-60">{count}</span>
          </button>
        )
      })}
    </div>
  )
}
