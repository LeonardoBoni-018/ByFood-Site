import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'Nenhum item encontrado',
  description = 'O cardápio está sendo atualizado',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center anim-fade-up">
      <PackageOpen size={40} className="text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">{description}</p>
    </div>
  )
}
