import { useEffect, useState } from 'react'
import { fetchMyStore } from '../api/store'
import type { Restaurant } from '../types'

// A loja do usuário logado muda raramente: uma busca por sessão de aba basta
let cached: Restaurant | null = null

export function resetMyStoreCache(store: Restaurant | null = null) {
  cached = store
}

export function useMyStore(): Restaurant | null {
  const [store, setStore] = useState<Restaurant | null>(cached)

  useEffect(() => {
    if (cached) return
    let active = true
    fetchMyStore()
      .then((s) => {
        cached = s
        if (active) setStore(s)
      })
      .catch(() => {
        // o painel continua utilizável sem o nome da loja
      })
    return () => {
      active = false
    }
  }, [])

  return store
}
