import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
}

export function QuantitySelector({ value, onChange, min = 1 }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
      >
        <Minus size={14} />
      </button>
      <span className="w-6 text-center font-semibold">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}