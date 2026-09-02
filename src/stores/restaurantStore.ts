import { create } from 'zustand'
import type { Restaurant } from '../types'
import { fetchRestaurant as apiFetch } from '../api/restaurant'

interface RestaurantState {
  restaurant: Restaurant | null
  fetchRestaurant: () => Promise<void>
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurant: null,
  fetchRestaurant: async () => {
    const restaurant = await apiFetch()
    set({ restaurant })
  },
}))