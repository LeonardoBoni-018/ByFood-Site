import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Ops! Algo deu errado',
  description = 'Verifique sua conexão',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mb-4">
        <AlertTriangle size={32} className="text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Tentar Novamente
        </Button>
      )}
    </div>
  )
}