import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import { createOrder } from '../../api/orders'
import { getErrorMessage } from '../../lib/errors'
import { CartItem } from '../../components/cart/CartItem'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { formatPrice } from '../../lib/formatters'

const PHONE_PATTERN = /^[0-9+()\-\s]{8,30}$/

export function CartPage() {
  const navigate = useNavigate()
  const store = useCartStore((s) => s.store)
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const clearCart = useCartStore((s) => s.clearCart)
  const user = useAuthStore((s) => s.user)

  // Cliente logado já tem nome e telefone: poupa digitação
  const [customerName, setCustomerName] = useState(user?.role === 'CUSTOMER' ? user.name : '')
  const [customerPhone, setCustomerPhone] = useState(user?.role === 'CUSTOMER' ? (user.phone ?? '') : '')
  const [customerAddress, setCustomerAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!customerName.trim()) e.customerName = 'Nome é obrigatório'
    if (!customerPhone.trim()) e.customerPhone = 'Telefone é obrigatório'
    else if (!PHONE_PATTERN.test(customerPhone.trim())) e.customerPhone = 'Telefone inválido'
    if (!customerAddress.trim()) e.customerAddress = 'Endereço é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!store || !validate()) return
    setLoading(true)
    try {
      const order = await createOrder(store.slug, {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        items: items.map((i) => ({ menuItemId: i.menuItem.id, quantity: i.quantity })),
      })
      clearCart()
      navigate(`/order/${order.trackingCode}/confirmed`)
    } catch (err) {
      setErrors({ submit: getErrorMessage(err, 'Erro ao criar pedido. Tente novamente.') })
    } finally {
      setLoading(false)
    }
  }

  if (!store || items.length === 0) {
    return (
      <div className="px-4 py-16 max-w-lg mx-auto text-center">
        <p className="font-display text-3xl text-dark mb-2">Sua sacola está vazia</p>
        <p className="text-gray-500 mb-6">Escolha uma loja e adicione os pratos que quiser.</p>
        <Link to="/" className="inline-flex h-12 items-center px-7 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-colors">
          Ver lojas
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={() => navigate(`/lojas/${store.slug}`)} className="flex items-center gap-2 text-gray-500 hover:text-dark transition-colors mb-6">
        <ArrowLeft size={20} /> Voltar para {store.name}
      </button>

      <h1 className="font-display text-3xl font-semibold mb-1">Seu pedido</h1>
      <p className="text-gray-500 mb-5">em {store.name}</p>

      <div className="bg-surface rounded-2xl p-4 mb-4">
        <h2 className="font-semibold text-sm text-gray-500 mb-2">Itens do pedido</h2>
        {items.map((item) => (
          <CartItem key={item.menuItem.id} item={item} />
        ))}
      </div>

      <div className="bg-surface rounded-2xl p-4 mb-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-display font-semibold text-xl text-dark tabular-nums">{formatPrice(total())}</span>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-4 mb-6">
        <h2 className="font-semibold text-sm text-gray-500 mb-3">Seus dados</h2>
        <div className="space-y-3">
          <Input
            label="Seu nome"
            autoComplete="name"
            maxLength={120}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            error={errors.customerName}
          />
          <Input
            label="Telefone"
            placeholder="(18) 99999-9999"
            autoComplete="tel"
            inputMode="tel"
            maxLength={30}
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            error={errors.customerPhone}
          />
          <Input
            label="Endereço de entrega"
            placeholder="Rua das Flores, 123 - Centro"
            autoComplete="street-address"
            maxLength={255}
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            error={errors.customerAddress}
          />
        </div>
        {!user && (
          <p className="mt-4 text-sm text-gray-500">
            <Link to="/entrar" state={{ from: '/cart' }} className="text-primary font-semibold">Entre</Link> para guardar este pedido no seu histórico.
          </p>
        )}
      </div>

      {errors.submit && (
        <p role="alert" className="text-danger text-sm text-center mb-4">{errors.submit}</p>
      )}

      <Button
        variant="primary"
        size="lg"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        <MessageCircle size={20} />
        {loading ? 'Enviando...' : 'Confirmar pedido'}
      </Button>
    </div>
  )
}
