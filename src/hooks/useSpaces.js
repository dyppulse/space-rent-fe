import useSWR from "swr";

export const useSpaces = () => {
  const { data, error, isLoading, mutate } = useSWR("/spaces");

  return {
    spaces: data,
    isLoading,
    error,
    mutate,
  };
};
