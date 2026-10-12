import { useEffect, useRef } from 'react'

/**
 * Executa `task` a cada `ms` enquanto a aba está visível e refaz a chamada ao voltar para ela.
 * A primeira execução fica a cargo de quem usa o hook.
 */
export function usePolling(task: () => void | Promise<unknown>, ms: number) {
  const saved = useRef(task)

  useEffect(() => {
    saved.current = task
  })

  useEffect(() => {
    const tick = () => {
      if (!document.hidden) void saved.current()
    }
    const timer = setInterval(tick, ms)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [ms])
}
