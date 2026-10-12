import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'

export function PublicLayout() {
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
