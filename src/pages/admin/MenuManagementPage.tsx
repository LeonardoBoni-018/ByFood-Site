import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { fetchStoreMenu } from '../../api/menu'
import type { MenuItem } from '../../types'
import { MenuItemRow } from '../../components/admin/MenuItemRow'
import { ErrorState } from '../../components/ui/ErrorState'
import { Skeleton } from '../../components/ui/Skeleton'
import { getErrorMessage } from '../../lib/errors'

export function MenuManagementPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const page = await fetchStoreMenu(0, 100)
      setItems(page.content)
      setError(null)
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar o cardápio.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-3xl font-semibold">Cardápio</h1>
        <button
          onClick={() => navigate('/loja/cardapio/novo')}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
        >
          <Plus size={18} /> Novo item
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[74px] w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState description={error} onRetry={load} />}

      {!loading && !error && (
        <div>
          {items.map((it) => (
            <MenuItemRow key={it.id} item={it} onUpdated={load} />
          ))}
          {items.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              Seu cardápio está vazio. Adicione o primeiro item para a loja aparecer completa.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
