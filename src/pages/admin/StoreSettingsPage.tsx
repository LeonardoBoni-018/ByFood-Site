import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'
import { fetchMyStore, updateMyStore } from '../../api/store'
import { resetMyStoreCache } from '../../hooks/useMyStore'
import { getErrorMessage, getFieldErrors } from '../../lib/errors'
import { EMPTY_STORE_PROFILE, validateStoreProfile } from '../../lib/storeProfile'
import type { StoreProfile } from '../../types'
import { StoreProfileFields } from '../../components/store/StoreProfileFields'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'

export function StoreSettingsPage() {
  const [profile, setProfile] = useState<StoreProfile>(EMPTY_STORE_PROFILE)
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchMyStore()
      .then((s) => {
        setSlug(s.slug)
        setProfile({
          name: s.name,
          description: s.description ?? '',
          cuisine: s.cuisine,
          address: s.address,
          phone: s.phone,
          whatsappNumber: s.whatsappNumber,
          openingHours: s.openingHours ?? '',
          imageUrl: s.imageUrl ?? '',
        })
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const local = validateStoreProfile(profile)
    setErrors(local)
    if (Object.keys(local).length > 0) return

    setSaving(true)
    try {
      const saved = await updateMyStore({
        ...profile,
        description: profile.description?.trim() || undefined,
        openingHours: profile.openingHours?.trim() || undefined,
        imageUrl: profile.imageUrl?.trim() || undefined,
      })
      resetMyStoreCache(saved)
      toast.success('Dados da loja atualizados')
    } catch (err) {
      const fields = getFieldErrors(err)
      if (Object.keys(fields).length) setErrors(fields)
      else toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold mb-1">Dados da loja</h1>
      {slug && <p className="text-sm text-gray-500 mb-6">Endereço público: /lojas/{slug}</p>}

      {loading ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="bg-surface rounded-[24px] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-6">
          <StoreProfileFields value={profile} onChange={setProfile} errors={errors} />
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      )}
    </div>
  )
}
