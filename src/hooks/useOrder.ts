import { useCallback, useEffect, useState } from 'react'
import { fetchOrder } from '../api/orders'
import { getErrorMessage, isNotFound } from '../lib/errors'
import type { Order } from '../types'

const FINAL = ['DELIVERED', 'CANCELLED']

/**
 * Carrega um pedido pelo código de acompanhamento. Com `pollMs`, atualiza periodicamente,
 * pausando quando a aba está oculta ou o pedido já foi finalizado.
 */
export function useOrder(trackingCode: string | undefined, pollMs?: number) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    if (!trackingCode) return
    let active = true
    let timer: ReturnType<typeof setTimeout> | undefined

    const load = async (initial: boolean) => {
      try {
        const data = await fetchOrder(trackingCode)
        if (!active) return
        setOrder(data)
        setError(null)
        setNotFound(false)
        if (pollMs && !FINAL.includes(data.status)) schedule()
      } catch (err) {
        if (!active) return
        if (isNotFound(err)) setNotFound(true)
        else {
          if (initial) setError(getErrorMessage(err))
          if (pollMs) schedule() // falhas transitórias não interrompem o acompanhamento
        }
      } finally {
        if (active && initial) setLoading(false)
      }
    }

    const schedule = () => {
      timer = setTimeout(() => {
        if (document.hidden) schedule()
        else void load(false)
      }, pollMs)
    }

    void load(true)
    return () => {
      active = false
      if (timer) clearTimeout(timer)
    }
  }, [trackingCode, pollMs, attempt])

  return { order, loading, error, notFound, retry }
}
