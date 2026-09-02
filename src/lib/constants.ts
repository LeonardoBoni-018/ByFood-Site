import type { OrderStatus } from '../types'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: 'Recebido',
  PREPARING: 'Em Preparo',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  RECEIVED: 'bg-warning text-dark',
  PREPARING: 'bg-info text-white',
  READY: 'bg-success text-white',
  DELIVERED: 'bg-gray-400 text-white',
  CANCELLED: 'bg-danger text-white',
}

export const CATEGORIES = ['Todos', 'Pizzas', 'Burgers', 'Bebidas', 'Sobremesas'] as const