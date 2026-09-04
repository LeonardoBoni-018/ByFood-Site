import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBarAdmin } from './TopBarAdmin'
import { useAuthStore } from '../../stores/authStore'

export function AdminLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) return <Navigate to="/admin/login" />

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <TopBarAdmin />
      <aside className="w-64 hidden md:block border-r border-gray-100 shrink-0">
        <Sidebar />
      </aside>
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
