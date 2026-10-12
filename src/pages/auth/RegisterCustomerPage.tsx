import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { homeFor, useAuthStore } from '../../stores/authStore'
import { getErrorMessage, getFieldErrors } from '../../lib/errors'
import { AuthShell } from '../../components/auth/AuthShell'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+()\-\s]{8,30}$/

export function RegisterCustomerPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const register = useAuthStore((s) => s.registerCustomer)

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={homeFor(user)} replace />

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!EMAIL_PATTERN.test(form.email.trim())) e.email = 'E-mail inválido'
    if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) e.phone = 'Telefone inválido'
    if (form.password.length < 8) e.password = 'A senha deve ter pelo menos 8 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const created = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      })
      navigate(homeFor(created), { replace: true })
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { submit: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Crie sua conta."
      subtitle="Guarde seus dados e acompanhe todos os pedidos num só lugar."
      footer={
        <>
          Já tem conta? <Link to="/entrar" className="text-primary font-semibold">Entrar</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.submit && (
          <p role="alert" className="text-sm text-danger bg-danger-light dark:bg-danger/10 rounded-xl px-4 py-3">
            {errors.submit}
          </p>
        )}
        <Input label="Nome" autoComplete="name" maxLength={120} value={form.name} onChange={set('name')} error={errors.name} />
        <Input label="E-mail" type="email" autoComplete="email" maxLength={120} value={form.email} onChange={set('email')} error={errors.email} />
        <Input label="Telefone (opcional)" type="tel" autoComplete="tel" maxLength={30} value={form.phone} onChange={set('phone')} error={errors.phone} />
        <PasswordInput label="Senha" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} />
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
    </AuthShell>
  )
}
