import { Link } from 'react-router-dom'
import { Skeleton } from '../ui/Skeleton'
import { ErrorState } from '../ui/ErrorState'

export function OrderLoading() {
  return (
    <div className="px-4 py-8 max-w-lg mx-auto space-y-4">
      <Skeleton className="h-20 w-20 rounded-full mx-auto" />
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export function OrderUnavailable({ notFound, error, onRetry }: { notFound: boolean; error: string | null; onRetry: () => void }) {
  if (notFound) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Pedido não encontrado</p>
        <Link to="/" className="text-primary font-semibold">Voltar ao cardápio</Link>
      </div>
    )
  }
  return <ErrorState description={error ?? undefined} onRetry={onRetry} />
}
