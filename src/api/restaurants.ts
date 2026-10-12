import client from './client'
import type { MenuItem, Page, Restaurant, RestaurantSummary } from '../types'

export const searchRestaurants = (
  params: { q?: string; cuisine?: string; page?: number; size?: number },
  signal?: AbortSignal,
) => client.get<Page<RestaurantSummary>>('/public/restaurants', { params, signal }).then((r) => r.data)

export const fetchCuisines = () =>
  client.get<string[]>('/public/restaurants/cuisines').then((r) => r.data)

export const fetchRestaurant = (slug: string) =>
  client.get<Restaurant>(`/public/restaurants/${encodeURIComponent(slug)}`).then((r) => r.data)

export const fetchRestaurantMenu = (slug: string) =>
  client
    .get<Page<MenuItem>>(`/public/restaurants/${encodeURIComponent(slug)}/menu`, { params: { size: 100 } })
    .then((r) => r.data)
