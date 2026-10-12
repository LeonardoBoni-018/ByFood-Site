import { beforeEach, describe, expect, it } from 'vitest'
import { useCartStore } from './cartStore'
import type { MenuItem } from '../types'

const item = (id: number, price = 10): MenuItem => ({
  id,
  name: `Item ${id}`,
  description: '',
  price,
  category: 'Main',
  available: true,
})

const storeA = { slug: 'loja-a', name: 'Loja A' }
const storeB = { slug: 'loja-b', name: 'Loja B' }

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it('soma quantidades do mesmo item e calcula total', () => {
    const cart = useCartStore.getState()
    cart.addItem(item(1, 10), storeA)
    cart.addItem(item(1, 10), storeA, 2)
    cart.addItem(item(2, 5.5), storeA)

    expect(useCartStore.getState().itemCount()).toBe(4)
    expect(useCartStore.getState().total()).toBeCloseTo(35.5)
  })

  it('recusa itens de outra loja sem alterar a sacola', () => {
    const cart = useCartStore.getState()
    cart.addItem(item(1), storeA)

    expect(cart.addItem(item(2), storeB)).toBe(false)
    expect(useCartStore.getState().store?.slug).toBe('loja-a')
    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('troca de loja quando o usuário confirma', () => {
    const cart = useCartStore.getState()
    cart.addItem(item(1), storeA)
    cart.replaceWith(item(2), storeB)

    expect(useCartStore.getState().store?.slug).toBe('loja-b')
    expect(useCartStore.getState().items.map((i) => i.menuItem.id)).toEqual([2])
  })

  it('libera a loja quando o último item é removido', () => {
    const cart = useCartStore.getState()
    cart.addItem(item(1), storeA)
    cart.removeItem(1)

    expect(useCartStore.getState().store).toBeNull()
    expect(useCartStore.getState().addItem(item(9), storeB)).toBe(true)
  })

  it('remove o item ao diminuir a quantidade para zero', () => {
    const cart = useCartStore.getState()
    cart.addItem(item(1), storeA)
    cart.updateQuantity(1, 0)

    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
