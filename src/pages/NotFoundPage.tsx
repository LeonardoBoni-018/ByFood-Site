import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-dark mb-2">404</h1>
      <p className="text-gray-500 mb-6">Página não encontrada</p>
      <Link to="/" className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-hover transition-colors">
        Voltar ao cardápio
      </Link>
    </div>
  )
}
