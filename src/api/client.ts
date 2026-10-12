import axios from 'axios'

// Em produção (Vercel) aponte VITE_API_URL para a API no Render; em dev o proxy do Vite usa '/api'.
const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') || '/api'

export const SESSION_KEY = 'byfood-session'

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
  timeout: 60000, // o Render free leva ~30-60s para "acordar" após inatividade
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = readToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? ''
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

export default client
