import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { spaceTypeService } from '../services/spaceTypeService'

// Hook to fetch all space types
export const useSpaceTypes = (activeOnly = true) => {
  return useQuery({
    queryKey: ['spaceTypes', { activeOnly }],
    queryFn: () => spaceTypeService.getAllSpaceTypes(activeOnly),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to fetch a single space type
export const useSpaceType = (id) => {
  return useQuery({
    queryKey: ['spaceType', id],
    queryFn: () => spaceTypeService.getSpaceType(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook to create a new space type
export const useCreateSpaceType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spaceTypeService.createSpaceType,
    onSuccess: () => {
      // Invalidate space types list
      queryClient.invalidateQueries({ queryKey: ['spaceTypes'] })
    },
    onError: (error) => {
      console.error('Failed to create space type:', error)
    },
  })
}

// Hook to update a space type
export const useUpdateSpaceType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spaceTypeService.updateSpaceType,
    onSuccess: (data, variables) => {
      const { id } = variables

      // Update space type detail cache
      queryClient.setQueryData(['spaceType', id], data)

      // Invalidate space types list
      queryClient.invalidateQueries({ queryKey: ['spaceTypes'] })
    },
    onError: (error) => {
      console.error('Failed to update space type:', error)
    },
  })
}

// Hook to delete a space type
export const useDeleteSpaceType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spaceTypeService.deleteSpaceType,
    onSuccess: (data, spaceTypeId) => {
      // Remove space type detail cache
      queryClient.removeQueries({ queryKey: ['spaceType', spaceTypeId] })

      // Invalidate space types list
      queryClient.invalidateQueries({ queryKey: ['spaceTypes'] })
    },
    onError: (error) => {
      console.error('Failed to delete space type:', error)
    },
  })
}
