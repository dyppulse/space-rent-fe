import { createContext, useContext, useEffect, useState } from 'react'
import { useAuthStatus, useLogin, useSignup, useLogout } from '../api/queries/authQueries'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [initialized, setInitialized] = useState(false)

  // React Query hooks
  const { data: authData, isLoading: checkingAuth, isError: authError } = useAuthStatus()
  const loginMutation = useLogin()
  const signupMutation = useSignup()
  const logoutMutation = useLogout()

  // Debug logging
  console.log('AuthContext Debug:', {
    authData: authData ? 'exists' : 'undefined',
    checkingAuth,
    authError,
    initialized,
    user: user ? 'exists' : 'null',
    isAuthenticated: !!user,
  })

  // Check auth status on mount
  useEffect(() => {
    // If we have auth data, set the user
    if (authData?.user) {
      setUser(authData.user)
      setInitialized(true)
    }
    // If we have an error (like 401), user is not authenticated
    else if (authError) {
      setUser(null)
      setInitialized(true)
    }
    // If we're not loading anymore and no data/error, user is not authenticated
    else if (!checkingAuth) {
      setUser(null)
      setInitialized(true)
    }
  }, [authData, authError, checkingAuth])

  const login = async (credentials) => {
    const result = await loginMutation.mutateAsync(credentials)
    setUser(result.user)
    return result
  }

  const signup = async (userData) => {
    const result = await signupMutation.mutateAsync(userData)
    setUser(result.user)
    return result
  }

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync()
      setUser(null)
    } catch (error) {
      // Even if logout API fails, clear local state
      setUser(null)
      throw error
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: checkingAuth || !initialized,
    login,
    signup,
    logout,
    initialized,
    // Loading states for mutations
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
