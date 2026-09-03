import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MenuItemForm } from '../../components/admin/MenuItemForm'
import { fetchAdminMenu } from '../../api/menu'
import type { MenuItem } from '../../types'

export function MenuItemFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initial, setInitial] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchAdminMenu(0, 200).then((p) => {
      const found = p.content.find((i) => String(i.id) === id)
      if (found) setInitial(found)
    }).finally(() => setLoading(false))
  }, [id])

  return (
    <div>
      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <MenuItemForm initial={initial} onSaved={() => navigate('/admin/menu')} />
      )}
    </div>
  )
}
