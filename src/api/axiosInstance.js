import axios from 'axios'

const rawEnvBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || ''
const fallbackLocalBase =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api'
    : ''

const normalizeBase = (value) => {
  if (!value) return value
  const v = String(value).trim()
  if (/^https?:\/\//i.test(v)) return v
  if (/^(localhost|127\.0\.0\.1|\[::1\])/i.test(v)) return `http://${v}`
  return `https://${v}`
}

const baseURL = normalizeBase(rawEnvBase) || fallbackLocalBase

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const unProtectedAxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Auto-logout on 401 and remember last page
const handleUnauthorized = (error) => {
  const status = error?.response?.status
  const requestUrl = error?.config?.url || ''

  // Log for debugging
  console.log('Axios interceptor: 401 error on', requestUrl, 'status:', status)

  if (
    status === 401 &&
    !requestUrl.includes('/auth/login') &&
    !requestUrl.includes('/auth/register') &&
    !requestUrl.includes('/auth/me') // Don't redirect on auth check failures
  ) {
    console.log('Axios interceptor: Redirecting to login from', window.location.pathname)
    try {
      const lastPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
      localStorage.setItem('postLoginRedirect', lastPath)
    } catch {
      // ignore storage errors
    }
    if (window.location.pathname !== '/auth/login') {
      window.location.replace('/auth/login')
    }
  } else {
    console.log('Axios interceptor: Not redirecting (excluded URL or not 401)')
  }
  return Promise.reject(error)
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => handleUnauthorized(error)
)

unProtectedAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => handleUnauthorized(error)
)

export default axiosInstance
export { unProtectedAxiosInstance }
