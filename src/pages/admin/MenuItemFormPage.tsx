import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MenuItemForm } from '../../components/admin/MenuItemForm'
import { fetchStoreMenu } from '../../api/menu'
import type { MenuItem } from '../../types'
import { Skeleton } from '../../components/ui/Skeleton'

export function MenuItemFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initial, setInitial] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (!id) return
    // a API já devolve só itens da própria loja; item de outra loja nunca aparece aqui
    fetchStoreMenu(0, 100)
      .then((p) => {
        const found = p.content.find((i) => String(i.id) === id)
        if (found) setInitial(found)
        else navigate('/loja/cardapio', { replace: true })
      })
      .catch(() => navigate('/loja/cardapio', { replace: true }))
      .finally(() => setLoading(false))
  }, [id, navigate])

  return (
    <div>
      {loading ? (
        <Skeleton className="h-96 w-full max-w-lg mx-auto rounded-2xl" />
      ) : (
        <MenuItemForm initial={initial} onSaved={() => navigate('/loja/cardapio')} />
      )}
    </div>
  )
}
