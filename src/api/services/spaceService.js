import axiosInstance, { unProtectedAxiosInstance } from '../axiosInstance'

// Helper function to transform MongoDB _id to id for frontend compatibility
const transformSpace = (space) => ({
  ...space,
  id: space._id,
  location: space.location || {},
  price: space.price || {},
  images: space.images || [],
})

// Helper function to recursively flatten nested objects into FormData
const appendFormData = (formData, data, parentKey = '') => {
  if (data === undefined || data === null) return

  // Arrays
  if (Array.isArray(data) && !(data[0] instanceof File)) {
    data.forEach((value, idx) => {
      appendFormData(formData, value, `${parentKey}[${idx}]`)
    })
    return
  }

  // Files and primitives
  if (typeof data !== 'object' || data instanceof File) {
    formData.append(parentKey, data)
    return
  }

  // Nested objects
  Object.keys(data).forEach((key) => {
    const newKey = parentKey ? `${parentKey}[${key}]` : key
    appendFormData(formData, data[key], newKey)
  })
}

export const spaceService = {
  // Get all spaces with filters
  getSpaces: async (filters = {}) => {
    const query = new URLSearchParams()

    if (filters.search) query.append('search', filters.search)
    if (filters.city) query.append('city', filters.city)
    if (filters.state) query.append('state', filters.state)
    if (filters.spaceType && filters.spaceType !== 'all')
      query.append('spaceType', filters.spaceType)
    if (filters.capacity && filters.capacity !== 'any') query.append('capacity', filters.capacity)
    if (filters.minPrice != null) query.append('minPrice', filters.minPrice)
    if (filters.maxPrice != null) query.append('maxPrice', filters.maxPrice)
    if (filters.sort) query.append('sort', filters.sort)

    const response = await unProtectedAxiosInstance.get(`/spaces?${query.toString()}`)

    // Transform MongoDB _id to id for frontend compatibility
    const transformedSpaces = response.data.spaces.map(transformSpace)
    return { ...response.data, spaces: transformedSpaces }
  },

  // Get space by ID
  getSpace: async (id) => {
    const response = await axiosInstance.get(`/spaces/${id}`)
    return transformSpace(response.data.space)
  },

  // Get user's spaces
  getMySpaces: async () => {
    try {
      const response = await axiosInstance.get('/spaces/owner/my-spaces')

      // Handle both array and object response formats
      let spacesData = response.data
      if (response.data && response.data.spaces) {
        // API returned { spaces: [...] }
        spacesData = response.data.spaces
      } else if (!Array.isArray(response.data)) {
        // API returned something unexpected
        console.warn('getMySpaces: Unexpected response format:', response.data)
        return []
      }

      return spacesData.map(transformSpace)
    } catch (error) {
      console.error('getMySpaces API error:', error)
      throw error
    }
  },

  // Create new space
  createSpace: async (values) => {
    const formData = new FormData()

    // Append image files
    if (values.images && values.images.length) {
      values.images.forEach((file) => formData.append('images', file))
    }

    // Append everything else
    const { images: _, ...rest } = values
    appendFormData(formData, rest)

    const response = await axiosInstance.post('/spaces', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  },

  // Update space
  updateSpace: async ({ values, id }) => {
    const formData = new FormData()

    if (values.newImages && values.newImages.length) {
      values.newImages.forEach((file) => formData.append('newImages', file))
    }

    const { newImages: _, ...rest } = values
    appendFormData(formData, rest)

    const response = await axiosInstance.patch(`/spaces/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  },

  // Delete space
  deleteSpace: async (spaceId) => {
    const response = await axiosInstance.delete(`/spaces/${spaceId}`)
    return response.data
  },
}
