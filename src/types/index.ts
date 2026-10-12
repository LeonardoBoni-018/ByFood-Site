export type UserRole = 'CUSTOMER' | 'STORE'

export interface User {
  id: number
  name: string
  login: string
  phone?: string | null
  role: UserRole
}

export interface Restaurant {
  id: number
  slug: string
  name: string
  description?: string | null
  cuisine: string
  address: string
  phone: string
  whatsappNumber: string
  openingHours?: string | null
  imageUrl?: string | null
  active: boolean
}

/** Versão enxuta devolvida pela vitrine de lojas (sem telefone/WhatsApp). */
export interface RestaurantSummary {
  slug: string
  name: string
  description?: string | null
  cuisine: string
  openingHours?: string | null
  imageUrl?: string | null
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  available: boolean
  imageUrl?: string
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export interface Order {
  id: number
  trackingCode: string
  restaurantName: string
  restaurantSlug: string
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

/** Formato de página do Spring Data 4: os metadados ficam dentro de `page`. */
export interface Page<T> {
  content: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
  user: User
}

export interface RegisterCustomerRequest {
  name: string
  email: string
  phone?: string
  password: string
}

export interface StoreProfile {
  name: string
  description?: string
  cuisine: string
  address: string
  phone: string
  whatsappNumber: string
  openingHours?: string
  imageUrl?: string
}

export interface RegisterStoreRequest {
  ownerName: string
  email: string
  password: string
  store: StoreProfile
}

export interface MenuItemRequest {
  name: string
  description: string
  price: number
  category: string
  available: boolean
  imageUrl?: string
}

export interface OrderRequest {
  customerName: string
  customerPhone: string
  customerAddress: string
  items: { menuItemId: number; quantity: number }[]
}
