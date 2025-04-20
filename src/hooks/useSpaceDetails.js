import useSWR from "swr";

export const useSpaceDetails = (spaceId) => {
  const { data, error, isLoading } = useSWR(
    spaceId ? `/spaces/${spaceId}` : null
  );

  return {
    space: data,
    isLoading,
    error,
  };
};
