import { useQuery } from "@tanstack/react-query";
import { api_tmdb } from "..";

const useGetPopularQuery = (movieType: POPULAR.GetPopularReq) => {
	return useQuery<POPULAR.GetPopularRes>({
		queryKey: ["popular"],
		queryFn: async () => {
			const response = await api_tmdb.get(`/${movieType}/popular`);
			return response.data;
		},
	});
};

export { useGetPopularQuery };
