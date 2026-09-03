import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { MenuPage } from './pages/public/MenuPage'
import { CartPage } from './pages/public/CartPage'
import { OrderConfirmedPage } from './pages/public/OrderConfirmedPage'
import { OrderTrackingPage } from './pages/public/OrderTrackingPage'

function Placeholder({ title }: { title: string }) {
  return <div className="p-8 text-center"><h1 className="text-2xl font-bold">{title}</h1></div>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order/:id/confirmed" element={<OrderConfirmedPage />} />
          <Route path="/order/:id" element={<OrderTrackingPage />} />
          <Route path="/orders" element={<Placeholder title="Meus Pedidos" />} />
          <Route path="/profile" element={<Placeholder title="Perfil" />} />
        </Route>
        <Route path="/admin/login" element={<Placeholder title="Login Admin" />} />
        <Route path="/admin/orders" element={<Placeholder title="Dashboard Pedidos" />} />
        <Route path="/admin/menu" element={<Placeholder title="Gerenciar Cardápio" />} />
        <Route path="/admin/menu/new" element={<Placeholder title="Novo Item" />} />
        <Route path="/admin/menu/:id/edit" element={<Placeholder title="Editar Item" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App