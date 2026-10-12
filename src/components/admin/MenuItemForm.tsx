import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage, getFieldErrors } from '../../lib/errors'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { createMenuItem, fetchStoreMenu, updateMenuItem } from '../../api/menu'
import type { MenuItem, MenuItemRequest } from '../../types'

interface MenuItemFormProps {
  initial?: MenuItem | null
  onSaved?: () => void
}

/** Aceita "12,50" e "12.50"; devolve NaN para qualquer outra coisa. */
function parsePrice(raw: string): number {
  let normalized = raw.trim()
  // com vírgula decimal, os pontos são separadores de milhar ("1.234,50")
  if (normalized.includes(',')) normalized = normalized.replace(/\./g, '').replace(',', '.')
  return /^\d+(\.\d{1,2})?$/.test(normalized) ? Number(normalized) : NaN
}

export function MenuItemForm({ initial = null, onSaved }: MenuItemFormProps) {
  const navigate = useNavigate()
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [price, setPrice] = useState(initial ? initial.price.toFixed(2).replace('.', ',') : '')
  const [category, setCategory] = useState(initial?.category || '')
  const [available, setAvailable] = useState(initial?.available ?? true)
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '')
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sugere as categorias que a loja já usa, para não criar variações ("Doce" / "Doces")
  useEffect(() => {
    fetchStoreMenu(0, 100)
      .then((page) => setCategories([...new Set(page.content.map((i) => i.category))]))
      .catch(() => setCategories([]))
  }, [])

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Nome é obrigatório'
    const value = parsePrice(price)
    if (Number.isNaN(value) || value <= 0) e.price = 'Informe um preço válido, como 12,50'
    else if (value > 99999.99) e.price = 'Preço muito alto'
    if (!category.trim()) e.category = 'Informe a categoria'
    if (imageUrl.trim() && !/^https?:\/\/\S+$/.test(imageUrl.trim())) e.imageUrl = 'A URL deve começar com http:// ou https://'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const body: MenuItemRequest = {
      name: name.trim(),
      description: description.trim(),
      price: parsePrice(price),
      category: category.trim(),
      available,
      imageUrl: imageUrl.trim() || undefined,
    }

    setLoading(true)
    try {
      if (initial) await updateMenuItem(initial.id, body)
      else await createMenuItem(body)
      onSaved?.()
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { submit: getErrorMessage(err, 'Erro ao salvar item') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-surface rounded-[24px] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 max-w-lg mx-auto"
    >
      <h2 className="font-display text-2xl font-semibold mb-5">{initial ? 'Editar item' : 'Novo item'}</h2>
      {errors.submit && (
        <p role="alert" className="text-sm text-danger bg-danger-light dark:bg-danger/10 rounded-xl px-4 py-3 mb-4">
          {errors.submit}
        </p>
      )}
      <div className="space-y-4">
        <Input label="Nome" maxLength={150} value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Preço (R$)" inputMode="decimal" placeholder="12,50" value={price} onChange={(e) => setPrice(e.target.value)} error={errors.price} />
          <div>
            <Input label="Categoria" list="menu-categories" maxLength={80} placeholder="Ex.: Doces" value={category} onChange={(e) => setCategory(e.target.value)} error={errors.category} />
            <datalist id="menu-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
          />
        </div>

        <div>
          <Input label="Foto (URL)" type="url" maxLength={500} placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} error={errors.imageUrl} />
          {imageUrl.trim() && !errors.imageUrl && (
            <img src={imageUrl.trim()} alt="Pré-visualização" className="mt-3 w-24 h-24 object-cover rounded-xl" onError={(e) => (e.currentTarget.style.display = 'none')} />
          )}
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[var(--color-primary)]" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
          <span className="text-sm">Disponível no cardápio</span>
        </label>

        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" type="button" onClick={() => navigate('/loja/cardapio')}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </div>
    </form>
  )
}
