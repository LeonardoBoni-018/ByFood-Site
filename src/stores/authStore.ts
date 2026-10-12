import { create } from 'zustand'
import { login as apiLogin, registerCustomer, registerStore } from '../api/auth'
import { SESSION_KEY } from '../api/client'
import { resetMyStoreCache } from '../hooks/useMyStore'
import type { LoginResponse, RegisterCustomerRequest, RegisterStoreRequest, User } from '../types'

interface Session {
  token: string
  expiresAt: string
  user: User
}

interface AuthState {
  token: string | null
  user: User | null
  login: (username: string, password: string) => Promise<User>
  registerCustomer: (data: RegisterCustomerRequest) => Promise<User>
  registerStore: (data: RegisterStoreRequest) => Promise<User>
  logout: () => void
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as Session
    // sessão vencida não deve parecer logada: o servidor recusaria o token de qualquer forma
    if (!session.token || !session.user || new Date(session.expiresAt).getTime() < Date.now()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

function saveSession(response: LoginResponse): Session {
  const session: Session = { token: response.token, expiresAt: response.expiresAt, user: response.user }
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // sem armazenamento (modo privado): a sessão vale só até recarregar a página
  }
  return session
}

const initial = loadSession()

export const useAuthStore = create<AuthState>((set) => {
  const authenticate = async (request: Promise<LoginResponse>) => {
    const session = saveSession(await request)
    resetMyStoreCache()
    set({ token: session.token, user: session.user })
    return session.user
  }

  return {
    token: initial?.token ?? null,
    user: initial?.user ?? null,
    login: (username, password) => authenticate(apiLogin({ username, password })),
    registerCustomer: (data) => authenticate(registerCustomer(data)),
    registerStore: (data) => authenticate(registerStore(data)),
    logout: () => {
      try {
        localStorage.removeItem(SESSION_KEY)
      } catch {
        // ignora
      }
      resetMyStoreCache()
      set({ token: null, user: null })
    },
  }
})

/** Rota inicial de cada papel depois do login. */
export function homeFor(user: User): string {
  return user.role === 'STORE' ? '/loja/pedidos' : '/'
}
