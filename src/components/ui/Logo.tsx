interface LogoMarkProps {
  size?: number
  className?: string
}

/** Marca: um "b" em que o bojo é um prato visto de cima, com a gema ao centro. */
export function LogoMark({ size = 36, className = '' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="byFood"
    >
      <rect width="64" height="64" rx="18" fill="var(--color-primary)" />
      <rect x="17" y="12" width="8" height="40" rx="4" fill="#FFFBF3" />
      <circle cx="35" cy="37" r="13" fill="none" stroke="#FFFBF3" strokeWidth="8" />
      <circle cx="35" cy="37" r="4.2" fill="#E3A72F" />
    </svg>
  )
}

export function Logo({ size = 36, className = '' }: LogoMarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className="font-display text-[22px] leading-none text-dark">
        <span className="italic font-normal">by</span>
        <span className="font-bold text-primary">Food</span>
      </span>
    </span>
  )
}
