import client from './client'
import type { LoginRequest, LoginResponse, RegisterCustomerRequest, RegisterStoreRequest } from '../types'

export const login = (data: LoginRequest) =>
  client.post<LoginResponse>('/auth/login', data).then((r) => r.data)

export const registerCustomer = (data: RegisterCustomerRequest) =>
  client.post<LoginResponse>('/auth/register/customer', data).then((r) => r.data)

export const registerStore = (data: RegisterStoreRequest) =>
  client.post<LoginResponse>('/auth/register/store', data).then((r) => r.data)
