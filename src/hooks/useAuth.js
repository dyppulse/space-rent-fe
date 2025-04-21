import useSWR from "swr";
import axiosInstance from "../api/axiosInstance";

export const useAuth = () => {

  const { data, error, mutate, isLoading } = useSWR("/auth/me");

  const login = async (email, password) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    localStorage.setItem('token', response.data.token)
    // await mutate(); // Revalidate session after login

  };

  const register = async (name, email, password, phone) => {
    await axiosInstance.post("/auth/register", { name, email, password, phone });
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    // await mutate(null); // Clear session
    localStorage.removeItem('token')
  };

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data,
    error,
    login,
    register,
    logout,
    mutate
  };
};
