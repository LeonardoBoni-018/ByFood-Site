import client from './client';
import type { MenuItem, Page, MenuItemRequest } from '../types'

export const fetchPublicMenu = (page = 0, size = 20) =>
  client.get<Page<MenuItem>>('/public/menu', { params: { page, size } }).then((r) => r.data)

export const fetchAdminMenu = (page = 0, size = 20) =>
  client.get<Page<MenuItem>>('/admin/menu', { params: { page, size } }).then((r) => r.data)

export const createMenuItem = (data: MenuItemRequest) =>
  client.post<MenuItem>('/admin/menu', data).then((r) => r.data)

export const updateMenuItem = (id: number, data: MenuItemRequest) =>
  client.put<MenuItem>(`/admin/menu/${id}`, data).then((r) => r.data)

export const deleteMenuItem = (id: number) =>
  client.delete(`/admin/menu/${id}`)