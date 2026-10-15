import { Loader2 } from 'lucide-react'
import { useServerStatus } from '../stores/serverStatusStore'

/** Aviso discreto enquanto a API acorda, no lugar de uma tela de erro. */
export function ServerWakingBanner() {
  const waking = useServerStatus((s) => s.waking)
  if (!waking) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="anim-slide-up fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 max-w-[calc(100vw-2rem)] rounded-full bg-dark text-background pl-4 pr-5 py-3 text-sm shadow-[0_12px_30px_-10px_rgba(35,26,19,0.6)]"
    >
      <Loader2 size={17} className="animate-spin shrink-0 text-mustard" />
      <span>Acordando o servidor… isso pode levar até 1 minuto.</span>
    </div>
  )
}
