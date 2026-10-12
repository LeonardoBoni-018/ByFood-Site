import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  compact?: boolean
}

export function QuantitySelector({ value, onChange, min = 1, compact = false }: QuantitySelectorProps) {
  const btn = compact ? 'w-7 h-7' : 'w-9 h-9'
  const icon = compact ? 13 : 15

  return (
    <div className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-700 bg-surface">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Diminuir quantidade"
        className={`${btn} rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors active:scale-90`}
      >
        <Minus size={icon} />
      </button>
      <span key={value} className="anim-pop min-w-5 text-center font-semibold text-sm tabular-nums text-dark">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        aria-label="Aumentar quantidade"
        className={`${btn} rounded-full flex items-center justify-center text-gray-600 hover:text-primary transition-colors active:scale-90`}
      >
        <Plus size={icon} />
      </button>
    </div>
  )
}
