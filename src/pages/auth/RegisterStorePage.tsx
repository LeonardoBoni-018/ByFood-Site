import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ClipboardList, MessageCircle, UtensilsCrossed } from 'lucide-react'
import { homeFor, useAuthStore } from '../../stores/authStore'
import { getErrorMessage, getFieldErrors } from '../../lib/errors'
import { EMPTY_STORE_PROFILE, validateStoreProfile } from '../../lib/storeProfile'
import type { StoreProfile } from '../../types'
import { PasswordInput } from '../../components/auth/PasswordInput'
import { StoreProfileFields } from '../../components/store/StoreProfileFields'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const BENEFITS = [
  { icon: UtensilsCrossed, title: 'Monte o cardápio', text: 'Cadastre pratos, preços, fotos e categorias. Pause itens quando acabarem.' },
  { icon: ClipboardList, title: 'Receba pedidos no painel', text: 'Cada pedido chega organizado, com status do preparo até a entrega.' },
  { icon: MessageCircle, title: 'Feche pelo WhatsApp', text: 'O cliente confirma pelo seu número, com o resumo do pedido já escrito.' },
]

export function RegisterStorePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const registerStore = useAuthStore((s) => s.registerStore)

  const [owner, setOwner] = useState({ ownerName: '', email: '', password: '' })
  const [store, setStore] = useState<StoreProfile>(EMPTY_STORE_PROFILE)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  if (user?.role === 'STORE') return <Navigate to={homeFor(user)} replace />

  function validate() {
    const e: Record<string, string> = {}
    if (!owner.ownerName.trim()) e.ownerName = 'Informe o nome do responsável'
    if (!EMAIL_PATTERN.test(owner.email.trim())) e.email = 'E-mail inválido'
    if (owner.password.length < 8) e.password = 'A senha deve ter pelo menos 8 caracteres'
    const storeErrors = validateStoreProfile(store)
    setErrors({ ...e, ...Object.fromEntries(Object.entries(storeErrors).map(([k, v]) => [`store.${k}`, v])) })
    return Object.keys(e).length === 0 && Object.keys(storeErrors).length === 0
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const created = await registerStore({
        ownerName: owner.ownerName.trim(),
        email: owner.email.trim(),
        password: owner.password,
        store: {
          ...store,
          description: store.description?.trim() || undefined,
          openingHours: store.openingHours?.trim() || undefined,
          imageUrl: store.imageUrl?.trim() || undefined,
        },
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
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-16 grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
      <div className="lg:sticky lg:top-28">
        <p className="anim-fade-in text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-5">Para lojas</p>
        <h1 className="font-display text-[40px] sm:text-6xl leading-[1.04] font-semibold text-dark">
          Sua loja no ar,
          <br />
          <span className="italic font-normal">do seu jeito.</span>
        </h1>
        <p className="anim-fade-up delay-2 mt-6 max-w-md text-gray-600 dark:text-gray-400 leading-relaxed">
          Crie a conta da sua loja, monte o cardápio e comece a receber pedidos. A gente cuida da vitrine; a
          conversa com o cliente continua no seu WhatsApp.
        </p>

        <ul className="mt-10 space-y-6">
          {BENEFITS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="anim-fade-up flex gap-4" style={{ animationDelay: `${300 + i * 90}ms` }}>
              <span className="shrink-0 w-11 h-11 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-primary">
                <Icon size={19} />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-dark">{title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="anim-fade-up delay-2 bg-surface rounded-[24px] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-8"
      >
        {errors.submit && (
          <p role="alert" className="text-sm text-danger bg-danger-light dark:bg-danger/10 rounded-xl px-4 py-3">
            {errors.submit}
          </p>
        )}

        <fieldset className="space-y-4">
          <legend className="font-display text-xl font-semibold text-dark mb-1">Responsável</legend>
          <Input label="Seu nome" autoComplete="name" maxLength={120} value={owner.ownerName} onChange={(e) => setOwner({ ...owner, ownerName: e.target.value })} error={errors.ownerName} />
          <Input label="E-mail de acesso" type="email" autoComplete="email" maxLength={120} value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} error={errors.email} />
          <PasswordInput label="Senha" autoComplete="new-password" value={owner.password} onChange={(e) => setOwner({ ...owner, password: e.target.value })} error={errors.password} />
        </fieldset>

        <fieldset>
          <legend className="font-display text-xl font-semibold text-dark mb-4">Sobre a loja</legend>
          <StoreProfileFields value={store} onChange={setStore} errors={errors} errorPrefix="store." />
        </fieldset>

        <div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Criando loja...' : 'Criar minha loja'}
          </Button>
          <p className="mt-4 text-sm text-center text-gray-500">
            Já tem conta? <Link to="/entrar" className="text-primary font-semibold">Entrar</Link>
          </p>
        </div>
      </form>
    </div>
  )
}
