import axios from 'axios'

// Em produção (Vercel) aponte VITE_API_URL para a API no Render; em dev o proxy do Vite usa '/api'.
const baseURL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') || '/api'

const client = axios.create({
  baseURL,
  timeout: 20000, // o Render free pode levar alguns segundos para "acordar"
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token')
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  },
)

export default client
