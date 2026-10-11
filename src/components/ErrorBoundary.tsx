import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorState } from './ui/ErrorState'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro de renderização', error, info.componentStack)
  }

  render() {
    if (this.state.failed) {
      return (
        <ErrorState
          title="Ops! Algo deu errado"
          description="Ocorreu um erro inesperado. Recarregue a página."
          onRetry={() => window.location.reload()}
        />
      )
    }
    return this.props.children
  }
}
