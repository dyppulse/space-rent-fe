import axiosInstance from '../axiosInstance'

export const spaceTypeService = {
  // Get all space types
  getAllSpaceTypes: async (activeOnly = true) => {
    const params = activeOnly ? { active: 'true' } : {}
    const response = await axiosInstance.get('/space-types', { params })
    return response.data
  },

  // Get space type by ID
  getSpaceType: async (id) => {
    const response = await axiosInstance.get(`/space-types/${id}`)
    return response.data.spaceType
  },

  // Create new space type (admin only)
  createSpaceType: async (spaceTypeData) => {
    const response = await axiosInstance.post('/space-types', spaceTypeData)
    return response.data.spaceType
  },

  // Update space type (admin only)
  updateSpaceType: async ({ id, data }) => {
    const response = await axiosInstance.patch(`/space-types/${id}`, data)
    return response.data.spaceType
  },

  // Delete space type (admin only)
  deleteSpaceType: async (id) => {
    const response = await axiosInstance.delete(`/space-types/${id}`)
    return response.data
  },
}
