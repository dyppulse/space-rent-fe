import axiosInstance from '../api/axiosInstance'
import useSWR from 'swr'

export const useBooking = () => {
  const { data, error, mutate, isLoading } = useSWR('/bookings')

  const createBooking = async (data) => {
    const response = await axiosInstance.post('/bookings', data)
    mutate()
    return response.data
  }

  return {
    data,
    error,
    isLoading,
    createBooking,
  }
}
