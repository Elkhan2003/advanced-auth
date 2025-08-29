import { useQuery } from "@tanstack/react-query";
import { api } from "..";

const useGetMovieDetailsQuery = (movieId: number) => {
  return useQuery<DETAILS.GetMovieDetailsRes>({
    queryKey: ["movie-details", movieId],
    queryFn: async () => {
      const response = await api.get(`movie/${movieId}`);
      return response.data;
    },
  });
};

export { useGetMovieDetailsQuery };
