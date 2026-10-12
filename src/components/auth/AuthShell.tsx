import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../ui/Logo'

interface AuthShellProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}

/** Moldura comum das telas de entrada: logo, título em serifa e cartão do formulário. */
export function AuthShell({ title, subtitle, children, footer, wide = false }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-14">
      <div className={`mx-auto w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
        <Link to="/" className="inline-block mb-10" aria-label="byFood, página inicial">
          <Logo />
        </Link>

        <h1 className="anim-fade-up font-display text-4xl sm:text-5xl font-semibold leading-[1.05] text-dark">{title}</h1>
        {subtitle && <p className="anim-fade-up delay-1 mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">{subtitle}</p>}

        <div className="anim-fade-up delay-2 mt-8 bg-surface rounded-[24px] border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          {children}
        </div>

        {footer && <div className="anim-fade-up delay-3 mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">{footer}</div>}
      </div>
    </div>
  )
}
