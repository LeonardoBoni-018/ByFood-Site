# Bistrô byFood — Frontend

Frontend responsivo para o sistema de restaurante byFood. Cardápio público com carrinho, pedidos com acompanhamento em tempo real e painel admin completo.

## Stack

- React 19 + TypeScript
- Vite (dev server + build)
- Tailwind CSS v4
- Zustand (state management)
- React Router v6
- Axios (HTTP client)
- Lucide React (ícones)

## Como rodar

```bash
cd byfood-frontend
npm install
npm run dev
```

O frontend sobe na porta **3000** com proxy automático para a API em `localhost:8080`.

## Funcionalidades

### Público
- Cardápio com filtros por categoria (Pizzas, Burgers, Bebidas, Sobremesas)
- Carrinho lateral (desktop) / flutuante (mobile)
- Finalização de pedido com dados do cliente
- Acompanhamento do pedido em tempo real (polling a cada 5s)
- Link pré-preenchido para WhatsApp do restaurante

### Admin (`/admin`)
- Login com JWT
- Dashboard com stats de pedidos
- Gestão do cardápio (criar, editar, ativar/desativar, remover)
- Gestão de pedidos (avançar status, cancelar, marcar pronto/entregue)

### Tema
- Toggle claro/escuro no header
- Persiste preferência no localStorage
- Detecta preferência do sistema automaticamente

## Estrutura

```
src/
├── api/           # Axios client + services (auth, menu, orders, restaurant)
├── components/
│   ├── admin/     # AdminLoginForm, MenuItemForm, MenuItemRow
│   ├── cart/      # CartBar, CartItem, CartSidebar
│   ├── layout/    # TopBar, BottomNav, PublicLayout, AdminLayout, Sidebar
│   ├── menu/      # CategoryTabs, FoodCard, FoodGrid
│   ├── order/     # OrderCard, OrderFilterTabs, OrderStatsBar, OrderStatusTimeline
│   └── ui/        # Badge, Button, Card, EmptyState, ErrorState, Input, Modal, QuantitySelector, Skeleton, Toggle
├── contexts/      # ThemeContext
├── lib/           # constants, formatters
├── pages/
│   ├── admin/     # LoginPage, DashboardPage, MenuManagementPage, MenuItemFormPage
│   └── public/    # MenuPage, CartPage, OrderConfirmedPage, OrderTrackingPage
├── stores/        # authStore, cartStore, restaurantStore (Zustand)
└── types/         # TypeScript interfaces
```
