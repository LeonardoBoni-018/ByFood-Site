import type { StoreProfile } from '../types'

export const CUISINE_SUGGESTIONS = [
  'Hambúrguer', 'Pizza', 'Brasileira', 'Japonesa', 'Italiana', 'Lanches', 'Doces', 'Padaria', 'Saudável', 'Bebidas',
]

const PHONE_PATTERN = /^[0-9+()\-\s]{8,30}$/

export const EMPTY_STORE_PROFILE: StoreProfile = {
  name: '',
  description: '',
  cuisine: '',
  address: '',
  phone: '',
  whatsappNumber: '',
  openingHours: '',
  imageUrl: '',
}

/** Validação local dos dados da loja; devolve erros indexados pelo nome do campo. */
export function validateStoreProfile(profile: StoreProfile): Record<string, string> {
  const e: Record<string, string> = {}
  if (!profile.name.trim()) e.name = 'Nome da loja é obrigatório'
  if (!profile.cuisine.trim()) e.cuisine = 'Informe o tipo de comida'
  if (!profile.address.trim()) e.address = 'Endereço é obrigatório'
  if (!PHONE_PATTERN.test(profile.phone.trim())) e.phone = 'Telefone inválido'
  if (!PHONE_PATTERN.test(profile.whatsappNumber.trim())) e.whatsappNumber = 'WhatsApp inválido'
  if (profile.imageUrl?.trim() && !/^https?:\/\/\S+$/.test(profile.imageUrl.trim())) {
    e.imageUrl = 'A URL deve começar com http:// ou https://'
  }
  return e
}
