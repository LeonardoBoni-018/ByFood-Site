import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { homeFor, useAuthStore } from '../../stores/authStore'
import { getErrorMessage, httpStatus } from '../../lib/errors'
import { AuthShell } from '../../components/auth/AuthShell'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

/** Só aceita caminhos internos como destino do login (evita redirecionamento para sites externos). */
function safeInternalPath(value: unknown): string | null {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : null
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = safeInternalPath((location.state as { from?: string } | null)?.from)

  if (user) return <Navigate to={from ?? homeFor(user)} replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!username.trim() || !password) {
      setError('Preencha e-mail e senha')
      return
    }
    setLoading(true)
    try {
      const logged = await login(username.trim(), password)
      navigate(logged.role === 'STORE' ? homeFor(logged) : (from ?? homeFor(logged)), { replace: true })
    } catch (err) {
      setError(httpStatus(err) === 401 ? 'E-mail ou senha incorretos' : getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Que bom te ver de novo."
      subtitle="Entre para acompanhar seus pedidos ou gerenciar a sua loja."
      footer={
        <>
          Ainda não tem conta? <Link to="/cadastro" className="text-primary font-semibold">Criar conta</Link>
          <span className="mx-2">·</span>
          <Link to="/para-lojas" className="text-primary font-semibold">Sou lojista</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {params.get('expirou') && !error && (
          <p role="status" className="text-sm text-gray-600 bg-warning-light dark:bg-warning/10 rounded-xl px-4 py-3">
            Sua sessão expirou. Entre novamente para continuar.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-danger bg-danger-light dark:bg-danger/10 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        <Input
          label="E-mail"
          type="text"
          autoComplete="username"
          inputMode="email"
          maxLength={120}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordInput
          label="Senha"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </AuthShell>
  )
}
