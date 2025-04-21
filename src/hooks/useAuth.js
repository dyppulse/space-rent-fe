import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";

export const useAuth = () => {
  const token = localStorage.getItem('token')
  const { data, error, mutate, isLoading } = useSWR(token ? "/auth/me" : null);

  const login = async (email, password) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    await mutate(); // Revalidate session after login
    return response.data;

  };

  const register = async (name, email, password, phone) => {
    await axiosInstance.post("/auth/register", { name, email, password, phone });
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    await mutate(null); // Clear session
    localStorage.removeItem('token')
  };

  return {
    user: data,
    isLoading,
    isAuthenticated: !!token,
    error,
    login,
    register,
    logout,
  };
};
