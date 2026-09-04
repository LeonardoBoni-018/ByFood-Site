import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 anim-fade-in" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 z-10 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-800 anim-scale-in">
        {children}
      </div>
    </div>
  )
}
