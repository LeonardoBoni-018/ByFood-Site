import { describe, expect, it } from 'vitest'
import { AxiosError } from 'axios'
import { getErrorMessage } from './errors'

const httpError = (status: number, data?: unknown) =>
  new AxiosError('x', 'ERR', undefined, undefined, { status, data } as never)

describe('getErrorMessage', () => {
  it('trata falha de rede', () => {
    expect(getErrorMessage(new AxiosError('Network Error'))).toMatch(/Sem conexão/)
  })
  it('junta erros de validação do backend', () => {
    expect(getErrorMessage(httpError(400, { errors: { a: 'nome é obrigatório', b: 'telefone inválido' } })))
      .toBe('nome é obrigatório · telefone inválido')
  })
  it('trata rate limit e erros 5xx', () => {
    expect(getErrorMessage(httpError(429))).toMatch(/Muitas tentativas/)
    expect(getErrorMessage(httpError(503))).toMatch(/indisponível/)
  })
  it('usa fallback para erros desconhecidos', () => {
    expect(getErrorMessage(new Error('boom'), 'fallback')).toBe('fallback')
  })
})
