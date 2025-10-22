import axiosInstance, { unProtectedAxiosInstance } from '../axiosInstance'

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await unProtectedAxiosInstance.post('/auth/login', credentials)
    return response.data
  },

  // Register user
  register: async (userData) => {
    const response = await unProtectedAxiosInstance.post('/auth/register', userData)
    return response.data
  },

  // Google OAuth login
  googleLogin: async (credential) => {
    const response = await unProtectedAxiosInstance.post('/auth/google', { credential })
    return response.data
  },

  // Check authentication status
  checkAuth: async () => {
    const response = await axiosInstance.get('/auth/me')
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await unProtectedAxiosInstance.post('/auth/logout')
    return response.data
  },
}
