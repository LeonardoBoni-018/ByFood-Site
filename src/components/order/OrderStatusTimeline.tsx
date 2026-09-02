import { Check } from 'lucide-react'
import type { OrderStatus } from '../../types'

const steps: { key: OrderStatus; label: string }[] = [
  { key: 'RECEIVED', label: 'Recebido' },
  { key: 'PREPARING', label: 'Preparando' },
  { key: 'READY', label: 'Pronto' },
  { key: 'DELIVERED', label: 'Entregue' },
]

const statusOrder: OrderStatus[] = ['RECEIVED', 'PREPARING', 'READY', 'DELIVERED']

interface OrderStatusTimelineProps {
  status: OrderStatus
}

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
  const currentIndex = statusOrder.indexOf(status)

  return (
    <div className="flex items-center justify-between px-2">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                isCompleted
                  ? 'bg-success text-white'
                  : 'bg-gray-200 text-gray-400'
              } ${isCurrent ? 'ring-2 ring-success ring-offset-2' : ''}`}
            >
              {isCompleted ? <Check size={14} /> : index + 1}
            </div>
            <span className={`text-[10px] ${isCompleted ? 'text-dark font-semibold' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}