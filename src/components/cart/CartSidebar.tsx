import { X, ShoppingCart, Trash2 } from 'lucide-react'
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
  const itemCount = useCartStore((s) => s.itemCount)
  const clearCart = useCartStore((s) => s.clearCart)

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 lg:hidden anim-fade-in"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col anim-slide-right
        lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] lg:w-80 lg:max-w-none lg:z-30 lg:anim-none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} className="text-primary" />
            <div>
              <h2 className="font-bold text-base text-gray-900 dark:text-white">Carrinho</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{itemCount()} {itemCount() === 1 ? 'item' : 'itens'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 min-h-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={40} className="mb-3 text-gray-300 dark:text-gray-600" />
              <p className="font-semibold text-gray-600 dark:text-gray-300 mb-0.5">Carrinho vazio</p>
              <p className="text-sm text-gray-400">Adicione itens do cardápio</p>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item, index) => (
                <CartItem key={item.menuItem.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatPrice(total())}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(total())}</span>
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
            <button
              onClick={clearCart}
              className="w-full mt-2 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-danger flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  )
}
