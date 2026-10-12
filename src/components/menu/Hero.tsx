import { ArrowDown, Clock, MapPin, MessageCircle } from 'lucide-react'
import type { MenuItem, Restaurant } from '../../types'
import { formatPrice } from '../../lib/formatters'

interface HeroProps {
  restaurant: Restaurant | null
  featured?: MenuItem
}

function Word({ children, delay }: { children: string; delay: number }) {
  return (
    <span className="rise-word mr-[0.22em]">
      <span style={{ animationDelay: `${delay}ms` }}>{children}</span>
    </span>
  )
}

export function Hero({ restaurant, featured }: HeroProps) {
  const digits = restaurant?.whatsappNumber?.replace(/\D/g, '') ?? ''

  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 pb-12 md:pt-14 md:pb-20 grid md:grid-cols-[1.15fr_1fr] gap-12 md:gap-6 items-center">
      <div>
        <p className="anim-fade-in text-xs font-semibold tracking-[0.18em] uppercase text-primary mb-5">
          {restaurant?.name ?? 'Bistrô byFood'} · {restaurant?.openingHours ?? 'todos os dias'}
        </p>

        <h1 className="font-display text-[44px] sm:text-6xl lg:text-[72px] leading-[1.02] font-semibold text-dark">
          <Word delay={80}>Comida</Word>
          <Word delay={160}>de</Word>
          <Word delay={240}>casa,</Word>
          <br />
          <span className="relative inline-block">
            <span className="italic font-normal">
              <Word delay={360}>feita</Word>
              <Word delay={440}>na</Word>
              <Word delay={520}>hora.</Word>
            </span>
            <svg
              className="absolute left-0 -bottom-2 w-full h-3 text-mustard"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                className="draw-line"
                d="M2 8 C 40 1, 70 11, 110 6 S 190 2, 230 7 S 280 9, 298 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="anim-fade-up delay-6 mt-7 max-w-md text-gray-600 dark:text-gray-400 leading-relaxed">
          {restaurant?.description ??
            'Escolha no cardápio, monte a sacola e feche o pedido direto pelo WhatsApp. Sem cadastro, sem taxa escondida.'}
        </p>

        <div className="anim-fade-up delay-7 mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#cardapio"
            className="group inline-flex items-center gap-2 h-12 pl-6 pr-5 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
          >
            Ver cardápio
            <ArrowDown size={17} className="transition-transform duration-300 group-hover:translate-y-1" />
          </a>
          {digits && (
            <a
              href={`https://wa.me/${digits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-gray-300 dark:border-gray-700 font-medium text-gray-800 dark:text-gray-200 hover:border-dark transition-colors"
            >
              <MessageCircle size={17} />
              Tirar dúvidas
            </a>
          )}
        </div>

        <ul className="anim-fade-up delay-8 mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <li className="flex items-center gap-1.5">
            <Clock size={14} /> {restaurant?.openingHours ?? 'Seg a Dom, 11h às 23h'}
          </li>
          {restaurant?.address && (
            <li className="flex items-center gap-1.5">
              <MapPin size={14} /> {restaurant.address}
            </li>
          )}
        </ul>
      </div>

      {/* prato em arco, selo giratório e comanda com o item em destaque */}
      <div className="relative mx-auto w-full max-w-[420px] md:max-w-none md:justify-self-end md:w-[400px]">
        <div className="anim-unveil [animation-delay:200ms] aspect-[4/5] rounded-t-[999px] rounded-b-[28px] overflow-hidden bg-gray-200 dark:bg-gray-800">
          {featured?.imageUrl && (
            <img
              src={featured.imageUrl.replace('w=400&h=300', 'w=800&h=1000')}
              alt={featured.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="absolute -top-5 -left-3 sm:-left-8 w-[104px] h-[104px]" aria-hidden>
          <svg viewBox="0 0 100 100" className="anim-spin-slow w-full h-full">
            <defs>
              <path id="stamp" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
            </defs>
            <circle cx="50" cy="50" r="48" fill="var(--color-mustard)" />
            <text fontSize="9.4" fontWeight="700" letterSpacing="2.4" fill="#231a13">
              <textPath href="#stamp">FEITO NA HORA • SEM FILA • </textPath>
            </text>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-3xl italic text-[#231a13]">
            b
          </span>
        </div>

        {featured && (
          <div className="anim-fade-up delay-8 absolute -bottom-6 -right-1 sm:-right-6 bg-surface border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-[0_10px_30px_-12px_rgba(35,26,19,0.35)] rotate-[2deg]">
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-500">Prato da vez</p>
            <p className="font-display text-lg font-semibold leading-tight text-dark">{featured.name}</p>
            <p className="text-primary font-bold tabular-nums">{formatPrice(featured.price)}</p>
          </div>
        )}
      </div>
    </section>
  )
}
