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

interface OrderUnavailableProps {
  notFound: boolean
  error: string | null
  onRetry: () => void
  /** O que não foi encontrado, para a mensagem (ex.: "Pedido", "Loja"). */
  subject?: string
}

export function OrderUnavailable({ notFound, error, onRetry, subject = 'Pedido' }: OrderUnavailableProps) {
  if (notFound) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="font-display text-2xl text-dark mb-2">{subject} não encontrado</p>
        <p className="text-gray-500 mb-6">O endereço pode estar incorreto ou a página foi removida.</p>
        <Link to="/" className="text-primary font-semibold">Ver lojas</Link>
      </div>
    )
  }
  return <ErrorState description={error ?? undefined} onRetry={onRetry} />
}
