import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { useRestaurantStore } from '../../stores/restaurantStore'

export function PublicLayout() {
  const fetchRestaurant = useRestaurantStore((s) => s.fetchRestaurant)

  useEffect(() => {
    fetchRestaurant()
  }, [fetchRestaurant])

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pb-20 md:pb-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}