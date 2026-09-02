import type { ReactNode } from 'react'
import type { OrderStatus } from '../../types'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../lib/constants'

interface BadgeProps {
  status?: OrderStatus
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'gray'
  children?: ReactNode
}

const variantColors = {
  success: 'bg-success text-white',
  warning: 'bg-warning text-dark',
  info: 'bg-info text-white',
  danger: 'bg-danger text-white',
  gray: 'bg-gray-400 text-white',
}

export function Badge({ status, variant, children }: BadgeProps) {
  if (status) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[status]}`}>
        {ORDER_STATUS_LABELS[status]}
      </span>
    )
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variantColors[variant || 'gray']}`}>
      {children}
    </span>
  )
}