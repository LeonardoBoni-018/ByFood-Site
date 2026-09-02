import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, MessageCircle } from 'lucide-react'
import { fetchOrder } from '../../api/orders'
import type { Order } from '../../types'
import { OrderStatusTimeline } from '../../components/order/OrderStatusTimeline'  
import { Skeleton } from '../../components/ui/Skeleton'
import { formatPrice } from '../../lib/formatters'

export function OrderConfirmedPage() {
  const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetchOrder(Number(id))
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="px-4 py-8 max-w-lg mx-auto space-y-4">
        <Skeleton className="h-20 w-20 rounded-full mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-500">Pedido não encontrado</p>
      </div>
    )
  }

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
            Recebido
          </span>
        </div>
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="bg-surface rounded-2xl p-4 mb-4 text-left">
        <h2 className="font-semibold text-sm text-gray-500 mb-2">Itens do Pedido</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm">
              {item.itemName} <span className="text-gray-400">× {item.quantity}</span>
            </span>
            <span className="text-sm font-semibold">{formatPrice(item.unitPrice * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
          <span className="font-bold">Total</span>
          <span className="font-bold text-lg">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-4 mb-6 text-left">
        <h2 className="font-semibold text-sm text-gray-500 mb-2">Dados do Cliente</h2>
        <p className="text-sm">👤 {order.customerName}</p>
        <p className="text-sm">📞 {order.customerPhone}</p>
        <p className="text-sm">📍 {order.customerAddress}</p>
      </div>

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