import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, Store } from 'lucide-react'
import axios from 'axios'
import { fetchCuisines, searchRestaurants } from '../../api/restaurants'
import type { RestaurantSummary } from '../../types'
import { RestaurantCard } from '../../components/store/RestaurantCard'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { getErrorMessage } from '../../lib/errors'

const PAGE_SIZE = 12

export function HomePage() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [cuisines, setCuisines] = useState<string[]>([])
  const [stores, setStores] = useState<RestaurantSummary[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const controller = useRef<AbortController | undefined>(undefined)

  useEffect(() => {
    fetchCuisines().then(setCuisines).catch(() => setCuisines([]))
  }, [])

  // Espera o usuário parar de digitar antes de consultar a API
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  const load = useCallback(
    async (pageToLoad: number) => {
      controller.current?.abort()
      const current = new AbortController()
      controller.current = current
      const append = pageToLoad > 0
      if (append) setLoadingMore(true)
      else setLoading(true)
      setError(null)
      try {
        const result = await searchRestaurants(
          { q: debounced, cuisine, page: pageToLoad, size: PAGE_SIZE },
          current.signal,
        )
        setStores((prev) => (append ? [...prev, ...result.content] : result.content))
        setPage(result.page.number)
        setTotalPages(result.page.totalPages)
      } catch (err) {
        if (axios.isCancel(err)) return // uma busca mais nova já substituiu esta
        setError(getErrorMessage(err, 'Não foi possível carregar as lojas.'))
      } finally {
        if (controller.current === current) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [debounced, cuisine],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(0)
    return () => controller.current?.abort()
  }, [load, attempt])

  return (
    <>
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-8 md:pt-16">
        <p className="anim-fade-in text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-5">
          Lojas do seu bairro
        </p>
        <h1 className="font-display text-[42px] sm:text-6xl lg:text-[76px] leading-[1.02] font-semibold text-dark max-w-4xl">
          <span className="rise-word mr-[0.22em]"><span style={{ animationDelay: '60ms' }}>Escolha</span></span>
          <span className="rise-word mr-[0.22em]"><span style={{ animationDelay: '140ms' }}>a</span></span>
          <span className="rise-word mr-[0.22em]"><span style={{ animationDelay: '220ms' }}>loja,</span></span>
          <br />
          <span className="italic font-normal">
            <span className="rise-word mr-[0.22em]"><span style={{ animationDelay: '340ms' }}>feche</span></span>
            <span className="rise-word mr-[0.22em]"><span style={{ animationDelay: '420ms' }}>no</span></span>
            <span className="rise-word"><span style={{ animationDelay: '500ms' }}>WhatsApp.</span></span>
          </span>
        </h1>

        <label className="anim-fade-up delay-6 mt-9 flex items-center gap-3 max-w-xl h-14 pl-5 pr-2 rounded-full bg-surface border border-gray-200 dark:border-gray-700 focus-within:border-primary transition-colors">
          <Search size={19} className="text-gray-400 shrink-0" />
          <span className="sr-only">Buscar lojas ou tipo de comida</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={60}
            placeholder="Busque por loja ou tipo de comida"
            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] placeholder:text-gray-400"
          />
        </label>

        {cuisines.length > 0 && (
          <div className="anim-fade-up delay-7 mt-5 flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {['', ...cuisines].map((c) => {
              const active = cuisine === c
              return (
                <button
                  key={c || 'todas'}
                  onClick={() => setCuisine(c)}
                  aria-pressed={active}
                  className={`shrink-0 h-10 px-5 rounded-full text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-dark text-background'
                      : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-dark'
                  }`}
                >
                  {c || 'Todas'}
                </button>
              )
            })}
          </div>
        )}
      </section>

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-12" aria-live="polite">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/3] rounded-[20px] rounded-br-[6px]" />
                <Skeleton className="h-5 w-2/3 mt-4 rounded" />
                <Skeleton className="h-4 w-full mt-2 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && <ErrorState description={error} onRetry={() => setAttempt((n) => n + 1)} />}

        {!loading && !error && stores.length === 0 && (
          <EmptyState
            title="Nenhuma loja encontrada"
            description="Tente outro nome ou tipo de comida."
          />
        )}

        {!loading && !error && stores.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
              {stores.map((store, i) => (
                <RestaurantCard key={store.slug} restaurant={store} index={i} />
              ))}
            </div>
            {page + 1 < totalPages && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => load(page + 1)}
                  disabled={loadingMore}
                  className="h-12 px-8 rounded-full border border-gray-300 dark:border-gray-700 font-medium hover:border-dark transition-colors disabled:opacity-50"
                >
                  {loadingMore ? 'Carregando...' : 'Ver mais lojas'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-[28px] bg-dark text-background p-8 sm:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-mustard mb-4">
              <Store size={15} /> Para lojas
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
              Seu cardápio no ar em poucos minutos.
            </h2>
            <p className="mt-3 opacity-75 leading-relaxed">
              Cadastre a loja, monte o cardápio e receba os pedidos organizados em um painel, com o fechamento
              feito no seu WhatsApp.
            </p>
          </div>
          <Link
            to="/para-lojas"
            className="group shrink-0 inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-mustard text-[#231a13] font-semibold hover:bg-white transition-colors"
          >
            Cadastrar minha loja
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}
