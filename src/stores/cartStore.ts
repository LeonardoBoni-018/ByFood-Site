import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, MenuItem } from '../types'

export interface CartStore {
  slug: string
  name: string
}

interface CartState {
  /** Loja dona dos itens: o carrinho só aceita itens de uma loja por vez. */
  store: CartStore | null
  items: CartItem[]
  /** Devolve false (sem alterar nada) quando o item é de outra loja; a UI decide se troca. */
  addItem: (menuItem: MenuItem, store: CartStore, quantity?: number) => boolean
  removeItem: (menuItemId: number) => void
  updateQuantity: (menuItemId: number, quantity: number) => void
  clearCart: () => void
  /** Esvazia o carrinho e começa um novo para `store`. */
  replaceWith: (menuItem: MenuItem, store: CartStore) => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      store: null,
      items: [],
      addItem: (menuItem, store, quantity = 1) => {
        const current = get().store
        if (current && current.slug !== store.slug && get().items.length > 0) {
          return false
        }
        const existing = get().items.find((i) => i.menuItem.id === menuItem.id)
        set({
          store,
          items: existing
            ? get().items.map((i) =>
                i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + quantity } : i,
              )
            : [...get().items, { menuItem, quantity }],
        })
        return true
      },
      removeItem: (menuItemId) => {
        const items = get().items.filter((i) => i.menuItem.id !== menuItemId)
        set({ items, store: items.length ? get().store : null })
      },
      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId)
          return
        }
        set({
          items: get().items.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i)),
        })
      },
      clearCart: () => set({ items: [], store: null }),
      replaceWith: (menuItem, store) => set({ store, items: [{ menuItem, quantity: 1 }] }),
      total: () => get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'byfood-cart', version: 2, migrate: () => ({ store: null, items: [] }) },
  ),
)
