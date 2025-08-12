import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const unProtectedAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Auto-logout on 401 and remember last page
const handleUnauthorized = (error) => {
  const status = error?.response?.status
  const requestUrl = error?.config?.url || ''
  if (
    status === 401 &&
    !requestUrl.includes('/auth/login') &&
    !requestUrl.includes('/auth/register')
  ) {
    try {
      const lastPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
      localStorage.setItem('postLoginRedirect', lastPath)
    } catch {
      // ignore storage errors
    }
    if (window.location.pathname !== '/auth/login') {
      window.location.replace('/auth/login')
    }
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
