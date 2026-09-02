import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Cardápio</div>} />
        <Route path="/cart" element={<div>Carrinho</div>} />
        <Route path="/order/:id" element={<div>Acompanhar Pedido</div>} />
        <Route path="/order/:id/confirmed" element={<div>Pedido Confirmado</div>} />
        <Route path="/admin/login" element={<div>Login Admin</div>} />
        <Route path="/admin/orders" element={<div>Dashboard Pedidos</div>} />
        <Route path="/admin/menu" element={<div>Gerenciar Cardápio</div>} />
        <Route path="/admin/menu/new" element={<div>Novo Item</div>} />
        <Route path="/admin/menu/:id/edit" element={<div>Editar Item</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App