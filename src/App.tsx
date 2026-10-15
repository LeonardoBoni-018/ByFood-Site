import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { PublicLayout } from './components/layout/PublicLayout'
import { HomePage } from './pages/public/HomePage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ServerWakingBanner } from './components/ServerWakingBanner'
import { NotFoundPage } from './pages/NotFoundPage'
import { Skeleton } from './components/ui/Skeleton'
import { useAuthStore } from './stores/authStore'

// Todo o resto é carregado sob demanda para reduzir o bundle inicial
const MenuPage = lazy(() => import('./pages/public/MenuPage').then((m) => ({ default: m.MenuPage })))
const CartPage = lazy(() => import('./pages/public/CartPage').then((m) => ({ default: m.CartPage })))
const OrderConfirmedPage = lazy(() => import('./pages/public/OrderConfirmedPage').then((m) => ({ default: m.OrderConfirmedPage })))
const OrderTrackingPage = lazy(() => import('./pages/public/OrderTrackingPage').then((m) => ({ default: m.OrderTrackingPage })))
const MyOrdersPage = lazy(() => import('./pages/public/MyOrdersPage').then((m) => ({ default: m.MyOrdersPage })))
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterCustomerPage = lazy(() => import('./pages/auth/RegisterCustomerPage').then((m) => ({ default: m.RegisterCustomerPage })))
const RegisterStorePage = lazy(() => import('./pages/auth/RegisterStorePage').then((m) => ({ default: m.RegisterStorePage })))
const AdminLayout = lazy(() => import('./components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const MenuManagementPage = lazy(() => import('./pages/admin/MenuManagementPage').then((m) => ({ default: m.MenuManagementPage })))
const MenuItemFormPage = lazy(() => import('./pages/admin/MenuItemFormPage').then((m) => ({ default: m.MenuItemFormPage })))
const StoreSettingsPage = lazy(() => import('./pages/admin/StoreSettingsPage').then((m) => ({ default: m.StoreSettingsPage })))

function PageFallback() {
  return (
    <div className="px-4 py-8 max-w-lg mx-auto space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

/** Área do cliente: sem login vai para a entrada e volta depois para a página pedida. */
function RequireCustomer({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) return <Navigate to="/entrar" state={{ from: location.pathname }} replace />
  if (user.role !== 'CUSTOMER') return <Navigate to="/loja/pedidos" replace />
  return <>{children}</>
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lojas/:slug" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order/:code/confirmed" element={<OrderConfirmedPage />} />
              <Route path="/order/:code" element={<OrderTrackingPage />} />
              <Route path="/pedidos" element={<RequireCustomer><MyOrdersPage /></RequireCustomer>} />
              <Route path="/para-lojas" element={<RegisterStorePage />} />
            </Route>

            <Route path="/entrar" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterCustomerPage />} />

            <Route path="/loja" element={<AdminLayout />}>
              <Route index element={<Navigate to="pedidos" replace />} />
              <Route path="pedidos" element={<DashboardPage />} />
              <Route path="cardapio" element={<MenuManagementPage />} />
              <Route path="cardapio/novo" element={<MenuItemFormPage />} />
              <Route path="cardapio/:id/editar" element={<MenuItemFormPage />} />
              <Route path="configuracoes" element={<StoreSettingsPage />} />
            </Route>

            {/* links antigos do painel e da lista de pedidos */}
            <Route path="/admin/*" element={<Navigate to="/loja/pedidos" replace />} />
            <Route path="/orders" element={<Navigate to="/pedidos" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ServerWakingBanner />
      <Toaster position="top-center" richColors closeButton />
    </ErrorBoundary>
  )
}

export default App
