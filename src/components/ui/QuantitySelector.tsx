import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  compact?: boolean
}

export function QuantitySelector({ value, onChange, min = 1, compact = false }: QuantitySelectorProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-1 py-0.5">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-6 h-6 rounded-md bg-white dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-90 shadow-sm"
        >
          <Minus size={12} />
        </button>
        <span className="w-5 text-center font-semibold text-xs text-gray-900 dark:text-white">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors active:scale-90"
        >
          <Plus size={12} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl px-1.5 py-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-90 shadow-sm"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center font-semibold text-sm text-gray-900 dark:text-white">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors active:scale-90"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
