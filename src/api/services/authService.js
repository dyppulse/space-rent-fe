import axiosInstance, { unProtectedAxiosInstance } from '../axiosInstance'

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await unProtectedAxiosInstance.post('/auth/login', credentials)
    return response.data
  },

  // Register user (legacy - keeps backward compatibility)
  register: async (userData) => {
    const response = await unProtectedAxiosInstance.post('/auth/register/client', userData)
    return response.data
  },

  // Register client
  registerClient: async (userData) => {
    const response = await unProtectedAxiosInstance.post('/auth/register/client', userData)
    return response.data
  },

  // Register owner
  registerOwner: async (userData) => {
    const response = await unProtectedAxiosInstance.post('/auth/register/owner', userData)
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

  // Verify email
  verifyEmail: async (token) => {
    const response = await unProtectedAxiosInstance.get(`/auth/verify-email?token=${token}`)
    return response.data
  },

  // Submit upgrade request
  submitUpgradeRequest: async (verificationInfo) => {
    const response = await axiosInstance.post('/auth/upgrade-request', { verificationInfo })
    return response.data
  },

  // Switch role
  switchRole: async (role) => {
    const response = await axiosInstance.post('/auth/switch-role', { role })
    return response.data
  },
}
