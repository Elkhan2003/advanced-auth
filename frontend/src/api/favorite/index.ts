import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "..";

const useGetFavoriteQuery = () => {
	return useQuery<FAVORITE.GetFavoriteRes>({
		queryKey: ["favorite"],
		queryFn: async () => {
			const response = await api.get(`/favorite/get-all`);
			return response.data;
		},
	});
};

const useAddFavoriteMutation = () => {
	return useMutation<FAVORITE.AddFavoriteRes, Error, FAVORITE.AddFavoriteReq>({
		mutationFn: async (data) => {
			const response = await api.post(`/favorite/add`, data);
			return response.data;
		},
	});
};

const useDeleteFavoriteMutation = () => {
	return useMutation<
		FAVORITE.DeleteFavoriteRes,
		Error,
		FAVORITE.DeleteFavoriteReq
	>({
		mutationFn: async (id) => {
			const response = await api.delete(`/favorite/delete/${id}`);
			return response.data;
		},
	});
};

export {
	useGetFavoriteQuery,
	useAddFavoriteMutation,
	useDeleteFavoriteMutation,
};
