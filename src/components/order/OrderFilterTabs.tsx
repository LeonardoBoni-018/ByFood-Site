import type { OrderStatus } from '../../types'

interface OrderFilterTabsProps {
  active: OrderStatus | 'ALL'
  onChange: (s: OrderStatus | 'ALL') => void
}

export function OrderFilterTabs({ active, onChange }: OrderFilterTabsProps) {
  const tabs: (OrderStatus | 'ALL')[] = ['ALL', 'RECEIVED', 'PREPARING', 'READY', 'DELIVERED']

  return (
    <div className="flex gap-2 mb-4">
      {tabs.map((t) => (
        <button
          key={String(t)}
          onClick={() => onChange(t)}
          className={`px-3 py-2 rounded-xl text-sm font-semibold ${active === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          {t === 'ALL' ? 'Todos' : t}
        </button>
      ))}
    </div>
  )
}
