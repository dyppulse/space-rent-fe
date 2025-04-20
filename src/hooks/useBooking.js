import axiosInstance from "../api/axiosInstance";
import useSWR from "swr";

export const useBooking = () => {
  const token = localStorage.getItem('token')
  const { data, error, mutate, isLoading } = useSWR(token ? "/bookings" : null);

   const createBooking = async (data) => {
    const response = await axiosInstance.post("/bookings", data);
    mutate();
    return response.data;
  };


  return {
    data,
    error,
    isLoading,
    createBooking
  };
};
