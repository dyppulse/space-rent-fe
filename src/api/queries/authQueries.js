import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { queryKeys } from '../../utils/queryKeys'

// Hook to check authentication status
export const useAuthStatus = () => {
  return useQuery({
    queryKey: queryKeys.auth.status(),
    queryFn: authService.checkAuth,
    retry: false, // Don't retry auth checks
    staleTime: Infinity, // Auth status doesn't change frequently
    gcTime: Infinity, // Keep auth status in cache
    // Enable the query to run on mount
    enabled: true,
    // Handle errors gracefully - if checkAuth fails, user is not authenticated
    onError: (error) => {
      console.log('Auth check failed (user not authenticated):', error?.response?.status)
    },
    // Don't throw errors for auth failures
    throwOnError: false,
  })
}

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Update auth user cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user)
      queryClient.setQueryData(queryKeys.auth.status(), data)

      // Invalidate and refetch user-specific data
      queryClient.invalidateQueries({ queryKey: queryKeys.spaces.mySpaces() })
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.owner() })
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

// Hook for signup mutation
export const useSignup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Update auth user cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user)
      queryClient.setQueryData(queryKeys.auth.status(), data)
    },
    onError: (error) => {
      console.error('Signup failed:', error)
    },
  })
}

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all auth-related cache
      queryClient.removeQueries({ queryKey: queryKeys.auth.all })

      // Clear user-specific data
      queryClient.removeQueries({ queryKey: queryKeys.spaces.mySpaces() })
      queryClient.removeQueries({ queryKey: queryKeys.bookings.owner() })
      queryClient.removeQueries({ queryKey: queryKeys.bookings.stats() })

      // Reset to initial state
      queryClient.setQueryData(queryKeys.auth.user(), null)
      queryClient.setQueryData(queryKeys.auth.status(), null)
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Even if logout API fails, clear local cache
      queryClient.removeQueries({ queryKey: queryKeys.auth.all })
      queryClient.setQueryData(queryKeys.auth.user(), null)
      queryClient.setQueryData(queryKeys.auth.status(), null)
    },
  })
}
