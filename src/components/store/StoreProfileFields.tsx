import type { ChangeEvent } from 'react'
import type { StoreProfile } from '../../types'
import { Input } from '../ui/Input'
import { CUISINE_SUGGESTIONS } from '../../lib/storeProfile'

interface StoreProfileFieldsProps {
  value: StoreProfile
  onChange: (value: StoreProfile) => void
  errors: Record<string, string>
  /** Prefixo das chaves de erro vindas do servidor (ex.: "store." no cadastro). */
  errorPrefix?: string
}

export function StoreProfileFields({ value, onChange, errors, errorPrefix = '' }: StoreProfileFieldsProps) {
  const set = (field: keyof StoreProfile) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...value, [field]: e.target.value })
  const err = (field: string) => errors[field] ?? errors[`${errorPrefix}${field}`]

  return (
    <div className="space-y-4">
      <Input label="Nome da loja" maxLength={120} value={value.name} onChange={set('name')} error={err('name')} />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
        <textarea
          value={value.description ?? ''}
          onChange={set('description')}
          maxLength={500}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
        />
        {err('description') && <span className="text-sm text-danger">{err('description')}</span>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Input label="Tipo de comida" list="cuisines" maxLength={60} value={value.cuisine} onChange={set('cuisine')} error={err('cuisine')} />
          <datalist id="cuisines">
            {CUISINE_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <Input label="Horário (opcional)" placeholder="Seg a Dom, 11h às 23h" maxLength={255} value={value.openingHours ?? ''} onChange={set('openingHours')} error={err('openingHours')} />
      </div>

      <Input label="Endereço" maxLength={255} value={value.address} onChange={set('address')} error={err('address')} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Telefone" type="tel" maxLength={30} value={value.phone} onChange={set('phone')} error={err('phone')} />
        <Input label="WhatsApp dos pedidos" type="tel" placeholder="+55 18 99999-9999" maxLength={30} value={value.whatsappNumber} onChange={set('whatsappNumber')} error={err('whatsappNumber')} />
      </div>

      <Input label="Foto de capa (URL, opcional)" type="url" maxLength={500} value={value.imageUrl ?? ''} onChange={set('imageUrl')} error={err('imageUrl')} />
    </div>
  )
}
