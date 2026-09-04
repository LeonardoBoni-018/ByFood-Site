import { AlertTriangle, RefreshCw } from 'lucide-react'

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
    <div className="flex flex-col items-center justify-center py-20 text-center anim-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-danger-light dark:bg-danger/10 flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-danger" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 max-w-xs">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-hover transition-colors active:scale-[0.97]"
        >
          <RefreshCw size={16} />
          Tentar Novamente
        </button>
      )}
    </div>
  )
}
