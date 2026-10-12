import client from './client'
import type { Restaurant, StoreProfile } from '../types'

export const fetchMyStore = () => client.get<Restaurant>('/store/restaurant').then((r) => r.data)

export const updateMyStore = (data: StoreProfile) =>
  client.put<Restaurant>('/store/restaurant', data).then((r) => r.data)
