import client from './client'
import type { MenuItem, Page, MenuItemRequest } from '../types'

/** Cardápio completo da loja do usuário logado (inclui itens indisponíveis). */
export const fetchStoreMenu = (page = 0, size = 100) =>
  client.get<Page<MenuItem>>('/store/menu', { params: { page, size } }).then((r) => r.data)

export const createMenuItem = (data: MenuItemRequest) =>
  client.post<MenuItem>('/store/menu', data).then((r) => r.data)

export const updateMenuItem = (id: number, data: MenuItemRequest) =>
  client.put<MenuItem>(`/store/menu/${id}`, data).then((r) => r.data)

export const deleteMenuItem = (id: number) =>
  client.delete(`/store/menu/${id}`)
