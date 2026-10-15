import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError } from 'axios'
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import client, { RETRY_DELAYS_MS } from './client'
import { useServerStatus } from '../stores/serverStatusStore'

function response(config: InternalAxiosRequestConfig, status: number): AxiosResponse {
  return { data: { ok: true }, status, statusText: '', headers: {}, config }
}

function failure(config: InternalAxiosRequestConfig, status?: number): AxiosError {
  return new AxiosError('falha', status ? 'ERR_BAD_RESPONSE' : 'ERR_NETWORK', config, undefined, status ? response(config, status) : undefined)
}

describe('client: novas tentativas enquanto a API acorda', () => {
  const originalAdapter = client.defaults.adapter

  beforeEach(() => {
    vi.useFakeTimers()
    useServerStatus.getState().setWaking(false)
  })

  afterEach(() => {
    client.defaults.adapter = originalAdapter
    vi.useRealTimers()
  })

  it('repete GET em 503 e limpa o aviso quando a API responde', async () => {
    let calls = 0
    client.defaults.adapter = ((config: InternalAxiosRequestConfig) => {
      calls++
      return calls < 3 ? Promise.reject(failure(config, 503)) : Promise.resolve(response(config, 200))
    }) as AxiosAdapter

    const result = client.get('/public/restaurants')
    await vi.advanceTimersByTimeAsync(RETRY_DELAYS_MS[0])
    expect(useServerStatus.getState().waking).toBe(true)
    await vi.advanceTimersByTimeAsync(RETRY_DELAYS_MS[1])

    expect((await result).status).toBe(200)
    expect(calls).toBe(3)
    expect(useServerStatus.getState().waking).toBe(false)
  })

  it('não repete POST para não duplicar pedidos', async () => {
    let calls = 0
    client.defaults.adapter = ((config: InternalAxiosRequestConfig) => {
      calls++
      return Promise.reject(failure(config))
    }) as AxiosAdapter

    await expect(client.post('/public/restaurants/x/orders', {})).rejects.toBeTruthy()
    expect(calls).toBe(1)
  })

  it('não repete erros 4xx', async () => {
    let calls = 0
    client.defaults.adapter = ((config: InternalAxiosRequestConfig) => {
      calls++
      return Promise.reject(failure(config, 404))
    }) as AxiosAdapter

    await expect(client.get('/public/restaurants/nao-existe')).rejects.toBeTruthy()
    expect(calls).toBe(1)
  })

  it('desiste depois de esgotar as tentativas', async () => {
    let calls = 0
    client.defaults.adapter = ((config: InternalAxiosRequestConfig) => {
      calls++
      return Promise.reject(failure(config, 503))
    }) as AxiosAdapter

    const result = client.get('/public/restaurants').catch((e) => e)
    await vi.advanceTimersByTimeAsync(RETRY_DELAYS_MS.reduce((a, b) => a + b, 0) + 1000)

    expect(await result).toBeInstanceOf(AxiosError)
    expect(calls).toBe(RETRY_DELAYS_MS.length + 1)
    expect(useServerStatus.getState().waking).toBe(false)
  })
})
