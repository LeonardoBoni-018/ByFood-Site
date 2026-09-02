import client from './client'
import type { Order, Page, OrderRequest, OrderStatus } from '../types'

export const createOrder = (data: OrderRequest) =>
  client.post<Order>('/public/orders', data).then((r) => r.data)

export const fetchOrder = (id: number) =>
  client.get<Order>(`/public/orders/${id}`).then((r) => r.data)

export const fetchAdminOrders = (page = 0, size = 20) =>
  client.get<Page<Order>>('/admin/orders', { params: { page, size } }).then((r) => r.data)

export const updateOrderStatus = (id: number, status: OrderStatus) =>
  client.put<Order>(`/admin/orders/${id}/status`, { status }).then((r) => r.data)