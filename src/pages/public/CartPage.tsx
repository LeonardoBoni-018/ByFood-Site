import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { useCartStore } from '../../stores/cartStore'
// import { useRestaurantStore } from '../../stores/restaurantStore'
import { createOrder } from '../../api/orders'
import { CartItem } from '../../components/cart/CartItem'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { formatPrice } from '../../lib/formatters'

export function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const clearCart = useCartStore((s) => s.clearCart)
//   const restaurant = useRestaurantStore((s) => s.restaurant)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!customerName.trim()) e.customerName = 'Nome é obrigatório'
    if (!customerPhone.trim()) e.customerPhone = 'Telefone é obrigatório'
    if (!customerAddress.trim()) e.customerAddress = 'Endereço é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        items: items.map((i) => ({ menuItemId: i.menuItem.id, quantity: i.quantity })),
      })
      clearCart()
      navigate(`/order/${order.id}/confirmed`)
    } catch {
      setErrors({ submit: 'Erro ao criar pedido. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6">
          <ArrowLeft size={20} /> Voltar
        </button>
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-semibold">Carrinho vazio</p>
          <p className="text-sm">Adicione itens do cardápio primeiro</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6">
        <ArrowLeft size={20} /> Voltar
      </button>

      <h1 className="text-xl font-bold mb-4">Seu Pedido</h1>

      <div className="bg-surface rounded-2xl p-4 mb-4">
        <h2 className="font-semibold text-sm text-gray-500 mb-2">Itens do Pedido</h2>
        {items.map((item) => (
          <CartItem key={item.menuItem.id} item={item} />
        ))}
      </div>

      <div className="bg-surface rounded-2xl p-4 mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Subtotal</span>
          <span>{formatPrice(total())}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Retirada</span>
          <span className="text-success font-semibold">Grátis</span>
        </div>
        <div className="border-t border-gray-100 pt-2 flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-xl text-dark">{formatPrice(total())}</span>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-4 mb-6">
        <h2 className="font-semibold text-sm text-gray-500 mb-3">Seus Dados</h2>
        <div className="space-y-3">
          <Input
            label="Seu nome"
            placeholder="Leonardo Boni"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            error={errors.customerName}
          />
          <Input
            label="Telefone"
            placeholder="(18) 99999-9999"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            error={errors.customerPhone}
          />
          <Input
            label="Endereço de entrega"
            placeholder="Rua das Flores, 123 - Centro"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            error={errors.customerAddress}
          />
        </div>
      </div>

      {errors.submit && (
        <p className="text-danger text-sm text-center mb-4">{errors.submit}</p>
      )}

      <Button
        variant="primary"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        <MessageCircle size={20} />
        {loading ? 'Enviando...' : 'Confirmar Pedido via WhatsApp'}
      </Button>
    </div>
  )
}