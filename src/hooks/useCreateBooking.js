import axiosInstance from "../api/axiosInstance";

export const createBooking = async (data) => {
  const response = await axiosInstance.post("/bookings", data);
  return response.data;
};
