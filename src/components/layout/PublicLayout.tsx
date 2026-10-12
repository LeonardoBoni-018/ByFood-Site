import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { useRestaurantStore } from '../../stores/restaurantStore'

export function PublicLayout() {
  const fetchRestaurant = useRestaurantStore((s) => s.fetchRestaurant)

  useEffect(() => {
    fetchRestaurant().catch(() => {
      // o restante da página funciona com os textos padrão
    })
  }, [fetchRestaurant])

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pb-24 md:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
