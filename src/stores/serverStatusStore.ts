import { create } from 'zustand'

interface ServerStatusState {
  /** true enquanto o cliente espera a API "acordar" (hospedagem gratuita hiberna após 15 min parada). */
  waking: boolean
  setWaking: (waking: boolean) => void
}

export const useServerStatus = create<ServerStatusState>((set) => ({
  waking: false,
  setWaking: (waking) => set({ waking }),
}))
