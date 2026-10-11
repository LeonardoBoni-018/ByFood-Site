import { useParams } from 'react-router-dom'
import { CheckCircle, MessageCircle } from 'lucide-react'
import { useOrder } from '../../hooks/useOrder'
import { OrderStatusTimeline } from '../../components/order/OrderStatusTimeline'
import { ORDER_STATUS_LABELS } from '../../lib/constants'
import { OrderItemsCard, CustomerCard } from '../../components/order/OrderDetails'
import { OrderLoading, OrderUnavailable } from '../../components/order/OrderPageState'

export function OrderConfirmedPage() {
  const { code } = useParams<{ code: string }>()
  const { order, loading, error, notFound, retry } = useOrder(code)

  if (loading) return <OrderLoading />
  if (!order) return <OrderUnavailable notFound={notFound} error={error} onRetry={retry} />

  return (
    <div className="px-4 py-8 max-w-lg mx-auto text-center">
      <div className="mb-6">
        <CheckCircle size={80} className="text-success mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-dark mb-1">Pedido Confirmado!</h1>
        <p className="text-gray-500">Seu pedido foi recebido com sucesso.</p>
      </div>

      <div className="bg-surface rounded-2xl p-4 mb-4 text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-lg">#{String(order.id).padStart(4, '0')}</span>
          <span className="bg-warning text-dark px-3 py-1 rounded-full text-xs font-semibold">
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
        <OrderStatusTimeline status={order.status} />
      </div>

      <OrderItemsCard order={order} />
      <CustomerCard order={order} />

      <a
        href={order.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-success text-white px-6 py-3 rounded-xl font-semibold hover:bg-success/90 transition-colors"
      >
        <MessageCircle size={20} />
        Enviar Pedido pelo WhatsApp
      </a>
    </div>
  )
}
