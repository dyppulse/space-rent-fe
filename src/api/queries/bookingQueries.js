import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingService } from '../services/bookingService'
import { queryKeys } from '../../utils/queryKeys'

// Hook to fetch user bookings (for regular clients)
export const useUserBookings = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.bookings.user(),
    queryFn: bookingService.getUserBookings,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled, // Can be controlled externally
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (auth issues)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false
      }
      return failureCount < 3
    },
    onError: (error) => {
      console.error('Failed to fetch user bookings:', error)
    },
  })
}

// Hook to fetch owner bookings
export const useOwnerBookings = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.bookings.owner(),
    queryFn: bookingService.getOwnerBookings,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled, // Can be controlled externally
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (auth issues)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false
      }
      return failureCount < 3
    },
    onError: (error) => {
      console.error('Failed to fetch owner bookings:', error)
    },
  })
}

// Hook to fetch booking stats
export const useBookingStats = () => {
  return useQuery({
    queryKey: queryKeys.bookings.stats(),
    queryFn: bookingService.getBookingStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch a single booking by ID
export const useBooking = (id) => {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => bookingService.getBooking(id),
    enabled: !!id, // Only run query if ID exists
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to create a new booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (data) => {
      // Add new booking to owner bookings cache
      queryClient.setQueryData(queryKeys.bookings.owner(), (oldData) => {
        if (!oldData) return [data.booking]
        return [data.booking, ...oldData]
      })

      // Invalidate booking stats to refetch with new data
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats() })
    },
    onError: (error) => {
      console.error('Failed to create booking:', error)
    },
  })
}

// Hook to update booking status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bookingService.updateBookingStatus,
    onSuccess: (data, variables) => {
      const { id } = variables

      // Update booking detail cache
      queryClient.setQueryData(queryKeys.bookings.detail(id), data)

      // Update in owner bookings cache
      queryClient.setQueryData(queryKeys.bookings.owner(), (oldData) => {
        if (!oldData) return oldData
        return oldData.map((booking) => (booking.id === id ? { ...booking, ...data } : booking))
      })

      // Invalidate booking stats to refetch with updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.stats() })
    },
    onError: (error) => {
      console.error('Failed to update booking status:', error)
    },
  })
}

// Alias for useOwnerBookings - for bookings management page
export const useBookings = useOwnerBookings
