import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../utils/queryKeys'
import axiosInstance from '../axiosInstance'

// Hook to fetch all amenities
export const useAmenities = (activeOnly = true) => {
  return useQuery({
    queryKey: ['amenities', { activeOnly }],
    queryFn: async () => {
      const params = activeOnly ? { isActive: 'true' } : {}
      const response = await axiosInstance.get('/admin/amenities', { params })
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Create amenity
export const useCreateAmenity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (amenityData) => {
      const response = await axiosInstance.post('/admin/amenities', amenityData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.amenities.all })
    },
  })
}

// Update amenity
export const useUpdateAmenity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/admin/amenities/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.amenities.all })
    },
  })
}

// Delete amenity
export const useDeleteAmenity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/admin/amenities/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.amenities.all })
    },
  })
}

// Reorder amenities
export const useReorderAmenities = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (amenities) => {
      const response = await axiosInstance.patch('/admin/amenities/reorder', { amenities })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.amenities.all })
    },
  })
}
