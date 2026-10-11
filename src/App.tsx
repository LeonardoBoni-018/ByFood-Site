import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { PublicLayout } from './components/layout/PublicLayout'
import { MenuPage } from './pages/public/MenuPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NotFoundPage } from './pages/NotFoundPage'
import { Skeleton } from './components/ui/Skeleton'

// Rotas secundárias e todo o painel admin são carregados sob demanda para reduzir o bundle inicial
const CartPage = lazy(() => import('./pages/public/CartPage').then((m) => ({ default: m.CartPage })))
const OrderConfirmedPage = lazy(() => import('./pages/public/OrderConfirmedPage').then((m) => ({ default: m.OrderConfirmedPage })))
const OrderTrackingPage = lazy(() => import('./pages/public/OrderTrackingPage').then((m) => ({ default: m.OrderTrackingPage })))
const LoginPage = lazy(() => import('./pages/admin/LoginPage').then((m) => ({ default: m.LoginPage })))
const AdminLayout = lazy(() => import('./components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const MenuManagementPage = lazy(() => import('./pages/admin/MenuManagementPage').then((m) => ({ default: m.MenuManagementPage })))
const MenuItemFormPage = lazy(() => import('./pages/admin/MenuItemFormPage').then((m) => ({ default: m.MenuItemFormPage })))

function Placeholder({ title }: { title: string }) {
  return <div className="p-8 text-center"><h1 className="text-2xl font-bold">{title}</h1></div>
}

function PageFallback() {
  return (
    <div className="px-4 py-8 max-w-lg mx-auto space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order/:code/confirmed" element={<OrderConfirmedPage />} />
              <Route path="/order/:code" element={<OrderTrackingPage />} />
              <Route path="/orders" element={<Placeholder title="Meus Pedidos" />} />
              <Route path="/profile" element={<Placeholder title="Perfil" />} />
            </Route>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="orders" element={<DashboardPage />} />
              <Route path="menu" element={<MenuManagementPage />} />
              <Route path="menu/new" element={<MenuItemFormPage />} />
              <Route path="menu/:id/edit" element={<MenuItemFormPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
    </ErrorBoundary>
  )
}

export default App
