import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export function AdminLoginForm() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [show, setShow] = useState(false)

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    if (!username || !password) return setError('Preencha usuário e senha')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/admin/orders')
    } catch (err) {
      setError('Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-surface rounded-2xl p-6 shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Painel Admin</h2>
      {error && <p className="text-danger text-sm mb-3 text-center">{error}</p>}
      <div className="space-y-3">
        <Input label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1 block">Senha</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-2 text-gray-500">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <Button variant="primary" type="submit" className="w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </div>
    </form>
  )
}
