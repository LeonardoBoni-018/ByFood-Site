import axios from 'axios'

interface ProblemDetail {
  detail?: string
  errors?: Record<string, string>
}

/** Converte qualquer erro de requisição em uma mensagem amigável em português. */
export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (!axios.isAxiosError<ProblemDetail>(error)) return fallback

  if (error.code === 'ECONNABORTED') return 'O servidor demorou para responder. Tente novamente.'
  if (!error.response) return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.'

  const { status, data } = error.response
  const fieldErrors = data?.errors ? Object.values(data.errors) : []

  if (status === 400 && fieldErrors.length > 0) return fieldErrors.join(' · ')
  if (status === 429) return 'Muitas tentativas. Aguarde um instante e tente novamente.'
  if (status === 401) return 'Sessão expirada ou credenciais inválidas.'
  if (status === 403) return 'Você não tem permissão para esta ação.'
  if (status >= 500) return 'O servidor está indisponível no momento. Tente novamente em instantes.'
  return data?.detail ?? fallback
}

/**
 * Erros de validação do backend por campo (ex.: { email: 'e-mail inválido', 'store.name': '...' }).
 * Vazio quando o erro não é uma validação 400.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (axios.isAxiosError<ProblemDetail>(error) && error.response?.status === 400) {
    return error.response.data?.errors ?? {}
  }
  return {}
}

/** Erros de rede/5xx são transitórios; 4xx indica problema na requisição. */
export function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404
}

export function httpStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined
}
