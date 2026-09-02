import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-surface rounded-2xl shadow-sm ${padding ? 'p-4' : ''} ${className}`}>
      {children}
    </div>
  )
}