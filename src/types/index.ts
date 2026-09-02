export interface Restaurant {
  id: number
  name: string
  description: string
  address: string
  phone: string
  whatsappNumber: string
  openingHours: string
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export interface Order {
  id: number
  customerName: string
  customerPhone: string
  customerAddress: string
  status: OrderStatus
  total: number
  items: OrderItem[]
  createdAt: string
  whatsappLink: string
}

export interface OrderItem {
  itemName: string
  unitPrice: number
  quantity: number
}

export type OrderStatus = 'RECEIVED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface MenuItemRequest {
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

export interface OrderRequest {
  customerName: string
  customerPhone: string
  customerAddress: string
  items: { menuItemId: number; quantity: number }[]
}