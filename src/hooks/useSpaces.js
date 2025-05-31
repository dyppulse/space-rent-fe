import useSWR from 'swr';
import axiosInstance from '../api/axiosInstance';

export const useSpaces = () => {
  const { data, error, isLoading, mutate } = useSWR('/spaces');

  const createSpace = async (data) => {
    const response = await axiosInstance.post('/space', data);
    mutate();
    return response.data;
  };

  return {
    spaces: data,
    isLoading,
    error,
    createSpace,
  };
};
