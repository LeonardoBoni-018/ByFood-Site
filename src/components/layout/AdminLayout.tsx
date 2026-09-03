import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuthStore } from '../../stores/authStore'

export function AdminLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) return <Navigate to="/admin/login" />

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 hidden md:block border-r border-gray-100">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
