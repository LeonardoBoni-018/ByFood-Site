import { X, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../stores/cartStore'
import { CartItem } from './CartItem'
import { Button } from '../ui/Button'
import { formatPrice } from '../../lib/formatters'

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-surface shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            <h2 className="font-bold text-lg">Carrinho</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={48} className="mb-4" />
              <p className="font-semibold">Carrinho vazio</p>
              <p className="text-sm">Adicione itens do cardápio</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItem key={item.menuItem.id} item={item} />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-4">
            <div className="flex justify-between mb-4">
              <span className="font-semibold text-gray-600">Total</span>
              <span className="font-bold text-xl text-dark">{formatPrice(total())}</span>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                onClose()
                navigate('/cart')
              }}
            >
              Finalizar Pedido
            </Button>
          </div>
        )}
      </div>
    </>
  )
}