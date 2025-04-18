import useSWR from 'swr';
import API from './fetcher';

// Optional: Get bookings (for owner dashboard)
export const useBookings = () => {
  const { data, error, isLoading } = useSWR('/bookings');
  return { bookings: data, isLoading, isError: error };
};

// Create a booking
export const createBooking = async (data) => {
  const res = await API.post('/bookings', data);
  return res.data;
};
