import axiosInstance from '../axiosInstance'

export const bookingService = {
  // Create new booking (now requires authentication)
  createBooking: async (bookingData) => {
    const response = await axiosInstance.post('/bookings', bookingData)
    return response.data
  },

  // Get user bookings (for regular clients)
  getUserBookings: async () => {
    const response = await axiosInstance.get('/bookings/user')
    return response.data.bookings
  },

  // Get owner bookings
  getOwnerBookings: async () => {
    const response = await axiosInstance.get('/bookings/owner')
    return response.data.bookings
  },

  // Get booking stats
  getBookingStats: async () => {
    const response = await axiosInstance.get('/bookings/stats')
    return response.data.stats
  },

  // Get booking by ID
  getBooking: async (id) => {
    const response = await axiosInstance.get(`/bookings/${id}`)
    return response.data.booking
  },

  // Update booking status
  updateBookingStatus: async ({ id, status, reason }) => {
    const response = await axiosInstance.patch(`/bookings/${id}/status`, { status, reason })
    return response.data.booking
  },
}
