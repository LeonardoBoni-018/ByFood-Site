import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { createMenuItem, updateMenuItem } from '../../api/menu'
import type { MenuItem, MenuItemRequest } from '../../types'
import { CATEGORIES } from '../../lib/constants'

interface MenuItemFormProps {
  initial?: MenuItem | null
  onSaved?: () => void
}

export function MenuItemForm({ initial = null, onSaved }: MenuItemFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [price, setPrice] = useState(initial ? String(initial.price) : '')
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0])
  const [available, setAvailable] = useState(initial?.available ?? true)
  const [imageUrl, setImageUrl] = useState<string | undefined>(initial?.imageUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageUrl(String(reader.result))
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    if (!name.trim() || !price) return setError('Preencha nome e preço')

    const body: MenuItemRequest = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      available,
      imageUrl,
    }

    setLoading(true)
    try {
      if (initial) {
        await updateMenuItem(initial.id, body)
      } else {
        await createMenuItem(body)
      }
      onSaved?.()
    } catch (err) {
      setError('Erro ao salvar item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">{initial ? 'Editar Item' : 'Novo Item'}</h2>
      {error && <p className="text-danger mb-3">{error}</p>}
      <div className="space-y-3">
        <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Preço" value={price} onChange={(e) => setPrice(e.target.value)} />
        <label className="text-sm font-medium text-gray-700">Categoria</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="text-sm font-medium text-gray-700">Descrição</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 h-24" />

        <div>
          <label className="text-sm font-medium text-gray-700">Imagem</label>
          <div className="flex items-center gap-3 mt-2">
            <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
            {imageUrl && <img src={imageUrl} alt="preview" className="w-20 h-20 object-cover rounded-md" />}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
            <span className="text-sm">Disponível</span>
          </label>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" type="button" onClick={() => window.history.back()}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </div>
    </form>
  )
}
