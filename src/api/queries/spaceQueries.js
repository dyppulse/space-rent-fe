import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { spaceService } from '../services/spaceService'
import { queryKeys } from '../../utils/queryKeys'

// Hook to fetch all spaces with filters
export const useSpaces = (filters = {}) => {
  return useQuery({
    queryKey: queryKeys.spaces.list(filters),
    queryFn: () => spaceService.getSpaces(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch a single space by ID
export const useSpace = (id) => {
  return useQuery({
    queryKey: queryKeys.spaces.detail(id),
    queryFn: async () => {
      console.log('useSpace: Fetching space with ID:', id)
      try {
        const result = await spaceService.getSpace(id)
        console.log('useSpace: API response:', result)
        return result
      } catch (error) {
        console.error('useSpace: API error:', error)
        throw error
      }
    },
    enabled: !!id, // Only run query if ID exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to fetch user's spaces
export const useMySpaces = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.spaces.mySpaces(),
    queryFn: spaceService.getMySpaces,
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
      console.error('Failed to fetch my spaces:', error)
    },
  })
}

// Hook to create a new space
export const useCreateSpace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spaceService.createSpace,
    onSuccess: (data) => {
      // Add new space to my spaces cache
      queryClient.setQueryData(queryKeys.spaces.mySpaces(), (oldData) => {
        if (!oldData) return [data.space]
        return [data.space, ...oldData]
      })

      // Invalidate spaces list to refetch with new data
      queryClient.invalidateQueries({ queryKey: queryKeys.spaces.lists() })
    },
    onError: (error) => {
      console.error('Failed to create space:', error)
      // The error will be available in the component via the mutation's error state
    },
  })
}

// Hook to update a space
export const useUpdateSpace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spaceService.updateSpace,
    onSuccess: (data, variables) => {
      const { id } = variables

      // Update space detail cache
      queryClient.setQueryData(queryKeys.spaces.detail(id), data.space)

      // Update in my spaces cache
      queryClient.setQueryData(queryKeys.spaces.mySpaces(), (oldData) => {
        if (!oldData) return oldData
        return oldData.map((space) => (space.id === id ? { ...space, ...data.space } : space))
      })

      // Invalidate spaces list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.spaces.lists() })
    },
    onError: (error) => {
      console.error('Failed to update space:', error)
    },
  })
}

// Hook to delete a space
export const useDeleteSpace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spaceService.deleteSpace,
    onSuccess: (data, spaceId) => {
      // Remove from my spaces cache
      queryClient.setQueryData(queryKeys.spaces.mySpaces(), (oldData) => {
        if (!oldData) return oldData
        return oldData.filter((space) => space.id !== spaceId)
      })

      // Remove space detail cache
      queryClient.removeQueries({ queryKey: queryKeys.spaces.detail(spaceId) })

      // Invalidate spaces list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.spaces.lists() })
    },
    onError: (error) => {
      console.error('Failed to delete space:', error)
    },
  })
}
