import client from './client'
import type { Order, Page, OrderRequest, OrderStatus } from '../types'

/** Cria o pedido na loja `slug`; com token (cliente logado) ele entra no histórico da conta. */
export const createOrder = (slug: string, data: OrderRequest) =>
  client.post<Order>(`/public/restaurants/${encodeURIComponent(slug)}/orders`, data).then((r) => r.data)

export const fetchOrder = (trackingCode: string) =>
  client.get<Order>(`/public/orders/${trackingCode}`).then((r) => r.data)

export const fetchMyOrders = (page = 0, size = 20) =>
  client.get<Page<Order>>('/me/orders', { params: { page, size } }).then((r) => r.data)

export const fetchStoreOrders = (page = 0, size = 50) =>
  client.get<Page<Order>>('/store/orders', { params: { page, size } }).then((r) => r.data)

export const updateOrderStatus = (id: number, status: OrderStatus) =>
  client.put<Order>(`/store/orders/${id}/status`, { status }).then((r) => r.data)
