import useSWR from 'swr';
import API from './fetcher';

// Get all spaces
export const useSpaces = () => {
  const { data, error, isLoading, mutate } = useSWR('/spaces');
  return { spaces: data, isLoading, isError: error, mutate };
};

// Get single space
export const useSpace = (id) => {
  const { data, error, isLoading } = useSWR(id ? `/spaces/${id}` : null);
  return { space: data, isLoading, isError: error };
};

// Create space
export const createSpace = async (data) => {
  const res = await API.post('/spaces', data);
  return res.data;
};

// Update space
export const updateSpace = async (id, data) => {
  const res = await API.put(`/spaces/${id}`, data);
  return res.data;
};

// Delete space
export const deleteSpace = async (id) => {
  const res = await API.delete(`/spaces/${id}`);
  return res.data;
};
