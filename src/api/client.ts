import axios from 'axios'
import { useServerStatus } from '../stores/serverStatusStore'

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Contador interno de novas tentativas (apenas leituras). */
    __retry?: number
  }
}

// Em produção (Vercel) aponte VITE_API_URL para a API no Render; em dev o proxy do Vite usa '/api'.
const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') || '/api'

export const SESSION_KEY = 'byfood-session'

/** Espera entre tentativas (ms). Somadas às esperas de cada tentativa, cobrem os ~60 s de um "cold start". */
export const RETRY_DELAYS_MS = [1500, 3000, 5000, 8000, 12000]

const TRANSIENT_STATUS = [502, 503, 504]

/** Lê o token da sessão salva; qualquer falha de armazenamento é tratada como "deslogado". */
export function readToken(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw).token as string | null) : null
  } catch {
    return null
  }
}

const client = axios.create({
  baseURL,
  timeout: 20000, // o Render free pode levar ~1 min para "acordar": a leitura tenta de novo
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = readToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

/** Falhas de rede/timeout e 502/503/504 indicam servidor indisponível por instantes, não erro da requisição. */
function isTransient(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false
  return !error.response || TRANSIENT_STATUS.includes(error.response.status)
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

client.interceptors.response.use(
  (response) => {
    // qualquer resposta prova que a API está de pé
    useServerStatus.getState().setWaking(false)
    return response
  },
  async (error) => {
    const config = error.config

    // Só repete leituras (GET): repetir um POST poderia duplicar um pedido
    if (config && config.method?.toLowerCase() === 'get' && isTransient(error) && !axios.isCancel(error)) {
      const attempt = config.__retry ?? 0
      if (attempt < RETRY_DELAYS_MS.length) {
        config.__retry = attempt + 1
        useServerStatus.getState().setWaking(true)
        await sleep(RETRY_DELAYS_MS[attempt])
        return client(config)
      }
      useServerStatus.getState().setWaking(false)
    }

    const url: string = config?.url ?? ''
    const isAuthRequest = url.includes('/auth/')
    // Token expirado/inválido em rota protegida: limpa a sessão e volta para o login
    if (error.response?.status === 401 && !isAuthRequest && readToken()) {
      try {
        localStorage.removeItem(SESSION_KEY)
      } catch {
        // ignora
      }
      if (!window.location.pathname.startsWith('/entrar')) {
        window.location.href = '/entrar?expirou=1'
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Pré-aquece a API assim que o site abre, para o "cold start" correr em paralelo com o carregamento
 * da página (e não depois do primeiro clique do usuário). Falhas são ignoradas: é só um empurrão.
 */
export function wakeServer(): void {
  void client.get('/actuator/health', { timeout: 60000 }).catch(() => undefined)
}

export default client
