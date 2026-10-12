import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBarAdmin } from './TopBarAdmin'
import { useAuthStore } from '../../stores/authStore'

/** Painel exclusivo de lojistas: visitantes vão para o login e clientes voltam para a vitrine. */
export function AdminLayout() {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) return <Navigate to="/entrar" state={{ from: location.pathname }} replace />
  if (user.role !== 'STORE') return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <TopBarAdmin />
      <aside className="w-64 hidden md:block border-r border-gray-200 dark:border-gray-800 shrink-0">
        <Sidebar />
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
